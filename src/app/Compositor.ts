import { Renderable, Updatable } from "./Global";

export default class Compositor {
  private updatableLayers = new Set<Updatable>();
  private renderableLayers = new Set<Renderable>();

  addLayer(layer: Updatable | Renderable): void {
    if ("update" in layer) this.updatableLayers.add(layer);
    if ("render" in layer) this.renderableLayers.add(layer);
  }

  update(time: number): void {
    this.updatableLayers.forEach((layer) => layer.update(time));
  }

  render(context: CanvasRenderingContext2D): void {
    this.renderableLayers.forEach((layer) => layer.render(context));
  }
}
