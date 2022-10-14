import {Player, Enemy, BulletPool, RectEntity} from "./entities.mjs";
import {Level, ShipClass} from "./levels.mjs";
import {CollisionEngine} from "./collisionEngine.mjs";
import {Renderer} from "./renderer.mjs";

class Game {
  constructor() {
    this.idealHeight = 375;
    this.idealWidth = 667;
    this.playerBulletPool = new BulletPool(30, 1000, "bullet", ["enemy"], "playerBullet");
    this.enemyBulletPool = new BulletPool(1, 1000, "bullet", ["player"], "enemyBullet");
    this.player = new Player(5, 5, 2, 11, 0.01, 0.75, "blueNoThruster", "blueThruster" , "player", "player", ["enemy", "enemyBullet"], 1, this.playerBulletPool, 25, 10);
    this.entityList = [
      new Enemy(50, 50, 4, 11, 0.01, 0.75, "redThruster", "redNoThruster", "test", "enemy", ["player", "playerBullet"], 0.1, this.enemyBulletPool, this.player, 10),
      ...this.playerBulletPool.bullets,
      ...this.enemyBulletPool.bullets,
      
    ];
    this.entityList.push(this.player);
    this.collisionEngine = new CollisionEngine(this.entityList, {x: this.idealWidth, y: this.idealHeight});
    this.renderer = new Renderer([
      {key:"blueNoThruster", url:"../assets/blueNoThrusterShip.png"},
      {key:"blueThruster", url:"../assets/blueThrusterShip.png"},
      {key:"redNoThruster", url:"../assets/redNoThrusterShip.png"},
      {key:"redThruster", url:"../assets/redThrusterShip.png"},
      {key:"bullet", url:"../assets/bullet.png"}
    ], this.idealWidth, this.idealHeight);
    this.initKeyInputs();
    this.initLoadBar(() => {this.loadingFinished()});
  }

  initLoadBar(completeFunct) {
    const documentFrag = document.createDocumentFragment();
    const barContainer = document.createElement("div");
    barContainer.style.backgroundColor = "grey";
    barContainer.style.width = "100%";
    barContainer.style.height = "10px";
    const bar = document.createElement("div");
    bar.style.backgroundColor = "blue";
    bar.style.width = "0%";
    bar.style.height = "10px";
    barContainer.appendChild(bar);
    documentFrag.appendChild(barContainer);
    document.body.appendChild(documentFrag);
    this.renderer.loadAssets((loader) => {
      bar.style.width = `${loader.progress}%`;
    }, completeFunct);
  }

  initKeyInputs() {
    this.keyList = {
      "KeyW": false,
      "Space": false
    };
    const canvas = document.getElementById("gameCanvas");
    canvas.addEventListener("keydown", (event) => {
      if(this.keyList[event.code] !== undefined) {
        this.keyList[event.code] = true;
      }
    });
    canvas.addEventListener("keyup", (event) => {
      if(this.keyList[event.code] !== undefined) {
        this.keyList[event.code] = false;
      }
    });
  }

  
  loadingFinished() {
    for(const entity of this.entityList) {
      this.renderer.addSprite(entity);
    }
    
    this.renderer.pixiApp.ticker.add(this.update, this);
  }
  
  removeEntity(id) {
    const idArr = this.entityList.map(entity => {entity.id});
    this.entityList.splice(idArr.indexOf(id), 1);
    delete this.renderer.spriteReferenceKey[id];
  }

  initLevel(level) {
    for(const entity of this.entityList) {
      if(entity.id.includes("Bullet")) {
        entity.clear();
      }
      else if(entity.id.includes("enemy")) {
        this.removeEntity(entity.id);
      }
      else if(entity.id == "player") {
        entity.reset();
        entity.x = level.playerPosX;
        entity.y = level.playerPosY;
        entity.angle = level.playerAngle;
      }
      let enemyCount = 1;
      for(const shipType of level.enemiesData) {
        for(const ship of shipType.positions) {
          //constructor(x, y, scale, radius, thrust, maxSpeed, idleAsset, thrustAsset, id, collisionLayer, collidesWith, bulletVel, bulletPool, target, maxHealth) {
          const enemy = new Enemy(position.x, position.y, shipType.radius, 11, 0.01, shipType.speed, shipType.idleAsset, shipType.thrustAsset, `enemy${enemyCount}`, "enemy", ["player", "playerBullet"], 0.1, this.enemyBulletPool, this.player, shipType.health);
          enemyCount++;
        }
      }
    }
  }
  
  update(framesPassed) {
    //console.log(this.keyList)
    const deltaMs = (framesPassed/60)*1000;
    let mousePosLocal = this.renderer.pixiApp.renderer.plugins.interaction.mouse.getLocalPosition(this.renderer.pixiApp.stage);  
    mousePosLocal.x /= this.renderer.gameScale;
    mousePosLocal.y /= this.renderer.gameScale;
    this.playerBulletPool.update(deltaMs);
    this.enemyBulletPool.update(deltaMs);
    this.collisionEngine.update(deltaMs, {...this.keyList, ...mousePosLocal});
    this.renderer.drawFrame(this.entityList);
  }
}





console.log(new Game());
