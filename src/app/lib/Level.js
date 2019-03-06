import config from '../config.js';

export default class Level {

  constructor(spriteMap) {
    this.spriteMap = spriteMap;
    this.buffer = document.createElement('canvas');
    this.buffer.width = config.screen.width;
    this.buffer.height = config.screen.height;

    const context = this.buffer.getContext('2d');

    const blocks = [
      "block1-right",
      "block1-front",
      "block1-top",
      "block1-bottom-z",
      "block1-front-z",
      "block1-front-x",
      "block1-top-x",
      "block1-bottom-x"
    ];

    let pos = 3;
    blocks.forEach(blockName => {
      this.spriteMap.draw(blockName, context, { x: pos, y: 3 });
      pos += 3;
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
