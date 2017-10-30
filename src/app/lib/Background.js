import config from '../config.js';
import { castArray } from './utils';

export default class Background {
  constructor(bgSpec, sprites) {
    this.width = config.screen.width;
    this.height = config.screen.height;
    this.bgLayers = new Map();

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
      this.bgLayers.set(bg.name, buffer);
    });
  }

  drawToBuffer(context, sprites) {
    return fillSpec => {
      let nameIndex = 0;
      let names = castArray(fillSpec.spriteName);
      fillSpec.ranges.forEach(range => {
        const stepX = range.stepX || 1;
        const stepY = range.stepY || 1;
        range.x.forEach(xRange => {
          const xEdges = this.getRangeEdges(xRange);
          range.y.forEach(yRange => {
            const yEdges = this.getRangeEdges(yRange);
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

  getRangeEdges(range) {
    let isArray = Array.isArray(range);
    return {
      start: isArray ? range[0] : range,
      end: isArray ? range[1] : range
    };
  }

  draw(bgLayerName, context) {
    const bgLayer = this.bgLayers.get(bgLayerName);
    context.drawImage(bgLayer, 0, 0);
  }
}
