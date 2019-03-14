import Behavior from '../libs/Behavior';
import { degToRad } from '../libs/math'

const LEFT = 1;
const RIGHT = -1;
const UP = 'up';
const DOWN = 'down';

export default class Jump extends Behavior {

  constructor() {
    super('jump');
    this.velocity = 200;
    this.xDirection = LEFT;
    this.yDirection = DOWN;
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
    return this.xDirection === LEFT;
  }

  isToRight() {
    return this.xDirection === RIGHT;
  }

  isToDown() {
    return this.yDirection === DOWN;
  }

  isToUp() {
    return this.yDirection === UP;
  }

  isJumping() {
    return Math.abs(this.angle) < Math.abs(this.maxAngle);
  }

  _start(xDirection, yDirection) {
    if(this.isJumping()) return;
    this.xDirection = xDirection;
    this.yDirection = yDirection;
    this.angle = 0;
    this.maxAngle = 90 * this.xDirection;
  }

  update(entity, deltaTime) {
    if(!this.isJumping())
      return;

    let radAngle = degToRad(90 + this.angle);
    let x = Math.sin(radAngle);
    let y = Math.cos(radAngle);

    entity.pos.move(x, y);
    this.angle += this.velocity * this.xDirection * deltaTime;
  }
}
