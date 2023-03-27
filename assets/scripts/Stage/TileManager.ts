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
import { TILE_TYPE_ENUM } from "../../enums";

// 砖块宽高
export const TILE_WIDTH = 55;
export const TILE_HEIGHT = 55;

@ccclass("TileManager")
export class TileManager extends Component {
  type: TILE_TYPE_ENUM;
  moveable: boolean;
  turnable: boolean;
  /**
   * 初始化砖块地图
   *
   */
  init(
    type: TILE_TYPE_ENUM,
    spriteFrame: SpriteFrame,
    poxX: number,
    poxY: number
  ) {
    if (this.type.includes("WALL")) {
      this.moveable = false;
      this.turnable = false;
    } else if (this.type.includes("CLIFF")) {
      this.moveable = false;
      this.turnable = true;
    } else {
      this.moveable = true;
      this.turnable = true;
    }

    // 如果spriteFrame不存在，则不生成砖块
    if (!spriteFrame) {
      Utils.error("spriteFrame不存在，则不生成砖块", spriteFrame);
      return;
    }

    // 创建砖块节点,挂载到本节点上
    const tileNode = Utils.createNode("tile", this.node);

    // 添加组件-Sprite
    const sprite = tileNode.addComponent(Sprite);
    // 更换组件属性-Sprite的图片
    sprite.spriteFrame = spriteFrame;

    const ui_transform = tileNode.getComponent(UITransform);
    ui_transform.setContentSize(TILE_WIDTH, TILE_HEIGHT);
    tileNode.setPosition(poxX, poxY);
  }
}
