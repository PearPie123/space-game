export class Renderer {
  constructor(assets, idealWidth, idealHeight) {
    this.idealWidth = idealWidth;
    this.idealHeight = idealHeight;
    this.gameScale = 0;
    this.canvas = document.getElementById("gameCanvas");
    this.pixiApp = new PIXI.Application({
      // width: 500,
      // height: 500,
      antialias: false,
      resolution: 1,
      view: this.canvas,
      //resizeTo: window
    });
    this.assets = assets;
    this.pixiApp.renderer.autoDensity = true;
    this.spriteReferenceKey = [];
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
    this.resizeCanvas();
    window.addEventListener("resize", this.resizeCanvas.bind(this));
    document.body.appendChild(this.pixiApp.view);
  }

  resizeCanvas() {
    this.gameScale = Math.min(window.innerWidth / this.idealWidth, window.innerHeight / this.idealHeight);
    this.pixiApp.renderer.resize(this.idealWidth * this.gameScale, this.idealHeight * this.gameScale);
  }
  
  loadAssets(loadCallback, completeFunct) {
    for(const assetPair of this.assets) {
      this.pixiApp.loader.add(assetPair.key, assetPair.url);
    }
    this.pixiApp.loader.onProgress.add(loadCallback);
    this.pixiApp.loader.load();
    this.pixiApp.loader.onComplete.add(completeFunct);
  }

  addSprite(entity) {
    const sprite = PIXI.Sprite.from(this.pixiApp.loader.resources[entity.currentAsset].texture);
    sprite.anchor.set(0.5, 0.5); 
    this.spriteReferenceKey[entity.id] = sprite;
    this.pixiApp.stage.addChild(sprite);

  }

  
  drawFrame(entityList) {
    for(const entity of entityList) {
      const sprite = this.spriteReferenceKey[entity.id];
      if(entity.visible) {
        sprite.visible = true;
        sprite.texture = this.pixiApp.loader.resources[entity.currentAsset].texture;
        sprite.x = entity.x * this.gameScale;
        sprite.y = entity.y * this.gameScale;
        sprite.scale.x = entity.scale * 2 * this.gameScale;
        sprite.scale.y = entity.scale * 2 * this.gameScale;
        sprite.angle = entity.angle + 90;
      }
      else {
        sprite.visible = false;
      }
    }
  }
}