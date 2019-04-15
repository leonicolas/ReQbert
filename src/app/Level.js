import config from './config';
import { Vec2, Matrix } from './libs/math';
import { jumpWithKeys } from './libs/bind';
import { isLevelCleared } from './libs/level';

import Layer from './Layer';
import Block from './Block';
import Qbert from './entities/Qbert';

const entitiesLayerPos = new Vec2(0.5, -1.4);

const refBlockPos = new Vec2(3, 3);
const blocksPos = new Vec2(
  config.block.startPosition.x,
  config.block.startPosition.y
);

export default class Level {

  constructor(levelSpec, tilesMap, charactersMap, input) {
    // Initialize properties
    this.tilesMap = tilesMap;
    this.blocksData = new Matrix();
    this.entitiesLayer = new Layer(entitiesLayerPos, config.screen);
    this.levelClearedListeners = new Set();

    // Create entities
    this.qbert = new Qbert(charactersMap, new Vec2(15, 3));
    this.entitiesLayer.addSprite(this.qbert);

    // Initialize level
    this._initializeBuffer();
    this._initializeLevelBlocks(levelSpec);
    this._initializeLevelListeners();
    this._initializeQbertListeners();

    // Bind keys.
    jumpWithKeys(input, this.qbert);
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
    this.refBlockName = levelSpec.refBlock;
    this.tilesMap.draw(levelSpec.refBlock, this.context, refBlockPos);

    // Draw level blocks into the level buffer.
    let pos = blocksPos.clone();
    levelSpec.blocks.forEach(line => {
      line.forEach(blockName => {
        if(blockName) {
          this._createBlock(blockName, pos);
        }
        pos.moveX(config.block.distance.column);
      });
      pos.x = blocksPos.x;
      pos.moveY(config.block.distance.line);
    });
  }

  _initializeLevelListeners() {
    this.levelClearedListeners.add(() => {
      this.qbert.jump.disable();
      this.qbert.win();
    });
  }

  _initializeQbertListeners() {
    this.qbert.jump.onStartListeners.add(direction => {
      this.currentBlock = this.blocksData.get(this.qbert.pos.y, this.qbert.pos.x);
      this.currentBlock.rotate(direction);
    });
    this.qbert.jump.onEndListeners.add(() => {
      this._checkLevelBoundary(this.qbert);
    });
    this.qbert.death.onEndListeners.add(() => {
      setTimeout(() => this.qbert.spawn.start(new Vec2(15, 3)), 500);
    });
    this.qbert.spawn.onEndListeners.add(() => {
      this.qbert.jump.enable();
    });
  }

  _createBlock(blockName, pos) {
    let block = new Block(blockName, this.tilesMap, pos);
    block.addRotateEndHandler((block) => this._checkBlock(block));
    this.blocksData.set(pos.y, pos.x, block);
    this.tilesMap.draw(blockName, this.context, pos);
  }

  _checkBlock(block) {
    if(block.currentSpriteName === this.refBlockName) {
      block.markAsCleared();
      if(isLevelCleared(this.blocksData, block)) {
        this.levelClearedListeners.forEach(listener => listener());
      };
    }
  }

  _checkLevelBoundary(entity) {
    let block = this.blocksData.get(entity.pos.y, entity.pos.x);
    if(block) return;

    if(entity.jump) {
      entity.jump.disable();
    }
    entity.death.start();
  }
}
