import { Vec2 } from './libs/math';

export default class Animation {
  constructor(frames, frameTime, pos = new Vec2(0, 0)) {
    this.frames = frames;
    this.frameTime = frameTime;
    this.elapsedTime = 0;
    this.pos = pos;
  }

  render(context, deltaTime) {
    const frameIndex = Math.floor(deltaTime / this.frameTime) % this.frames.length;
    context.drawImage(this.frames[frameIndex], this.pos.x, this.pos.y);
    this.elapsedTime += deltaTime;
  }
}
