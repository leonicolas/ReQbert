import config from "./config";
import { ConfigSpec } from "./specs/Config";

export function getGameConfig(): ConfigSpec {
  return config;
}
