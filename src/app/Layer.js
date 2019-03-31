import config from './config';

export default class Layer {

  constructor(pos, size) {
    // Initialize properties
    this.pos = pos.clone();
    this.size = size;
    this.sprites = [];
    // Initialize buffer
    this.buffer = document.createElement('canvas');
    this.buffer.width = size.width;
    this.buffer.height = size.height;
    this.context = this.buffer.getContext('2d');
  }

  addSprite(sprite) {
    this.sprites.push(sprite);
  }

  update(deltaTime) {
    this.sprites.forEach(sprite => sprite.update(deltaTime));
  }

  render(context, deltaTime) {
    this._clear();
    this._renderSprites(deltaTime);
    context.drawImage(this.buffer, this.pos.x * config.gridSize, this.pos.y * config.gridSize);
  }

  _clear() {
    this.context.clearRect(0, 0, this.buffer.width, this.buffer.height);
  }

  _renderSprites(deltaTime) {
    this.sprites.forEach(sprite => {
      sprite.render(this.context, deltaTime);
    })
  }
}
