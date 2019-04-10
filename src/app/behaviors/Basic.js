import Behavior from '../Behavior';
import config from '../config';

export default class Basic extends Behavior {

  constructor() {
    super('basic');
    this.reset();
    this.speed = 12;
    this.dyingListeners = new Set();
    this.beingBornListeners = new Set();
  }

  born() {
    if(this.isActive()) return;
    this.reset();
    this.isBeingBorn = true;
    this.beingBornListeners.forEach(listener => listener());
  }

  die() {
    if(this.isActive()) return;
    this.reset();
    this.isDying = true;
    this.dyingListeners.forEach(listener => listener());
  }

  addBeingBornListener(listener) {
    this.beingBornListeners.add(listener);
  }

  addDyingListener(listener) {
    this.dyingListeners.add(listener);
  }

  isActive() {
    return this.isBeingBorn || this.isDying;
  }

  update(entity, deltaTime) {
    if(this.isBeingBorn)
      this._beingBornUpdate(entity, deltaTime);
    else if(this.isDying)
      this._dyingUpdate(entity, deltaTime);
  }

  reset() {
    this.isBeingBorn = false;
    this.isDying = false;
  }

  _beingBornUpdate(entity, deltaTime) {

  }

  _dyingUpdate(entity, deltaTime) {
    if(entity.pos.y < config.grid.lines + 2)
      entity.pos.moveY(this.speed * deltaTime);
  }
}
