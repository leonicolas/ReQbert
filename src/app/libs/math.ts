export function degToRad(deg) {
  return deg * Math.PI / 180;
}

export function toFixed(number, decimals) {
  let factor = Math.pow(10, decimals);
  let signal = number >= 0 ? 1 : -1;
  return Math.round((number * factor) + (signal * 0.0001)) / factor;
}

export class Vec2 {
  constructor(x, y) {
    if(Array.isArray(x)) {
      y = x[1];
      x = x[0];
    }
    this.x = x;
    this.y = y;
  }

  swap() {
    this.y = [this.x, (this.x = this.y)][0];
  }

  clone() {
    return new Vec2(this.x, this.y);
  }

  set(x, y) {
    this.setX(x);
    this.setY(y);
  }

  setX(x) {
    this.x = x;
  }

  setY(y) {
    this.y = y;
  }

  move(x, y) {
    this.moveX(x);
    this.moveY(y);
  }

  moveX(x) {
    this.x += x;
  }

  moveY(y) {
    this.y += y;
  }
}

export class Matrix {
  constructor() {
    this.matrix = [];
  }

  set(x, y, value) {
    let col = this.matrix[x];
    if(!col) {
      col = [];
      this.matrix[x] = col;
    }
    col[y] = value;
  }

  get(x, y) {
    let col = this.matrix[x];
    return col ? col[y] : undefined;
  }
}
