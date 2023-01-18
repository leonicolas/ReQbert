import config from './config';

import { LEFT, RIGHT, UP, DOWN } from './behaviors/Jump';
import { Vector2 } from './libs/math';
import TilesMap from './TilesMap';
import Sprite from './Sprite';

const blockSize = 3 * config.grid.size;

export default class Block {

  private currentSpriteName: string;
  private tilesMap: TilesMap;
  private position: Vector2;
  private onRotateEndHandlers = new Set<(block: Block) => void>();
  private cleared: boolean = false;
  private currentBlockAnim: Animation;
  private blockAnimMap = new Map<string, Animation>();

  constructor(initialSpriteName: string, tilesMap: TilesMap, position = new Vector2(0, 0)) {
    this.currentSpriteName = initialSpriteName;
    this.tilesMap = tilesMap;
    this.position = position.clone();
    this.initializeAnimations();
  }

  addRotateEndHandler(handler: (block: Block) => void) {
    this.onRotateEndHandlers.add(handler);
  }

  triggerOnRotateEndHandler() {
    this.onRotateEndHandlers.forEach(handler => handler(this));
  }

  markAsCleared() {
    this.cleared = true;
    this.currentBlockAnim = this.tilesMap.newSprite("bl-cleared", this.position);
  }

  rotate(direction: Vector2) {
    if(this.cleared) return;
    this.currentBlockAnim = this.blockAnimMap.get(`${this.currentSpriteName}-${direction.y}-${direction.x}`);
    this.currentBlockAnim.position.set(this.position.x, this.position.y);
    this.currentSpriteName = this.currentBlockAnim.getLastFrameName();
    this.currentBlockAnim.play();
  }

  render(context, deltaTime) {
    context.clearRect(
      this.position.x * config.grid.size,
      this.position.y * config.grid.size,
      blockSize,
      blockSize
    );

    if(this.currentBlockAnim) {
      this.currentBlockAnim.render(context, deltaTime);
    }
  }

  private initializeAnimations() {
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

    blocksSpec.forEach(blockSpec => {
      let blockAnim = this.tilesMap.newAnimation(blockSpec[1]);
      blockAnim.onAnimationEndListeners.add(() => {
        this.triggerOnRotateEndHandler();
      });
      this.blockAnimMap.set(blockSpec[0], blockAnim);
    });
  }
}
