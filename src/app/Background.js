import { castArray } from './libs/utils';

export default class Background {
  constructor(images) {
    this.images = castArray(images);
  }

  render(context) {
    context.drawImage(this.images[0], 0, 0);
  }
}
