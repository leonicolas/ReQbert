import { Vec2 } from './libs/math';

import config from './config';

export default class Animation {

  constructor(animationData, pos = new Vec2(0, 0)) {
    this.frames = animationData.frames;
    this.framesNames = animationData.framesNames;
    this.frameTime = animationData.frameTime / 1000;
    this.framesCount = this.frames.length;
    this.pos = pos.clone();
    this.transformIndex = 0;
    this.onAnimationEndListeners = new Set();

    this.start();
  }

  start(loop = false) {
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

  render(context, deltaTime, transformIndex = 0) {
    if(this.loop || this.frameIndex + 1 < this.framesCount) {
      this.frameIndex = Math.floor(this.elapsedTime / this.frameTime) % this.framesCount;
      this.elapsedTime += deltaTime;
    } else {
      if(!this.ended) {
        this.ended = true;
        this.triggerOnAnimationEnd();
      }
    }

    if(!this.visible) return;

    const frame = this.frames[this.frameIndex];
    context.drawImage(
      frame[this.transformIndex],
      this.pos.x * config.grid.size,
      this.pos.y * config.grid.size
    );
  }
}
