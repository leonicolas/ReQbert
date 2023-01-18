import Entity from '../Entity';
import Jump from '../behaviors/Jump';
import Spawn from '../behaviors/Spawn';
import Die from '../behaviors/Die';
import Win from '../behaviors/Win';
import TilesMap from '../TilesMap';
import { Vector2 } from '../libs/math';

export enum QbertDirection {
  Left, Right
}

export enum QbertState {
  Idle, Won, Jumping
}

export default class Qbert extends Entity {

  private state: QbertState = QbertState.Idle;

  constructor(tilesMap: TilesMap, position: Vector2) {
    super(position);
    this.initializeSprites(tilesMap);

    this.addBehavior(Jump);
    this.addBehavior(Spawn);
    this.addBehavior(Win);
    this.addBehavior(Die);

    this.bindDieListeners();
    this.bindWinListeners();
  }

  update(deltaTime: number) {
    this.updateSprite();
    super.update(deltaTime);
  }

  private bindDieListeners() {
    this.behavior<Die>(Die).onStartListeners.add(() => {
      this.setActiveSprite('dying');
      this.playAnimationInLoop();
    });

    this.behavior<Die>(Die).onEndListeners.add(() => {
      this.stopAnimation();
      this.behavior<Jump>(Jump).reset();
      this.setActiveSprite('idle-front');
    });
  }

  private bindWinListeners() {
    this.behavior<Win>(Win).onStartListeners.add(() => {
      this.state = QbertState.Won;
      this.setActiveSprite('win-jump');
    });
    this.behavior<Win>(Win).onLowestPointListeners.add(() => this.setActiveSprite('win-jump'));
    this.behavior<Win>(Win).onHighestPointListeners.add(() => this.setActiveSprite('win'));
    this.behavior<Win>(Win).onEndListeners.add(() => this.setActiveSprite('win'));
  }

  private updateSprite() {
    if(this.behavior<Die>(Die).isDying || this.state === QbertState.Won)
      return;

    // Updates the direction
    const xDirection = this.behavior<Jump>(Jump).isToLeft() ? QbertDirection.Left : QbertDirection.Right;
    this.transformIndex = xDirection;

    // Updates the state
    this.state = this.behavior<Jump>(Jump).isJumping ? QbertState.Jumping : QbertState.Idle;
    const yDirection = this.behavior<Jump>(Jump).isToDown() ? 'front' : 'back';

    this.setActiveSprite(`${this.state}-${yDirection}`);
  }

  private initializeSprites(tilesMap: TilesMap) {
    this.addSprite('idle-front', tilesMap.createSprite('qbert-front'));
    this.addSprite('idle-back', tilesMap.createSprite('qbert-back'));
    this.addSprite('jumping-front', tilesMap.createSprite('qbert-front-jumping'));
    this.addSprite('jumping-back', tilesMap.createSprite('qbert-back-jumping'));
    this.addSprite('dying', tilesMap.createSprite('qbert-dying'));
    this.addSprite('win', tilesMap.createSprite('qbert-wining'));
    this.addSprite('win-jump', tilesMap.createSprite('qbert-wining-jump'));
  }
}
