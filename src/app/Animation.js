import { Vec2 } from './libs/math';

import config from './config';

export default class Animation {

  constructor(animationData, pos = new Vec2(0, 0)) {
    this.frames = animationData.frames;
    this.frameTime = animationData.frameTime / 1000;
    this.pos = pos;

    this.frameIndex = 0;
    this.framesCount = this.frames.length;
    this.elapsedTime = 0;
  }

  render(context, deltaTime, transformIndex = 0) {
    this.frameIndex = Math.floor(this.elapsedTime / this.frameTime) % this.framesCount;
    this.elapsedTime += deltaTime;

    context.drawImage(
      this.frames[this.frameIndex][transformIndex],
      this.pos.x * config.gridSize,
      this.pos.y * config.gridSize
    );
  }
}
