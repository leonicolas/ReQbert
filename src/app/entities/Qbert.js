import Entity from '../Entity';
import Jump from '../behaviors/Jump';
import Spawn from '../behaviors/Spawn';
import Die from '../behaviors/Die';
import Win from '../behaviors/Win';

const LEFT = 0;
const RIGHT = 1;

const STATE_IDLE = 'idle';
const STATE_WON = 'won';
const STATE_JUMPING = 'jumping';

export default class Qbert extends Entity {

  constructor(spriteMap, pos) {
    super(pos);

    this._initializeSprites(spriteMap);

    // Initial state
    this.xDirection = LEFT;
    this.state = STATE_IDLE;

    this.addBehavior(new Jump());
    this.addBehavior(new Spawn());
    this.addBehavior(new Win());
    this.addBehavior(new Die());

    this._bindDieListeners();
    this._bindWinListeners();
  }

  update(deltaTime) {
    super.update(deltaTime);
    this._updateSprite();
    this.sprite.pos.set(this.pos.x, this.pos.y);
  }

  render(context, deltaTime) {
    this.sprite.render(context, deltaTime, this.xDirection);
  }

  _bindDieListeners() {
    this.die.onStartListeners.add(() => {
      this.sprites.dying.playInLoop();
      this._setCurrentSprite('dying');
    });

    this.die.onEndListeners.add(() => {
      this.sprites.dying.stop();
      this.jump.reset();
      this._setCurrentSprite('idle-front');
    });
  }

  _bindWinListeners() {
    this.win.onStartListeners.add(() => {
      this.state = STATE_WON;
      this._setCurrentSprite('win-jump');
    });
    this.win.onLowestPointListeners.add(() => this._setCurrentSprite('win-jump'));
    this.win.onHighestPointListeners.add(() => this._setCurrentSprite('win'));
    this.win.onEndListeners.add(() => this._setCurrentSprite('win'));
  }

  _updateSprite() {
    if(this.die.isDying || this.state === STATE_WON) return;

    this.xDirection = this.jump.isToLeft() ? LEFT : RIGHT;
    this.state = this.jump.isJumping ? STATE_JUMPING : STATE_IDLE;
    const yDirection = this.jump.isToDown() ? 'front' : 'back';
    this._setCurrentSprite(`${this.state}-${yDirection}`);
  }

  _setCurrentSprite(name) {
    this.sprite = this.sprites[name];
  }

  _initializeSprites(spriteMap) {
    this.sprites = {
      'idle-front': spriteMap.newSprite('qbert-front'),
      'idle-back': spriteMap.newSprite('qbert-back'),
      'jumping-front': spriteMap.newSprite('qbert-front-jumping'),
      'jumping-back': spriteMap.newSprite('qbert-back-jumping'),
      'dying': spriteMap.newAnimation('qbert-dying'),
      'win': spriteMap.newSprite('qbert-wining'),
      'win-jump': spriteMap.newSprite('qbert-wining-jump'),
    };
  }
}
