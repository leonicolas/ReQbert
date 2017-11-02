import BackgroundMap from './BackgroundMap';
import SpriteMap from './SpriteMap';

export function loadImage(imageFile) {
  return new Promise(resolve => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.src = `/assets/img/${imageFile}`;
  });
}

export function loadSprites(spritesSpecName) {
  return loadJson(spritesSpecName)
    .then(spritesSpec => Promise.all([spritesSpec, loadImage(spritesSpec.imageFile)]))
    .then(([spritesSpec, image]) => new SpriteMap(spritesSpec, image));
}

export function loadBackgrounds(bgSpecName) {
  return loadJson(bgSpecName)
    .then(bgSpec => Promise.all([bgSpec, loadSprites(bgSpec.spritesSpecName)]))
    .then(([bgSpec, spritesMap]) => new BackgroundMap(bgSpec, spritesMap));
}

export function loadLevel(levelNumber) {
  let level = `00${levelNumber}`.slice(-3);
  return loadJson(`level-${level}.json`);
}

export function loadJson(fileName) {
  return fetch(`/assets/spec/${fileName}`).then(resp => resp.json());
}
