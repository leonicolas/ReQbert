import Vec2 from '../libs/Vec2';

export default class Qbert {

  constructor(spriteMap, pos) {
    this.spriteMap = spriteMap;
    this.actions = {
      normalFront: this.spriteMap.get('qbert-front'),
      jumpingFront: this.spriteMap.get('qbert-front-jumping'),
      normalBack: this.spriteMap.get('qbert-back'),
      jumpingBack: this.spriteMap.get('qbert-back-jumping'),
    };
    this.pos = pos;
    this.setNormalState();
    this.setLeftFront();
  }

  setJumpingState() {
    this.state = 'jumping';
  }

  setNormalState() {
    this.state = 'normal';
  }

  setLeftFront() {
    this.directionLeftRight = 0;
    this.directionFrontBack = 'Front';
  }

  setRightFront() {
    this.directionLeftRight = 1;
    this.directionFrontBack = 'Front';
  }

  setLeftBack() {
    this.directionLeftRight = 0;
    this.directionFrontBack = 'Back';
  }

  setRightBack() {
    this.directionLeftRight = 1;
    this.directionFrontBack = 'Back';
  }

  update(time) {
  }

  render(context, time) {
    let sprite = this.actions[this.state + this.directionFrontBack];
    sprite.render(context, 0, this.pos, this.directionLeftRight);
  }
}
