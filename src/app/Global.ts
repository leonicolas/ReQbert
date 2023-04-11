import config from "./config";
import Entity from "./Entity";
import { ConfigSpec } from "./specs/Config";
import Sprite from "./Sprite";

export function getGameConfig(): ConfigSpec {
  return config;
}

export interface Updatable {
  update(deltaTime: number): void;
}

export interface Renderable {
  render(context: CanvasRenderingContext2D): void;
}

export class EntityEvent<T> {
  readonly detail?: T;
  readonly entity: Entity;

  constructor(entity: Entity, detail?: T) {
    this.detail = detail;
    this.entity = entity;
  }
}

export class SpriteEvent {
  readonly sprite: Sprite;

  constructor(sprite: Sprite) {
    this.sprite = sprite;
  }
}
