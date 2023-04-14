import { _decorator, Component, director, Node, UITransform, utils } from "cc";
const { ccclass, property } = _decorator;
import Utils from "db://assets/scripts/Utils";
import levels from "../../levels";
import { ILevel, IRecord } from "../../interfaces";
import {
  DIRECTION_NUMBER_ENUM,
  ENTITY_DIRECTION_ENUM,
  ENTITY_STATE_ENUM,
  ENTITY_TYPE_ENUM,
  EVENT_ENUM,
  SCENE_ENUM,
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
import { ShakeManager } from "../UI/ShakeManager";

@ccclass("BattleManager")
export class BattleManager extends Component {
  level: ILevel;
  tileMap: Node;
  smokes: Node;
  private inited: boolean = false;
  // #region 地图相关
  /**
   * 生成地图
   *
   */
  async generateTileMap() {
    // 手动创建节点
    // 地图节点
    this.tileMap = Utils.createNode("tileMap", this.node);

    // 添加震动控制器
    const shakeManager = this.tileMap.addComponent(ShakeManager);
    shakeManager.init();

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
      this.outGame();
      return;
    }
    if (this.inited) {
      // 切换关卡时先淡出
      await FaderManager.instance.fadeOut();
    } else {
      // 初次载入关卡保持黑屏
      await FaderManager.instance.mask();
    }

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

    // 玩家创建完成, 发送事件, 通知敌人看向玩家,加上参数true, 表示是游戏初始化的阶段
    EventManager.instance.emit(EVENT_ENUM.PLAYER_CREATE_END, true);

    // 加载完成后淡入
    await FaderManager.instance.fadeIn();
    this.inited = true;
  }

  /**
   * 保存当前游戏状态
   *
   */
  record() {
    const item: IRecord = {
      player: {
        x: DataManager.instance.player.x,
        y: DataManager.instance.player.y,
        direction: DataManager.instance.player.direction,
        state: DataManager.instance.player.state as ENTITY_STATE_ENUM,
        type: DataManager.instance.player.type,
      },
      door: {
        x: DataManager.instance.door.x,
        y: DataManager.instance.door.y,
        direction: DataManager.instance.door.direction,
        state: DataManager.instance.door.state as ENTITY_STATE_ENUM,
        type: DataManager.instance.door.type,
      },
      enemies: DataManager.instance.enemies.map((enemy) => {
        return {
          x: enemy.x,
          y: enemy.y,
          direction: enemy.direction,
          state: enemy.state as ENTITY_STATE_ENUM,
          type: enemy.type,
        };
      }),
      bursts: DataManager.instance.bursts.map((burst) => {
        return {
          x: burst.x,
          y: burst.y,
          direction: burst.direction,
          state: burst.state as ENTITY_STATE_ENUM,
          type: burst.type,
        };
      }),
      spikes: DataManager.instance.spikes.map((spike) => {
        return {
          x: spike.x,
          y: spike.y,
          count: spike.count,
          type: spike.type,
        };
      }),
    };
    DataManager.instance.record.push(item);
  }

  /**
   * 游戏撤回
   *
   */
  revoke() {
    // 取出最后一条记录
    const record = DataManager.instance.record.pop();
    if (record) {
      // 撤回玩家状态
      DataManager.instance.player.x = DataManager.instance.player.realX =
        record.player.x;
      DataManager.instance.player.y = DataManager.instance.player.realY =
        record.player.y;
      DataManager.instance.player.direction = record.player.direction;
      // 玩家只记录死和站立的状态
      if (
        record.player.state === ENTITY_STATE_ENUM.DEAD ||
        record.player.state === ENTITY_STATE_ENUM.AIRDEAD
      ) {
        DataManager.instance.player.state === record.player.state;
      } else {
        DataManager.instance.player.state === ENTITY_STATE_ENUM.IDLE;
      }
      DataManager.instance.player.type = record.player.type;

      // 撤回门状态
      DataManager.instance.door.x = record.door.x;
      DataManager.instance.door.y = record.door.y;
      DataManager.instance.door.direction = record.door.direction;
      DataManager.instance.door.state = record.door.state;
      DataManager.instance.door.type = record.door.type;

      // 撤回敌人状态
      for (let i = 0; i < record.enemies.length; i++) {
        const enemy = record.enemies[i];
        const enemyManager = DataManager.instance.enemies[i];
        enemyManager.x = enemy.x;
        enemyManager.y = enemy.y;
        enemyManager.direction = enemy.direction;
        enemyManager.state = enemy.state;
        enemyManager.type = enemy.type;
      }

      // 撤回陷阱状态
      for (let i = 0; i < record.bursts.length; i++) {
        const burst = record.bursts[i];
        const burstManager = DataManager.instance.bursts[i];
        burstManager.x = burst.x;
        burstManager.y = burst.y;
        burstManager.direction = burst.direction;
        burstManager.state = burst.state;
        burstManager.type = burst.type;
      }

      // 撤回尖刺状态
      for (let i = 0; i < record.spikes.length; i++) {
        const spike = record.spikes[i];
        const spikeManager = DataManager.instance.spikes[i];
        spikeManager.x = spike.x;
        spikeManager.y = spike.y;
        spikeManager.count = spike.count;
        spikeManager.type = spike.type;
      }
    }
  }
  // 退出游戏
  async outGame() {
    await FaderManager.instance.fadeOut();
    director.loadScene(SCENE_ENUM.START);
  }
  onLoad() {
    // 绑定可以触发下一关的事件
    EventManager.instance.on(EVENT_ENUM.NEXT_LEVEL, this.nextLevel, this);
    // 开启触发移动烟雾效果
    EventManager.instance.on(EVENT_ENUM.SHOW_SMOKE, this.generateSmoke, this);

    // 触发游戏记录和撤回事件
    EventManager.instance.on(EVENT_ENUM.RECORD, this.record, this);
    EventManager.instance.on(EVENT_ENUM.REVOKE, this.revoke, this);
    EventManager.instance.on(EVENT_ENUM.RESTART, this.initStage, this);
    EventManager.instance.on(EVENT_ENUM.OUT, this.outGame, this);
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
    EventManager.instance.off(EVENT_ENUM.RECORD, this.record, this);
    EventManager.instance.off(EVENT_ENUM.REVOKE, this.revoke, this);
    EventManager.instance.off(EVENT_ENUM.RESTART, this.initStage, this);
    EventManager.instance.off(EVENT_ENUM.OUT, this.outGame, this);
  }
}
