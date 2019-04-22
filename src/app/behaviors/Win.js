import Behavior from '../Behavior';
import config from '../config';

export default class Win extends Behavior {

  constructor() {
    super('win');
    this.speed = 5;
    this.distance = 1;
    this.onLowestPointListeners = new Set();
    this.onHighestPointListeners = new Set();
  }

  start(times = 1) {
    if(times <= 0) return;
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

  update(entity, deltaTime) {
    if(!this.isRunning) return;

    // Gets the initial entity position
    if(!this.initialPosition) {
      this.initialPosition = entity.pos.y;
      this.targetPosition = this.initialPosition - this.distance;
      if(entity.jump)
        entity.jump.disable();
    }
    // Calculates the movement position
    let newPosition = entity.pos.y + this.speed * deltaTime * this.direction;

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
    entity.pos.setY(newPosition);
  }
}
