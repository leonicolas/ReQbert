import config from '../config';

// The blocks distance
const distance = Object.assign({}, config.block.distance);

// The directions steps
const directions = [
  { line: 0, column: 2 },
  { line: 2, column: 0 },
  { line: 1, column: 1 },
  { line: -1, column: 1 },
];

export function createDieIfOutOfBoundariesCallBack(blocksData) {
  return (entity) => {
    let block = blocksData.get(entity.pos.y, entity.pos.x);
    if(!block && entity.die)
      entity.die.start();
  }
}

export function isStageCleared(blocksData, refBlock) {
  let cleared = false;
  directions.forEach(direction => {
    if(cleared) return;

    // Initialize the blocks in the given direction to be checked
    direction = invertDirection(direction);
    let blocks = [
      getNextBlock(blocksData, refBlock, direction),
      refBlock
    ];
    // Verifies if the direction was cleared
    cleared = isDirectionCleared(blocksData, blocks, direction);
  });
  return cleared;
}

function isDirectionCleared(blocksData, blocks, direction) {
  let clearedCount = 0;
  while(blocks[0] || blocks[1]) {
    blocks = blocks.map(block => {
      if(block && block.cleared) {
        clearedCount++;
        block = getNextBlock(blocksData, block, direction);
      } else {
        block = undefined;
      }
      direction = invertDirection(direction);
      return block;
    });
  }
  return clearedCount >= 5;
}

function invertDirection(direction) {
  return {
    line: direction.line * -1,
    column: direction.column * -1
  };
}

function getNextBlock(blocksData, block, direction) {
  return blocksData.get(
    block.pos.y + distance.line   * direction.line,
    block.pos.x + distance.column * direction.column
  );
}
