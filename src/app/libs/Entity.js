
export default class Entity {

  constructor(spriteMap, pos) {
    this.spriteMap = spriteMap;
    this.pos = pos;
    this.behaviors = [];
  }

  addBehaviour(behavior) {
    this.behaviors.push(behavior);
    this[behavior.name] = behavior;
  }

  update(deltaTime) {
    this.behaviors.forEach(behavior => behavior.update(this, deltaTime));
  }
}
