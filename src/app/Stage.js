import Level from "./Level";

export default class Stage {

  constructor(stageSpec, tilesMap, charactersMap) {
    // Prepares stage levels.
    Object.keys(stageSpec).forEach(levelName => {
      let levelSpec = stageSpec[levelName];
      this[levelName] = new Level(levelSpec, tilesMap, charactersMap);
    });
  }
}
