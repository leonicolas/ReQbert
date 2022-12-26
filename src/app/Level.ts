import Stage from "./Stage";

export default class Level {

  constructor(levelSpec, tilesMap, charactersMap, input) {
    this.levelSpec = levelSpec;
    this.tilesMap = tilesMap;
    this.charactersMap = charactersMap;
    this.input = input;
    this.currentStage;
  }

  getStage(stageNumber) {
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
