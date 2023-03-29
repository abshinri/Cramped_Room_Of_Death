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
  ENTITY_DIRECTION_ENUM,
  ENTITY_STATE_ENUM,
  DIRECTION_NUMBER_ENUM,
  ENTITY_TYPE_ENUM,
  ENTITY_DIRECTION_TO_BLOCK_ENUM,
} from "db://assets/enums";
import { TILE_WIDTH, TILE_HEIGHT } from "db://assets/scripts/Stage/MapManager";
import { StateMachine } from "db://assets/base/StateMachine";
import { IEntity } from "../interfaces";
const { ccclass, property } = _decorator;

@ccclass("EntityManager")
export class EntityManager extends Component {
  fsm: StateMachine; // 状态机
  x: number = 0; // 实体的横向位置
  y: number = 0; // 实体的纵向位置

  private _direction: ENTITY_DIRECTION_ENUM; // 实体的朝向
  private _state: ENTITY_STATE_ENUM | ENTITY_DIRECTION_TO_BLOCK_ENUM; // 实体的状态
  private type: ENTITY_TYPE_ENUM; // 实体的类型

  get direction() {
    return this._direction;
  }

  /**
   * 改变方向并改变当前角色的状态,并向状态机传递参数, 告知状态机当前状态的改变
   *
   */
  set direction(value: ENTITY_DIRECTION_ENUM) {
    this._direction = value;
    // 设置方向的状态级参数
    this.fsm.setParams(
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
  set state(value: ENTITY_STATE_ENUM | ENTITY_DIRECTION_TO_BLOCK_ENUM) {
    this._state = value;
    this.fsm.setParams(value, true);
  }

  update(dt: number) {
    /** 更新实体的坐标
     *  本游戏的地图信息为二维数组, 建模基准为右下坐标下标数字增加, 左上坐标下标数字减少
     *  但是cocos的坐标系规则右上坐标下标数字增加, 左下坐标下标数字减少
     *  所以设置位置需要对y轴坐标进行取反
     */
    this.node.setPosition(
      this.x * TILE_WIDTH - TILE_WIDTH * 1.5,
      -this.y * TILE_HEIGHT + TILE_HEIGHT * 1.5
    );
  }

  async init(params: IEntity) {
    // 创建精灵
    const sprite = this.addComponent(Sprite);
    // 设置精灵的大小模式为自定义
    sprite.sizeMode = Sprite.SizeMode.CUSTOM;
    // 引入UITransform组件,缩放到砖块大小
    const transform = this.getComponent(UITransform);
    transform.setContentSize(TILE_WIDTH * 4, TILE_HEIGHT * 4);

    // 根据传入的参数, 初始化基本属性
    this.x = params.x;
    this.y = params.y;

    // 初始化状态为IDLE
    this.state = params.state;
    // 初始化方向为UP
    this.direction = params.direction;
    // 初始化类型为实体类型
    this.type = params.type;
  }
}
