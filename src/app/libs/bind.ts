import Jump from '../behaviors/Jump';
import Entity from '../Entity';
import Keyboard, { Keys } from '../Keyboard';

export function jumpWithKeys(keyboard: Keyboard, entity: Entity) {
  keyboard.addKeyListener(Keys.ArrowLeft, (state) => {
    if(state && keyboard.getKeyState(Keys.ArrowUp))
      entity.behavior<Jump>(Jump)?.leftUp();
    else if(state && keyboard.getKeyState(Keys.ArrowDown))
      entity.behavior<Jump>(Jump)?.leftDown();
  });

  keyboard.addKeyListener(Keys.ArrowRight, (state) => {
    if(state && keyboard.getKeyState(Keys.ArrowUp))
      entity.behavior<Jump>(Jump)?.rightUp();
    else if(state && keyboard.getKeyState(Keys.ArrowDown))
      entity.behavior<Jump>(Jump)?.rightDown();
  });

  keyboard.addKeyListener(Keys.ArrowUp, (state) => {
    if(state && keyboard.getKeyState(Keys.ArrowLeft))
      entity.behavior<Jump>(Jump)?.leftUp();
    else if(state && keyboard.getKeyState(Keys.ArrowRight))
      entity.behavior<Jump>(Jump)?.rightUp();
  });

  keyboard.addKeyListener(Keys.ArrowDown, (state) => {
    if(state && keyboard.getKeyState(Keys.ArrowLeft))
      entity.behavior<Jump>(Jump)?.leftDown();
    else if(state && keyboard.getKeyState(Keys.ArrowRight))
      entity.behavior<Jump>(Jump)?.rightDown();
  });
}
