import Behavior from '../Behavior';
import Entity from '../Entity';
import Jump from './Jump';

export default class Win extends Behavior {

  distance: number = 1;
  times: number;
  isRunning: boolean = false;
  initialPosition: number;
  targetPosition: number;
  speed: number;
  direction = -1;

  onLowestPointListeners = new Set<() => void>();
  onHighestPointListeners = new Set<() => void>();

  start(times = 1) {
    if(times <= 0)
      return;
    this.times = times;
    this.isRunning = true;
    this.initialPosition = undefined;
    this.direction = -1;
    this.triggerOnStart();
  }

  triggerOnHighestPoint() {
    this.onHighestPointListeners.forEach(listener => listener());
  }

  triggerOnLowestPoint() {
    this.onLowestPointListeners.forEach(listener => listener());
  }

  update(entity: Entity, deltaTime: number) {
    if(!this.isRunning)
      return;

    // Gets the initial entity position
    if(!this.initialPosition) {
      this.initialPosition = entity.position.y;
      this.targetPosition = this.initialPosition - this.distance;
      entity.behavior<Jump>(Jump)?.disable();
    }
    // Calculates the movement position
    let newPosition = entity.position.y + this.speed * deltaTime * this.direction;

    if(newPosition < this.targetPosition) {
      newPosition = this.targetPosition;
      this.direction *= -1;
      this.triggerOnHighestPoint();
    } else if(newPosition > this.initialPosition) {
      newPosition = this.initialPosition;
      if(--this.times === 0) {
        this.isRunning = false;
        this.triggerOnEnd();
      } else {
        this.triggerOnLowestPoint();
      }
      this.direction *= -1;
    }

    // Move the entity
    entity.position.y = newPosition;
  }
}
