export function loadImage(url) {
  return new Promise(resolve => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.src = url;
  });
}

export function loadLevel(levelNumber) {
  let level = `00${levelNumber}`.slice(-3);
  return fetch(`/assets/levels/level-${level}.json`).then(resp => resp.json());
}
