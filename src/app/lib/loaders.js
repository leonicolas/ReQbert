import BackgroundMap from './BackgroundMap';
import SpriteMap from './SpriteMap';
import Level from './Level';

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

export function loadBackgrounds(bgSpecName, spriteMap) {
  return loadJson(bgSpecName)
    .then(bgSpec => new BackgroundMap(bgSpec, spriteMap));
}

export function loadLevel(levelNumber, spriteMap) {
  let level = `00${levelNumber}`.slice(-3);
  return loadJson(`level-${level}.json`)
    .then(levelSpec => new Level(levelSpec, spriteMap));
}

export function loadJson(fileName) {
  return fetch(`/assets/spec/${fileName}`).then(resp => resp.json());
}
