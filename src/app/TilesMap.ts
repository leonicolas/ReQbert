import { Vector2 } from "./libs/math";

import Sprite from "./Sprite";
import { SpriteSpec, TilesMapSpec, ImageSpec } from "./specs/Sprite";
import { getGameConfig } from "./Global";

export default class TilesMap {
  private spriteImageSource: CanvasImageSource;
  private tilesImageMap = new Map<string, CanvasImageSource>();
  private spriteSpecMap = new Map<string, SpriteSpec>();

  constructor(tilesMapSpec: TilesMapSpec, spriteImageSource: CanvasImageSource) {
    this.spriteImageSource = spriteImageSource;

    tilesMapSpec.tiles.forEach((imageSpec) => this.addImageToBufferMap(imageSpec));
    tilesMapSpec.sprites.forEach((spriteSpec) => this.spriteSpecMap.set(spriteSpec.name, spriteSpec));
  }

  getTileImage(tileName: string): CanvasImageSource | undefined {
    return this.tilesImageMap.get(tileName);
  }

  getTilesImages(tilesNames: string[]): (CanvasImageSource | undefined)[] {
    return tilesNames.map((tileName) => this.getTileImage(tileName));
  }

  createSprite(spriteName: string, position: Vector2 = new Vector2(0, 0)): Sprite {
    const spriteSpec = this.spriteSpecMap.get(spriteName);
    if (!spriteSpec) {
      throw new Error(`Sprite ${spriteName} not defined`);
    }
    const images = this.getTilesImages(spriteSpec.frames).filter(image => image) as CanvasImageSource[];
    return new Sprite(images, spriteSpec, position);
  }

  drawTile(
    tileName: string,
    context: CanvasRenderingContext2D,
    position: Vector2 = new Vector2(0, 0),
    _: number = 0 //transformIndex
  ) {
    const config = getGameConfig();
    const tileImage = this.getTileImage(tileName);
    if (tileImage)
      context.drawImage(tileImage, position.x * config.grid.size, position.y * config.grid.size);
  }

  private addImageToBufferMap(imageSpec: ImageSpec) {
    const position = new Vector2(imageSpec.position[0], imageSpec.position[1]);
    const config = getGameConfig();
    const size = new Vector2(imageSpec.size[0] * config.grid.size, imageSpec.size[1] * config.grid.size);
    this.tilesImageMap.set(imageSpec.name, this.createImageBuffer(position, size));
  }

  private createImageBuffer(position: Vector2, size: Vector2): CanvasImageSource {
    const buffer = document.createElement("canvas");
    buffer.width = size.x;
    buffer.height = size.y;

    const context = buffer.getContext("2d");
    if (context)
      context.drawImage(this.spriteImageSource, position.x, position.y, size.x, size.y, 0, 0, size.x, size.y);
    return buffer;
  }
}
