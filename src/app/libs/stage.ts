import Die from "../behaviors/Die";
import { JumpEvent } from "../behaviors/Jump";
import Block from "../Block";
import config from "../config";
import { Matrix } from "./math";

// The blocks distance
const distance = Object.assign({}, config.block.distance);

export interface BlockDirection {
  line: number;
  column: number;
}

// The directions steps
const directions: BlockDirection[] = [
  { line: 0, column: 2 },
  { line: 2, column: 0 },
  { line: 1, column: 1 },
  { line: -1, column: 1 },
];

export function createDieIfOutOfBoundariesCallBack(_: Matrix<Block>): (jumpEvent: JumpEvent) => void {
  return (jumpEvent: JumpEvent) => {
    const entity = jumpEvent.entity;
    //const block = blocksData.get(entity.position.y, entity.position.x);
    entity.behavior<Die>(Die)?.start();
  };
}

export function isStageCleared(blocksData: Matrix<Block>, refBlock: Block): boolean {
  let cleared = false;
  directions.forEach((direction) => {
    if (cleared) return;

    // Initialize the blocks in the given direction to be checked
    direction = invertDirection(direction);
    const nextBlock = getNextBlock(blocksData, refBlock, direction);
    if (nextBlock) {
      let blocks = [nextBlock, refBlock];
      // Verifies if the direction was cleared
      cleared = isDirectionCleared(blocksData, blocks, direction);  
    }
  });
  return cleared;
}

function isDirectionCleared(blocksData: Matrix<Block>, blocks: Block[], direction: BlockDirection): boolean {
  let clearedCount = 0;
  let currentBlocks: (Block | undefined)[] | undefined = blocks;
  while (currentBlocks && (currentBlocks[0] || currentBlocks[1])) {
    currentBlocks = currentBlocks.map((block) => {
      let currentBlock: Block | undefined = block;
      if (block?.cleared) {
        clearedCount++;
        currentBlock = getNextBlock(blocksData, block, direction);
      } else {
        currentBlock = undefined;
      }
      direction = invertDirection(direction);
      return currentBlock;
    });
  }
  return clearedCount >= 5;
}

function invertDirection(direction: BlockDirection): BlockDirection {
  return {
    line: direction.line * -1,
    column: direction.column * -1,
  };
}

function getNextBlock(blocksData: Matrix<Block>, block: Block, direction: BlockDirection) {
  return blocksData.get(
    block.position.y + distance.line * direction.line, block.position.x + distance.column * direction.column
  );
}
