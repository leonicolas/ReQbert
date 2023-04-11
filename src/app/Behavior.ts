import Entity from "./Entity";
import { EntityEvent } from "./Global";

export default class Behavior {
  readonly onStartListeners = new Set<(gameEvent: EntityEvent<any>) => void>();
  readonly onEndListeners = new Set<(gameEvent: EntityEvent<any>) => void>();
  readonly entity: Entity;

  static NAME: string = "";

  constructor(entity: Entity) {
    this.entity = entity;
  }

  triggerOnStart<T extends EntityEvent<any>>(gameEvent: T) {
    this.onStartListeners.forEach((handler) => handler(gameEvent));
  }

  triggerOnEnd<T extends EntityEvent<any>>(gameEvent: T) {
    this.onEndListeners.forEach((handler) => handler(gameEvent));
  }

  update(_: number) {
    console.info("Update not implemented!");
  }
}
