import { getGameConfig, Renderable, SpriteEvent, Updatable } from "./Global";
import { Vector2 } from "./libs/math";
import { castArray } from "./libs/utils";
import { SpriteSpec } from "./specs/Sprite";

export default class Sprite implements Updatable, Renderable {
  private spriteSpec?: SpriteSpec;
  private frames: CanvasImageSource[];
  private frameTime: number;
  private framesCount: number;
  private visible: boolean = true;

  //private transformIndex: number = 0;

  private loop: boolean = false;
  private ended: boolean = false;
  private frameIndex: number = 0;
  private elapsedTime: number = 0;

  readonly onAnimationEndListeners = new Set<(spriteEvent: SpriteEvent) => void>();
  readonly position: Vector2;

  constructor(
    images: CanvasImageSource | CanvasImageSource[],
    spriteSpec?: SpriteSpec,
    position: Vector2 = new Vector2(0, 0)
  ) {
    this.spriteSpec = Object.freeze(Object.assign({}, spriteSpec));
    this.frames = castArray<CanvasImageSource>(images);
    this.frameTime = this.spriteSpec?.frameTime / 1000 || 0;
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
    this.onAnimationEndListeners.forEach((listener) => listener(new SpriteEvent(this)));
  }

  update(deltaTime: number) {
    if (this.loop || this.frameIndex + 1 < this.framesCount) {
      this.frameIndex = this.calculateNextFrameIndex();
      this.elapsedTime += deltaTime;
    } else if (!this.ended) {
      this.stop();
    }
  }

  render(context: CanvasRenderingContext2D) {
    if (!this.visible) return;

    const frame = this.frames[this.frameIndex];
    const config = getGameConfig();
    context.drawImage(
      frame, //[this.transformIndex],
      this.position.x * config.grid.size,
      this.position.y * config.grid.size
    );
  }

  clone(position: Vector2 = new Vector2(0, 0)): Sprite {
    return new Sprite(this.frames, this.spriteSpec, position);
  }

  getLastFrameName() {
    return this.spriteSpec?.frames[this.spriteSpec.frames.length - 1];
  }

  private calculateNextFrameIndex(): number {
    if (this.frameTime) {
      return Math.floor(this.elapsedTime / this.frameTime) % this.framesCount;
    }
    return 0;
  }
}
