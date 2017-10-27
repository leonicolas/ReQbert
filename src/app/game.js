import { loadImage, loadLevel } from './lib/loaders';
import config from './config.js';

import SpriteMap from './lib/SpriteMap';

const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

context.fillRect(0, 0, config.screen.width, config.screen.height);

loadImage('/assets/img/tiles.png').then(image => {
  const sprites = new SpriteMap(image);
  sprites.define('brick', 0, 24, 16, 16);

  loadLevel(1).then(console.log);

  for (let x = 0; x < config.screen.width; x += 16) {
    sprites.draw('brick', context, x, 0);
    sprites.draw('brick', context, x, config.screen.height - 16);
  }

  for (let y = 16; y < config.screen.height - 16; y += 16) {
    sprites.draw('brick', context, 0, y);
    sprites.draw('brick', context, config.screen.width - 16, y);
  }
});
