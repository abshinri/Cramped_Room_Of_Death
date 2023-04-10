import { AnimationClip } from "cc";
import State from "../../base/State";
import { SmokeStateMachine } from "./SmokeStateMachine";
import DirectionSubStateMachine from "../../base/DirectionSubStateMachine";
import { ENTITY_DIRECTION_ENUM } from "../../enums";

const BASE_URL = "/texture/smoke/idle";

export default class IdleSubStateMachine extends DirectionSubStateMachine {
  /**
   * 创建一个烟子状态机的实例
   * @param {SmokeStateMachine} fsm 门的状态机
   */
  constructor(fsm: SmokeStateMachine) {
    super(fsm);
    // 配置烟时朝向的相关的状态
    this.stateMachines.set(
      ENTITY_DIRECTION_ENUM.UP,
      new State(fsm, `${BASE_URL}/top`, AnimationClip.WrapMode.Normal, 1.5)
    );

    this.stateMachines.set(
      ENTITY_DIRECTION_ENUM.DOWN,
      new State(fsm, `${BASE_URL}/bottom`, AnimationClip.WrapMode.Normal, 1.5)
    );

    this.stateMachines.set(
      ENTITY_DIRECTION_ENUM.LEFT,
      new State(fsm, `${BASE_URL}/left`, AnimationClip.WrapMode.Normal, 1.5)
    );

    this.stateMachines.set(
      ENTITY_DIRECTION_ENUM.RIGHT,
      new State(fsm, `${BASE_URL}/right`, AnimationClip.WrapMode.Normal, 1.5)
    );
  }
}
