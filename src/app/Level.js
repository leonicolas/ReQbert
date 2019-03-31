import config from './config';
import { Vec2, Matrix } from './libs/math';
import Layer from './Layer';
import Qbert from './entities/Qbert'

const entitiesLayerPos = new Vec2(0.5, 0.6);

const refBlockPos = new Vec2(3, 3);
const blocksPos = new Vec2(3, 3);
const blocksDistance = new Vec2(3, 2);

export default class Level {

  constructor(levelSpec, blocksBuffer, charactersMap, animations) {
    // Initialize properties
    this.levelSpec = levelSpec;
    this.blocksBuffer = blocksBuffer;
    this.blocksData = new Matrix();
    this.entitiesLayer = new Layer(entitiesLayerPos, config.screen);
    this.animations = animations;

    // Create entities
    this.qbert = new Qbert(charactersMap, new Vec2(15, 1));
    this.entitiesLayer.addSprite(this.qbert);

    this.qbert.jump.addOnStartHandler((behaviour, direction) => {
      //console.log(this.qbert.pos, direction);
    });

    // Initialize level
    this._initializeBuffer();
    this._initializeLevelBlocks(levelSpec);
  }

  update(deltaTime) {
    this.entitiesLayer.update(deltaTime);
  }

  render(context, deltaTime) {
    context.drawImage(this.buffer, 0, 0);
    this.entitiesLayer.render(context, deltaTime);
  }

  _initializeBuffer() {
    this.buffer = document.createElement('canvas');
    this.buffer.width = config.screen.width;
    this.buffer.height = config.screen.height;
  }

  _initializeLevelBlocks(levelSpec) {
    const context = this.buffer.getContext('2d');

    // Draw reference block into the level buffer.
    this.blocksBuffer.draw(levelSpec.refBlock, context, refBlockPos);

    // Draw level blocks into the level buffer.
    let pos = blocksPos.clone();
    levelSpec.blocks.forEach(line => {
      line.forEach(blockName => {
        if(blockName) {
          this.blocksData.set(pos.x, pos.y, blockName);
          this.blocksBuffer.draw(blockName, context, pos);
        }
        pos.moveX(blocksDistance.x);
      });
      pos.x = blocksPos.x;
      pos.moveY(blocksDistance.y);
    });
  }
}
