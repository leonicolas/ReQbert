export function createAnimation(frames, frameTime) {
  return time => {
    const frameIndex = Math.floor(time / frameTime) % frames.length;
    return frames[frameIndex];
  };
}
