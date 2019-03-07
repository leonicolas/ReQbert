import config from '../config.js';
import Vec2 from './Vec2';

export default class Level {

  constructor(levelSpec, spriteMap) {
    this.levelSpec = levelSpec;
    this.spriteMap = spriteMap;

    this.buffer = this._initializeLevel(levelSpec);
  }

  _initializeLevel(levelSpec) {
    // Creates buffer and gets buffer context.
    const buffer = document.createElement('canvas');
    buffer.width = config.screen.width;
    buffer.height = config.screen.height;

    const context = buffer.getContext('2d');

    // Draw reference block into the level buffer.
    this.spriteMap.draw(levelSpec.refBlock, context, new Vec2(3, 3));

    // Draw level blocks into the level buffer.
    let posX = 3, posY = 3;
    levelSpec.blocks.forEach(line => {
      line.forEach(blockName => {
        if(blockName)
          this.spriteMap.draw(blockName, context, new Vec2(posX, posY));
        posX += 3;
      });
      posX = 3;
      posY += 2;
    });
    return buffer;
  }

  update(time) {
  }

  render(context, time) {
    context.drawImage(this.buffer, 0, 0);
  }
}
