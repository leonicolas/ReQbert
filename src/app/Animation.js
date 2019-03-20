import { Vec2 } from './libs/math';

export default class Animation {
  constructor(frames, frameTime, pos = new Vec2(0, 0)) {
    this.frames = frames;
    this.frameTime = frameTime;
    this.elapsedTime = 0;
    this.pos = pos;
  }

  render(context, deltaTime) {
    const frameIndex = Math.floor(this.elapsedTime / this.frameTime) % this.frames.length;
    this.frames[frameIndex].render(context, deltaTime);
    this.elapsedTime += deltaTime;
  }
}
