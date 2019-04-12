import Behavior from '../Behavior';
import config from '../config';

export default class Spawn extends Behavior {

  constructor() {
    super('spawn');
    this.reset();
    this.speed = 5;
    this.onStartListeners = new Set();
    this.onEndListeners = new Set();
  }

  start(finalPos) {
    if(this.isActive()) return;
    this.reset();
    this.isSpawning = true;
    this.position = finalPos.clone();
    this.position.y = -2;
    this.finalPos = finalPos;
    this.onStartListeners.forEach(listener => listener());
  }

  isActive() {
    return this.isSpawning;
  }

  update(entity, deltaTime) {
    this._checkIfFinished(entity);
    if(this.isSpawning) {
      this._move(entity, deltaTime);
    }
  }

  reset() {
    this.isSpawning = false;
  }

  _move(entity, deltaTime) {
    this.position.moveY(this.speed * deltaTime);
    entity.pos.set(this.position.x, this.position.y);
  }

  _checkIfFinished(entity) {
    if(!this.isSpawning) return;
    if(entity.pos.y >= this.finalPos.y &&
       entity.pos.y < config.grid.lines) {
      entity.pos.set(this.finalPos.x, this.finalPos.y);
      this.isSpawning = false;
      this.onEndListeners.forEach(listener => listener());
    }
  }
}
