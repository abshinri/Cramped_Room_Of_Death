import { AnimationClip } from "cc";
import State from "../../base/State";
import { DoorStateMachine } from "./DoorStateMachine";
import DirectionSubStateMachine from "../../base/DirectionSubStateMachine";
import {
  ENTITY_DIRECTION_ENUM,
} from "../../enums";

const BASE_URL = "/texture/door/death";

export default class DeadSubStateMachine extends DirectionSubStateMachine {
  /**
   * 创建一个站立子状态机的实例
   * @param {DoorStateMachine} fsm 门的状态机
   */
  constructor(fsm: DoorStateMachine) {
    super(fsm);
    // 配置站立时朝向的相关的状态
    this.stateMachines.set(
      ENTITY_DIRECTION_ENUM.UP,
      new State(fsm, `${BASE_URL}`)
    );

    this.stateMachines.set(
      ENTITY_DIRECTION_ENUM.DOWN,
      new State(fsm, `${BASE_URL}`)
    );

    this.stateMachines.set(
      ENTITY_DIRECTION_ENUM.LEFT,
      new State(fsm, `${BASE_URL}`)
    );

    this.stateMachines.set(
      ENTITY_DIRECTION_ENUM.RIGHT,
      new State(fsm, `${BASE_URL}`)
    );
  }
}
