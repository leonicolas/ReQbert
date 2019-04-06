import Entity from '../Entity';
import Jump from '../behaviors/Jump';

const LEFT = 0;
const RIGHT = 1;

export default class Qbert extends Entity {

  constructor(spriteMap, pos) {
    super(spriteMap, pos);

    this.sprites = {
      'idle-front': this.spriteMap.newSprite('qbert-front'),
      'idle-back': this.spriteMap.newSprite('qbert-back'),
      'jumping-front': this.spriteMap.newSprite('qbert-front-jumping'),
      'jumping-back': this.spriteMap.newSprite('qbert-back-jumping'),
    };

    this.sprite = this.sprites.idleFront;
    this.xDirection = LEFT;

    this.addBehavior(new Jump());
  }

  update(deltaTime) {
    this.xDirection = this.jump.isToLeft() ? LEFT : RIGHT;
    let state = this.jump.isJumping() ? 'jumping' : 'idle';
    let yDirection = this.jump.isToDown() ? 'front' : 'back';
    this.sprite = this.sprites[`${state}-${yDirection}`];
    this.sprite.pos.set(this.pos.x, this.pos.y);
    super.update(deltaTime);
  }

  render(context, deltaTime) {
    this.sprite.render(context, deltaTime, this.xDirection);
  }
}
