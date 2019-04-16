import { toFixed } from '../libs/math';

import Behavior from '../Behavior';
import config from '../config';

export default class Win extends Behavior {

  constructor() {
    super('win');
    this.speed = 2;
    this.maxDistance = 2;
  }

  start(times = 1) {
    if(times <= 0) return;
    this.times = times;
    this.isRunning = true;
    this.initialPos = undefined;
    this.totalDistance = 0;
    this.direction = -1;
    this.triggerOnStart();
  }

  update(entity, deltaTime) {
    if(!this.isRunning) return;

    // Gets the initial entity position
    if(!this.initialPos) {
      this.initialPos = entity.pos.y;
    }
    // Calculates the moving distance.
    const distance = toFixed(this.speed * deltaTime, 2);
    this.totalDistance += distance;

    // Move the entities
    entity.pos.moveY(distance * this.direction);
    console.log(entity.pos.y, toFixed(this.totalDistance, 2), distance);

    // Verifies the moving boundaries
    this._verifyBoundaries();

    if(!this.isRunning) {
      this.triggerOnEnd();
      //this.start(this.times - 1);
    }
  }

  _verifyBoundaries() {
    if(this.totalDistance > this.maxDistance) {
      this.totalDistance = 0;
      this.direction *= -1;
      console.log("===========================================");
      if(this.direction < 0)
        this.isRunning = false;
    }
  }
}
