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

import Utils from "db://assets/scripts/Utils";
import { TileManager } from "./TileManager";
import DataManager from "../../runtime/DataManager";
import ResourceManager from "../../runtime/ResourceManager";
import { ShakeManager } from "../UI/ShakeManager";

// 砖块宽高
export const TILE_WIDTH = 55;
export const TILE_HEIGHT = 55;

@ccclass("MapManager")
export class MapManager extends Component {
  /**
   * 居中地图
   *
   */
  centerTileMap() {
    const { mapRowCount, mapCol } = DataManager.instance;
    const x = -(mapCol * 55) / 2;
    const y = (mapRowCount * 55) / 2 + 100;

    // 初始化地图的时候确保画面没有在震动
    const shakeManager = this.node.getComponent(ShakeManager);
    shakeManager.stopShake();
    
    this.node.setPosition(x, y);
  }

  /**
   * 初始化砖块地图
   *
   */
  async init() {
    // 加载地图资源
    const spriteFrames = await ResourceManager.instance.loadResDir(
      `texture/tile/tile`,
      SpriteFrame
    );

    // 砖块属性信息
    DataManager.instance.tiles = [];

    const tilesNode = Utils.createNode("tiles", this.node);

    // 遍历地图上的每一个砖块
    // 传入的map是一个二维数组
    // map[i]表示的实际展示的地图的纵向每一列的数据的数组
    // map[i][j]则依次是从上到下的每一个砖块的数据
    DataManager.instance.map.forEach((col, colIndex) => {
      DataManager.instance.tiles[colIndex] = [];

      col.forEach((tile, tileIndex) => {
        // 如果砖块类型或者砖块图片索引不存在，则不生成砖块
        if (!tile.type || !tile.src) {
          Utils.error("如果砖块类型或者砖块图片索引不存在，则不生成砖块", tile);
          return;
        }
        // 添加自定义组件-砖块管理器
        const tileManager = tilesNode.addComponent(TileManager);

        // 当地图类型为1,5,9的时候, 进行一定量的随机处理
        // 同时不能过于随机, 否则会导致地图看起来很奇怪
        // 过滤一些需要随机的砖块, 使得地图看起来更加的自然
        if (
          [1, 5, 9].indexOf(tile.src) !== -1 &&
          colIndex % 2 === 0 &&
          tileIndex % 2 === 0
        ) {
          tile.src = Utils.random(tile.src, tile.src + 3);
        }

        const spriteSrc = `tile (${tile.src})`;
        const spriteFrame =
          spriteFrames.find((spriteFrame) => spriteFrame.name === spriteSrc) ||
          spriteFrames[0];

        // 将砖块管理器的数据存储到数据管理中心
        DataManager.instance.tiles[colIndex][tileIndex] = tileManager;

        // 初始化并设置砖块的位置
        // 砖块的位置是根据砖块的索引来计算的
        // 砖块的索引是从左到右,从上到下的
        // colIndex决定了砖块的横向位置, tileIndex决定了砖块的纵向位置
        tileManager.init(
          tile.type,
          spriteFrame,
          colIndex * TILE_WIDTH,
          -tileIndex * TILE_HEIGHT
        );
      });
    });

    this.centerTileMap();
  }
}
