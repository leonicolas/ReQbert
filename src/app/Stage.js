import Level from "./Level";

export default class Stage {

  constructor(stageSpec, tilesMap, charactersMap, input) {
    this.stageSpec = stageSpec;
    this.tilesMap = tilesMap;
    this.charactersMap = charactersMap;
    this.input = input;
    this.currentLevel;
  }

  getLevel(level) {
    this.input.resetListeners();
    this.currentLevel = new Level(
      this.stageSpec.levels[level],
      this.tilesMap,
      this.charactersMap,
      this.input
    );
    return this.currentLevel;
  }
}
