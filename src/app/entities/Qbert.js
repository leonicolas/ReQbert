import Vec2 from '../libs/Vec2';

export default class Qbert {
  constructor(spriteMap) {
    this.spriteMap = spriteMap;
    this.qbert = this.spriteMap.get('qbert');
  }

  update(time) {
  }

  render(context, time) {
    this.qbert.render(context, 0, new Vec2(15.5, 1.6));
  }
}
