import { Keys } from '../Keyboard';

export function jumpWithKeys(keyboard, entity) {
  keyboard.addKeyListener(Keys.ArrowLeft, (state) => {
    if(state && keyboard.getKeyState(Keys.ArrowUp))
      entity.jump.leftUp();
    else if(state && keyboard.getKeyState(Keys.ArrowDown))
      entity.jump.leftDown();
  });

  keyboard.addKeyListener(Keys.ArrowRight, (state) => {
    if(state && keyboard.getKeyState(Keys.ArrowUp))
      entity.jump.rightUp();
    else if(state && keyboard.getKeyState(Keys.ArrowDown))
      entity.jump.rightDown();
  });

  keyboard.addKeyListener(Keys.ArrowUp, (state) => {
    if(state && keyboard.getKeyState(Keys.ArrowLeft))
      entity.jump.leftUp();
    else if(state && keyboard.getKeyState(Keys.ArrowRight))
      entity.jump.rightUp();
  });

  keyboard.addKeyListener(Keys.ArrowDown, (state) => {
    if(state && keyboard.getKeyState(Keys.ArrowLeft))
      entity.jump.leftDown();
    else if(state && keyboard.getKeyState(Keys.ArrowRight))
      entity.jump.rightDown();
  });
}
