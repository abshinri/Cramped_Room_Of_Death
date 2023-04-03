import { _decorator, Component, Node, UITransform } from "cc";
const { ccclass, property } = _decorator;
import Utils from "db://assets/scripts/Utils";
import levels from "../../levels";
import { ILevel } from "../../interfaces";
import {
  ENTITY_DIRECTION_ENUM,
  ENTITY_STATE_ENUM,
  ENTITY_TYPE_ENUM,
  EVENT_ENUM,
} from "../../enums";

import { MapManager } from "../Stage/MapManager";
import { PlayerManager } from "../Player/PlayerManager";

import DataManager from "../../runtime/DataManager";
import EventManager from "../../runtime/EventManager";
import { WoodenSkeletonManager } from "../WoodenSkeleton/WoodenSkeletonManager";
import { IronSkeletonManager } from "../IronSkeleton/IronSkeletonManager";
import { DoorManager } from "../Door/DoorManager";

@ccclass("BattleManager")
export class BattleManager extends Component {
  level: ILevel;
  tileMap: Node;

  // #region 地图相关
  /**
   * 生成地图
   *
   */
  async generateTileMap() {
    // 手动创建节点
    // 地图节点
    this.tileMap = Utils.createNode("tileMap", this.node);
    const mapManager = this.tileMap.addComponent(MapManager);
    await mapManager.init();
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
  async generatePlayer() {
    // 手动创建节点
    // 玩家节点
    const player = Utils.createNode("player", this.tileMap);
    // 玩家管理器
    const playerManager = player.addComponent(PlayerManager);
    await playerManager.init({
      x: 2,
      y: 8,
      state: ENTITY_STATE_ENUM.IDLE,
      direction: ENTITY_DIRECTION_ENUM.UP,
      type: ENTITY_TYPE_ENUM.PLAYER,
    });
    DataManager.instance.player = playerManager;
  }

  // #endregion

  async generateEnemy() {
    // 手动创建节点
    // 敌人节点
    const entity1 = Utils.createNode("woodenSkeleton", this.tileMap);
    const entity2 = Utils.createNode("woodenSkeleton", this.tileMap);
    const entity3 = Utils.createNode("woodenSkeleton", this.tileMap);
    const entity4 = Utils.createNode("ironSkeleton", this.tileMap);
    // 敌人管理器
    const woodenSkeletonManager1 = entity1.addComponent(WoodenSkeletonManager);
    const woodenSkeletonManager2 = entity2.addComponent(WoodenSkeletonManager);
    const woodenSkeletonManager3 = entity3.addComponent(WoodenSkeletonManager);
    const ironSkeletonManager4 = entity4.addComponent(IronSkeletonManager);
    await woodenSkeletonManager1.init({
      x: 2,
      y: 2,
      state: ENTITY_STATE_ENUM.IDLE,
      direction: ENTITY_DIRECTION_ENUM.UP,
      type: ENTITY_TYPE_ENUM.ENEMY_WOODEN_SKELETON,
    });
    await woodenSkeletonManager2.init({
      x: 8,
      y: 2,
      state: ENTITY_STATE_ENUM.IDLE,
      direction: ENTITY_DIRECTION_ENUM.UP,
      type: ENTITY_TYPE_ENUM.ENEMY_WOODEN_SKELETON,
    });
    await woodenSkeletonManager3.init({
      x: 8,
      y: 6,
      state: ENTITY_STATE_ENUM.IDLE,
      direction: ENTITY_DIRECTION_ENUM.UP,
      type: ENTITY_TYPE_ENUM.ENEMY_WOODEN_SKELETON,
    });

    await ironSkeletonManager4.init({
      x: 2,
      y: 6,
      state: ENTITY_STATE_ENUM.IDLE,
      direction: ENTITY_DIRECTION_ENUM.UP,
      type: ENTITY_TYPE_ENUM.ENEMY_IRON_SKELETON,
    });
    DataManager.instance.enemies = [
      woodenSkeletonManager1,
      woodenSkeletonManager2,
      woodenSkeletonManager3,
      ironSkeletonManager4,
    ];
  }

  // 生成门
  async generateDoor() {
    // 手动创建节点
    // 门节点
    const door = Utils.createNode("door", this.tileMap);
    // 门管理器
    const doorManager = door.addComponent(DoorManager);
    await doorManager.init({ x: 7, y: 8 });

    DataManager.instance.door = doorManager;
  }

  async initStage() {
    const level = levels[`level_${DataManager.instance.levelIndex}`];

    if (!level) {
      Utils.error("关卡不存在", level);
      return;
    }
    this.level = level;

    DataManager.instance.map = level.map;
    DataManager.instance.mapRowCount = level.map.length || 0;
    DataManager.instance.mapCol = level.map[0].length || 0;

    await this.generateTileMap();
    await this.generateEnemy();
    await this.generatePlayer();
    await this.generateDoor();

    // 玩家创建完成, 发送事件, 通知敌人看向玩家
    EventManager.instance.emit(EVENT_ENUM.PLAYER_CREATE_END, true);
  }

  onLoad() {
    // 绑定可以触发下一关的事件
    EventManager.instance.on(EVENT_ENUM.NEXT_LEVEL, this.nextLevel, this);
  }

  start() {
    this.initStage();
  }

  update(deltaTime: number) {}

  onDestroy() {
    // 解绑事件
    EventManager.instance.off(EVENT_ENUM.NEXT_LEVEL, this.nextLevel, this);
  }
}
