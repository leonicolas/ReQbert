export default class SpriteMap {
  constructor(image) {
    this.image = image;
    this.sprites = new Map();
  }

  define(name, x, y, width, height) {
    const buffer = document.createElement('canvas');
    buffer.width = width;
    buffer.height = height;
    const context = buffer.getContext('2d');
    context.drawImage(this.image, x, y, width, height, 0, 0, width, height);
    this.sprites.set(name, buffer);
  }

  draw(name, context, x, y) {
    const buffer = this.sprites.get(name);
    context.drawImage(buffer, x, y);
  }
}
