import Keyboard from "./Keyboard";
import { LevelSpec } from "./specs/Level";
import TilesMap from "./TilesMap";
import Stage from "./Stage";

export default class Level {
  private levelSpec: LevelSpec;
  private tilesMap: TilesMap;
  private charactersMap: TilesMap;
  private input: Keyboard;
  private currentStage?: Stage;

  constructor(levelSpec: LevelSpec, tilesMap: TilesMap, charactersMap: TilesMap, input: Keyboard) {
    this.levelSpec = levelSpec;
    this.tilesMap = tilesMap;
    this.charactersMap = charactersMap;
    this.input = input;
  }

  getStage(stageNumber: number): Stage {
    this.input.resetListeners();
    this.currentStage = new Stage(
      this.levelSpec.stages[`stage${stageNumber}`],
      this.tilesMap,
      this.charactersMap,
      this.input
    );
    return this.currentStage;
  }
}
