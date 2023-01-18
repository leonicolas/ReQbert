import { SpriteSpec } from "./Sprite"

export interface RangeSpec {
  x: number[],
  y: number[],
}

export interface BackgroundFillSpec {
  imageName: string,
  index: number,
  ranges: RangeSpec[],
}

export interface BackgroundSpec {
  name: string,
  color: string,
  fill: BackgroundFillSpec[],
}

export interface BackgroundsSpec {
  backgrounds: SpriteSpec[],
  backgroundImages: BackgroundSpec[],
}
