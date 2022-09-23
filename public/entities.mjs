class Entity {
  constructor(x, y, scale, currentAsset, id, collisionLayer, collidesWith) {
    this.x = x;
    this.y = y;
    this.velX = 0;
    this.velY = 0;
    this.angle = 0;
    this.scale = scale;
    this.currentAsset = currentAsset;
    this.id = id;
    this.collisionLayer = collisionLayer;
    this.collidesWith = collidesWith;
    this.collisionActive = true;
    this.collidesWithWall = false;
    this.visible = true;
  }
  
  update() {

  }
}

export class RectEntity extends Entity {
  constructor(x, y, width, length, scale, currentAsset, id, collisionLayer, collidesWith) {
    super(x, y, scale, currentAsset, id, collisionLayer, collidesWith);
    this.width = width * scale;
    this.length = length * scale;
  }
  get corners() {
    const radians = this.angle * Math.PI / 180;
    return {
      tr: {
        x: this.x + (this.width / 2) * Math.cos(radians) - (this.length / 2) * Math.sin(radians),
        y: this.y + (this.width / 2) * Math.sin(radians) + (this.length / 2) * Math.cos(radians)
      },
      tl: {
        x: this.x - (this.width / 2) * Math.cos(radians) - (this.length / 2) * Math.sin(radians),
        y: this.y - (this.width / 2) * Math.sin(radians) + (this.length / 2) * Math.cos(radians)
      },
      br: {
        x: this.x + (this.width / 2) * Math.cos(radians) + (this.length / 2) * Math.sin(radians),
        y: this.y + (this.width / 2) * Math.sin(radians) - (this.length / 2) * Math.cos(radians)
      },
      bl: {
        x: this.x - (this.width / 2) * Math.cos(radians) + (this.length / 2) * Math.sin(radians),
        y: this.y - (this.width / 2) * Math.sin(radians) - (this.length / 2) * Math.cos(radians)
      }
    }   
  }
  update() {
  }
}

export class Bullet extends RectEntity {
  constructor(startX, startY, asset, id, collidesWith, collisionLayer) {
    super(startX, startY, 4, 19, 1, asset, id, collisionLayer, collidesWith);
    this.inUse = false;
    this.collisionActive = false;
    this.baseSize = { x: 19, y: 4 };
    this.scale = 1;
    this.damage = 0;
    this.activeTime = 0;
    this.collided = false;
  }

  clear() {
    this.collisionActive = false;
    this.inUse = false;
    this.x = -1000;
    this.y = -1000;
    this.activeTime = 0;
    this.visible = false;
  }
  
}

export class BulletPool {
  constructor(size, bulletLife, asset, collidesWith, collisionLayer) {
    this.bullets = []; 
    this.bulletLife = bulletLife;
    for(let i = 1; i <= size; i++) {
      this.bullets.push(new Bullet(-1000, -1000, asset, `${collisionLayer}${i}`, collidesWith, collisionLayer))
    }
  }

  getBullet(parent, damage) {
    const radians = parent.angle * Math.PI / 180;
    const bullet = this.bullets.filter((bullet) => {return !bullet.inUse})[0];
    bullet.scale = parent.scale / 2;
    bullet.damage = damage
    bullet.x = parent.x;
    bullet.y = parent.y;
    bullet.angle = parent.angle;
    bullet.velX = parent.bulletVel * Math.cos(radians);
    bullet.velY = parent.bulletVel * Math.sin(radians);
    bullet.inUse = true;
    bullet.collisionActive = true;
    bullet.visible = true;
  }

  
  update(delta) {
    for(const bullet of this.bullets.filter(bullet => bullet.inUse)) {
      bullet.activeTime += delta;
      if(bullet.activeTime > this.bulletLife) {
        bullet.clear();
      }
    }
  }
}

export class Ship extends Entity {
  constructor(x, y, scale, radius, thrust, maxSpeed, idleAsset, thrustAsset, id, collisionLayer, collidesWith, bulletVel, bulletPool, bulletCooldown) {
    super(x, y, scale, idleAsset, id, collisionLayer, collidesWith);
    this.radius = radius * scale;
    this.velX = 0.0;
    this.velY = 0.0;
    this.mass = this.radius * this.radius * Math.PI;
    this.thrust = thrust;
    this.maxSpeed = maxSpeed;
    this.dragCoeff = this.thrust / this.maxSpeed; 
    this.collidesWithWall = true;
    this.usedThrottle = false;
    this.idleAsset = idleAsset;
    this.thrustAsset = thrustAsset;
    this.bulletVel = bulletVel;
    this.bulletPool = bulletPool;
    this.lastShot = 0;
    this.bulletCooldown = bulletCooldown;
    this.health = 0;
  }
  
  fireBullet() {
    if(this.lastShot > this.bulletCooldown) {
      this.bulletPool.getBullet(this, 5);
      this.lastShot = 0;
    }
  } 
  
  throttle(power) {
    this.usedThrottle = true;
    this.velX += Math.cos(this.angle * (Math.PI / 180)) * this.thrust * power;
    this.velY += Math.sin(this.angle * (Math.PI / 180)) * this.thrust * power; 
  }
  
  rotateToPoint(x, y) {
    const translatedX = x - this.x;
    const translatedY = y - this.y;
    this.angle = Math.atan2(translatedY, translatedX) * (180/Math.PI); 
  }
  
  update() {
    if(this.usedThrottle) {
      this.currentAsset = this.thrustAsset;
    }
    else {
      this.currentAsset = this.idleAsset;
    }
    this.usedThrottle = false;
  }
  
}

export class Enemy extends Ship {
  constructor(x, y, scale, radius, thrust, maxSpeed, idleAsset, thrustAsset, id, collisionLayer, collidesWith, bulletVel, bulletPool, target) {
    super(x, y, scale, radius, thrust, maxSpeed, idleAsset, thrustAsset, id, collisionLayer, collidesWith, bulletVel, bulletPool);
    this.target = target;
    this.throttleDistance = 300;
    
  }
  
  update(delta) {
    const distanceSquared = Math.pow(this.target.x - this.x, 2) + Math.pow(this.target.y - this.y, 2);
    if(distanceSquared > Math.pow(this.throttleDistance, 2)) {
      const power = distanceSquared / Math.pow(this.throttleDistance, 2);
      this.throttle(power);
    }
    
    this.rotateToPoint(this.target.x, this.target.y);
  }
} 

export class Player extends Ship {
  constructor(x, y, scale, radius, thrust, maxSpeed, idleAsset, thrustAsset, id, collisionLayer, collidesWith, bulletVel, bulletPool, bulletCooldown) {
   super(x, y, scale, radius, thrust, maxSpeed, idleAsset, thrustAsset, id, collisionLayer, collidesWith, bulletVel, bulletPool, bulletCooldown);
  }

  handleInput(delta, input) {
    const pressedKeys = [];
    for(const key in input) {
      if(input[key]) {
        pressedKeys.push(key);
      }
    }
    for(const key of pressedKeys) {
      switch(key) {
        case "KeyW":
          this.throttle(1);
          break;
        case "Space":
          this.fireBullet();
      }
    }//
    this.rotateToPoint(input.x, input.y);
  }
  update(delta, input) {
    this.lastShot += delta;
    const dragX = this.dragCoeff * (-this.velX);
    const dragY = this.dragCoeff * (-this.velY);
    this.velX += dragX;
    this.velY += dragY;
    this.handleInput(delta, input);
    if(this.usedThrottle) {
      this.currentAsset = this.thrustAsset;
    }
    else {
      this.currentAsset = this.idleAsset;
    }
    this.usedThrottle = false;
  }
}
