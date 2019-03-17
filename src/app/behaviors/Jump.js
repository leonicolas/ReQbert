import Behavior from '../libs/Behavior';
import { degToRad } from '../libs/math'

const LEFT = -1;
const RIGHT = 1;
const UP = -1;
const DOWN = 1;

export default class Jump extends Behavior {

  constructor() {
    super('jump');
    this.speed = 250;
    this.xDirection = LEFT;
    this.yDirection = DOWN;
    this.ratioX = 3;
    this.ratioY = 2;
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
    return this.jumping;
  }

  _start(xDirection, yDirection) {
    if(this.isJumping()) return;
    this.xDirection = xDirection;
    this.yDirection = yDirection;
    this.lastX = yDirection > 0 ? 0 : 1;
    this.lastY = yDirection > 0 ? 1 : 0;
    this.angle = 0;
    this.maxAngle = 90;
    this.refAngle = yDirection > 0 ? 0 : 90;
    this.jumping = true;
  }

  _calculateNextAngle(deltaTime) {
    this.angle += this.speed * deltaTime;
    if(this.angle > this.maxAngle) {
      this.jumping = false;
      this.angle = this.maxAngle;
    }
  }

  update(entity, deltaTime) {
    if(!this.isJumping()) return;

    this._calculateNextAngle(deltaTime);
    let radAngle = degToRad(this.refAngle - this.angle);
    let x = Math.sin(radAngle);
    let y = Math.cos(radAngle);

    entity.pos.move(
      Math.abs(x - this.lastX) * this.ratioX * this.xDirection,
      Math.abs(y - this.lastY) * this.ratioY * this.yDirection
    );
    this.lastX = x;
    this.lastY = y;
  }
}
