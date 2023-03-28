import {
  _decorator,
  Component,
  Sprite,
  UITransform,
  Animation,
  animation,
  AnimationClip,
  SpriteFrame,
} from "cc";
import { EntityManager } from "../../base/EntityManager";
import {
  CONTROL_ENUM,
  EVENT_ENUM,
  FSM_PARAMS_NAME_ENUM,
  ENTITY_DIRECTION_ENUM,
  ENTITY_STATE_ENUM,
  DIRECTION_NUMBER_ENUM,
  ENTITY_TYPE_ENUM,
} from "../../enums";
import DataManager from "../../runtime/DataManager";
import EventManager from "../../runtime/EventManager";
import ResourceManager from "../../runtime/ResourceManager";
import { TILE_WIDTH, TILE_HEIGHT } from "../Stage/MapManager";
import Utils from "../Utils";
import { PlayerStateMachine } from "./PlayerStateMachine";
const { ccclass, property } = _decorator;

@ccclass("PlayerManager")
export class PlayerManager extends EntityManager {
  targetX: number = 2; // 主角的目标横向位置
  targetY: number = 8; // 主角的目标纵向位置,+为向上,-为向下
  private readonly speed = 1 / 10; // 主角移动速度

  inputHandle(input: CONTROL_ENUM) {
    if (this.willBlock(input)) return;
    this.move(input);
  }

  /**
   * 判断是否会被阻挡
   *
   * @param {CONTROL_ENUM} input
   */
  willBlock(input: CONTROL_ENUM) {
    // 提取方向,移动目标
    const { targetX: x, targetY: y, direction } = this;
    // 获取地图数据
    const { tiles } = DataManager.instance;
    /**
     *  1.玩家下一步的砖块要存在, 玩家才能移动,
     *  2.玩家下一步的砖块要能踩上去, 玩家才能移动
     *  3.武器下一步的砖块不存在或者能转换方向, 玩家才能移动
     *  满足以上条件则表示玩家的移动不会被阻挡
     * */
    if (input === CONTROL_ENUM.UP) {
      /** 向上移动 */
      const playerNextY = y - 1;
      const weaponNextY = y - 2;
      if (playerNextY < 0) return true; // 上方超出地图边界, 无法移动
      const playerNextTile = tiles[x][playerNextY]; // 玩家上方的砖块
      const weaponNextTile = tiles[x][weaponNextY]; // 武器上方的砖块

      if (
        playerNextTile &&
        playerNextTile.moveable &&
        (!weaponNextTile || weaponNextTile.turnable)
      ) {
        return false;
      } else {
        this.state = ENTITY_STATE_ENUM.BLOCK_UP;
        return true;
      }
    } else if (input === CONTROL_ENUM.DOWN) {
    /** 向下移动 */
      const playerNextY = y + 1;
      const weaponNextY = y + 2;
      if (playerNextY > tiles[0].length) return true; // 下方超出地图边界, 无法移动
      const playerNextTile = tiles[x][playerNextY]; // 玩家下方的砖块
      const weaponNextTile = tiles[x][weaponNextY]; // 武器下方的砖块

      if (
        playerNextTile &&
        playerNextTile.moveable &&
        (!weaponNextTile || weaponNextTile.turnable)
      ) {
        return false;
      } else {
        this.state = ENTITY_STATE_ENUM.BLOCK_DOWN;
        return true;
      }
    } else if (input === CONTROL_ENUM.LEFT) {
    /** 向左移动 */
      const playerNextX = x - 1;
      const weaponNextX = x - 2;
      if (playerNextX < 0) return true; // 左方超出地图边界, 无法移动
      const playerNextTile = tiles[playerNextX][y]; // 玩家左方的砖块
      const weaponNextTile = tiles[weaponNextX][y]; // 武器左方的砖块

      if (
        playerNextTile &&
        playerNextTile.moveable &&
        (!weaponNextTile || weaponNextTile.turnable)
      ) {
        return false;
      } else {
        this.state = ENTITY_STATE_ENUM.BLOCK_LEFT;
        return true;
      }
    } else if (input === CONTROL_ENUM.RIGHT) {
      /** 向右移动 */
        const playerNextX = x + 1;
        const weaponNextX = x + 2;
        if (playerNextX > tiles[0].length) return true; // 右方超出地图边界, 无法移动
        const playerNextTile = tiles[playerNextX][y]; // 玩家右方的砖块
        const weaponNextTile = tiles[weaponNextX][y]; // 武器右方的砖块
  
        if (
          playerNextTile &&
          playerNextTile.moveable &&
          (!weaponNextTile || weaponNextTile.turnable)
        ) {
          return false;
        } else {
          this.state = ENTITY_STATE_ENUM.BLOCK_RIGHT;
          return true;
        }
      } else if (input === CONTROL_ENUM.TURN_LEFT) {
      /**
       * 通过角色的侧方(转向的一边),前方和侧前方的砖块来判断是否能转向
       * 如果前方,侧方和侧前方的砖块都都是可以让武器穿过的,则表示可以转向
       * 转向时,想一想,武器的位置是怎么变化的, 侧前的砖块在哪
       * 因为砖块时数组包数组的形式, 数组下标为从左到右从上到下增加
       * 所以以主人公为中心, 四个象限左上为x-,y- ,右下为x+,y+
       * */
      /** 左转 */
      let weaponX: number;
      let weaponY: number;
      if (direction === ENTITY_DIRECTION_ENUM.UP) {
        weaponX = x - 1;
        weaponY = y - 1;
      } else if (direction === ENTITY_DIRECTION_ENUM.LEFT) {
        weaponX = x - 1;
        weaponY = y + 1;
      } else if (direction === ENTITY_DIRECTION_ENUM.DOWN) {
        weaponX = x + 1;
        weaponY = y + 1;
      } else if (direction === ENTITY_DIRECTION_ENUM.RIGHT) {
        weaponX = x + 1;
        weaponY = y - 1;
      }
      if (
        (!tiles[x][weaponY] || tiles[x][weaponY].turnable) &&
        (!tiles[weaponX][weaponY] || tiles[weaponX][weaponY].turnable) &&
        (!tiles[weaponX][y] || tiles[weaponX][y].turnable)
      ) {
        return false;
      } else {
        this.state = ENTITY_STATE_ENUM.BLOCK_TURN_LEFT;
        return true;
      }
    } else if (input === CONTROL_ENUM.TURN_RIGHT) {
      /** 右转 */
      let weaponX: number;
      let weaponY: number;
      if (direction === ENTITY_DIRECTION_ENUM.UP) {
        weaponX = x + 1;
        weaponY = y - 1;
      } else if (direction === ENTITY_DIRECTION_ENUM.LEFT) {
        weaponX = x - 1;
        weaponY = y - 1;
      } else if (direction === ENTITY_DIRECTION_ENUM.DOWN) {
        weaponX = x - 1;
        weaponY = y + 1;
      } else if (direction === ENTITY_DIRECTION_ENUM.RIGHT) {
        weaponX = x + 1;
        weaponY = y + 1;
      }
      if (
        (!tiles[x][weaponY] || tiles[x][weaponY].turnable) &&
        (!tiles[weaponX][weaponY] || tiles[weaponX][weaponY].turnable) &&
        (!tiles[weaponX][y] || tiles[weaponX][y].turnable)
      ) {
        return false;
      } else {
        this.state = ENTITY_STATE_ENUM.BLOCK_TURN_RIGHT;
        return true;
      }
    }
  }

