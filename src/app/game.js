import { loadBackgrounds } from './lib/loaders';
import Timer from './lib/Timer';
import Compositor from './lib/Compositor';

async function main(canvas) {
  const context = canvas.getContext('2d');

  const bgMap = await loadBackgrounds('backgrounds.json');

  const compositor = new Compositor();
  compositor.addLayer(bgMap.get('bg-game-1'));

  const timer = new Timer();
  timer.update = time => {
    compositor.draw(context);
  };
  timer.start();
}

const canvas = document.getElementById('game');
main(canvas);
