import { Vec2 } from './libs/math';
import { degToRad } from './libs/math';
import { castArray } from './libs/utils';

import config from './config';
import Sprite from './Sprite';
import Animation from './Animation';

export default class SpriteMap {

  constructor(spritesSpec, spriteImageMap) {
    this.spriteImageMap = spriteImageMap;
    this.images = new Map();
    this.animationsData = new Map();
    spritesSpec.sprites.forEach(spriteSpec => this._createSpriteBuffer(spriteSpec));
    const animationsSpec = spritesSpec.animations || [];
    animationsSpec.forEach(animSpec => this._createAnimationData(animSpec));
  }

  getImage(imageName) {
    return this.images.get(imageName);
  }

  getAnimationData(animationName) {
    return this.animationsData.get(animationName);
  }

  newSprite(imageName, pos) {
    const image = this.getImage(imageName);
    return new Sprite(image, pos);
  }

  newAnimation(animationName, pos) {
    const animation = this.getAnimationData(animationName);
    return new Animation(animation, pos);
  }

  draw(imageName, context, pos = new Vec2(0, 0), transformIndex = 0) {
    context.drawImage(
      this.getImage(imageName)[transformIndex],
      pos.x * config.grid.size,
      pos.y * config.grid.size
    );
  }

  _createAnimationData(animSpec) {
    let framesImages = animSpec.frames.map(
      frameName => this.getImage(frameName)
    );
    this.animationsData.set(animSpec.name, {
      framesNames: animSpec.frames,
      frames: framesImages,
      frameTime: animSpec.frameTime
    });
  }

  _createSpriteBuffer(spriteSpec) {
    const pos = new Vec2(spriteSpec.position[0], spriteSpec.position[1]);
    const size = new Vec2(
      spriteSpec.size[0] * config.grid.size,
      spriteSpec.size[1] * config.grid.size
    );
    const buffers = castArray(
      this._createTransformedBuffer(pos, size, spriteSpec.transformation)
    );
    this.images.set(spriteSpec.name, buffers);
  }

  _createTransformedBuffer(pos, size, transformation) {
    switch (transformation) {
      case 'rotated':
        return this._createRotatedBuffer(pos, size);

      case 'flipped':
        return this._createFlipped(pos, size);

      default:
        return this._createBuffer(pos, size);
    }
  }

  _createRotatedBuffer(pos, size) {
    return [0, 90, 180, 270].map(rotation =>
      this._createBuffer(pos, size, { rotation })
    );
  }

  _createFlipped(pos, size) {
    return [false, true].map(flipped =>
      this._createBuffer(pos, size, { flipped })
    );
  }

  _createBuffer(pos, size, { rotation, flipped } = {}) {
    const buffer = document.createElement('canvas');
    const isRotated = rotation === 90 || rotation === 270;
    const spriteSize = size.clone();
    if (isRotated) spriteSize.swap();
    buffer.width = spriteSize.x;
    buffer.height = spriteSize.y;

    const context = buffer.getContext('2d');
    if (flipped) {
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
      this.spriteImageMap,
      pos.x, pos.y,
      size.x, size.y,
      0, 0,
      size.x, size.y
    );
    return buffer;
  }
}
