import config from './config';

import { LEFT, RIGHT, UP, DOWN } from './behaviors/Jump';
import { Vec2 } from './libs/math';

const blockSize = 3 * config.gridSize;

export default class Block {
  constructor(blockName, tilesMap, pos = new Vec2(0, 0)) {
    this.blockName = blockName;
    this.tilesMap = tilesMap;
    this.pos = pos.clone();
    this.onRotateEndHandlers = new Set();
    this._initializeAnimations();
  }

  addRotateEndHandler(handler) {
    this.onRotateEndHandlers.add(handler);
  }

  triggerOnRotateEndHandler() {
    this.onRotateEndHandlers.forEach(handler => handler(this));
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
    let blocksSpec = [
      [`bl1-f-${UP}-${RIGHT}`  , 'bl1-f-u'],
      [`bl1-f-${DOWN}-${LEFT}` , 'bl1-f-d'],
      [`bl1-f-${UP}-${LEFT}`   , 'bl1-f-l'],
      [`bl1-f-${DOWN}-${RIGHT}`, 'bl1-f-r'],

      [`bl1-r-${UP}-${RIGHT}`  , 'bl1-r-u'],
      [`bl1-r-${DOWN}-${LEFT}` , 'bl1-r-d'],
      [`bl1-r-${UP}-${LEFT}`   , 'bl1-r-l'],
      [`bl1-r-${DOWN}-${RIGHT}`, 'bl1-r-r'],

      [`bl1-t-${UP}-${RIGHT}`  , 'bl1-t-u'],
      [`bl1-t-${DOWN}-${LEFT}` , 'bl1-t-d'],
      [`bl1-t-${UP}-${LEFT}`   , 'bl1-t-l'],
      [`bl1-t-${DOWN}-${RIGHT}`, 'bl1-t-r'],
    ];

    this.blockAnimMap = new Map();
    blocksSpec.forEach(blockSpec => {
      let blockAnim = this.tilesMap.newAnimation(blockSpec[1]);
      blockAnim.addAnimationEndHandler(() => {
        this.triggerOnRotateEndHandler();
      });
      this.blockAnimMap.set(blockSpec[0], blockAnim);
    });
  }
}
