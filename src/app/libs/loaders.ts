import BackgroundMap from '../BackgroundMap';
import SpriteMap from '../SpriteMap';
import Level from '../Level';

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

export function loadBackgrounds(bgSpecName, tilesMap) {
  return loadJson(`specs/${bgSpecName}`)
    .then(bgSpec => new BackgroundMap(bgSpec, tilesMap));
}

export function loadLevel(levelNumber, tilesMap, charactersMap, input) {
  return loadJson(`levels/level-${levelNumber}.json`)
    .then(levelSpec => new Level(levelSpec, tilesMap, charactersMap, input));
}

export function loadJson(fileName) {
  return fetch(`assets/${fileName}`).then(resp => resp.json());
}
