import { Vec2 } from './libs/math';

export default class Sprite {

  constructor(buffer, pos = new Vec2(0, 0)) {
    this.buffer = buffer;
    this.pos = pos;
  }

  render(context) {
    context.drawImage(this.buffer, this.pos.x, this.pos.y);
  }
}
