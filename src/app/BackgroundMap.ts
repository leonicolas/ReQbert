import { Size2, Vector2 } from "./libs/math";

import TilesMap from "./TilesMap";
import { BackgroundMapSpec, BackgroundsSpec } from "./specs/Background";
import { SpriteSpec } from "./specs/Sprite";
import Sprite from "./Sprite";
import { ConfigSpec } from "./specs/Config";

export default class BackgroundMap {
  private size: Size2;
  private backgrounds: Map<string, Sprite>;

  constructor(backgroundsSpec: BackgroundsSpec, tilesMap: TilesMap, config: ConfigSpec) {
    this.size = new Size2(config.screen.width, config.screen.height);
    this.backgrounds = this.createBackgrounds(backgroundsSpec, tilesMap);
  }

  get(bgName: string): Sprite | undefined {
    return this.backgrounds.get(bgName)?.clone();
  }

  private createBackgrounds(backgroundsSpec: BackgroundsSpec, tilesMap: TilesMap): Map<string, Sprite> {
    const backgroundImages = new Map<string, CanvasImageSource>();
    backgroundsSpec.backgrounds.forEach((bgMapSpec) => {
      backgroundImages.set(bgMapSpec.name, this.createBackgroundImage(bgMapSpec, tilesMap));
    });

    const backgrounds = new Map<string, Sprite>();
    backgroundsSpec.animations.forEach((spriteSpec) => {
      backgrounds.set(spriteSpec.name, this.createBackground(backgroundImages, spriteSpec));
    });
    return backgrounds;
  }

  private createBackground(backgroundImages: Map<string, CanvasImageSource>, spriteSpec: SpriteSpec): Sprite {
    const frames = spriteSpec.frames.map((bgName) => {
      const bgImage = backgroundImages.get(bgName);
      if (!bgImage) {
        throw new Error(`Backgroung image ${bgName} not defined`);
      }
      return bgImage;
    });
    return new Sprite(frames, spriteSpec);
  }

  private createBackgroundImage(bgMapSpec: BackgroundMapSpec, tilesMap: TilesMap): CanvasImageSource {
    // Buffer initialization
    const buffer = document.createElement("canvas");
    buffer.width = this.size.width;
    buffer.height = this.size.height;

    // Fill buffer with defined color
    const context = buffer.getContext("2d");
    if (context) this.fillBuffer(context, bgMapSpec.color);

    // Draw tilesMap into the buffer
    let line = 0;
    bgMapSpec.map.forEach((mapLine) => {
      let column = 0;
      mapLine.split("").forEach((tileIndex) => {
        const tileName = bgMapSpec.tiles[this.calculateTileIndexValue(tileIndex)];
        if (tileName && context) {
          tilesMap.drawTile(tileName, context, new Vector2(column, line));
        }
        column++;
      });
      line++;
    });

    return buffer;
  }

  private calculateTileIndexValue(tileIndex: string): number {
    if (tileIndex.match(/[0-9]/)) return parseInt(tileIndex, 10);
    if (tileIndex.match(/[A-Z]/)) return tileIndex.charCodeAt(0) - 55;
    if (tileIndex.match(/[a-z]/)) return tileIndex.charCodeAt(0) - 87;
    return -1;
  }

  private fillBuffer(context: CanvasRenderingContext2D, color: string) {
    if (color) {
      context.fillStyle = color;
      context.fillRect(0, 0, this.size.width, this.size.height);
    } else {
      context.fillStyle = "rgba(0, 0, 0, 1)";
    }
  }
}
