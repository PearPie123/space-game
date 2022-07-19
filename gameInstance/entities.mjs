class Entity {
  constructor(x, y, rotation,radius) {
    this.x = x;
    this.y = y;
    this.rotation = rotation;
    this.radius = radius;
  }
  
  update() {
    
  }
}

class Ship extends Entity {
  constuctor(x, y, rotation, radius, thrust, drag) {
    super(x, y, rotation, radius);
    this.velX = 0.0;
    this.velY = 0.0;
    this.thrust = thrust;
  }
  
  update() {
    this.velX -= drag;
    this.velY -= drag;
    this.x += velX;
    this.y += velY;
  }
  
  thrust() {
    this.velX = 
    this.velY = ; 
  }
}