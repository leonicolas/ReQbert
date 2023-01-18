import Behavior from '../Behavior';
import config from '../config';
import Entity from '../Entity';
import { Vector2 } from '../libs/math';

export default class Spawn extends Behavior {

  speed: number = 5;
  isSpawning: boolean;
  position: Vector2;
  finalPos: Vector2;

  constructor() {
    super();
    this.reset();
  }

  start(finalPos: Vector2) {
    if(this.isActive()) return;
    this.reset();
    this.isSpawning = true;
    this.position = finalPos.clone();
    this.position.y = -2;
    this.finalPos = finalPos;
    this.triggerOnStart();
  }

  isActive() {
    return this.isSpawning;
  }

  update(entity: Entity, deltaTime: number) {
    this.checkIfFinished(entity);
    if(this.isSpawning) {
      this.move(entity, deltaTime);
    }
  }

  reset() {
    this.isSpawning = false;
  }

  private move(entity: Entity, deltaTime: number) {
    this.position.moveY(this.speed * deltaTime);
    entity.position.set(this.position.x, this.position.y);
  }

  private checkIfFinished(entity: Entity) {
    if(!this.isSpawning)
      return;
    if(entity.position.y >= this.finalPos.y && entity.position.y < config.grid.lines) {
      entity.position.set(this.finalPos.x, this.finalPos.y);
      this.isSpawning = false;
      this.triggerOnEnd();
    }
  }
}
