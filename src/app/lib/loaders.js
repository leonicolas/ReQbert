export function loadImage(imageFile) {
  return new Promise(resolve => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.src = `/assets/img/${imageFile}`;
  });
}

export function loadLevel(levelNumber) {
  let level = `00${levelNumber}`.slice(-3);
  return loadJson(`level-${level}`);
}

export function loadJson(fileName) {
  return fetch(`/assets/spec/${fileName}.json`).then(resp => resp.json());
}
}
