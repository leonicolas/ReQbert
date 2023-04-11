import Behavior from "../Behavior";
import config from "../config";
import Entity from "../Entity";
import { EntityEvent } from "../Global";
import { Vector2 } from "../libs/math";

export class SpawnEvent extends EntityEvent<void> {}

export default class Spawn extends Behavior {
  private speed: number = 5;
  private finalPos?: Vector2;

  public isSpawning: boolean = false;
  public position?: Vector2;

  constructor(entity: Entity) {
    super(entity);
    this.reset();
  }

  start(finalPos: Vector2) {
    if (this.isActive()) return;
    this.reset();
    this.isSpawning = true;
    this.position = finalPos.clone();
    this.position.y = -2;
    this.finalPos = finalPos;
    this.triggerOnStart<SpawnEvent>(new SpawnEvent(this.entity));
  }

  isActive() {
    return this.isSpawning;
  }

  update(deltaTime: number) {
    this.checkIfFinished(this.entity);
    if (this.isSpawning) {
      this.move(this.entity, deltaTime);
    }
  }

  reset() {
    this.isSpawning = false;
  }

  private move(entity: Entity, deltaTime: number) {
    if (!this.position) {
      return;
    }
    this.position.moveY(this.speed * deltaTime);
    entity.position.set(this.position.x, this.position.y);
  }

  private checkIfFinished(entity: Entity) {
    if (!this.isSpawning || !entity.position || !this.finalPos) 
      return;

    if (entity.position.y >= this.finalPos.y && entity.position.y < config.grid.lines) {
      entity.position.set(this.finalPos.x, this.finalPos.y);
      this.isSpawning = false;
      this.triggerOnEnd<SpawnEvent>(new SpawnEvent(this.entity));
    }
  }
}
