import { _decorator } from "cc";
import { EntityManager } from "./EntityManager";
import { EVENT_ENUM, ENTITY_DIRECTION_ENUM, ENTITY_STATE_ENUM } from "../enums";
import DataManager from "../runtime/DataManager";
import EventManager from "../runtime/EventManager";
import Utils from "db://assets/scripts/Utils";
import { IEntity } from "../interfaces";
const { ccclass, property } = _decorator;

@ccclass("EnemyManager")
export class EnemyManager extends EntityManager {
  async init(param: IEntity) {
    super.init(param);

    EventManager.instance.on(
      EVENT_ENUM.PLAYER_CREATE_END,
      this.changeDirectionToPlayer,
      this
    );

    EventManager.instance.on(
      EVENT_ENUM.PLAYER_MOVE_END,
      this.changeDirectionToPlayer,
      this
    );

    EventManager.instance.on(EVENT_ENUM.ENEMY_DEAD, this.dead, this);
  }

  /**
   * 玩家结束移动,初始化后触发
   *
   * @param isInit 是否是初始化
   */
  changeDirectionToPlayer(isInit: boolean) {
    if (this.state === ENTITY_STATE_ENUM.DEAD) return;
    if (!DataManager.instance.player) return;
    // 玩家每次结束移动, 改变敌人的朝向, 其实始终对着玩家
    const { x: playerX, y: playerY } = DataManager.instance.player;

    // 计算玩家和敌人的x轴距离
    const disX = Math.abs(playerX - this.x);
    // 计算玩家和敌人的y轴距离
    const disY = Math.abs(playerY - this.y);
    /**
     * 首先把敌人当作中心点, 玩家当作目标点
     * 坐标系从左到右,从上到下增加
     * 按象限区分, 然后根据X,Y轴距离来判断
     * 如: 如果玩家在右上角, 且X轴距离大于Y轴距离, 那么敌人就朝右转
     * 如: 如果玩家在右上角, 且X轴距离小于Y轴距离, 那么敌人就朝上转
     * 如果玩家初始化在对角线上, 则随机转向
     */
    if (playerX === this.x && playerY < this.y) {
      // 玩家在上方
      this.direction = ENTITY_DIRECTION_ENUM.UP;
    } else if (playerX === this.x && playerY > this.y) {
      // 玩家在下方
      this.direction = ENTITY_DIRECTION_ENUM.DOWN;
    } else if (playerX < this.x && playerY === this.y) {
      // 玩家在左方
      this.direction = ENTITY_DIRECTION_ENUM.LEFT;
    } else if (playerX > this.x && playerY === this.y) {
      // 玩家在右方
      this.direction = ENTITY_DIRECTION_ENUM.RIGHT;
    } else if (playerX === this.x && playerY === this.y && isInit) {
      // 玩家重叠
      this.direction = Utils.randomByArray([
        ENTITY_DIRECTION_ENUM.UP,
        ENTITY_DIRECTION_ENUM.DOWN,
        ENTITY_DIRECTION_ENUM.LEFT,
        ENTITY_DIRECTION_ENUM.RIGHT,
      ]);
    } else if (playerX > this.x && playerY < this.y) {
      // 玩家在右上角
      if (disX > disY) {
        this.direction = ENTITY_DIRECTION_ENUM.RIGHT;
      } else if (disX < disY) {
        this.direction = ENTITY_DIRECTION_ENUM.UP;
      } else if (isInit) {
        this.direction = Utils.randomByArray([
          ENTITY_DIRECTION_ENUM.UP,
          ENTITY_DIRECTION_ENUM.RIGHT,
        ]);
      }
    } else if (playerX > this.x && playerY > this.y) {
      // 玩家在右下角
      if (disX > disY) {
        this.direction = ENTITY_DIRECTION_ENUM.RIGHT;
      } else if (disX < disY) {
        this.direction = ENTITY_DIRECTION_ENUM.DOWN;
      } else if (isInit) {
        this.direction = Utils.randomByArray([
          ENTITY_DIRECTION_ENUM.DOWN,
          ENTITY_DIRECTION_ENUM.RIGHT,
        ]);
      }
    } else if (playerX < this.x && playerY > this.y) {
      // 玩家在左下角
      if (disX > disY) {
        this.direction = ENTITY_DIRECTION_ENUM.LEFT;
      } else if (disX < disY) {
        this.direction = ENTITY_DIRECTION_ENUM.DOWN;
      } else if (isInit) {
        this.direction = Utils.randomByArray([
          ENTITY_DIRECTION_ENUM.DOWN,
          ENTITY_DIRECTION_ENUM.LEFT,
        ]);
      }
    } else if (playerX < this.x && playerY < this.y) {
      // 玩家在左上角
      if (disX > disY) {
        this.direction = ENTITY_DIRECTION_ENUM.LEFT;
      } else if (disX < disY) {
        this.direction = ENTITY_DIRECTION_ENUM.UP;
      } else if (isInit) {
        this.direction = Utils.randomByArray([
          ENTITY_DIRECTION_ENUM.UP,
          ENTITY_DIRECTION_ENUM.LEFT,
        ]);
      }
    }
  }

  /**
   * 当触发敌人死亡事件时, 如果事件里的敌人id和当前敌人的id相同, 则将敌人的状态改为死亡
   *
   * @param {string} id
   * @returns {*}  {void}
   */
  dead(id: string): void {
    if (this.state === ENTITY_STATE_ENUM.DEAD || id !== this.id) return;
    this.state = ENTITY_STATE_ENUM.DEAD;
  }

  protected onDestroy(): void {
    super.onDestroy();
    EventManager.instance.off(
      EVENT_ENUM.PLAYER_CREATE_END,
      this.changeDirectionToPlayer,
      this
    );
    EventManager.instance.off(
      EVENT_ENUM.PLAYER_MOVE_END,
      this.changeDirectionToPlayer,
      this
    );
  }
}