  // 控制角色移动
  move(input: CONTROL_ENUM) {
    if (input === CONTROL_ENUM.UP) {
      this.targetY -= 1;
    } else if (input === CONTROL_ENUM.DOWN) {
      this.targetY += 1;
    } else if (input === CONTROL_ENUM.LEFT) {
      this.targetX -= 1;
    } else if (input === CONTROL_ENUM.RIGHT) {
      this.targetX += 1;
    } else if (input === CONTROL_ENUM.TURN_LEFT) {
      this.state = ENTITY_STATE_ENUM.TURN_LEFT;
      if (this.direction === ENTITY_DIRECTION_ENUM.UP) {
        this.direction = ENTITY_DIRECTION_ENUM.LEFT;
      } else if (this.direction === ENTITY_DIRECTION_ENUM.LEFT) {
        this.direction = ENTITY_DIRECTION_ENUM.DOWN;
      } else if (this.direction === ENTITY_DIRECTION_ENUM.DOWN) {
        this.direction = ENTITY_DIRECTION_ENUM.RIGHT;
      } else if (this.direction === ENTITY_DIRECTION_ENUM.RIGHT) {
        this.direction = ENTITY_DIRECTION_ENUM.UP;
      }
    } else if (input === CONTROL_ENUM.TURN_RIGHT) {
      this.state = ENTITY_STATE_ENUM.TURN_RIGHT;
      if (this.direction === ENTITY_DIRECTION_ENUM.UP) {
        this.direction = ENTITY_DIRECTION_ENUM.RIGHT;
      } else if (this.direction === ENTITY_DIRECTION_ENUM.LEFT) {
        this.direction = ENTITY_DIRECTION_ENUM.UP;
      } else if (this.direction === ENTITY_DIRECTION_ENUM.DOWN) {
        this.direction = ENTITY_DIRECTION_ENUM.LEFT;
      } else if (this.direction === ENTITY_DIRECTION_ENUM.RIGHT) {
        this.direction = ENTITY_DIRECTION_ENUM.DOWN;
      }
    }
  }

  // 让角色的坐标根据速度趋近于目标坐标,实现有动画的移动效果
  updatePosition() {
    // 逼近targetX
    if (this.targetX < this.x) {
      this.x -= this.speed;
    } else if (this.targetX > this.x) {
      this.x += this.speed;
    }

    // 逼近targetY
    if (this.targetY < this.y) {
      this.y -= this.speed;
    } else if (this.targetY > this.y) {
      this.y += this.speed;
    }

    // 坐标近似时就结束移动
    if (
      Math.abs(this.targetX - this.x) < 0.01 &&
      Math.abs(this.targetY - this.y) < 0.01
    ) {
      this.x = this.targetX;
      this.y = this.targetY;
    }
  }
  update(dt: number) {
    this.updatePosition();
    super.update(dt);
  }

  async init() {
    // 加载玩家角色的状态机
    this.fsm = this.addComponent(PlayerStateMachine);
    await this.fsm.init();

    super.init({
      x: 2,
      y: 8,
      state: ENTITY_STATE_ENUM.IDLE,
      direction: ENTITY_DIRECTION_ENUM.UP,
      type: ENTITY_TYPE_ENUM.PLAYER,
    });

    // 初始化状态为IDLE
    this.state = ENTITY_STATE_ENUM.IDLE;
    // 初始化方向为UP
    this.direction = ENTITY_DIRECTION_ENUM.UP;

    // 当玩家按下操作按钮时, 触发move事件
    EventManager.instance.on(EVENT_ENUM.PLAYER_CONTROL, this.inputHandle, this);

    Utils.info(
      "PlayerManager init() DataManager.instance.tiles end",
      DataManager.instance.tiles
    );
  }
}
