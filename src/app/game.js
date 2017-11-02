import { loadBackgrounds } from './lib/loaders';
import config from './config.js';

const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

Promise.all([loadBackgrounds('backgrounds.json')]).then(([bgMap]) => {
  bgMap.draw('bg-game-1', context);
});
