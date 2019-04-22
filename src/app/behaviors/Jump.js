import Behavior from '../Behavior';
import { degToRad, Vec2 } from '../libs/math'

export const LEFT = -1;
export const RIGHT = 1;
export const UP = -1;
export const DOWN = 1;

export default class Jump extends Behavior {

  constructor() {
    super('jump');
    this.isEnabled = true;
    this.speed = 250;
    this.ratio = new Vec2(3, 2);
    this.reset();
  }

  reset() {
    this.isJumping = false;
    this.direction = new Vec2(LEFT, DOWN);
    this.lastPos = this.direction.clone();
  }

  enable() {
    this.isEnabled = true;
  }
;
  disable() {
    this.isEnabled = false;
  }

  leftDown() {
    this._start(LEFT, DOWN);
  }

  leftUp() {
    this._start(LEFT, UP);
  }

  rightDown() {
    this._start(RIGHT, DOWN);
  }

  rightUp() {
    this._start(RIGHT, UP);
  }

  isToLeft() {
    return this.direction.x === LEFT;
  }

  isToRight() {
    return this.direction.x === RIGHT;
  }

  isToDown() {
    return this.direction.y === DOWN;
  }

  isToUp() {
    return this.direction.y === UP;
  }

  update(entity, deltaTime) {
    if(!this.isJumping) return;

    this.angle += this.speed * deltaTime;

    let finished = this.angle > this.maxAngle;
    if(finished) {
      this.angle = this.maxAngle;
    }

    this._moveEntity(entity);

    if(finished) {
      this._normalizeEntityPos(entity);
      this.triggerOnEnd();
      this.isJumping = false;
    }
  }

  _moveEntity(entity) {
    let radAngle = degToRad(this.refAngle - this.angle);
    let x = Math.sin(radAngle);
    let y = Math.cos(radAngle);

    entity.pos.move(
      Math.abs(x - this.lastPos.x) * this.ratio.x * this.direction.x,
      Math.abs(y - this.lastPos.y) * this.ratio.y * this.direction.y
    );
    this.lastPos.set(x, y);
  }

  _normalizeEntityPos(entity) {
    entity.pos.set(
      Math.round(entity.pos.x),
      Math.round(entity.pos.y)
    );
  }

  _start(directionX, directionY) {
    if(this.isJumping || !this.isEnabled) return;

    this.isJumping = true;
    this.direction.set(directionX, directionY);
    this.lastPos.set(
      directionY > 0 ? 0 : 1,
      directionY > 0 ? 1 : 0
    );
    this.angle = 0;
    this.maxAngle = 90;
    this.refAngle = directionY > 0 ? 0 : 90;

    this.triggerOnStart(this.direction.clone());
  }
}
