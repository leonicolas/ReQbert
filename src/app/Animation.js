import { Vec2 } from './libs/math';

import config from './config';
import { castArray } from './libs/utils';

export default class Animation {

  constructor(animationData, pos = new Vec2(0, 0)) {
    this.frames = animationData.frames.map(frame => castArray(frame));
    this.framesNames = animationData.framesNames;
    this.frameTime = animationData.frameTime / 1000;
    this.framesCount = this.frames.length;
    this.visible = true;
    this.pos = pos.clone();
    this.transformIndex = 0;
    this.onAnimationEndListeners = new Set();
  }

  playInLoop() {
    this.play(true);
  }

  play(loop = false) {
    this.loop = loop;
    this.ended = false;
    this.frameIndex = 0;
    this.elapsedTime = 0;
    this.show();
  }

  stop() {
    this.loop = false;
    this.ended = true;
  }

  show() {
    this.visible = true;
  }

  hide() {
    this.visible = false;
  }

  getFrameName(frameIndex) {
    return this.framesNames[frameIndex];
  }

  getLastFrameName() {
    return this.getFrameName(this.framesCount - 1);
  }

  triggerOnAnimationEnd() {
    this.onAnimationEndListeners.forEach(listener => listener(this));
  }

  render(context, deltaTime) {
    if(this.loop || this.frameIndex + 1 < this.framesCount) {
      this.frameIndex = Math.floor(this.elapsedTime / this.frameTime) % this.framesCount;
      this.elapsedTime += deltaTime;
    } else if(!this.ended) {
      this.ended = true;
      this.triggerOnAnimationEnd();
    }

    if(!this.visible) return;

    const frame = this.frames[this.frameIndex || 0];
    context.drawImage(
      frame[this.transformIndex],
      this.pos.x * config.grid.size,
      this.pos.y * config.grid.size
    );
  }
}
