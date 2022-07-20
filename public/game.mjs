import {Player, Ship, RectEntity} from "./entities.mjs";
import {CollisionEngine} from "./collisionEngine.mjs";
import {Renderer} from "./renderer.mjs";

class Game {
  constructor() {
    this.idealHeight = 375;
    this.idealWidth = 667;
    this.entityList = [
      new Player(5, 5, 0, 11, 0.01, 0.75, "blueNoThruster", "blueThruster" , "player"),
      new Ship(50, 50, 0, 11, 0.01, 0.75, "redThruster", "test"),
      new RectEntity(70, 70, 100, 100, "bullet", "test1" )
    ];
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
    this.renderer.addSprites(this.entityList);
    this.renderer.pixiApp.ticker.add(this.update, this);
  }
  
  update(framesPassed) {
    //console.log(this.keyList)
    const deltaMs = (framesPassed/60)*1000;
    let mousePosLocal = this.renderer.pixiApp.renderer.plugins.interaction.mouse.getLocalPosition(this.renderer.pixiApp.stage)  
    mousePosLocal.x /= this.renderer.gameScale;
    mousePosLocal.y /= this.renderer.gameScale;
    
    this.collisionEngine.update(deltaMs, {...this.keyList, ...mousePosLocal});
    this.renderer.drawFrame(this.entityList);
  }
}



console.log(new Game());
