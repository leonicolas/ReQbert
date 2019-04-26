import { loadBackgrounds, loadSprites, loadStage } from './libs/loaders';
import { Vec2 } from './libs/math';

import Timer from './Timer';
import Compositor from './Compositor';
import config from './config';
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

  // Stage
  const stage1 = await loadStage(1, tilesMap, charactersMap, input);

  // Compositor
  const compositor = new Compositor();

  const background = bgMap.getNewAnimation('bg-game');
  compositor.addLayer(background);

  const level1 = stage1.getLevel('level1');
  compositor.addLayer(level1);

  level1.onLevelClearedListeners.add(() => {
    background.playInLoop();
  });

  compositor.addLayer(charactersMap.newSprite("pill-green", new Vec2(8, 3)));
  compositor.addLayer(charactersMap.newSprite("pill-green-jumping", new Vec2(10, 3)));

  compositor.addLayer(charactersMap.newSprite("pill-beige", new Vec2(8, 5)));
  compositor.addLayer(charactersMap.newSprite("pill-beige-jumping", new Vec2(10, 5)));

  compositor.addLayer(charactersMap.newSprite("pill-red", new Vec2(21, 3)));
  compositor.addLayer(charactersMap.newSprite("pill-red-jumping", new Vec2(23, 3)));

  compositor.addLayer(charactersMap.newSprite("pill-blue", new Vec2(21, 5)));
  compositor.addLayer(charactersMap.newSprite("pill-blue-jumping", new Vec2(23, 5)));

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
