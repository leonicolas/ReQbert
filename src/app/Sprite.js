import { Vec2 } from './libs/math';
import { castArray } from './libs/utils';
import Animation from './Animation';
import config from './config';

export default class Sprite {

  constructor(spriteData, pos = new Vec2(0, 0)) {
    if(spriteData.frames) {
      this.animation = spriteData;
    } else {
      this.images = castArray(spriteData);
    }
    this.pos = pos.clone();
    this.transformIndex = 0;
  }

  render(context, deltaTime, transformIndex = -1) {
    if(transformIndex >= 0) {
      this.transformIndex = transformIndex;
    }
    if(this.animation) {
      this.animation.render(context, deltaTime, this.transformIndex);
    } else {
      context.drawImage(
        this.images[this.transformIndex],
        this.pos.x * config.gridSize,
        this.pos.y * config.gridSize
      );
    }
  }
}
