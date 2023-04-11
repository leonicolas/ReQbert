import { SpriteSpec } from "./Sprite";

export type BackgroundMapSpec = {
  name: string;
  color: string;
  tiles: string[];
  map: string[];
};

export type BackgroundsSpec = {
  animations: SpriteSpec[];
  backgrounds: BackgroundMapSpec[];
};
