import { loadBackgrounds } from './lib/loaders';
import Timer from './lib/Timer';

const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

Promise.all([loadBackgrounds('backgrounds.json')]).then(([bgMap]) => {
  const timer = new Timer();
  timer.update = time => {
    bgMap.draw('bg-game-1', context);
  };
  timer.start();
});
