import { loadBackgrounds, loadSprites, loadStage } from './libs/loaders';
import { Vec2 } from './libs/math';

import Timer from './Timer';
import Compositor from './Compositor';
import config from './config';

async function main(canvas) {
  const context = canvas.getContext('2d');

  // Maps
  const tilesMap = await loadSprites('tiles.json');
  const charactersMap = await loadSprites('characters.json');
  const bgMap = await loadBackgrounds('backgrounds.json', tilesMap);

  // Stage
  const stage1 = await loadStage(1, tilesMap, charactersMap);

  // Compositor
  const compositor = new Compositor();
  //compositor.addLayer(bgMap.getAnimation('level-cleared'));
  let cube1 = tilesMap.createNewAnimation('bl1-t-l', new Vec2(3, 11));
  let cube2 = tilesMap.createNewAnimation('bl1-r-l', new Vec2(3, 11));
  let cube = cube2;
  compositor.addLayer(bgMap.get('bg-game-1'));
  compositor.addLayer(stage1.level1);
  compositor.addLayer(cube1);
  compositor.addLayer(cube2);

  setInterval(() => {
    cube.hide();
    cube = cube == cube1 ? cube2 : cube1;
    cube.show();
    cube.start();
  }, 1500);
  //compositor.addLayer(tilesMap.createNewSprite('bl-cleared'));

  // Time based main loop
  const timer = new Timer();

  // Test code... it will be deleted
  let action = 0;
  let currentAction = -1;
  let qbert = stage1.level1.qbert;
  let qbertActions = [
    'leftDown','rightDown','leftDown','rightDown','leftDown','rightDown','leftDown','rightDown',
    'rightUp' ,'leftUp'   ,'rightUp' ,'leftUp'   ,'rightUp' ,'leftUp'   ,'rightUp' ,'leftUp'
  ];
  qbert.jump.addOnFinishHandler(() => {
    if(++action >= qbertActions.length) action = 0;
  });

  function jumpTest() {
    if(currentAction !== action) {
      currentAction = action;
      setTimeout(() => qbert.jump[qbertActions[action]](), 1000);
    }
  }

  // Main loop
  timer.update = deltaTime => {
    jumpTest();
    compositor.update(deltaTime);
    compositor.render(context, deltaTime);
  };
  timer.start();
}

const canvas = document.getElementById('game');
main(canvas);
