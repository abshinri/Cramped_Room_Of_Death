import { AnimationClip } from "cc";
import State from "../../base/State";
import { PlayerStateMachine } from "./PlayerStateMachine";
import DirectionSubStateMachine from "../../base/DirectionSubStateMachine";
import {
  ENTITY_DIRECTION_ENUM,
  DIRECTION_NUMBER_ENUM,
  FSM_PARAMS_NAME_ENUM,
} from "../../enums";

const BASE_URL = "/texture/player/idle";

export default class IdleSubStateMachine extends DirectionSubStateMachine {
  /**
   * 创建一个左转子状态机的实例
   * @param {PlayerStateMachine} fsm 玩家角色的状态机
   */
  constructor(fsm: PlayerStateMachine) {
    super(fsm);
    // 配置站立时朝向的相关的状态
    this.stateMachines.set(
      ENTITY_DIRECTION_ENUM.UP,
      new State(fsm, `${BASE_URL}/top`, AnimationClip.WrapMode.Loop)
    );

    this.stateMachines.set(
      ENTITY_DIRECTION_ENUM.DOWN,
      new State(fsm, `${BASE_URL}/bottom`, AnimationClip.WrapMode.Loop)
    );

    this.stateMachines.set(
      ENTITY_DIRECTION_ENUM.LEFT,
      new State(fsm, `${BASE_URL}/left`, AnimationClip.WrapMode.Loop)
    );

    this.stateMachines.set(
      ENTITY_DIRECTION_ENUM.RIGHT,
      new State(fsm, `${BASE_URL}/right`, AnimationClip.WrapMode.Loop)
    );
  }
}
