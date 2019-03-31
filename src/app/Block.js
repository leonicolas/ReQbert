import config from './config';

import { LEFT, RIGHT, UP, DOWN } from './behaviors/Jump';
import { Vec2 } from './libs/math';

const blockSize = 3 * config.gridSize;

export default class Block {
  constructor(blockName, tilesMap, pos = new Vec2(0, 0)) {
    this.blockName = blockName;
    this.tilesMap = tilesMap;
    this.pos = pos.clone();
    this._initializeAnimations();
  }

  rotate(direction) {
    this.blockAnim = this.blockAnimMap.get(`${this.blockName}-${direction.y}-${direction.x}`);
    this.blockAnim.pos.set(this.pos.x, this.pos.y);
    this.blockName = this.blockAnim.getLastFrameName();
    this.blockAnim.start();
  }

  render(context, deltaTime) {
    context.clearRect(
      this.pos.x * config.gridSize,
      this.pos.y * config.gridSize,
      blockSize,
      blockSize
    );

    if(this.blockAnim) {
      this.blockAnim.render(context, deltaTime);
    }
  }

  _initializeAnimations() {
    this.blockAnimMap = new Map();
    this.blockAnimMap.set(`bl1-f-${UP}-${RIGHT}`, this.tilesMap.newAnimation('bl1-f-u'));
    this.blockAnimMap.set(`bl1-f-${DOWN}-${LEFT}`, this.tilesMap.newAnimation('bl1-f-d'));
    this.blockAnimMap.set(`bl1-f-${UP}-${LEFT}`, this.tilesMap.newAnimation('bl1-f-l'));
    this.blockAnimMap.set(`bl1-f-${DOWN}-${RIGHT}`, this.tilesMap.newAnimation('bl1-f-r'));

    this.blockAnimMap.set(`bl1-r-${UP}-${RIGHT}`, this.tilesMap.newAnimation('bl1-r-u'));
    this.blockAnimMap.set(`bl1-r-${DOWN}-${LEFT}`, this.tilesMap.newAnimation('bl1-r-d'));
    this.blockAnimMap.set(`bl1-r-${UP}-${LEFT}`, this.tilesMap.newAnimation('bl1-r-l'));
    this.blockAnimMap.set(`bl1-r-${DOWN}-${RIGHT}`, this.tilesMap.newAnimation('bl1-r-r'));

    this.blockAnimMap.set(`bl1-t-${UP}-${RIGHT}`, this.tilesMap.newAnimation('bl1-t-u'));
    this.blockAnimMap.set(`bl1-t-${DOWN}-${LEFT}`, this.tilesMap.newAnimation('bl1-t-d'));
    this.blockAnimMap.set(`bl1-t-${UP}-${LEFT}`, this.tilesMap.newAnimation('bl1-t-l'));
    this.blockAnimMap.set(`bl1-t-${DOWN}-${RIGHT}`, this.tilesMap.newAnimation('bl1-t-r'));
  }
}
