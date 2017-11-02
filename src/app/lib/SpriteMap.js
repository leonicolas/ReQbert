import { degToRad } from './math';
import { castArray } from './utils';
import config from '../config';

export default class SpriteMap {
  constructor(spritesSpec, image) {
    this.image = image;
    this.sprites = new Map();

    spritesSpec.sprites.forEach(spriteSpec => {
      this.defineSprite(spriteSpec);
    });
  }

  defineSprite(spriteSpec) {
    const params = {
      name: spriteSpec.name,
      x: spriteSpec.position[0],
      y: spriteSpec.position[1],
      width: spriteSpec.size[0] * config.gridSize,
      height: spriteSpec.size[1] * config.gridSize
    };
    switch (spriteSpec.definition) {
      case 'rotated':
        this.defineRotated(params);
        break;
      case 'fliped':
        this.defineFliped(params);
        break;
      default:
        this.define(params);
    }
  }

  define({ name, x, y, width, height }) {
    const buffer = this.createBuffer(name, x, y, width, height);
    this.set(name, width, height, buffer);
  }

  defineRotated({ name, x, y, width, height }) {
    const buffers = [0, 90, 180, 270].map(rotation =>
      this.createBuffer(name, x, y, width, height, { rotation })
    );
    this.set(name, width, height, buffers);
  }

  defineFliped({ name, x, y, width, height }) {
    const buffers = [false, true].map(fliped =>
      this.createBuffer(name, x, y, width, height, { fliped })
    );
    this.set(name, width, height, buffers);
  }

  createBuffer(name, x, y, width, height, { rotation, fliped } = {}) {
    const buffer = document.createElement('canvas');
    const flipWidthHeight = rotation === 90 || rotation === 270;
    const spriteWidth = flipWidthHeight ? height : width;
    const spriteHeight = flipWidthHeight ? width : height;
    buffer.width = spriteWidth;
    buffer.height = spriteHeight;

    const context = buffer.getContext('2d');
    if (fliped) {
      context.scale(-1, 1);
      context.translate(-spriteWidth, 0);
    }

    let transX = flipWidthHeight && rotation === 270 ? 0 : spriteWidth;
    let transY = flipWidthHeight && rotation === 90 ? 0 : spriteHeight;
    if (rotation) {
      context.translate(transX, transY);
      context.rotate(degToRad(rotation));
    }
    context.drawImage(this.image, x, y, width, height, 0, 0, width, height);
    return buffer;
  }

  set(name, width, height, buffers) {
    this.sprites.set(name, {
      size: {
        x: width / config.gridSize,
        y: height / config.gridSize
      },
      width,
      height,
      buffers: castArray(buffers)
    });
  }

  get(name) {
    return this.sprites.get(name);
  }

  getSpriteSize(name) {
    const sprite = this.get(name);
    return {
      x: sprite.xSize,
      y: sprite.ySize
    };
  }

  draw(name, context, x = 0, y = 0, index = 0) {
    const sprite = this.get(name);
    context.drawImage(sprite.buffers[index], x * config.gridSize, y * config.gridSize);
  }
}
