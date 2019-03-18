export function createAnimation(frames, frameTime) {
  return new Animation(frames, frameTime);
}

class Animation {
  constructor(frames, frameTime) {
    this.frames = frames;
    this.frameTime = frameTime;
    this.elapsedTime = 0;
  }

  render(context, deltaTime) {
    const frameIndex = Math.floor(deltaTime / this.frameTime) % this.frames.length;
    this.frames[frameIndex].render(context, this.elapsedTime);
    this.elapsedTime += time;
  }
}
