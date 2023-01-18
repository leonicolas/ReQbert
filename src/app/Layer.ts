import config from './config';
import Entity from './Entity';
import { Size2, Vector2 } from './libs/math';
import { ConfigSpec } from './specs/Config';
import Sprite from './Sprite';

export default class Layer {

  position: Vector2;
  size: Size2;
  sprites: Sprite[];
  entities: Entity[];
  buffer: HTMLCanvasElement;
  context: CanvasRenderingContext2D;

  constructor(position: Vector2, config: ConfigSpec) {
    // Initialize properties
    this.position = position.clone();
    this.size = new Size2(config.screen.width, config.screen.height);
    this.sprites = [];
    // Initialize buffer
    this.buffer = document.createElement('canvas');
    this.buffer.width = config.screen.width;
    this.buffer.height = config.screen.height;
    this.context = this.buffer.getContext('2d');
  }

  addSprite(sprite: Sprite) {
    this.sprites.push(sprite);
  }

  addEntity(entity: Entity) {
    this.entities.push(entity);
  }

  update(deltaTime: number) {
    this.entities.forEach(entity => entity.update(deltaTime));
  }

  render(context: CanvasRenderingContext2D, deltaTime: number) {
    this.clear();
    this.entities.forEach(entity => {
      entity.render(this.context, deltaTime);
    });
    this.sprites.forEach(sprite => {
      sprite.render(this.context, deltaTime);
    });
    context.drawImage(this.buffer, this.position.x * config.grid.size, this.position.y * config.grid.size);
  }

  private clear() {
    this.context.clearRect(0, 0, this.buffer.width, this.buffer.height);
  }
}
