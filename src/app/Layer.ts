import Entity from "./Entity";
import { Renderable, Updatable } from "./Global";
import { Vector2 } from "./libs/math";
import { ConfigSpec } from "./specs/Config";
import Sprite from "./Sprite";

export default class Layer implements Updatable, Renderable {
  private gridSize: number;
  private sprites = new Set<Sprite>();
  private entities = new Set<Entity>();
  private buffer: HTMLCanvasElement;
  private context: CanvasRenderingContext2D | null;

  readonly position: Vector2;

  constructor(position: Vector2, config: ConfigSpec) {
    // Initialize properties
    this.position = position.clone();
    this.gridSize = config.grid.size;
    // Initialize buffer
    this.buffer = document.createElement("canvas");
    this.buffer.width = config.screen.width;
    this.buffer.height = config.screen.height;
    this.context = this.buffer.getContext("2d");
  }

  addSprite(sprite: Sprite) {
    this.sprites.add(sprite);
  }

  addEntity(entity: Entity) {
    this.entities.add(entity);
  }

  update(deltaTime: number) {
    this.entities.forEach((entity) => entity.update(deltaTime));
  }

  render(context: CanvasRenderingContext2D) {
    if(!this.context)
      return;

    this.clear();
    this.entities.forEach((entity) => {
      entity.render(this.context as CanvasRenderingContext2D);
    });
    this.sprites.forEach((sprite) => {
      sprite.render(this.context as CanvasRenderingContext2D);
    });
    context.drawImage(this.buffer, this.position.x * this.gridSize, this.position.y * this.gridSize);
  }

  private clear() {
    this.context?.clearRect(0, 0, this.buffer.width, this.buffer.height);
  }
}
