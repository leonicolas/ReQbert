import { Vec2, Matrix } from './libs/math';
import { LEFT, RIGHT, UP, DOWN } from './behaviors/Jump';

import config from './config';

import Layer from './Layer';
import Block from './Block';
import Qbert from './entities/Qbert'

const entitiesLayerPos = new Vec2(0.5, -1.4);

const refBlockPos = new Vec2(3, 3);
const blocksPos = new Vec2(3, 3);
const blocksDistance = new Vec2(3, 2);

export default class Level {

  constructor(levelSpec, tilesMap, charactersMap) {
    // Initialize properties
    this.levelSpec = levelSpec;
    this.tilesMap = tilesMap;
    this.blocksData = new Matrix();
    this.entitiesLayer = new Layer(entitiesLayerPos, config.screen);

    // Create entities
    this.qbert = new Qbert(charactersMap, new Vec2(15, 3));
    this.entitiesLayer.addSprite(this.qbert);

    // Add jump event handler
    this.qbert.jump.addStartHandler((behaviour, direction) => {
      this.currentBlock = this.blocksData.get(this.qbert.pos.y, this.qbert.pos.x);
      this.currentBlock.rotate(direction);
    });

    // Initialize level
    this._initializeBuffer();
    this._initializeLevelBlocks(levelSpec);
  }

  update(deltaTime) {
    this.entitiesLayer.update(deltaTime);
  }

  render(context, deltaTime) {
    if(this.currentBlock) {
      this.currentBlock.render(this.context, deltaTime);
    }
    context.drawImage(this.buffer, 0, 0);
    this.entitiesLayer.render(context, deltaTime);
  }

  _initializeBuffer() {
    this.buffer = document.createElement('canvas');
    this.buffer.width = config.screen.width;
    this.buffer.height = config.screen.height;
    this.context = this.buffer.getContext('2d');
  }

  _initializeLevelBlocks(levelSpec) {
    // Draw reference block into the level buffer.
    this.tilesMap.draw(levelSpec.refBlock, this.context, refBlockPos);

    // Draw level blocks into the level buffer.
    let pos = blocksPos.clone();
    levelSpec.blocks.forEach(line => {
      line.forEach(blockName => {
        if(blockName) {
          let block = new Block(blockName, this.tilesMap, pos);
          block.addRotateEndHandler(() => console.log("Rotation ended!"));
          this.blocksData.set(pos.y, pos.x, block);
          this.tilesMap.draw(blockName, this.context, pos);
        }
        pos.moveX(blocksDistance.x);
      });
      pos.x = blocksPos.x;
      pos.moveY(blocksDistance.y);
    });
    console.log(this.blocksData);
  }
}
