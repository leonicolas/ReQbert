import Vec2 from '../libs/Vec2';
import Entity from '../libs/Entity';
import Jump from '../behaviors/Jump';

const LEFT = 0;
const RIGHT = 1;

export default class Qbert extends Entity {

  constructor(spriteMap, pos) {
    super(spriteMap, pos);

    this.actions = {
      'idle-front': this.spriteMap.get('qbert-front'),
      'idle-back': this.spriteMap.get('qbert-back'),
      'jumping-front': this.spriteMap.get('qbert-front-jumping'),
      'jumping-back': this.spriteMap.get('qbert-back-jumping'),
    };

    this.sprite = this.actions.idleFront;
    this.xDirection = LEFT;

    this.addBehaviour(new Jump());
  }

  update(deltaTime) {
    this.xDirection = this.jump.isToLeft() ? LEFT : RIGHT;
    let state = this.jump.isJumping() ? 'jumping' : 'idle';
    let yDirection = this.jump.isToDown() ? 'front' : 'back';
    this.sprite = this.actions[`${state}-${yDirection}`];
    super.update(deltaTime);
  }

  render(context) {
    this.sprite.render(context, 0, this.pos, this.xDirection);
  }
}
