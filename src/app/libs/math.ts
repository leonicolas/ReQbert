export function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function toFixed(number: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  const signal = number >= 0 ? 1 : -1;
  return Math.round(number * factor + signal * 0.0001) / factor;
}

export class Vector2 {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  swap() {
    this.y = [this.x, (this.x = this.y)][0];
  }

  clone(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  set(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  copyFrom(vector: Vector2) {
    this.x = vector.x;
    this.y = vector.y;
  }

  move(x: number, y: number) {
    this.moveX(x);
    this.moveY(y);
  }

  moveX(x: number) {
    this.x += x;
  }

  moveY(y: number) {
    this.y += y;
  }
}

export class Size2 {
  width: number;
  height: number;

  constructor(width: number, heigh: number) {
    this.width = width;
    this.height = heigh;
  }

  swap() {
    this.height = [this.width, (this.width = this.height)][0];
  }

  clone(): Size2 {
    return new Size2(this.width, this.height);
  }

  set(width: number, height: number) {
    this.width = width;
    this.height = height;
  }
}

export class Range {
  start: number;
  end: number;

  constructor(start: number, end: number) {
    this.start = start;
    this.end = end;
  }

  forEach(fn: (index: number) => void, step: number = 1) {
    for (let index = this.start; index <= this.end; index += step) {
      fn(index);
    }
  }
}

export class Matrix<V> {
  matrix = new Array<V[]>();

  set(x: number, y: number, value: V) {
    let col = this.matrix[x];
    if (!col) {
      col = [];
      this.matrix[x] = col;
    }
    col[y] = value;
  }

  get(x: number, y: number): V | undefined {
    const col = this.matrix[x];
    return col ? col[y] : undefined;
  }
}
