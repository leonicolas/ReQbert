import BackgroundMap from './BackgroundMap';
import SpriteMap from './SpriteMap';
import Stage from './Stage';

export function loadImage(imageFile) {
  return new Promise(resolve => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.src = `assets/imgs/${imageFile}`;
  });
}

export function loadSprites(spritesSpecName) {
  return loadJson(`specs/${spritesSpecName}`)
    .then(spritesSpec => Promise.all([spritesSpec, loadImage(spritesSpec.imageFile)]))
    .then(([spritesSpec, image]) => new SpriteMap(spritesSpec, image));
}

export function loadBackgrounds(bgSpecName, spriteMap) {
  return loadJson(`specs/${bgSpecName}`)
    .then(bgSpec => new BackgroundMap(bgSpec, spriteMap));
}

export function loadStage(stageNumber, spriteMap) {
  return loadJson(`stages/stage-${stageNumber}.json`)
    .then(stageSpec => new Stage(stageSpec, spriteMap));
}

export function loadJson(fileName) {
  return fetch(`assets/${fileName}`).then(resp => resp.json());
}
