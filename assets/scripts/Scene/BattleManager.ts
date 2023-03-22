import { _decorator, Component, Node, UITransform } from "cc";
const { ccclass, property } = _decorator;
import Utils from "db://assets/scripts/Utils";
import levels from "../../levels";
import { ILevel } from "../../interfaces";
import { EVENT_ENUM } from "../../enums";

import { MapManager } from "../Stage/MapManager";
import { PlayerManager } from "../Player/PlayerManager";

import DataManager from "../../runtime/DataManager";
import EventManager from "../../runtime/EventManager";

@ccclass("BattleManager")
export class BattleManager extends Component {
  level: ILevel;
  stage: Node;
  tileMap: Node;

  // #region 地图相关
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

  /**
   * 居中地图
   *
   */
  centerTileMap() {
    const { mapRowCount, mapCol } = DataManager.instance;
    const x = -(mapCol * 55) / 2;
    const y = (mapRowCount * 55) / 2 + 80;
    this.tileMap.setPosition(x, y);
  }

  /**
   * 下一关
   *
   */
  nextLevel() {
    this.clearLevel();
    DataManager.instance.levelIndex++;
    this.initStage();
  }

  /**
   * 清除关卡
   *
   */
  clearLevel() {
    DataManager.instance.reset();
    this.tileMap.destroyAllChildren();
  }

  // #endregion
  // #region 玩家相关
  // 生成玩家
  generatePlayer() {
    // 手动创建节点
    // 玩家节点
    const player = Utils.createNode("player", this.node);
    // 玩家管理器
    const playerManager = player.addComponent(PlayerManager);
    playerManager.init();  
  }

  // #endregion

  initStage() {
    const level = levels[`level_${DataManager.instance.levelIndex}`];

    if (!level) return;
    this.level = level;

    DataManager.instance.map = level.map;
    DataManager.instance.mapRowCount = level.map.length || 0;
    DataManager.instance.mapCol = level.map[0].length || 0;

    this.generateTileMap();
    this.centerTileMap();

    this.generatePlayer();
  }

  onLoad() {
    // 绑定可以触发下一关的事件
    EventManager.instance.on(EVENT_ENUM.NEXT_LEVEL, this.nextLevel, this);
  }

  start() {
    this.initStage();
    console.log(this);
    console.log(this.node);
  }

  update(deltaTime: number) {}

  onDestroy() {
    // 解绑事件
    EventManager.instance.off(EVENT_ENUM.NEXT_LEVEL, this.nextLevel, this);
  }
}
