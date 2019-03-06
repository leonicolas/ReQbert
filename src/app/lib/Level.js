import config from '../config.js';
import Vec2 from './Vec2';

export default class Level {

  constructor(spriteMap) {
    this.spriteMap = spriteMap;
    this.buffer = document.createElement('canvas');
    this.buffer.width = config.screen.width;
    this.buffer.height = config.screen.height;

    const context = this.buffer.getContext('2d');

    const level1 = {
      refBlock: "bl1-r",
      blocks: [
        [null   , null   , null   , null   , "bl1-f", null   , null   , null   , null   ],
        [null   , null   , null   , "bl1-f", null   , "bl1-t", null   , null   , null   ],
        [null   , null   , "bl1-f", null   , "bl1-f", null   , "bl1-t", null   , null   ],
        [null   , "bl1-t", null   , "bl1-t", null   , "bl1-t", null   , "bl1-f", null   ],
        ["bl1-f", null   , "bl1-t", null   , "bl1-f", null   , "bl1-t", null   , "bl1-f"],
        [null   , "bl1-f", null   , "bl1-f", null   , "bl1-t", null   , "bl1-t", null   ],
        [null   , null   , "bl1-t", null   , "bl1-t", null   , "bl1-f", null   , null   ],
        [null   , null   , null   , "bl1-f", null   , "bl1-f", null   , null   , null   ],
        [null   , null   , null   , null   , "bl1-t", null   , null   , null   , null   ],
      ]
    };

    // Draw reference block.
    this.spriteMap.draw(level1.refBlock, context, new Vec2(3, 3));

    let posX = 3, posY = 3;
    level1.blocks.forEach(line => {
      line.forEach(blockName => {
        if(blockName)
          this.spriteMap.draw(blockName, context, new Vec2(posX, posY));
        posX += 3;
      });
      posX = 3;
      posY += 2;
    });
  }

  update(time) {
  }

  render(context, time) {
    context.drawImage(
      this.buffer, 0, 0
    );
  }
}
