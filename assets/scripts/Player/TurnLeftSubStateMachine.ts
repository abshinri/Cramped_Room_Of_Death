import { AnimationClip } from "cc";
import State from "../../base/State";
import { StateMachine } from "../../base/StateMachine";
import { SubStateMachine } from "../../base/SubStateMachine";
import {
  CHARACTER_DIRECTION_ENUM,
  DIRECTION_NUMBER_ENUM,
  FSM_PARAMS_NAME_ENUM,
} from "../../enums";

const BASE_URL = "/texture/player/turnleft";

export default class TurnLeftSubStateMachine extends SubStateMachine {
  /**
   * 创建一个左转子状态机的实例
   * @param {StateMachine} fsm
   */
  constructor(fsm: StateMachine) {
    super(fsm);
    // 配置左转相关的状态
    this.stateMachines.set(
      CHARACTER_DIRECTION_ENUM.UP,
      new State(fsm, `${BASE_URL}/top`)
    );

    this.stateMachines.set(
      CHARACTER_DIRECTION_ENUM.DOWN,
      new State(fsm, `${BASE_URL}/bottom`)
    );

    this.stateMachines.set(
      CHARACTER_DIRECTION_ENUM.LEFT,
      new State(fsm, `${BASE_URL}/left`)
    );

    this.stateMachines.set(
      CHARACTER_DIRECTION_ENUM.RIGHT,
      new State(fsm, `${BASE_URL}/right`)
    );
  }
  run(): void {
    // 获取当前的方向值, 此处初始化在PlayerManager中
    const value = this.fsm.getParams(FSM_PARAMS_NAME_ENUM.DIRECTION);
    this.currentState = this.stateMachines.get(
      DIRECTION_NUMBER_ENUM[value as number]
    );
  }
}
