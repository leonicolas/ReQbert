import Background from './lib/Background';
import { loadImage, loadLevel, loadJson } from './lib/loaders';
import config from './config.js';

import SpriteMap from './lib/SpriteMap';

const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

const gridSize = config.gridSize;

Promise.all([loadImage('tiles.png'), loadJson('backgrounds.json')]).then(([tiles, bgSpec]) => {
  const sprites = new SpriteMap(tiles, gridSize);
  sprites.define('brick', 0, 16, gridSize, gridSize);
  sprites.defineRotated('blueTriangle', 0, 0, gridSize * 2, gridSize);
  sprites.defineRotated('greenTriangle', 32, 0, gridSize * 2, gridSize);
  sprites.defineRotated('redTriangle', 64, 0, gridSize * 2, gridSize);

  let bg = new Background(bgSpec.backgrounds, sprites);
  bg.draw('bg-game-1', context);
});
