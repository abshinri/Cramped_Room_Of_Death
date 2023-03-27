import { AnimationClip } from "cc";
import { SubStateMachine } from "./SubStateMachine";
import {
  ENTITY_DIRECTION_ENUM,
  DIRECTION_NUMBER_ENUM,
  FSM_PARAMS_NAME_ENUM,
} from "../enums";

/**
 * 方向和转弯的子状态机基类
 *
 * @export
 * @class DirectionSubStateMachine
 * @extends {SubStateMachine}
 */
export default class DirectionSubStateMachine extends SubStateMachine {
  
  /**
   * 改变方向时改变状态, 并且执行自身里的run方法
   *
   */
  run(): void {
    // 获取当前的方向值, 此处相关的初始化在PlayerManager中
    const value = this.fsm.getParams(FSM_PARAMS_NAME_ENUM.DIRECTION);
    this.currentState = this.stateMachines.get(
      DIRECTION_NUMBER_ENUM[value as number]
    );
  }
}
