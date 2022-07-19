export class CollisionEngine {
  constructor(entities, arenaBounds) {
    this.entityList = entities;
    this.arenaBounds = arenaBounds;
  }

  checkCircleCollision(obj1, obj2) { 
    const distance = Math.pow(Math.pow(obj1.x - obj2.x,2) + Math.pow(obj1.y - obj2.y, 2), 0.5);
    const sumRadius = obj1.radius + obj2.radius;
    if(sumRadius >= distance) {
      const collisionDepth = sumRadius - distance;
      const normalVector = {//vector from obj2 to obj1
        x: (obj1.x - obj2.x) / distance,
        y: (obj1.y - obj2.y) / distance
      };
      const tangentVector = {
        x: -normalVector.y,
        y: normalVector.x
      };
      obj1.x += (collisionDepth/2) * normalVector.x;
      obj1.y += (collisionDepth/2) * normalVector.y;
      obj2.x -= (collisionDepth/2) * normalVector.x;
      obj2.y -= (collisionDepth/2) * normalVector.y;
      
      const tangentDotProduct1 = tangentVector.x * obj1.velX + tangentVector.y * obj1.velY; 
      const tangentDotProduct2 = tangentVector.x * obj2.velX + tangentVector.y * obj2.velY;
      const normalDotProduct1 = normalVector.x * obj1.velX + normalVector.y * obj1.velY;
      const normalDotProduct2 = normalVector.x * obj2.velX + normalVector.y * obj2.velY;
      const momentum1 = (normalDotProduct1 * (obj1.mass - obj2.mass) + 2 * obj2.mass * normalDotProduct2) / (obj1.mass + obj2.mass);
      const momentum2 = (normalDotProduct2 * (obj2.mass - obj1.mass) + 2 * obj1.mass * normalDotProduct1) / (obj1.mass + obj2.mass);
      
      obj1.velX = tangentVector.x * tangentDotProduct1 + normalVector.x * momentum1;
      obj1.velY = tangentVector.y * tangentDotProduct1 + normalVector.y * momentum1;
      obj2.velX = tangentVector.x * tangentDotProduct2 + normalVector.x * momentum2;
      obj2.velY = tangentVector.y * tangentDotProduct2 + normalVector.y * momentum2;
    }
  }

  checkWallCollision(entity) {
    const withinX = (entity.x + entity.radius <= this.arenaBounds.x && entity.x - entity.radius >= 0);
    const withinY = (entity.y + entity.radius <= this.arenaBounds.y && entity.y - entity.radius >= 0);
    if(!withinX) {
      entity.velX *= -0.3;
      if(entity.x < (this.arenaBounds.x / 2)) {
        entity.x = entity.radius;
      }
      else {
        entity.x = this.arenaBounds.x - entity.radius;
      }
    }
    if(!withinY) {
      entity.velY *= -0.3;
      if(entity.y < (this.arenaBounds.y / 2)) {
        entity.y = entity.radius;
      }
      else {
        entity.y = this.arenaBounds.y - entity.radius;
      }
    }
  }

  checkRectCircleCollision(circle, rect) {
    const closestX = Math.abs()
  }
  
  update(delta, input) {
    const checkedEntities = [];
    for(const entity of this.entityList) {
      if(entity.collidesWithWall) { 
        this.checkWallCollision(entity);
      }
      for(const entity2 of this.entityList) {
        if(entity2.id !== entity.id && !checkedEntities.includes([entity, entity2].sort())) {
          if(entity2.radius === undefined) {
            
          }
          else {
            this.checkCircleCollision(entity, entity2);
            checkedEntities.push(entity, entity2);
            //console.log(checkedEntities)
          }
        }
      }
      entity.update(delta, input);
      entity.x += entity.velX * delta;
      entity.y += entity.velY * delta;
    }
    return this.entityList;
  }
  
  
}
