import { loadBackgrounds, loadSprites, loadLevel } from "./libs/loaders";

import "@total-typescript/ts-reset";
import Timer from "./Timer";
import Compositor from "./Compositor";
import Keyboard from "./Keyboard";
import config from "./config";

export default async function main(canvas: HTMLCanvasElement) {
  canvas.focus();
  const context = canvas.getContext("2d");

  // Input
  const input = new Keyboard();

  // Maps
  const tilesMap = await loadSprites("tiles");
  //tilesMap.drawTile("brick", context);
  const charactersMap = await loadSprites("entities");
  const backgroundMap = await loadBackgrounds("backgrounds", tilesMap, config);

  // Level
  const level1 = await loadLevel(1, tilesMap, charactersMap, input);

  // Compositor
  const compositor = new Compositor();

  const background = backgroundMap.get("bg-game");
  if (background)
    compositor.addLayer(background);

  const stage1 = level1.getStage(1);
  compositor.addLayer(stage1);

  stage1.onLevelClearedListeners.add(() => {
    background?.playInLoop();
  });

  // Start listening the input
  input.startListeningTo(window);

  // Time based main loop
  const timer = new Timer();
  timer.update = (deltaTime) => {
    compositor.update(deltaTime);
    if (context)
      compositor.render(context);
  };
  timer.start();
}
