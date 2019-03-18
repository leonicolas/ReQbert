import config from './config';
import { Vec2 } from './libs/math';
import Layer from './Layer';
import Qbert from './entities/Qbert'

export default class Level {

  constructor(levelSpec, tilesMap, charactersMap) {
    this.levelSpec = levelSpec;
    this.tilesMap = tilesMap;
    this.entitiesLayer = new Layer(new Vec2(0.5, 0.6), config.screen);

    // Entities
    this.qbert = new Qbert(charactersMap, new Vec2(15, 1));
    this.entitiesLayer.addSprite(this.qbert);

    // Buffer level cubes
    this.buffer = this._initializeLevel(levelSpec);
  }

  update(deltaTime) {
    this.entitiesLayer.update(deltaTime);
  }

  render(context, deltaTime) {
    context.drawImage(this.buffer, 0, 0);
    this.entitiesLayer.render(context, deltaTime);
  }

  _initializeLevel(levelSpec) {
    // Creates buffer and gets buffer context.
    const buffer = document.createElement('canvas');
    buffer.width = config.screen.width;
    buffer.height = config.screen.height;

    const context = buffer.getContext('2d');

    // Draw reference block into the level buffer.
    this.tilesMap.draw(levelSpec.refBlock, context, new Vec2(3, 3));

    // Draw level blocks into the level buffer.
    let posX = 3, posY = 3;
    levelSpec.blocks.forEach(line => {
      line.forEach(blockName => {
        if(blockName)
          this.tilesMap.draw(blockName, context, new Vec2(posX, posY));
        posX += 3;
      });
      posX = 3;
      posY += 2;
    });
    return buffer;
  }
}
