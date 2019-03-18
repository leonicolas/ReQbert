import config from './config';
import { Vec2 } from './libs/math';
import Layer from './Layer';
import Qbert from './entities/Qbert'

const REF_BLOCK_POS = new Vec2(3, 3);
const BLOCKS_INI_POS = new Vec2(3, 3);

export default class Level {

  constructor(levelSpec, tilesMap, charactersMap) {
    // Initialize properties
    this.levelSpec = levelSpec;
    this.tilesMap = tilesMap;
    this.entitiesLayer = new Layer(new Vec2(0.5, 0.6), config.screen);

    // Create entities
    this.qbert = new Qbert(charactersMap, new Vec2(15, 1));
    this.entitiesLayer.addSprite(this.qbert);

    // Initialize level
    this._initializeBuffer();
    this._initializeLevelBlocks(levelSpec);
  }

  update(deltaTime) {
    this.entitiesLayer.update(deltaTime);
  }

  render(context, deltaTime) {
    context.drawImage(this.buffer, 0, 0);
    this.entitiesLayer.render(context, deltaTime);
  }

  _initializeBuffer() {
    this.buffer = document.createElement('canvas');
    this.buffer.width = config.screen.width;
    this.buffer.height = config.screen.height;
  }

  _initializeLevelBlocks(levelSpec) {
    const context = this.buffer.getContext('2d');

    // Draw reference block into the level buffer.
    this.tilesMap.draw(levelSpec.refBlock, context, REF_BLOCK_POS);

    // Draw level blocks into the level buffer.
    let pos = BLOCKS_INI_POS.clone();
    levelSpec.blocks.forEach(line => {
      line.forEach(blockName => {
        if(blockName)
          this.tilesMap.draw(blockName, context, pos);
        pos.moveX(3);
      });
      pos.x = BLOCKS_INI_POS.x;
      pos.moveY(2);
    });
  }
}
