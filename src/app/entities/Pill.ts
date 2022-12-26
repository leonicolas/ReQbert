import Entity from "../Entity";
import Jump from '../behaviors/Jump';
import Spawn from '../behaviors/Spawn';
import Die from '../behaviors/Die';
import { Vec2 } from "../libs/math";

export default class Pill extends Entity {

  constructor(spriteMap, color) {
    super(new Vec2(13, -2));

    this.color = color;
    this.accumulatedTime = 0;
    this.jumpInterval = 1500;

    this._initializeSprites(spriteMap);
    this._setCurrentSprite('idle');

    this.addBehavior(new Jump());
    this.addBehavior(new Spawn());
    this.addBehavior(new Die());

    this._bindEvents();
  }

  update(deltaTime) {
    if(this.ready) {
      this.accumulatedTime += deltaTime * 1000;
    }

    if(this.accumulatedTime >= this.jumpInterval) {
      this.accumulatedTime = 0;
      this.randomJump();
    }

    super.update(deltaTime);
  }

  randomJump() {
    if(Math.random() < 0.5)
      this.jump.rightDown();
    else
      this.jump.leftDown();
  }

  _initializeSprites(spriteMap) {
    this.sprites = {
      'idle': spriteMap.newSprite(`pill-${this.color}`),
      'idle-jumping': spriteMap.newSprite(`pill-${this.color}-jumping`),
      'dying': spriteMap.newAnimation(`pill-${this.color}-dying`),
    };
  }

  _bindEvents() {
    this.spawn.onEndListeners.add(() => this.ready = true);

    this.jump.onStartListeners.add(() => this._setCurrentSprite('idle-jumping'));
    this.jump.onEndListeners.add(() => this._setCurrentSprite('idle'));

    this.die.onStartListeners.add(() => {
      this.sprites.dying.playInLoop();
      this._setCurrentSprite('dying');
    });

    this.die.onEndListeners.add(() => {
      this.sprites.dying.stop();
      this._setCurrentSprite('idle');
    });
  }
}
