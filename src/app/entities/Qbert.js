import Vec2 from '../libs/Vec2';

export default class Qbert {

  constructor(spriteMap, pos) {
    this.spriteMap = spriteMap;
    this.qbert = this.spriteMap.get('qbert');
    this.pos = pos;
  }

  update(time) {
  }

  render(context, time) {
    this.qbert.render(context, 0, this.pos);
  }
}
