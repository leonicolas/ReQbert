import Entity from "../Entity";
import Jump from '../behaviors/Jump';
import Spawn from '../behaviors/Spawn';
import Die from '../behaviors/Die';
import { Vector2 } from "../libs/math";
import TilesMap from "../TilesMap";

export default class Pill extends Entity {

  private accumulatedTime = 0;
  private jumpInterval = 1500;
  private ready = false;
  private color: string;

  constructor(tilesMap: TilesMap, color: string) {
    super(new Vector2(13, -2));

    this.color = color;

    this.initializeSprites(tilesMap);
    this.setActiveSprite('idle');

    this.addBehavior(Jump);
    this.addBehavior(Spawn);
    this.addBehavior(Die);

    this.bindEvents();
  }

  update(deltaTime: number) {
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

  private initializeSprites(tilesMap: TilesMap) {
    this.sprites = {
      'idle': tilesMap.newSprite(`pill-${this.color}`),
      'idle-jumping': tilesMap.newSprite(`pill-${this.color}-jumping`),
      'dying': tilesMap.newAnimation(`pill-${this.color}-dying`),
    };
  }

  private bindEvents() {
    this.behaviors.spawn.onEndListeners.add(() => this.ready = true);

    this.behaviors.jump.onStartListeners.add(() => this.setActiveSprite('idle-jumping'));
    this.behaviors.jump.onEndListeners.add(() => this.setActiveSprite('idle'));

    this.behaviors.die.onStartListeners.add(() => {
      this.sprites.dying.playInLoop();
      this.setActiveSprite('dying');
    });

    this.behaviors.die.onEndListeners.add(() => {
      this.sprites.dying.stop();
      this.setActiveSprite('idle');
    });
  }
}
