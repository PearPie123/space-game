class Entity {
  constructor(x, y, angle, currentAsset, id) {
    this.x = x;
    this.y = y;
    this.velX = 0;
    this.velY = 0;
    this.angle = angle;
    this.currentAsset = currentAsset;
    this.id = id;
    this.collidesWithWall = false;
  }
  
  update() {

  }
}

export class RectEntity extends Entity {
  constructor(x, y, width, length, currentAsset, id) {
    super(x, y, 0, currentAsset, id);
    this.width = width;
    this.length = length;
  }
  get corners() {
    const radians = this.angle * Math.PI/180;
    //console.log(this.x)
    return {
      tr: {
        x: this.x + (this.width / 2) * Math.cos(radians) - (this.height / 2) * Math.sin(radians),
        y: this.y + (this.width / 2) * Math.sin(radians) + (this.height / 2) * Math.sin(radians)
      },
      tl: {
        x: this.x - (this.width / 2) * Math.cos(radians) - (this.height / 2) * Math.sin(radians),
        y: this.y - (this.width / 2) * Math.sin(radians) + (this.height / 2) * Math.sin(radians)
      },
      br: {
        x: this.x + (this.width / 2) * Math.cos(radians) + (this.height / 2) * Math.sin(radians),
        y: this.y + (this.width / 2) * Math.sin(radians) - (this.height / 2) * Math.sin(radians)
      },
      bl: {
        x: this.x - (this.width / 2) * Math.cos(radians) + (this.height / 2) * Math.sin(radians),
        y: this.y - (this.width / 2) * Math.sin(radians) - (this.height / 2) * Math.sin(radians)
      }
    }   
  }
  update() {
    this.corners;
  }
}

export class Bullet extends RectEntity {
  constructor() {
    
  }
}
export class Ship extends Entity {
  constructor(x, y, angle, radius, thrust, maxSpeed, idleAsset, thrustAsset, id) {
    super(x, y, angle, idleAsset, id);
    this.velX = 0.0;
    this.velY = 0.0;
    this.mass = radius * radius * Math.PI;
    this.radius = radius;
    this.thrust = thrust;
    this.maxSpeed = maxSpeed;
    this.dragCoeff = this.thrust / this.maxSpeed; 
    this.collidesWithWall = true;
    this.usedThrottle = false;
    this.idleAsset = idleAsset;
    this.thrustAsset = thrustAsset;
  }
  
  
  throttle() {
    this.usedThrottle = true;
    this.velX += Math.cos(this.angle * (Math.PI / 180)) * this.thrust;
    this.velY += Math.sin(this.angle * (Math.PI / 180)) * this.thrust; 
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
  constructor(x, y, angle, radius, thrust, maxSpeed, idleAsset, thrustAsset, id) {
    super(x, y, angle, radius, thrust, maxSpeed, idleAsset, thrustAsset, id);
  }
} 

export class Player extends Ship {
  constructor(x, y, angle, radius, thrust, maxSpeed, idleAsset, thrustAsset, id) {
   super(x, y, angle, radius, thrust, maxSpeed, idleAsset, thrustAsset, id);
    this.score = 0;
  }


  getCoin() {
    score += 1;
  }

  rotateToPoint(x, y) {
    const translatedX = x - this.x;
    const translatedY = y - this.y;
    this.angle = Math.atan2(translatedY, translatedX) * (180/Math.PI); 
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
          this.throttle();
          break;
        case "Space":
          
      }
    }//
    this.rotateToPoint(input.x, input.y);
  }
  update(delta, input) {
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
