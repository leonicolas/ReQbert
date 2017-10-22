import { loadImage } from './lib/loaders';

const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

const config = {
  screen: {
    width: 512,
    height: 384
  }
};

context.fillRect(0, 0, config.screen.width, config.screen.height);

loadImage('/assets/img/characters.png').then(image => {
  context.drawImage(image, 0, 0, 32, 32, 0, 0, 32, 32);
});
