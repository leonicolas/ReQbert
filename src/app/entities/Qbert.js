import Entity from '../Entity';
import Jump from '../behaviors/Jump';
import Spawn from '../behaviors/Spawn';
import Death from '../behaviors/Death';

const LEFT = 0;
const RIGHT = 1;

export default class Qbert extends Entity {

  constructor(spriteMap, pos) {
    super(spriteMap, pos);

    this.sprites = {
      'idle-front': this.spriteMap.newSprite('qbert-front'),
      'idle-back': this.spriteMap.newSprite('qbert-back'),
      'jumping-front': this.spriteMap.newSprite('qbert-front-jumping'),
      'jumping-back': this.spriteMap.newSprite('qbert-back-jumping'),
      'dying': this.spriteMap.newAnimation('qbert-dying'),
      'wining': this.spriteMap.newAnimation('qbert-wining'),
    };

    //this.sprite = this.sprites.idleFront;
    this.xDirection = LEFT;

    this.addBehavior(new Jump());
    this.addBehavior(new Spawn());
    this.addBehavior(new Death());

    this.death.onStartListeners.add(() => {
      this.sprites.dying.playInLoop();
      this._setCurrentSprite('dying');
    })

    this.death.onEndListeners.add(() => {
      this.sprites.dying.stop();
      this.jump.reset();
      this._setCurrentSprite('idle-front');
    })
  }

  win() {
    this.sprites.wining.play(3);
    this.isWining = true;
    this._setCurrentSprite('wining');
  }

  update(deltaTime) {
    super.update(deltaTime);
    if(!this.death.isDying && !this.isWining) {
      this._updateSprite();
    }
    this.sprite.pos.set(this.pos.x, this.pos.y);
  }

  render(context, deltaTime) {
    this.sprite.render(context, deltaTime, this.xDirection);
  }

  _updateSprite() {
    this.xDirection = this.jump.isToLeft() ? LEFT : RIGHT;
    let state = this.jump.isJumping() ? 'jumping' : 'idle';
    let yDirection = this.jump.isToDown() ? 'front' : 'back';
    this._setCurrentSprite(`${state}-${yDirection}`);
  }

  _setCurrentSprite(name) {
    this.sprite = this.sprites[name];
  }
}
