
export default class Behavior {

  constructor(name) {
    this.name = name;
    this.onStartListeners = new Set();
    this.onEndListeners = new Set();
  }

  triggerOnStart(data) {
    this.onStartListeners.forEach(handler => handler(data));
  }

  triggerOnEnd(data) {
    this.onEndListeners.forEach(handler => handler(data));
  }

  update(entity, deltaTime) {
    console.info('Update not implemented!');
  }
}
