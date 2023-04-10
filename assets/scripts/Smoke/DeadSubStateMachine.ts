import State from "../../base/State";
import { SmokeStateMachine } from "./SmokeStateMachine";
import DirectionSubStateMachine from "../../base/DirectionSubStateMachine";
import { ENTITY_DIRECTION_ENUM } from "../../enums";

// 用门的空图片作为代替
const BASE_URL = "/texture/door/death";

export default class IdleSubStateMachine extends DirectionSubStateMachine {
  /**
   * 创建一个烟结束子状态机的实例
   * @param {SmokeStateMachine} fsm 烟的状态机
   */
  constructor(fsm: SmokeStateMachine) {
    super(fsm);
    // 配置烟结束时朝向的相关的状态
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
