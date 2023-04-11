import Behavior from "./Behavior";
import { Renderable, Updatable } from "./Global";
import { Vector2 } from "./libs/math";
import Sprite from "./Sprite";

export default class Entity implements Updatable, Renderable {
  private activeSprite?: Sprite;

  readonly behaviors: Map<typeof Behavior, Behavior> = new Map();
  readonly sprites = new Map<string, Sprite>();

  public position: Vector2;

  constructor(position: Vector2) {
    this.position = position.clone();
  }

  addBehavior(behavior: typeof Behavior) {
    this.behaviors.set(behavior, new behavior(this));
  }

  addSprite(name: string, sprite: Sprite) {
    this.sprites.set(name, sprite);
  }

  playAnimationInLoop() {
    this.activeSprite?.playInLoop();
  }

  stopAnimation() {
    this.activeSprite?.stop();
  }

  behavior<T extends Behavior>(behavior: typeof Behavior): T {
    return this.behaviors.get(behavior) as T;
  }

  update(deltaTime: number) {
    Object.keys(this.behaviors).forEach((name) => {
      this.behaviors[name].update(this, deltaTime);
    });
    this.activeSprite?.position.set(this.position.x, this.position.y);
  }

  render(context: CanvasRenderingContext2D) {
    this.activeSprite?.render(context);
  }

  setActiveSprite(name: string) {
    this.activeSprite = this.sprites[name];
  }
}
