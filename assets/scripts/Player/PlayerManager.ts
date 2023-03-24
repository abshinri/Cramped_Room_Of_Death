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
import {
  CONTROL_ENUM,
  EVENT_ENUM,
  FSM_PARAMS_NAME_ENUM,
  CHARACTER_DIRECTION_ENUM,
  CHARACTER_STATE_ENUM,
  DIRECTION_NUMBER_ENUM,
} from "../../enums";
import EventManager from "../../runtime/EventManager";
import ResourceManager from "../../runtime/ResourceManager";
import { TILE_WIDTH, TILE_HEIGHT } from "../Stage/MapManager";
import { PlayerStateMachine } from "./PlayerStateMachine";
const { ccclass, property } = _decorator;

@ccclass("PlayerManager")
export class PlayerManager extends Component {
  pfsm: PlayerStateMachine; // 状态机
  x: number = 0; // 主角的横向位置
  y: number = 0; // 主角的纵向位置
  targetX: number = 0; // 主角的目标横向位置
  targetY: number = 0; // 主角的目标纵向位置,+为向上,-为向下
  private readonly speed = 1 / 10; // 主角移动速度

  private _direction: CHARACTER_DIRECTION_ENUM; // 主角的朝向
  private _state: CHARACTER_STATE_ENUM; // 主角的状态

  get direction() {
    return this._direction;
  }

  /**
   * 改变方向并改变当前角色的状态,并向状态机传递参数, 告知状态机当前状态的改变
   *
   */
  set direction(value: CHARACTER_DIRECTION_ENUM) {
    this._direction = value;
    // 设置方向的状态级参数
    this.pfsm.setParams(
      FSM_PARAMS_NAME_ENUM.DIRECTION,
      DIRECTION_NUMBER_ENUM[value]
    );
  }
  get state() {
    return this._state;
  }

  /**
   * 改变当前角色的状态,并向状态机传递参数, 告知状态机当前状态的改变
   *
   */
  set state(value: CHARACTER_STATE_ENUM) {
    this._state = value;
    this.pfsm.setParams(value, true);
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
      if (this.direction === CHARACTER_DIRECTION_ENUM.UP) {
        this.direction = CHARACTER_DIRECTION_ENUM.LEFT;
      } else if (this.direction === CHARACTER_DIRECTION_ENUM.LEFT) {
        this.direction = CHARACTER_DIRECTION_ENUM.DOWN;
      } else if (this.direction === CHARACTER_DIRECTION_ENUM.DOWN) {
        this.direction = CHARACTER_DIRECTION_ENUM.RIGHT;
      } else if (this.direction === CHARACTER_DIRECTION_ENUM.RIGHT) {
        this.direction = CHARACTER_DIRECTION_ENUM.UP;
      }
    } else if (input === CONTROL_ENUM.TURN_RIGHT) {
      if (this.direction === CHARACTER_DIRECTION_ENUM.UP) {
        this.direction = CHARACTER_DIRECTION_ENUM.RIGHT;
      } else if (this.direction === CHARACTER_DIRECTION_ENUM.LEFT) {
        this.direction = CHARACTER_DIRECTION_ENUM.UP;
      } else if (this.direction === CHARACTER_DIRECTION_ENUM.DOWN) {
        this.direction = CHARACTER_DIRECTION_ENUM.LEFT;
      } else if (this.direction === CHARACTER_DIRECTION_ENUM.RIGHT) {
        this.direction = CHARACTER_DIRECTION_ENUM.DOWN;
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

    this.node.setPosition(
      this.x * TILE_WIDTH - TILE_WIDTH * 1.5,
      -this.y * TILE_HEIGHT + TILE_HEIGHT * 1.5
    );
  }

  async init() {
    // 创建精灵
    const sprite = this.addComponent(Sprite);
    // 设置精灵的大小模式为自定义
    sprite.sizeMode = Sprite.SizeMode.CUSTOM;
    // 引入UITransform组件,缩放到砖块大小
    const transform = this.getComponent(UITransform);
    transform.setContentSize(TILE_WIDTH * 4, TILE_HEIGHT * 4);

    // 加载玩家角色的状态机
    this.pfsm = this.addComponent(PlayerStateMachine);
    await this.pfsm.init();

    // 初始化状态为IDLE
    this.state = CHARACTER_STATE_ENUM.IDLE;
    // 初始化方向为UP
    this.direction = CHARACTER_DIRECTION_ENUM.UP;

    EventManager.instance.on(EVENT_ENUM.PLAYER_CONTROL, this.move, this);
  }
}
