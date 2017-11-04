import { loadBackgrounds } from './lib/loaders';
import Timer from './lib/Timer';
import Compositor from './lib/Compositor';

const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

Promise.all([loadBackgrounds('backgrounds.json')]).then(([bgMap]) => {
  const compositor = new Compositor();
  const timer = new Timer();

  compositor.addLayer(bgMap.get('bg-game-1'));

  timer.update = time => {
    compositor.draw(context);
  };
  timer.start();
});
