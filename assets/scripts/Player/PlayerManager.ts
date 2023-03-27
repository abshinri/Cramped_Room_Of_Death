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
import EventManager from "../../runtime/EventManager";
import ResourceManager from "../../runtime/ResourceManager";
import { TILE_WIDTH, TILE_HEIGHT } from "../Stage/MapManager";
import { PlayerStateMachine } from "./PlayerStateMachine";
const { ccclass, property } = _decorator;

@ccclass("PlayerManager")
export class PlayerManager extends EntityManager {
  targetX: number = 0; // 主角的目标横向位置
  targetY: number = 0; // 主角的目标纵向位置,+为向上,-为向下
  private readonly speed = 1 / 10; // 主角移动速度

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
      x: 0,
      y: 0,
      state: ENTITY_STATE_ENUM.IDLE,
      direction: ENTITY_DIRECTION_ENUM.UP,
      type: ENTITY_TYPE_ENUM.PLAYER,
    })

    // 初始化状态为IDLE
    this.state = ENTITY_STATE_ENUM.IDLE;
    // 初始化方向为UP
    this.direction = ENTITY_DIRECTION_ENUM.UP;

    // 当玩家按下操作按钮时, 触发move事件
    EventManager.instance.on(EVENT_ENUM.PLAYER_CONTROL, this.move, this);
  }
}
