import { Vec2 } from './libs/math';

import config from './config';

export default class Animation {

  constructor(animationData, pos = new Vec2(0, 0)) {
    this.frames = animationData.frames;
    this.framesNames = animationData.framesNames;
    this.frameTime = animationData.frameTime / 1000;
    this.framesCount = this.frames.length;
    this.pos = pos.clone();

    this.onAnimationEndHandlers = new Set();

    this.start();
  }

  start(loop = false) {
    this.loop = loop;
    this.ended = false;
    this.frameIndex = 0;
    this.elapsedTime = 0;
    this.show();
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

  addAnimationEndHandler(handler) {
    this.onAnimationEndHandlers.add(handler);
  }

  triggerOnAninmationEnd() {
    this.onAnimationEndHandlers.forEach(handler => handler(this));
  }

  render(context, deltaTime, transformIndex = 0) {
    if(this.loop || this.frameIndex + 1 < this.framesCount) {
      this.frameIndex = Math.floor(this.elapsedTime / this.frameTime) % this.framesCount;
      this.elapsedTime += deltaTime;
    } else {
      if(!this.ended) {
        this.ended = true;
        this.triggerOnAninmationEnd();
      }
    }

    if(!this.visible) return;
    context.drawImage(
      this.frames[this.frameIndex][transformIndex],
      this.pos.x * config.gridSize,
      this.pos.y * config.gridSize
    );
  }
}
