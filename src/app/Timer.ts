export default class Timer {

  public update?: (deltaTime: number) => void

  private updateProxy: (time: number) => void;

  constructor(deltaTime: number = 1 / 60) {
    let lastTime = 0;
    let accumulatedTime = 0;

    this.updateProxy = time => {
      accumulatedTime += (time - lastTime) / 1000;

      while (accumulatedTime > deltaTime) {
        if (this.update)
          this.update(deltaTime);
        accumulatedTime -= deltaTime;
      }
      lastTime = time;
      this.enqueue();
    };
  }

  enqueue() {
    requestAnimationFrame(this.updateProxy);
  }

  start() {
    this.enqueue();
  }
}
