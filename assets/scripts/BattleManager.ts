import { _decorator, Component, Node, UITransform } from "cc";
const { ccclass, property } = _decorator;
import { MapManager } from "./MapManager";
import Utils from "./Utils";
import levels from "../levels";
import { ILevel } from "../interfaces";
import DataManager from "../runtime/DataManager";
@ccclass("BattleManager")
export class BattleManager extends Component {
  level: ILevel;
  stage: Node;
  tileMap: Node;

  /**
   * 生成地图
   *
   */
  generateTileMap() {
    // 手动创建节点

    // 舞台节点
    this.stage = Utils.createNode("stage", this.node);
    // 地图节点
    this.tileMap = Utils.createNode("tileMap", this.stage);

    const mapManager = this.tileMap.addComponent(MapManager);
    mapManager.init();
  }

  // 居中地图

  centerTileMap() {
    const { mapRowCount, mapCol } = DataManager.instance;
    const x = -(mapCol * 55) / 2;
    const y = (mapRowCount * 55) / 2 + 80;
    this.tileMap.setPosition(x, y);
  }

  start() {
    const level = levels[`level_${1}`];
    if (!level) return;
    this.level = level;

    DataManager.instance.map = level.map;
    DataManager.instance.mapRowCount = level.map.length || 0;
    DataManager.instance.mapCol = level.map[0].length || 0;

    this.generateTileMap();
    this.centerTileMap();
  }

  update(deltaTime: number) {}
}
