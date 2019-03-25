import config from './config.js';

import { castArray } from './libs/utils';
import { Vec2 } from './libs/math';

import Animation from './Animation';
import Background from './Background';
import Range from './Range';

export default class BackgroundMap {

  constructor(backgroundsSpec, tilesMap) {
    this.size = new Vec2(config.screen.width, config.screen.height);
    this.backgroundImages = new Map();
    this.backgroundAnimations = new Map();
    backgroundsSpec.backgrounds.forEach(bgSpec => this._createBackground(bgSpec, tilesMap));
    backgroundsSpec.animations.forEach(animSpec => this._createAnimation(animSpec));
  }

  get(bgName) {
    return new Background(this.backgroundImages.get(bgName));
  }

  getAnimation(animName) {
    const animationData = this.backgroundAnimations.get(animName);
    return new Animation(animationData);
  }

  _createAnimation(animSpec) {
    const frames = animSpec.frames.map(bgName => this.backgroundImages.get(bgName));
    this.backgroundAnimations.set(animSpec.name, {
      frames,
      frameTime: animSpec.frameTime
    });
  }

  _createBackground(bgSpec, tilesMap) {
    // Buffer initialize
    const buffer = document.createElement('canvas');
    buffer.width = this.size.x;
    buffer.height = this.size.y;

    // Fill buffer with defined color
    const context = buffer.getContext('2d');
    this._fillBuffer(context, bgSpec.color);

    // Draw tilesMap into the buffer
    bgSpec.fill.forEach(this._drawToBuffer(context, tilesMap));

    // Save backgrounds
    this.backgroundImages.set(bgSpec.name, buffer);
  }

  _fillBuffer(context, color) {
    if (color) {
      context.fillStyle = color;
      context.fillRect(0, 0, this.size.x, this.size.y);
    } else {
      context.fillStyle = 'rgba(0, 0, 0, 1)';
    }
  }

  _drawToBuffer(context, tilesMap) {
    function normalizeRange(fn) {
      return range => {
        range = Array.isArray(range) ? range : [range, range];
        fn(new Range(range[0], range[1]));
      };
    }

    function drawTile(rangeX, rangeY, { step, names, nameIndex, index }) {
      rangeX.forEach(x => {
        rangeY.forEach(y => {
          let spriteName = names[nameIndex++ % names.length];
          tilesMap.draw(spriteName, context, new Vec2(x, y), index || 0);
        }, step.y);
      }, step.x);
    }

    return fillSpec => {
      const fillCxt = {
        names: castArray(fillSpec.spriteName),
        nameIndex: 0,
        index: fillSpec.index
      };

      // Process ranges
      fillSpec.ranges.forEach(range => {
        fillCxt.step = new Vec2(range.stepX || 1, range.stepY || 1);
        // Process X range
        range.x.forEach(
          normalizeRange(rangeX => {
            // Process Y range
            range.y.forEach(
              normalizeRange(rangeY => {
                drawTile(rangeX, rangeY, fillCxt);
              })
            );
          })
        );
      });
    };
  }
}
