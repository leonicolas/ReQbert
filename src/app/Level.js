import config from './config';
import { Vec2, Matrix } from './libs/math';
import { jumpWithKeys } from './libs/bind';
import { isLevelCleared } from './libs/level';

import Layer from './Layer';
import Block from './Block';
import Qbert from './entities/Qbert';
import Pill from './entities/Pill';

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
    this.entities = new Set();
    this.entitiesLayer = new Layer(entitiesLayerPos, config.screen);
    this.cleared = false;

    // Create entities
    const startPos = new Vec2(levelSpec.startPos);
    this.qbert = new Qbert(charactersMap, startPos);
    this.entitiesLayer.addSprite(this.qbert);
    this.qbert.jump.onEndListeners.add(createDieIfOutOfBoundariesCallBack(this.blocksData));

    this.entitiesTest(charactersMap);

    // Initialize level
    this._initializeBuffer();
    this._initializeLevelBlocks(levelSpec);
    this._initializeQbertListeners();

    // Bind keys
    jumpWithKeys(input, this.qbert);

    // Events listeners
    this.onLevelClearedListeners = new Set();
  }

  // It will be removed. Only for tests.
  entitiesTest(charactersMap) {
    const pill = new Pill(charactersMap,'green');
    this.entitiesLayer.addSprite(pill);
    setTimeout(() => pill.spawn.start(new Vec2(12, 5)), 3000);
    pill.jump.onEndListeners.add(createDieIfOutOfBoundariesCallBack(this.blocksData));

    const pill2 = new Pill(charactersMap,'beige');
    this.entitiesLayer.addSprite(pill2);
    setTimeout(() => pill2.spawn.start(new Vec2(18, 5)), 6000);
    pill2.jump.onEndListeners.add(createDieIfOutOfBoundariesCallBack(this.blocksData));

    const pill3 = new Pill(charactersMap,'red');
    this.entitiesLayer.addSprite(pill3);
    setTimeout(() => pill3.spawn.start(new Vec2(12, 5)), 10000);
    pill3.jump.onEndListeners.add(createDieIfOutOfBoundariesCallBack(this.blocksData));

    const pill4 = new Pill(charactersMap,'blue');
    this.entitiesLayer.addSprite(pill4);
    setTimeout(() => pill4.spawn.start(new Vec2(18, 5)), 15000);
    pill4.jump.onEndListeners.add(createDieIfOutOfBoundariesCallBack(this.blocksData));

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

  triggerOnLevelCleared() {
    this.onLevelClearedListeners.forEach(listener => listener());
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

  _initializeQbertListeners() {
    // Jump listeners
    this.qbert.jump.onStartListeners.add(direction => {
      this.currentBlock = this.blocksData.get(this.qbert.pos.y, this.qbert.pos.x);
      this.currentBlock.rotate(direction);
    });
    this.qbert.jump.onEndListeners.add(() => {
      if(this.cleared) {
        this.qbert.win.start(3);
        this.triggerOnLevelCleared();
      }
    });

    // Die process listener
    this.qbert.die.onEndListeners.add(() => {
      setTimeout(() => this.qbert.spawn.start(new Vec2(15, 3)), 500);
    });

    // Spawn process
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
        this.cleared = true;
      };
    }
  }
}

function createDieIfOutOfBoundariesCallBack(blocksData) {
  return (entity) => {
    let block = blocksData.get(entity.pos.y, entity.pos.x);
    if(!block && entity.die)
      entity.die.start();
  }
}
