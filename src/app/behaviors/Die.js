import Behavior from '../Behavior';
import config from '../config';

export default class Die extends Behavior {

  constructor() {
    super('die');
    this.reset();
    this.speed = 12;

    this.onStartListeners.add(entity => {
      if(entity.jump && entity.jump.isEnabled) {
        entity.jump.disable();
      }
    });
  }

  start() {
    if(this.isActive()) return;
    this.reset();
    this.isDying = true;
  }

  isActive() {
    return this.isDying;
  }

  update(entity, deltaTime) {
    this._dyingUpdate(entity);
    if(this.isDying) {
      this._move(entity, deltaTime);
    }
  }

  reset() {
    this.isDying = false;
    this.position = undefined;
  }

  _move(entity, deltaTime) {
    this.position.moveY(this.speed * deltaTime);
    entity.pos.setY(this.position.y);
  }

  _dyingUpdate(entity) {
    if(!this.isDying) return;

    if(!this.position) {
      this.position = entity.pos;
      this.triggerOnStart(entity);
    }
    if(entity.pos.y >= config.grid.lines + 2) {
      this.reset();
      this.triggerOnEnd(entity);
    }
  }
}
