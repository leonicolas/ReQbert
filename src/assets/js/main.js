const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

const config = {
  screen: {
    width: 512,
    height: 384
  }
};

context.fillRect(0, 0, config.screen.width, config.screen.height);
