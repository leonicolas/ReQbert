import Level from "./Level";

export default class Stage {

  constructor(stageSpec, tilesMap, charactersMap) {
    this.stageSpec = stageSpec;
    this.tilesMap = tilesMap;
    this.charactersMap = charactersMap;

    this._initializeAnimations();
    this._initializeLevels();
  }

  _initializeLevels() {
    Object.keys(this.stageSpec.levels).forEach(levelName => {
      let levelSpec = this.stageSpec.levels[levelName];
      this[levelName] = new Level(
        levelSpec,
        this.tilesMap,
        this.charactersMap,
        this.animations
      );
    });
  }

  _initializeAnimations() {

  }
}
