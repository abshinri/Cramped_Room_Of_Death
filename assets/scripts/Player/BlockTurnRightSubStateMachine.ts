import DirectionSubStateMachine from "../../base/DirectionSubStateMachine";
import State from "../../base/State";
import { PlayerStateMachine } from "./PlayerStateMachine";

import {
  ENTITY_DIRECTION_ENUM,
} from "../../enums";

const BASE_URL = "/texture/player/blockturnright";

export default class BlockTurnRightSubStateMachine extends DirectionSubStateMachine {
  /**
   * 创建一个向右旋转时撞墙的动画子状态机的实例
   * @param {PlayerStateMachine} fsm
   */
  constructor(fsm: PlayerStateMachine) {
    super(fsm);
    // 配置向右旋转时撞墙的动画相关的状态
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
