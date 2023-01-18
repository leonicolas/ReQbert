import Entity from "./Entity";

export default class Behavior {

  onStartListeners = new Set<(data: unknown) => void>();
  onEndListeners = new Set<(data: unknown) => void>();

  static NAME: string = "";

  triggerOnStart(data?: unknown) {
    this.onStartListeners.forEach((handler) => handler(data));
  }

  triggerOnEnd(data?: unknown) {
    this.onEndListeners.forEach((handler) => handler(data));
  }

  update(entity: Entity, deltaTime: number) {
    console.info("Update not implemented!");
  }
}
