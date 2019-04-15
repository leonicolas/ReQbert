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

    this.play();
  }

  playInLoop() {
    this.play(-1)
  }

  play(times = 1) {
    this.playTimes = times;
    this.ended = false;
    this.frameIndex = 0;
    this.elapsedTime = 0;
    this.show();
  }

  stop() {
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
    let hasFinished = this.frameIndex >= this.framesCount - 1;
    // Count the number of times the animation was played.
    if(this.playTimes > 1 && hasFinished) {
      console.log('reseting');
      this.play(--this.playTimes);
      hasFinished = false;
    }

    // Render the animation frame.
    if(this.playTimes < 0 || !hasFinished) {
      this.frameIndex = Math.round(this.elapsedTime / this.frameTime) % this.framesCount;
      console.log(this.framesNames[0], this.elapsedTime / this.frameTime / this.framesCount, this.elapsedTime, this.frameIndex)
      this.elapsedTime += deltaTime;
    } else if(!this.ended) {
      this.ended = true;
      this.triggerOnAnimationEnd();
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
