 export class ShipClass {
  constructor(radius, speed, bulletCooldown, idleAsset, thrustAsset, health) {
    this.radius = radius;
    this.health = health
    this.speed = speed;
    this.bulletCooldown = bulletCooldown;
    this.idleAsset = idleAsset;
    this.thrustAsset = thrustAsset;
  }  
}
/*
enemies 
[
  {
  class: ship class,
  positions: []
  },
  {
  class: bigships,
  positions: []
  }
]
*/

export class Level {
  constructor(enemiesData, playerPosX, playerPosY, playerAngle) {
    this.enemiesData = enemiesData;
    this.playerPosX = playerPosX;
    this.playerPosY = playerPosY;
    this.playerAngle = playerAngle;
    
  }  
}