import config from "./config";

import { LEFT, RIGHT, UP, DOWN } from "./behaviors/Jump";
import { Vector2 } from "./libs/math";
import TilesMap from "./TilesMap";
import Sprite from "./Sprite";
import { Renderable, Updatable } from "./Global";

const blockSize = 3 * config.grid.size;

export default class Block implements Updatable, Renderable {
  private tilesMap: TilesMap;
  private currentBlock: Sprite | undefined;
  private blockAnimMap = new Map<string, Sprite>();

  public cleared: boolean = false;
  public currentFrameName?: string;

  public position: Vector2;
  readonly onRotateEndHandlers = new Set<(block: Block) => void>();

  constructor(initialFrameName: string, tilesMap: TilesMap, position = new Vector2(0, 0)) {
    this.currentFrameName = initialFrameName;
    this.tilesMap = tilesMap;
    this.position = position.clone();
    this.initializeAnimations();
  }

  addRotateEndHandler(handler: (block: Block) => void) {
    this.onRotateEndHandlers.add(handler);
  }

  triggerOnRotateEndHandler() {
    this.onRotateEndHandlers.forEach((handler) => handler(this));
  }

  markAsCleared() {
    this.cleared = true;
    this.currentBlock = this.tilesMap.createSprite("bl-cleared", this.position);
  }

  rotate(direction: Vector2) {
    if (this.cleared) return;
    this.currentBlock = this.blockAnimMap.get(`${this.currentFrameName}-${direction.y}-${direction.x}`);
    if (!this.currentBlock) {
      return;
    }
    this.currentBlock.position.set(this.position.x, this.position.y);
    this.currentFrameName = this.currentBlock.getLastFrameName();
    this.currentBlock.play();
  }

  update(deltaTime: number) {
    if (this.currentBlock) {
      this.currentBlock.update(deltaTime);
    }
  }

  render(context: CanvasRenderingContext2D) {
    context.clearRect(this.position.x * config.grid.size, this.position.y * config.grid.size, blockSize, blockSize);

    if (this.currentBlock) {
      this.currentBlock.render(context);
    }
  }

  private initializeAnimations() {
    // TODO: Move the animations to a json file
    let blocksSpec = [
      [`bl1-f-${UP}-${RIGHT}`, "bl1-f-u"],
      [`bl1-f-${DOWN}-${LEFT}`, "bl1-f-d"],
      [`bl1-f-${UP}-${LEFT}`, "bl1-f-l"],
      [`bl1-f-${DOWN}-${RIGHT}`, "bl1-f-r"],

      [`bl1-r-${UP}-${RIGHT}`, "bl1-r-u"],
      [`bl1-r-${DOWN}-${LEFT}`, "bl1-r-d"],
      [`bl1-r-${UP}-${LEFT}`, "bl1-r-l"],
      [`bl1-r-${DOWN}-${RIGHT}`, "bl1-r-r"],

      [`bl1-t-${UP}-${RIGHT}`, "bl1-t-u"],
      [`bl1-t-${DOWN}-${LEFT}`, "bl1-t-d"],
      [`bl1-t-${UP}-${LEFT}`, "bl1-t-l"],
      [`bl1-t-${DOWN}-${RIGHT}`, "bl1-t-r"],
    ];

    blocksSpec.forEach((blockSpec) => {
      let blockAnim = this.tilesMap.createSprite(blockSpec[1]);
      blockAnim.onAnimationEndListeners.add(() => {
        this.triggerOnRotateEndHandler();
      });
      this.blockAnimMap.set(blockSpec[0], blockAnim);
    });
  }
}
