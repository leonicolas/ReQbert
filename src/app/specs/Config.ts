export interface ConfigSpec {
  screen: {
    width: number;
    height: number;
  };
  grid: {
    lines: number;
    columns: number;
    size: number;
  };
  block: {
    startPosition: {
      x: number;
      y: number;
    };
    distance: {
      line: number;
      column: number;
    };
  };
}
