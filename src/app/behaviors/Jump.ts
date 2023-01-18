import Behavior from '../Behavior';
import Entity from '../Entity';
import { degToRad, Vector2 } from '../libs/math'

export const LEFT = -1;
export const RIGHT = 1;
export const UP = -1;
export const DOWN = 1;

export default class Jump extends Behavior {

  isEnabled: boolean = true;
  speed: number = 250;
  angle: number;
  refAngle: number;
  ratio: Vector2 = new Vector2(3, 2);
  isJumping: boolean;
  direction: Vector2;
  lastPosition: Vector2;
  maxAngle: number;

  constructor() {
    super();
    this.reset();
  }

  reset() {
    this.isJumping = false;
    this.direction = new Vector2(LEFT, DOWN);
    this.lastPosition = this.direction.clone();
  }

  enable() {
    this.isEnabled = true;
  }
;
  disable() {
    this.isEnabled = false;
  }

  leftDown() {
    this.start(LEFT, DOWN);
  }

  leftUp() {
    this.start(LEFT, UP);
  }

  rightDown() {
    this.start(RIGHT, DOWN);
  }

  rightUp() {
    this.start(RIGHT, UP);
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

  update(entity: Entity, deltaTime: number) {
    if(!this.isJumping) return;

    this.angle += this.speed * deltaTime;

    let finished = this.angle > this.maxAngle;
    if(finished) {
      this.angle = this.maxAngle;
    }

    this.moveEntity(entity);

    if(finished) {
      this.normalizeEntityPosition(entity);
      this.triggerOnEnd(entity);
      this.isJumping = false;
    }
  }

  private moveEntity(entity: Entity) {
    let radAngle = degToRad(this.refAngle - this.angle);
    let x = Math.sin(radAngle);
    let y = Math.cos(radAngle);

    entity.position.move(
      Math.abs(x - this.lastPosition.x) * this.ratio.x * this.direction.x,
      Math.abs(y - this.lastPosition.y) * this.ratio.y * this.direction.y
    );
    this.lastPosition.set(x, y);
  }

  private normalizeEntityPosition(entity: Entity) {
    entity.position.set(
      Math.round(entity.position.x),
      Math.round(entity.position.y)
    );
  }

  private start(directionX: number, directionY: number) {
    if(this.isJumping || !this.isEnabled) return;

    this.isJumping = true;
    this.direction.set(directionX, directionY);
    this.lastPosition.set(
      directionY > 0 ? 0 : 1,
      directionY > 0 ? 1 : 0
    );
    this.angle = 0;
    this.maxAngle = 90;
    this.refAngle = directionY > 0 ? 0 : 90;

    this.triggerOnStart(this.direction.clone());
  }
}
