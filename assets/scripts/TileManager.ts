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
import Utils from "./Utils";

// 砖块宽高
export const TILE_WIDTH = 55;
export const TILE_HEIGHT = 55;

@ccclass("TileManager")
export class TileManager extends Component {
  /**
   * 初始化砖块地图
   *
   */
  init(spriteFrame: SpriteFrame, poxX: number, poxY: number) {
    // 如果砖块类型或者砖块图片索引不存在，则不生成砖块
    // 生成砖块
    const tileNode = Utils.createNode("tile", this.node);

    const sprite = tileNode.addComponent(Sprite);
    sprite.spriteFrame = spriteFrame;

    const ui_transform = tileNode.getComponent(UITransform);
    ui_transform.setContentSize(TILE_WIDTH, TILE_HEIGHT);

    tileNode.setPosition(poxX, poxY);

    return tileNode;
  }
}
