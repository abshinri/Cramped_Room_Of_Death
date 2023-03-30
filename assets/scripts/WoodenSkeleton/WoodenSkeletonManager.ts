import { Vec2, _decorator } from "cc";
import { EntityManager } from "../../base/EntityManager";
import {
  CONTROL_ENUM,
  EVENT_ENUM,
  ENTITY_DIRECTION_ENUM,
  ENTITY_STATE_ENUM,
  ENTITY_TYPE_ENUM,
  ENTITY_DIRECTION_TO_BLOCK_ENUM,
  FSM_PARAMS_NAME_ENUM,
} from "../../enums";
import DataManager from "../../runtime/DataManager";
import EventManager from "../../runtime/EventManager";
import { TileManager } from "../Stage/TileManager";
import Utils from "../Utils";
import { WoodenSkeletonMachine } from "./WoodenSkeletonMachine";
const { ccclass, property } = _decorator;

@ccclass("WoodenSkeletonManager")
export class WoodenSkeletonManager extends EntityManager {
  async init(param = { x: 2, y: 2 }) {
    this.fsm = this.addComponent(WoodenSkeletonMachine);
    await this.fsm.init();

    super.init({
      x: param.x,
      y: param.y,
      state: ENTITY_STATE_ENUM.IDLE,
      direction: ENTITY_DIRECTION_ENUM.UP,
      type: ENTITY_TYPE_ENUM.PLAYER,
    });

    // 初始化状态为IDLE
    this.state = ENTITY_STATE_ENUM.IDLE;
    // 初始化方向为UP
    this.direction = ENTITY_DIRECTION_ENUM.UP;

    Utils.info(
      "WoodenSkeletonManager.init()-end DataManager.instance.tiles",
      DataManager.instance.tiles
    );
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

    EventManager.instance.on(
      EVENT_ENUM.PLAYER_MOVE_END,
      this.attackPlayer,
      this
    );

    this.changeDirectionToPlayer(true);
  }

  /**
   * 玩家结束移动,初始化后触发
   *
   * @param isInit 是否是初始化
   */
  changeDirectionToPlayer(isInit: boolean) {
    if(this.state === ENTITY_STATE_ENUM.DEAD) return;
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
   * 攻击玩家
   * 如果玩家在敌人的攻击范围(一格范围)内, 则攻击玩家
   */
  attackPlayer() {
    if(this.state === ENTITY_STATE_ENUM.DEAD) return;
    if (!DataManager.instance.player) return;

    // 玩家每次结束移动, 改变敌人的朝向, 其实始终对着玩家
    const {
      x: playerX,
      y: playerY,
      state: playerState,
    } = DataManager.instance.player;
    if (playerState === (ENTITY_STATE_ENUM.DEAD || ENTITY_STATE_ENUM.AIRDEAD)) {
      return;
    }

    // 计算玩家和敌人的x轴距离
    const disX = Math.abs(playerX - this.x);
    // 计算玩家和敌人的y轴距离
    const disY = Math.abs(playerY - this.y);

    if (disX <= 1 && disY <= 1) {
      // 攻击玩家
      this.state = ENTITY_STATE_ENUM.ATTACK;
      EventManager.instance.emit(
        EVENT_ENUM.ATTACK_PLAYER,
        ENTITY_STATE_ENUM.DEAD
      );
    }
  }
}
