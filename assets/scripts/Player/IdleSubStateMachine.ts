import { AnimationClip } from "cc";
import State from "../../base/State";
import { StateMachine } from "../../base/StateMachine";
import DirectionSubStateMachine from "../../base/DirectionSubStateMachine";
import {
  CHARACTER_DIRECTION_ENUM,
  DIRECTION_NUMBER_ENUM,
  FSM_PARAMS_NAME_ENUM,
} from "../../enums";

const BASE_URL = "/texture/player/idle";

export default class IdleSubStateMachine extends DirectionSubStateMachine {
  /**
   * 创建一个左转子状态机的实例
   * @param {StateMachine} fsm
   */
  constructor(fsm: StateMachine) {
    super(fsm);
    // 配置左转相关的状态
    this.stateMachines.set(
      CHARACTER_DIRECTION_ENUM.UP,
      new State(fsm, `${BASE_URL}/top`, AnimationClip.WrapMode.Loop)
    );

    this.stateMachines.set(
      CHARACTER_DIRECTION_ENUM.DOWN,
      new State(fsm, `${BASE_URL}/bottom`, AnimationClip.WrapMode.Loop)
    );

    this.stateMachines.set(
      CHARACTER_DIRECTION_ENUM.LEFT,
      new State(fsm, `${BASE_URL}/left`, AnimationClip.WrapMode.Loop)
    );

    this.stateMachines.set(
      CHARACTER_DIRECTION_ENUM.RIGHT,
      new State(fsm, `${BASE_URL}/right`, AnimationClip.WrapMode.Loop)
    );
  }
}
