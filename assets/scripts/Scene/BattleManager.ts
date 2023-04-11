import { _decorator, Component, Node, UITransform, utils } from "cc";
const { ccclass, property } = _decorator;
import Utils from "db://assets/scripts/Utils";
import levels from "../../levels";
import { ILevel } from "../../interfaces";
import {
  DIRECTION_NUMBER_ENUM,
  ENTITY_DIRECTION_ENUM,
  ENTITY_STATE_ENUM,
  ENTITY_TYPE_ENUM,
  EVENT_ENUM,
  SPIKES_STATE_ENUM,
} from "../../enums";

import { MapManager } from "../Stage/MapManager";
import { PlayerManager } from "../Player/PlayerManager";

import DataManager from "../../runtime/DataManager";
import EventManager from "../../runtime/EventManager";
import { WoodenSkeletonManager } from "../WoodenSkeleton/WoodenSkeletonManager";
import { IronSkeletonManager } from "../IronSkeleton/IronSkeletonManager";
import { DoorManager } from "../Door/DoorManager";
import { BurstManager } from "../Burst/BurstManager";
import { SpikesManager } from "../Spikes/SpikesManager";
import { SmokeManager } from "../Smoke/SmokeManager";
import FaderManager from "../../runtime/FaderManager";

@ccclass("BattleManager")
export class BattleManager extends Component {
  level: ILevel;
  tileMap: Node;
  smokes: Node;
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
    DataManager.instance.levelIndex = DataManager.instance.levelIndex + 1;
    this.initStage();
  }

  /**
   * 清除关卡
   *
   */
  clearLevel() {
    this.tileMap.destroyAllChildren();
    this.tileMap.destroy();
    DataManager.instance.reset();
  }

  // 生成敌人
  async generateEnemy() {
    const initPromise = [];
    // 遍历地图数据中的每一个敌人信息
    for (let i = 0; i < this.level.enemies.length; i++) {
      const enemyInfo = this.level.enemies[i];
      // 手动创建节点
      // 敌人节点
      const entity = Utils.createNode(enemyInfo.type, this.tileMap);
      // 敌人管理器
      let entityManager: WoodenSkeletonManager | IronSkeletonManager;
      switch (enemyInfo.type) {
        case ENTITY_TYPE_ENUM.ENEMY_WOODEN_SKELETON:
          entityManager = entity.addComponent(WoodenSkeletonManager);
          break;
        case ENTITY_TYPE_ENUM.ENEMY_IRON_SKELETON:
          entityManager = entity.addComponent(IronSkeletonManager);
          break;
      }
      initPromise.push(entityManager.init(enemyInfo));
      DataManager.instance.enemies.push(entityManager);
    }
    
    await Promise.all(initPromise);
  }

  // 生成门
  async generateDoor() {
    // 手动创建节点
    // 门节点
    const door = Utils.createNode("door", this.tileMap);
    // 门管理器
    const doorManager = door.addComponent(DoorManager);
    await doorManager.init(this.level.door);

    DataManager.instance.door = doorManager;
  }

  // 生成掉落陷阱
  async generateBurst() {
    const initPromise = [];
    // 遍历地图数据中的每一个掉落陷阱信息
    for (let i = 0; i < this.level.bursts.length; i++) {
      const burstInfo = this.level.bursts[i];
      // 手动创建节点
      // 掉落陷阱节点
      const burst = Utils.createNode("burst", this.tileMap);
      // 掉落陷阱管理器
      const burstManager = burst.addComponent(BurstManager);
      initPromise.push(burstManager.init(burstInfo));
      DataManager.instance.bursts.push(burstManager);
    }
    await Promise.all(initPromise);
  }

  // 生成尖刺陷阱
  async generateSpikes() {
    const initPromise = [];
    // 遍历地图数据中的每一个尖刺陷阱信息
    for (let i = 0; i < this.level.spikes.length; i++) {
      const spikesInfo = this.level.spikes[i];
      // 手动创建节点
      // 尖刺陷阱节点
      const spikes = Utils.createNode("spikes", this.tileMap);
      // 尖刺陷阱管理器
      const spikesManager = spikes.addComponent(SpikesManager);
      initPromise.push(spikesManager.init(spikesInfo));
      DataManager.instance.spikes.push(spikesManager);
    }
    await Promise.all(initPromise);
  }

  // 生成烟雾层
  async generateSmokeLayer() {
    this.smokes = Utils.createNode("smokes", this.tileMap);
  }
  // 生成烟雾
  async generateSmoke(x: number, y: number, direction: ENTITY_DIRECTION_ENUM) {
    // 检查是否已经存在状态为DEAD的烟雾, 如果存在则直接复用
    const deadSmoke = DataManager.instance.smokes.find(
      (smoke) => smoke.state === ENTITY_STATE_ENUM.DEAD
    );
    if (deadSmoke) {
      deadSmoke.respawn(x, y, direction);
    } else {
      // 手动创建节点
      // 玩家节点
      const smoke = Utils.createNode("smoke", this.smokes);
      // 玩家管理器
      const smokeManager = smoke.addComponent(SmokeManager);
      await smokeManager.init({
        x,
        y,
        direction,
        state: ENTITY_STATE_ENUM.IDLE,
        type: ENTITY_TYPE_ENUM.SMOKE,
      });

      DataManager.instance.smokes.push(smokeManager);
    }
  }

  // 生成玩家
  async generatePlayer() {
    // 手动创建节点
    // 玩家节点
    const player = Utils.createNode("player", this.tileMap);
    // 玩家管理器
    const playerManager = player.addComponent(PlayerManager);
    await playerManager.init(this.level.player);
    DataManager.instance.player = playerManager;
  }

  canToNextLevel() {
    const { x: playerX, y: playerY } = DataManager.instance.player;
    const { x: doorX, y: doorY, state: doorState } = DataManager.instance.door;
    if (
      playerX === doorX &&
      playerY === doorY &&
      doorState === ENTITY_STATE_ENUM.DEAD
    ) {
      EventManager.instance.emit(EVENT_ENUM.NEXT_LEVEL);
    }
  }

  async initStage() {
    const level = levels[`level${DataManager.instance.levelIndex}`];
    if (!level) {
      Utils.error("关卡不存在", level);
      return;
    }

    await FaderManager.instance.fadeOut();

    this.level = level;

    DataManager.instance.map = level.map;
    DataManager.instance.mapRowCount = level.map.length || 0;
    DataManager.instance.mapCol = level.map[0].length || 0;

    await this.generateTileMap();
    await this.generateEnemy();
    await this.generateBurst();
    await this.generateSpikes();
    await this.generateDoor();
    await this.generateSmokeLayer(); // 在玩家角色生成前, 生成烟雾层, 以后的烟雾都放入在内, 保证烟雾在玩家角色之下
    await this.generatePlayer();

    Utils.info("initStage 加载完之后 DataManager.instance", DataManager.instance);

    // 玩家创建完成, 发送事件, 通知敌人看向玩家,加上参数true, 表示是游戏初始化的阶段
    EventManager.instance.emit(EVENT_ENUM.PLAYER_CREATE_END, true);

    await FaderManager.instance.fadeIn();
  }

  onLoad() {
    // 绑定可以触发下一关的事件
    EventManager.instance.on(EVENT_ENUM.NEXT_LEVEL, this.nextLevel, this);
    // 开启触发移动烟雾效果
    EventManager.instance.on(EVENT_ENUM.SHOW_SMOKE, this.generateSmoke, this);
  }

  start() {
    this.initStage();
  }

  update(deltaTime: number) {
    this.canToNextLevel();
  }

  onDestroy() {
    // 解绑事件
    EventManager.instance.off(EVENT_ENUM.NEXT_LEVEL, this.nextLevel, this);
    EventManager.instance.off(EVENT_ENUM.SHOW_SMOKE, this.generateSmoke, this);
  }
}
