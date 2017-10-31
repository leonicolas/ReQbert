import config from '../config.js';
import { castArray } from './utils';

export default class BackgroundMap {
  constructor(bgSpec, sprites) {
    this.width = config.screen.width;
    this.height = config.screen.height;
    this.backgrounds = new Map();

    bgSpec.forEach(bg => {
      const buffer = document.createElement('canvas');

      // Buffer size
      buffer.width = this.width;
      buffer.height = this.height;

      // Fill buffer with defined color
      const context = buffer.getContext('2d');
      if (bg.color) {
        context.fillStyle = bg.color;
        context.fillRect(0, 0, this.width, this.height);
      } else {
        context.fillStyle = 'rgba(0, 0, 0, 1)';
      }

      // Fill buffer with tiles
      bg.fill.forEach(this.drawToBuffer(context, sprites));

      // Index background buffer
      this.backgrounds.set(bg.name, buffer);
    });
  }

  drawToBuffer(context, sprites) {
    function getRangeEdges(range) {
      let isArray = Array.isArray(range);
      return {
        start: isArray ? range[0] : range,
        end: isArray ? range[1] : range
      };
    }

    return fillSpec => {
      let nameIndex = 0;
      let names = castArray(fillSpec.spriteName);
      // Process ranges
      fillSpec.ranges.forEach(range => {
        const stepX = range.stepX || 1;
        const stepY = range.stepY || 1;
        // Process X range
        range.x.forEach(xRange => {
          const xEdges = getRangeEdges(xRange);
          // Process Y range
          range.y.forEach(yRange => {
            const yEdges = getRangeEdges(yRange);
            // Draw tile in X,Y coordinate
            for (let x = xEdges.start; x <= xEdges.end; x += stepX) {
              for (let y = yEdges.start; y <= yEdges.end; y += stepY) {
                let spriteName = names[nameIndex++ % names.length];
                sprites.draw(spriteName, context, x, y, fillSpec.index || 0);
              }
            }
          });
        });
      });
    };
  }

  draw(bgName, context) {
    const bg = this.backgrounds.get(bgName);
    context.drawImage(bg, 0, 0);
  }
}
