import { castArray } from './libs/utils';
import { Size2, Vector2 } from './libs/math';

import TilesMap from './TilesMap';
import { BackgroundSpec, BackgroundsSpec } from './specs/Background';
import { ConfigSpec } from './specs/Config';
import { SpriteSpec } from './specs/Sprite';
import Sprite from './Sprite';
import { getGameConfig } from './Global';

export default class BackgroundMap {

  size: Size2;
  backgrounds = new Map<string, Sprite>();

  constructor(backgroundsSpec: BackgroundsSpec, tilesMap: TilesMap) {
    const config = getGameConfig();
    this.size = new Size2(config.screen.width, config.screen.height);

    const backgroundImages = backgroundsSpec.backgroundImages.map((backgroundImageSpec) =>
      this.createBackground(backgroundImageSpec);
    );
    backgroundsSpec.backgrounds.forEach(
      (backgroundSpec) => this.createBackground(backgroundSpec, backgroundImages));
  }

  get(bgName: string): Sprite {
    return new Sprite(this.backgroundImages.get(bgName));
  }

  private createBackground(animSpec: SpriteSpec) {
    const frames = animSpec.frames.map(bgName => this.backgroundImages.get(bgName));
    this.animationsData.set(animSpec.name, {
      frames,
      frameTime: animSpec.frameTime
    });
  }

  private createBackground(bgSpec: BackgroundSpec, tilesMap: TilesMap): Backgro {
    // Buffer initialize
    const buffer = document.createElement('canvas');
    buffer.width = this.size.width;
    buffer.height = this.size.height;

    // Fill buffer with defined color
    const context = buffer.getContext('2d');
    this.fillBuffer(context, bgSpec.color);

    // Draw tilesMap into the buffer
    bgSpec.fill.forEach(this.drawToBuffer(context, tilesMap));

    // Save backgrounds
    this.backgroundImages.set(bgSpec.name, buffer);
  }

  private fillBuffer(context: CanvasRenderingContext2D, color: string) {
    if (color) {
      context.fillStyle = color;
      context.fillRect(0, 0, this.size.width, this.size.height);
    } else {
      context.fillStyle = 'rgba(0, 0, 0, 1)';
    }
  }

  private drawToBuffer(context: CanvasRenderingContext2D, tilesMap: TilesMap) {
    function normalizeRange(fn: (range: Range) => void) {
      return (range: Range) => {
        range = Array.isArray(range) ? range : [range, range];
        fn(new Range(range[0], range[1]));
      };
    }

    function drawTile(
      rangeX:number[],
      rangeY: number[],
      { step, names, nameIndex, index }: { step: Vector2, names: string[], nameIndex: number, index: number }
    ) {
      rangeX.forEach(x => {
        rangeY.forEach(y => {
          let spriteName = names[nameIndex++ % names.length];
          tilesMap.draw(spriteName, context, new Vector2(x, y), index || 0);
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
        fillCxt.step = new Vector2(range.stepX || 1, range.stepY || 1);
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
