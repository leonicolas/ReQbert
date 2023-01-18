import BackgroundMap from '../BackgroundMap';
import TilesMap from '../TilesMap';
import Level from '../Level';
import { TilesMapSpec } from '../specs/Sprite';
import Keyboard from '../Keyboard';
import { ConfigSpec } from '../specs/Config';
import { BackgroundsSpec } from '../specs/Background';
import { LevelSpec } from '../specs/Level';

export async function loadImage(imageFile: string): Promise<HTMLImageElement> {
  return new Promise(resolve => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.src = `assets/imgs/${imageFile}`;
  });
}

export async function loadSprites(spritesSpecName: string): Promise<TilesMap> {
  const spritesSpec = await loadJson<TilesMapSpec>(`specs/${spritesSpecName}`);
  const [spritesSpecData, image] = await Promise.all([spritesSpec, loadImage(spritesSpec.imageFile)]);
  return new TilesMap(spritesSpecData, image);
}

export async function loadBackgrounds(bgSpecName: string, tilesMap: TilesMap, config: ConfigSpec): Promise<BackgroundMap> {
  const bgSpec = await loadJson<BackgroundsSpec>(`specs/${bgSpecName}`);
  return new BackgroundMap(bgSpec, tilesMap, config);
}

export async function loadLevel(levelNumber: number, tilesMap: TilesMap, charactersMap: TilesMap, input: Keyboard) {
  const levelSpec = await loadJson<LevelSpec>(`levels/level-${levelNumber}on`);
  return new Level(levelSpec, tilesMap, charactersMap, input);
}

export async function loadJson<T>(fileName: string): Promise<T> {
  const resp = await fetch(`assets/${fileName}`);
  return await respon();
}
