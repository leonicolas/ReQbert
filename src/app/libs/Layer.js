import config from '../config';

export default class Layer {

  constructor(pos, size) {
    this.pos = pos;
    this.size = size;
    this.sprites = [];
    this.buffer = document.createElement('canvas');
    this.buffer.width = size.width;
    this.buffer.height = size.height;
    this.context = this.buffer.getContext('2d');
  }

  addSprite(sprite) {
    this.sprites.push(sprite);
  }

  render(context, time) {
    this._clear();
    this._renderSprites(time);
    context.drawImage(this.buffer, this.pos.x * config.gridSize, this.pos.y * config.gridSize);
  }

  _clear() {
    this.context.clearRect(0, 0, this.buffer.width, this.buffer.height);
  }

  _renderSprites(time) {
    this.sprites.forEach(sprite => {
      sprite.render(this.context, time);
    })
  }
}
