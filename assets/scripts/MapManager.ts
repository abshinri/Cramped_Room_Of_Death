import {
  _decorator,
  Component,
  Node,
  SpriteFrame,
  Sprite,
  UITransform,
  Layers,
} from "cc";
const { ccclass, property } = _decorator;
import levels from "../levels";
import Utils from "./Utils";
import { TileManager } from "./TileManager";
import DataManager from "../runtime/DataManager";
// 砖块宽高
export const TILE_WIDTH = 55;
export const TILE_HEIGHT = 55;

@ccclass("MapManager")
export class MapManager extends Component {
  /**
   * 初始化砖块地图
   *
   */
  async init() {
    // 解构出地图数据

    const spriteFrames = await Utils.loadResDir(
      `texture/tile/tile`,
      SpriteFrame
    );
    // 遍历地图上的每一个砖块
    // 传入的map是一个二维数组
    // map[i]表示的实际展示的地图的纵向每一列的数据的数组
    // map[i][j]则依次是从上到下的每一个砖块的数据
    DataManager.map.forEach((col, colIndex) => {
      col.forEach((tile, tileIndex) => {
        // 如果砖块类型或者砖块图片索引不存在，则不生成砖块
        if (!tile.type || !tile.src) return;
        // 生成砖块
        const tileManager = this.node.addComponent(TileManager);
        const spriteSrc = `tile (${tile.src})`;
        const spriteFrame =
          spriteFrames.find((spriteFrame) => spriteFrame.name === spriteSrc) ||
          spriteFrames[0];

        // 初始化并设置砖块的位置
        // 砖块的位置是根据砖块的索引来计算的
        // 砖块的索引是从左到右,从上到下的
        // colIndex决定了砖块的横向位置, tileIndex决定了砖块的纵向位置
        tileManager.init(
          spriteFrame,
          colIndex * TILE_WIDTH,
          -tileIndex * TILE_HEIGHT
        );
      });
    });
  }
}
