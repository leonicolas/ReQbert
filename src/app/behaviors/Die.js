import Behavior from '../Behavior';
import config from '../config';

export default class Die extends Behavior {

  constructor() {
    super('die');
    this.reset();
    this.speed = 12;
  }

  start() {
    if(this.isActive()) return;
    this.reset();
    this.isDying = true;
    this.position = undefined;
    this.triggerOnStart();
  }

  isActive() {
    return this.isDying;
  }

  update(entity, deltaTime) {
    this._checkIfDying(entity);
    if(this.isDying) {
      this._move(entity, deltaTime);
    }
  }

  reset() {
    this.isDying = false;
  }

  _move(entity, deltaTime) {
    this.position.moveY(this.speed * deltaTime);
    entity.pos.setY(this.position.y);
  }

  _checkIfDying(entity) {
    if(!this.isDying) return;
    if(!this.position) {
      this.position = entity.pos;
    }
    if(entity.pos.y >= config.grid.lines + 2) {
      this.isDying = false;
      this.triggerOnEnd();
    }
  }
}
