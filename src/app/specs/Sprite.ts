export enum ImageTransformation {
  Rotated,
  Flipped,
}

export type SpriteSpec = {
  name: string;
  frameTime: number;
  frames: string[];
  transformation: ImageTransformation;
};

export type ImageSpec = {
  name: string;
  position: number[];
  size: number[];
};

export type TilesMapSpec = {
  imageFile: string;
  tiles: ImageSpec[];
  sprites: SpriteSpec[];
};
