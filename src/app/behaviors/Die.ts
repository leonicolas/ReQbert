import Behavior from "../Behavior";
import config from "../config";
import Entity from "../Entity";
import { EntityEvent } from "../Global";
import { Vector2 } from "../libs/math";
import Jump from "./Jump";

export class DieEvent extends EntityEvent<void> {}

export default class Die extends Behavior {
  private speed: number = 12;
  public isDying: boolean = false;
  public position: Vector2 = new Vector2(0, 0);

  constructor(entity: Entity) {
    super(entity);
    this.reset();

    this.onStartListeners.add(() => {
      const jump = this.entity.behaviors.get(Jump) as Jump;
      if (jump && jump.isEnabled) {
        jump.disable();
      }
    });
  }

  start() {
    if (this.isActive()) return;
    this.position = this.entity.position.clone();
    this.reset();
    this.isDying = true;
  }

  isActive() {
    return this.isDying;
  }

  update(deltaTime: number) {
    this.dyingUpdate();
    if (this.isDying) {
      this.move(deltaTime);
    }
  }

  reset() {
    this.isDying = false;
  }

  private move(deltaTime: number) {
    this.position.moveY(this.speed * deltaTime);
    this.entity.position.y = this.position.y;
  }

  private dyingUpdate() {
    if (!this.isDying) return;

    this.position.copyFrom(this.entity.position);
    this.triggerOnStart(new DieEvent(this.entity));

    if (this.entity.position.y >= config.grid.lines + 2) {
      this.reset();
      this.triggerOnEnd(new DieEvent(this.entity));
    }
  }
}
