export default class Range {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }

  forEach(fn, step = 1) {
    for (let value = this.start; value <= this.end; value += step) {
      fn(value);
    }
  }
}
