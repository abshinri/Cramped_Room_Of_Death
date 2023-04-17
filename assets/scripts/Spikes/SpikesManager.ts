import { _decorator, Component, Event, Sprite, UITransform } from "cc";
import {
  FSM_PARAMS_NAME_ENUM,
  ENTITY_STATE_ENUM,
  ENTITY_TYPE_ENUM,
  SPIKES_TYPE_TO_NUMBER_ENUM,
  EVENT_ENUM,
} from "db://assets/enums";
import { TILE_WIDTH, TILE_HEIGHT } from "db://assets/scripts/Stage/MapManager";
import { StateMachine } from "db://assets/base/StateMachine";
import { IEntity, ISpikes } from "db://assets/interfaces";
import Utils from "db://assets/scripts/Utils";
import { SpikesStateMachine } from "./SpikesStateMachine";
import EventManager from "../../runtime/EventManager";
import DataManager from "../../runtime/DataManager";
const { ccclass, property } = _decorator;

@ccclass("SpikesManager")
export class SpikesManager extends Component {
  id: string = Utils.randomString(8);
  fsm: StateMachine; // 状态机
  x: number = 0; // 实体的横向位置
  y: number = 0; // 实体的纵向位置

  private _count: number; // 尖刺状态
  private _totalCount: number; // 尖刺类型, 不同的尖刺总数就有不同的尖刺类型
  type: ENTITY_TYPE_ENUM; // 实体的类型

  get count() {
    return this._count;
  }

  /**
   * 当前尖刺状态计数, 计数完成触发尖刺攻击
   *
   */
  set count(value: number) {
    if (this._count === value) {
      return;
    } else if (value > this._totalCount) { // 玩家快速移动时, 尖刺状态计数可能会超过尖刺类型, 所以需要取余
      value = value - this._totalCount;
    }
    this._count = value;
    this.fsm.setParams(FSM_PARAMS_NAME_ENUM.SPIKES_CUR_COUNT, value);
  }

  get totalCount() {
    return this._totalCount;
  }

  /**
   * 尖刺类型, 不同的尖刺总数就有不同的尖刺类型, 也是尖刺状态计数的上限
   *
   */
  set totalCount(value: number) {
    if (this._totalCount === value) return;
    this._totalCount = value;
    this.fsm.setParams(FSM_PARAMS_NAME_ENUM.SPIKES_TOTAL_COUNT, value);
  }

  // 玩家每行动一次, 尖刺状态计数加一
  onPlayerMoveEnd() {
    this.count++;
    this.attackPlayer();
  }

  attackPlayer() {
    const { realX: playerX, realY: playerY } = DataManager.instance.player;
    if (
      this.count === this.totalCount &&
      this.x === playerX &&
      this.y === playerY
    ) {
      EventManager.instance.emit(
        EVENT_ENUM.ATTACK_PLAYER,
        ENTITY_STATE_ENUM.DEAD
      );
    }
  }

  // 尖刺攻击之后, 重置计数
  resetState() {
    this.count = 0;
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

  async init(params: ISpikes) {
    // 创建精灵
    const sprite = this.addComponent(Sprite);
    // 设置精灵的大小模式为自定义
    sprite.sizeMode = Sprite.SizeMode.CUSTOM;
    // 引入UITransform组件,缩放到砖块大小
    const transform = this.getComponent(UITransform);
    transform.setContentSize(TILE_WIDTH * 4, TILE_HEIGHT * 4);

    // 初始化状态机
    this.fsm = this.addComponent(SpikesStateMachine);
    await this.fsm.init();

    // 根据传入的参数, 初始化基本属性
    this.x = params.x;
    this.y = params.y;

    // 初始化尖刺类型
    this.totalCount = SPIKES_TYPE_TO_NUMBER_ENUM[params.type];
    // 初始化当前尖刺状态
    this.count = params.count;

    EventManager.instance.on(
      EVENT_ENUM.PLAYER_MOVE_END,
      this.onPlayerMoveEnd,
      this
    );
  }

  protected onDestroy(): void {
    EventManager.instance.off(
      EVENT_ENUM.PLAYER_MOVE_END,
      this.onPlayerMoveEnd,
      this
    );
  }
}
