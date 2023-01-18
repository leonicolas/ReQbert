import { getGameConfig } from './Global';
import { Vector2 } from './libs/math';
import { castArray } from './libs/utils';
import { ConfigSpec } from './specs/Config';
import { SpriteSpec, ImageSpec } from './specs/Sprite';

export default class Sprite {

  position: Vector2;

  frames: CanvasImageSource[];
  frameTime: number;
  framesCount: number;
  visible: boolean = true;

  transformIndex: number = 0;

  loop: boolean = false;
  ended: boolean = false;
  frameIndex: number = 0;
  elapsedTime: number;

  onAnimationEndListeners = new Set<(self: Sprite) => void>();

  constructor(images: CanvasImageSource | CanvasImageSource[], spriteSpec?: SpriteSpec, position: Vector2 = new Vector2(0, 0)) {
    this.frames = castArray<CanvasImageSource>(images);
    this.frameTime = spriteSpec?.frameTime / 1000 || 0;
    this.framesCount = this.frames.length;
    this.position = position.clone();
  }

  playInLoop() {
    this.play(true);
  }

  play(loop: boolean = false) {
    this.loop = loop;
    this.reset();
    this.show();
  }

  stop() {
    this.loop = false;
    this.ended = true;
    this.triggerOnAnimationEnd();
  }

  reset() {
    this.ended = false;
    this.frameIndex = 0;
    this.elapsedTime = 0;
  }

  show() {
    this.visible = true;
  }

  hide() {
    this.visible = false;
  }

  triggerOnAnimationEnd() {
    this.onAnimationEndListeners.forEach(listener => listener(this));
  }

  render(context: CanvasRenderingContext2D, deltaTime: number) {
    if(this.loop || this.frameIndex + 1 < this.framesCount) {
      this.frameIndex = this.calculateNextFrameIndex();
      this.elapsedTime += deltaTime;
    } else if(!this.ended) {
      this.stop();
    }

    if(!this.visible)
      return;

    const frame = this.frames[this.frameIndex];
    const config = getGameConfig();
    context.drawImage(
      frame[this.transformIndex],
      this.position.x * config.grid.size,
      this.position.y * config.grid.size
    );
  }

  private calculateNextFrameIndex(): number {
    if(this.frameTime)
      return Math.floor(this.elapsedTime / this.frameTime) % this.framesCount;
    return 0;
  }
}
