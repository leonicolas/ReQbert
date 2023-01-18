import Behavior from '../Behavior';
import config from '../config';
import Entity from '../Entity';
import { Vector2 } from '../libs/math';

export default class Die extends Behavior {

  speed: number = 12;
  isDying: boolean = false;
  position: Vector2;

  constructor() {
    super();
    this.reset();

    this.onStartListeners.add(entity => {
      if(entity.jump && entity.jump.isEnabled) {
        entity.jump.disable();
      }
    });
  }

  start() {
    if(this.isActive()) return;
    this.reset();
    this.isDying = true;
  }

  isActive() {
    return this.isDying;
  }

  update(entity: Entity, deltaTime: number) {
    this.dyingUpdate(entity);
    if(this.isDying) {
      this.move(entity, deltaTime);
    }
  }

  reset() {
    this.isDying = false;
    this.position = undefined;
  }

  private move(entity: Entity, deltaTime: number) {
    this.position.moveY(this.speed * deltaTime);
    entity.position.y = this.position.y;
  }

  private dyingUpdate(entity: Entity) {
    if(!this.isDying)
      return;

    if(!this.position) {
      this.position = entity.position;
      this.triggerOnStart(entity);
    }
    if(entity.position.y >= config.grid.lines + 2) {
      this.reset();
      this.triggerOnEnd(entity);
    }
  }
}
