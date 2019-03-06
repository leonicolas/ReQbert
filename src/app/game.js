import { loadBackgrounds, loadSprites } from './lib/loaders';
import Timer from './lib/Timer';
import Compositor from './lib/Compositor';
import Level from './lib/Level';

async function main(canvas) {
  const context = canvas.getContext('2d');

  const spriteMap = await loadSprites('tiles.json');
  const bgMap = await loadBackgrounds('backgrounds.json');
  const level1 = new Level(spriteMap);

  const compositor = new Compositor();
  //compositor.addLayer(bgMap.getAnimation('level-cleared'));
  compositor.addLayer(bgMap.get('bg-game-3'));
  compositor.addLayer(level1);

  const timer = new Timer();
  timer.update = time => {
    compositor.update(time);
    compositor.render(context, time);
  };
  timer.start();
}

const canvas = document.getElementById('game');
main(canvas);
