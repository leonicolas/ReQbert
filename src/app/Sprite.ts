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
  }

  render(context, deltaTime, transformIndex = 0) {
    if(this.animation) {
      this.animation.render(context, deltaTime);
    } else {
      if(transformIndex >= this.images.length)
        transformIndex = 0;
      context.drawImage(
        this.images[transformIndex],
        this.pos.x * config.grid.size,
        this.pos.y * config.grid.size
      );
    }
  }
}
