export default class Compositor {
  constructor() {
    this.layers = [];
  }

  addLayer(layer) {
    this.layers.push(layer);
  }

  draw(context, time) {
    this.layers.forEach(layer => layer(context, time));
  }
}
