import State from "../../base/State";
import { IronSkeletonStateMachine } from "./IronSkeletonStateMachine";
import DirectionSubStateMachine from "../../base/DirectionSubStateMachine";
import {
  ENTITY_DIRECTION_ENUM,
} from "../../enums";

const BASE_URL = "/texture/ironskeleton/death";

export default class DeadSubStateMachine extends DirectionSubStateMachine {
  /**
   * 创建一个死亡子状态机的实例
   * @param {IronSkeletonStateMachine} fsm 铁骷髅角色的状态机
   */
  constructor(fsm: IronSkeletonStateMachine) {
    super(fsm);
    // 配置站立时朝向的相关的状态
    this.stateMachines.set(
      ENTITY_DIRECTION_ENUM.UP,
      new State(fsm, `${BASE_URL}/top`)
    );

    this.stateMachines.set(
      ENTITY_DIRECTION_ENUM.DOWN,
      new State(fsm, `${BASE_URL}/bottom`)
    );

    this.stateMachines.set(
      ENTITY_DIRECTION_ENUM.LEFT,
      new State(fsm, `${BASE_URL}/left`)
    );

    this.stateMachines.set(
      ENTITY_DIRECTION_ENUM.RIGHT,
      new State(fsm, `${BASE_URL}/right`)
    );
  }
}
