export default class Compositor {
  constructor() {
    this.updatableLayers = [];
    this.layers = [];
  }

  addLayer(layer) {
    if(layer.update) this.updatableLayers.push(layer);
    this.layers.push(layer);
  }

  update(time) {
    this.updatableLayers.forEach(layer => layer.update(time));
  }

  render(context, time) {
    this.layers.forEach(layer => layer.render(context, time));
  }
}
