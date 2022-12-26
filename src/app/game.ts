import { loadBackgrounds, loadSprites, loadLevel } from './libs/loaders';

import Timer from './Timer';
import Compositor from './Compositor';
import Keyboard from './Keyboard';

async function main(canvas) {
  canvas.focus();
  const context = canvas.getContext('2d');

  // Input
  const input = new Keyboard();

  // Maps
  const tilesMap = await loadSprites('tiles.json');
  const charactersMap = await loadSprites('characters.json');
  const bgMap = await loadBackgrounds('backgrounds.json', tilesMap);

  // Level
  const level1 = await loadLevel(1, tilesMap, charactersMap, input);

  // Compositor
  const compositor = new Compositor();

  const background = bgMap.getNewAnimation('bg-game');
  compositor.addLayer(background);

  const stage1 = level1.getStage(1);
  compositor.addLayer(stage1);

  stage1.onLevelClearedListeners.add(() => {
    background.playInLoop();
  });

  // Start listening the input
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
