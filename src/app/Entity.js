
export default class Entity {

  constructor(pos) {
    this.behaviors = [];
    this.transformIndex = 0;
    this.pos = pos.clone();
  }

  addBehavior(behavior) {
    this.behaviors.push(behavior);
    this[behavior.name] = behavior;
  }

  update(deltaTime) {
    this.behaviors.forEach(behavior => behavior.update(this, deltaTime));
    if(this.sprite)
      this.sprite.pos.set(this.pos.x, this.pos.y);
  }

  render(context, deltaTime) {
    if(this.sprite)
      this.sprite.render(context, deltaTime, this.transformIndex);
  }

  _setCurrentSprite(name) {
    this.sprite = this.sprites[name];
  }
}
