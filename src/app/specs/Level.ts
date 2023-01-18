export interface StageSpec {
  startPos: number[],
  refBlock: string,
  blocks: string[][],
}

export interface LevelSpec {
  stages: Map<string, StageSpec>,
}
