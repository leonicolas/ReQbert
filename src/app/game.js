import { loadBackgrounds, loadSprites, loadStage } from './libs/loaders';
import { Vec2 } from './libs/math';

import Timer from './Timer';
import Compositor from './Compositor';
import config from './config';
import Keyboard from './Keyboard';

async function main(canvas) {
  const context = canvas.getContext('2d');

  // Input
  const input = new Keyboard();

  // Maps
  const tilesMap = await loadSprites('tiles.json');
  const charactersMap = await loadSprites('characters.json');
  const bgMap = await loadBackgrounds('backgrounds.json', tilesMap);

  // Stage
  const stage1 = await loadStage(1, tilesMap, charactersMap, input);

  // Compositor
  const compositor = new Compositor();
  compositor.addLayer(bgMap.get('bg-game-1'));
  compositor.addLayer(stage1.getLevel('level1'));

  // Start to listening the input
  input.startListeningTo(window);

  // Time based main loop
  const timer = new Timer();
  timer.update = deltaTime => {
    compositor.update(deltaTime);
    compositor.render(context, deltaTime);
  };
  timer.start();
}

main(document.getElementById('game'));
