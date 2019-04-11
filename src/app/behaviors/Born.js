import Behavior from '../Behavior';
import config from '../config';

export default class Born extends Behavior {

  constructor() {
    super('born');
    this.reset();
    this.speed = 5;
    this.onStartListeners = new Set();
    this.onEndListeners = new Set();
  }

  start(finalPos) {
    if(this.isActive()) return;
    this.reset();
    this.isBeingBorn = true;
    this.position = finalPos.clone();
    this.position.y = -2;
    this.finalPos = finalPos;
    this.onStartListeners.forEach(listener => listener());
  }

  isActive() {
    return this.isBeingBorn;
  }

  update(entity, deltaTime) {
    this._checkIfBeingBorn(entity);
    if(this.isBeingBorn) {
      this._move(entity, deltaTime);
    }
  }

  reset() {
    this.isBeingBorn = false;
  }

  _move(entity, deltaTime) {
    this.position.moveY(this.speed * deltaTime);
    entity.pos.set(this.position.x, this.position.y);
  }

  _checkIfBeingBorn(entity) {
    if(!this.isBeingBorn) return;
    if(entity.pos.y >= this.finalPos.y &&
       entity.pos.y < config.grid.lines) {
      entity.pos.set(this.finalPos.x, this.finalPos.y);
      this.isBeingBorn = false;
      this.onEndListeners.forEach(listener => listener());
    }
  }
}
