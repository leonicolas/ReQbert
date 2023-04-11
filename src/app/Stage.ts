import config from "./config";
import { Vector2, Matrix } from "./libs/math";
import { jumpWithKeys } from "./libs/bind";
import { isStageCleared, createDieIfOutOfBoundariesCallBack } from "./libs/stage";

import Layer from "./Layer";
import Block from "./Block";
import Qbert from "./entities/Qbert";
import Pill from "./entities/Pill";
import Jump, { JumpEvent } from "./behaviors/Jump";
import Spawn from "./behaviors/Spawn";
import Win from "./behaviors/Win";
import Die from "./behaviors/Die";
import { StageSpec } from "./specs/Level";
import { Renderable, Updatable } from "./Global";
import TilesMap from "./TilesMap";
import Keyboard from "./Keyboard";

const entitiesLayerPos = new Vector2(0.5, -1.4);

const refBlockPos = new Vector2(3, 3);
const blocksPosition = new Vector2(config.block.startPosition.x, config.block.startPosition.y);

export default class Stage implements Updatable, Renderable {
  private tilesMap: TilesMap;
  private blocksData = new Matrix<Block>();
  private entitiesLayer: Layer = new Layer(entitiesLayerPos, config);
  private cleared: boolean = false;
  private currentBlock?: Block;
  private player: Qbert;
  private buffer?: HTMLCanvasElement;
  private context?: CanvasRenderingContext2D;
  private refBlockName?: string;

  // Events listeners
  onLevelClearedListeners = new Set<() => void>();

  constructor(stageSpec: StageSpec, tilesMap: TilesMap, charactersMap: TilesMap, input: Keyboard) {
    this.tilesMap = tilesMap;

    // Create entities
    const startPos = new Vector2(stageSpec.startPos[0], stageSpec.startPos[1]);
    this.player = new Qbert(charactersMap, startPos);
    this.entitiesLayer.addEntity(this.player);
    this.player.behavior<Jump>(Jump).onEndListeners.add(createDieIfOutOfBoundariesCallBack(this.blocksData));

    this.entitiesTest(charactersMap);

    // Initialize stage
    this.initializeBuffer();
    this.initializeStageBlocks(stageSpec);
    this.initializePlayerListeners();

    // Bind keys
    jumpWithKeys(input, this.player);
  }

  // It will be removed. Only for test.
  entitiesTest(charactersMap: TilesMap) {
    const pill = new Pill(charactersMap, "green");
    this.entitiesLayer.addEntity(pill);
    setTimeout(() => pill.behavior<Spawn>(Spawn).start(new Vector2(12, 5)), 3000);
    pill.behavior<Jump>(Jump).onEndListeners.add(createDieIfOutOfBoundariesCallBack(this.blocksData));

    const pill2 = new Pill(charactersMap, "beige");
    this.entitiesLayer.addEntity(pill2);
    setTimeout(() => pill2.behavior<Spawn>(Spawn).start(new Vector2(18, 5)), 6000);
    pill2.behavior<Jump>(Jump).onEndListeners.add(createDieIfOutOfBoundariesCallBack(this.blocksData));

    const pill3 = new Pill(charactersMap, "red");
    this.entitiesLayer.addEntity(pill3);
    setTimeout(() => pill3.behavior<Spawn>(Spawn).start(new Vector2(12, 5)), 10000);
    pill3.behavior<Jump>(Jump).onEndListeners.add(createDieIfOutOfBoundariesCallBack(this.blocksData));

    const pill4 = new Pill(charactersMap, "blue");
    this.entitiesLayer.addEntity(pill4);
    setTimeout(() => pill4.behavior<Spawn>(Spawn).start(new Vector2(18, 5)), 15000);
    pill4.behavior<Jump>(Jump).onEndListeners.add(createDieIfOutOfBoundariesCallBack(this.blocksData));
  }

  update(deltaTime: number) {
    this.entitiesLayer.update(deltaTime);
  }

  render(context: CanvasRenderingContext2D) {
    if (this.context)
      this.currentBlock?.render(this.context);
  
    if (this.buffer)
      context.drawImage(this.buffer, 0, 0);
    this.entitiesLayer.render(context);
  }

  triggerOnLevelCleared() {
    this.onLevelClearedListeners.forEach((listener) => listener());
  }

  private initializeBuffer() {
    this.buffer = document.createElement("canvas");
    this.buffer.width = config.screen.width;
    this.buffer.height = config.screen.height;
    this.context = this.buffer.getContext("2d") as CanvasRenderingContext2D;
  }

  private initializeStageBlocks(stageSpec: StageSpec) {
    // Draw reference block into the stage buffer.
    this.refBlockName = stageSpec.refBlock;
    if (this.context)
      this.tilesMap.drawTile(stageSpec.refBlock, this.context, refBlockPos);

    // Draw stage blocks into the stage buffer.
    let position = blocksPosition.clone();
    stageSpec.blocks.forEach((line) => {
      line.forEach((blockName: string) => {
        if (blockName) {
          this.createBlock(blockName, position);
        }
        position.moveX(config.block.distance.column);
      });
      position.x = blocksPosition.x;
      position.moveY(config.block.distance.line);
    });
  }

  private initializePlayerListeners() {
    // Jump listeners
    this.player.behavior<Jump>(Jump).onStartListeners.add((event: JumpEvent) => {
      if (!event.detail)
        return;
      this.currentBlock = this.blocksData.get(this.player.position.y, this.player.position.x);
      this.currentBlock?.rotate(event.detail);
    });
    this.player.behavior<Jump>(Jump).onEndListeners.add(() => {
      if (this.cleared) {
        this.player.behavior<Win>(Win).start(3);
        this.triggerOnLevelCleared();
      }
    });

    // Die process listener
    this.player.behavior<Die>(Die).onEndListeners.add(() => {
      setTimeout(() => this.player.behavior<Spawn>(Spawn).start(new Vector2(15, 3)), 500);
    });

    // Spawn process
    this.player.behavior<Spawn>(Spawn).onEndListeners.add(() => {
      this.player.behavior<Jump>(Jump).enable();
    });
  }

  private createBlock(blockName: string, position: Vector2) {
    let block = new Block(blockName, this.tilesMap, position);
    block.addRotateEndHandler((block: Block) => this.checkBlock(block));
    this.blocksData.set(position.y, position.x, block);
    if (this.context)
      this.tilesMap.drawTile(blockName, this.context, position);
  }

  private checkBlock(block: Block) {
    if (block.currentFrameName === this.refBlockName) {
      block.markAsCleared();
      if (isStageCleared(this.blocksData, block)) {
        this.cleared = true;
      }
    }
  }
}
