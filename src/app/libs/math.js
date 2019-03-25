export function degToRad(deg) {
  return deg * Math.PI / 180;
}

export class Vec2 {
  constructor(x, y) {
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
    this.x = x;
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
