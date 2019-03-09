import { loadBackgrounds, loadSprites, loadStage } from './libs/loaders';
import Timer from './libs/Timer';
import Compositor from './libs/Compositor';
import Qbert from './entities/Qbert'

async function main(canvas) {
  const context = canvas.getContext('2d');

  const tilesMap = await loadSprites('tiles.json');
  const charactersMap = await loadSprites('characters.json');
  const bgMap = await loadBackgrounds('backgrounds.json', tilesMap);
  const stage1 = await loadStage(1, tilesMap);
  const qbert = new Qbert(charactersMap);

  const compositor = new Compositor();
  //compositor.addLayer(bgMap.getAnimation('level-cleared'));
  compositor.addLayer(bgMap.get('bg-game-1'));
  compositor.addLayer(stage1.level1);
  compositor.addLayer(qbert);

  const timer = new Timer();
  timer.update = time => {
    compositor.update(time);
    compositor.render(context, time);
  };
  timer.start();
}

const canvas = document.getElementById('game');
main(canvas);
