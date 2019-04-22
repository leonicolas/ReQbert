
export default class Entity {

  constructor(pos) {
    this.pos = pos.clone();
    this.behaviors = [];
  }

  addBehavior(behavior) {
    this.behaviors.push(behavior);
    this[behavior.name] = behavior;
  }

  update(deltaTime) {
    this.behaviors.forEach(behavior => behavior.update(this, deltaTime));
  }
}
