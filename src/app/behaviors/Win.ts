import Behavior from "../Behavior";
import { EntityEvent } from "../Global";
import Jump from "./Jump";

export class WinEvent extends EntityEvent<void> {}

export default class Win extends Behavior {
  public distance: number = 1;
  public times: number = 0;
  public isRunning: boolean = false;
  public initialPosition?: number;
  public targetPosition?: number;
  public speed: number = 0;
  public direction = -1;

  readonly onLowestPointListeners = new Set<() => void>();
  readonly onHighestPointListeners = new Set<() => void>();

  start(times = 1) {
    if (times <= 0) return;
    this.times = times;
    this.isRunning = true;
    this.initialPosition = undefined;
    this.direction = -1;
    this.triggerOnStart(new WinEvent(this.entity));
  }

  triggerOnHighestPoint() {
    this.onHighestPointListeners.forEach((listener) => listener());
  }

  triggerOnLowestPoint() {
    this.onLowestPointListeners.forEach((listener) => listener());
  }

  update(deltaTime: number) {
    if (!this.isRunning) return;

    // Gets the initial entity position
    if (!this.initialPosition) {
      this.initialPosition = this.entity.position.y;
      this.targetPosition = this.initialPosition - this.distance;
      this.entity.behavior<Jump>(Jump)?.disable();
    }
    // Calculates the movement position
    let newPosition = this.entity.position.y + this.speed * deltaTime * this.direction;

    if (this.targetPosition && newPosition < this.targetPosition) {
      newPosition = this.targetPosition;
      this.direction *= -1;
      this.triggerOnHighestPoint();
    } else if (newPosition > this.initialPosition) {
      newPosition = this.initialPosition;
      if (--this.times === 0) {
        this.isRunning = false;
        this.triggerOnEnd(new WinEvent(this.entity));
      } else {
        this.triggerOnLowestPoint();
      }
      this.direction *= -1;
    }

    // Move the entity
    this.entity.position.y = newPosition;
  }
}
