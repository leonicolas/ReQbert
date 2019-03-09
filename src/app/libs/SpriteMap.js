import Vect2 from './Vec2';
import { degToRad } from './math';
import { castArray } from './utils';
import config from '../config';

export default class SpriteMap {
  constructor(spritesSpec, image) {
    this.image = image;
    this.sprites = new Map();

    spritesSpec.sprites.forEach(spriteSpec => {
      this._defineSprite(spriteSpec);
    });
  }

  _defineSprite(spriteSpec) {
    const params = {
      name: spriteSpec.name,
      pos: new Vect2(spriteSpec.position[0], spriteSpec.position[1]),
      size: new Vect2(
        spriteSpec.size[0] * config.gridSize,
        spriteSpec.size[1] * config.gridSize
      )
    };
    switch (spriteSpec.definition) {
      case 'rotated':
        this._defineRotated(params);
        break;
      case 'fliped':
        this._defineFliped(params);
        break;
      default:
        this._define(params);
    }
  }

  _define({ name, pos, size }) {
    const buffer = this._createBuffer(name, pos, size);
    this._set(name, size, buffer);
  }

  _defineRotated({ name, pos, size }) {
    const buffers = [0, 90, 180, 270].map(rotation =>
      this._createBuffer(name, pos, size, { rotation })
    );
    this._set(name, size, buffers);
  }

  _defineFliped({ name, pos, size }) {
    const buffers = [false, true].map(fliped =>
      this._createBuffer(name, pos, size, { fliped })
    );
    this._set(name, size, buffers);
  }

  _createBuffer(name, pos, size, { rotation, fliped } = {}) {
    const buffer = document.createElement('canvas');
    const isRotated = rotation === 90 || rotation === 270;
    const spriteSize = size.clone();
    if (isRotated) spriteSize.swap();
    buffer.width = spriteSize.x;
    buffer.height = spriteSize.y;

    const context = buffer.getContext('2d');
    if (fliped) {
      context.scale(-1, 1);
      context.translate(-spriteSize.x, 0);
    }

    if (rotation) {
      let transX = isRotated && rotation === 270 ? 0 : spriteSize.x;
      let transY = isRotated && rotation === 90 ? 0 : spriteSize.y;
      context.translate(transX, transY);
      context.rotate(degToRad(rotation));
    }
    context.drawImage(
      this.image,
      pos.x,
      pos.y,
      size.x,
      size.y,
      0,
      0,
      size.x,
      size.y
    );
    return buffer;
  }

  _get(name) {
    return this.sprites.get(name);
  }

  _set(name, size, buffers) {
    const width = size.x / config.gridSize;
    const height = size.y / config.gridSize;
    this.sprites.set(name, {
      size: new Vect2(width, height),
      buffers: castArray(buffers)
    });
  }

  _draw(sprite, context, pos = { x: 0, y: 0}, index = 0) {
    context.drawImage(
      sprite.buffers[index],
      pos.x * config.gridSize,
      pos.y * config.gridSize
    );
  }

  get(name) {
    const sprite = this._get(name);
    return {
      render: (context, time, pos) => {
        this._draw(sprite, context, pos);
      }
    };
  }

  getSpriteSize(name) {
    const sprite = this._get(name);
    return sprite.size;
  }

  draw(name, context, pos, index = 0) {
    const sprite = this._get(name);
    this._draw(sprite, context, pos, index);
  }
}
