import Level from "./Level";

export default class Stage {

  constructor(stageSpec, tilesMap, charactersMap) {
    // Prepares stage levels.
    Object.keys(stageSpec.levels).forEach(levelName => {
      let levelSpec = stageSpec.levels[levelName];
      this[levelName] = new Level(levelSpec, tilesMap, charactersMap);
    });
  }
}
