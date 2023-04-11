import Entity from "../Entity";
import Jump from "../behaviors/Jump";
import Spawn from "../behaviors/Spawn";
import Die from "../behaviors/Die";
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
    this.setActiveSprite("idle");

    this.addBehavior(Jump);
    this.addBehavior(Spawn);
    this.addBehavior(Die);

    this.bindEvents();
  }

  update(deltaTime: number) {
    if (this.ready) {
      this.accumulatedTime += deltaTime * 1000;
    }

    if (this.accumulatedTime >= this.jumpInterval) {
      this.accumulatedTime = 0;
      this.randomJump();
    }

    super.update(deltaTime);
  }

  randomJump() {
    const jump = this.behavior<Jump>(Jump);
    if (Math.random() < 0.5) jump.rightDown();
    else jump.leftDown();
  }

  private initializeSprites(tilesMap: TilesMap) {
    this.addSprite("idle", tilesMap.createSprite(`pill-${this.color}`));
    this.addSprite("idle-jumping", tilesMap.createSprite(`pill-${this.color}-jumping`));
    this.addSprite("dying", tilesMap.createSprite(`pill-${this.color}-dying`));
  }

  private bindEvents() {
    this.behavior<Spawn>(Spawn).onEndListeners.add(() => (this.ready = true));

    const jump = this.behavior<Jump>(Jump);
    jump.onStartListeners.add(() => this.setActiveSprite("idle-jumping"));
    jump.onEndListeners.add(() => this.setActiveSprite("idle"));

    const die = this.behavior<Die>(Die);

    die.onStartListeners.add(() => {
      this.sprites.get("dying")?.playInLoop();
      this.setActiveSprite("dying");
    });

    die.onEndListeners.add(() => {
      this.sprites.get("dying")?.stop();
      this.setActiveSprite("idle");
    });
  }
}
