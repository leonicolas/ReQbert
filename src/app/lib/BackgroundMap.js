import config from '../config.js';
import { castArray } from './utils';
import Vec2 from './Vec2';
import Range from './Range';

export default class BackgroundMap {
  constructor(bgSpec, sprites) {
    this.size = new Vec2(config.screen.width, config.screen.height);
    this.backgrounds = new Map();

    bgSpec.backgrounds.forEach(bg => {
      const buffer = document.createElement('canvas');

      // Buffer size
      buffer.width = this.size.x;
      buffer.height = this.size.y;

      // Fill buffer with defined color
      const context = buffer.getContext('2d');
      if (bg.color) {
        context.fillStyle = bg.color;
        context.fillRect(0, 0, this.size.x, this.size.y);
      } else {
        context.fillStyle = 'rgba(0, 0, 0, 1)';
      }

      // Draw sprites into buffer
      bg.fill.forEach(this._drawToBuffer(context, sprites));

      // Index background buffer
      this.backgrounds.set(bg.name, buffer);
    });
  }

  _drawToBuffer(context, sprites) {
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
          sprites.draw(spriteName, context, new Vec2(x, y), index || 0);
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

  get(bgName) {
    const bg = this.backgrounds.get(bgName);
    return context => {
      context.drawImage(bg, 0, 0);
    };
  }
}
