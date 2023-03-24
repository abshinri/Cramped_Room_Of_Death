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
