import { AnimationClip } from "cc";
import { SubStateMachine } from "./SubStateMachine";
import {
  CHARACTER_DIRECTION_ENUM,
  DIRECTION_NUMBER_ENUM,
  FSM_PARAMS_NAME_ENUM,
} from "../enums";


/**
 * 专门控制方向的子状态机基类
 *
 * @export
 * @class DirectionSubStateMachine
 * @extends {SubStateMachine}
 */
export default class DirectionSubStateMachine extends SubStateMachine {
  run(): void {
    // 获取当前的方向值, 此处初始化在PlayerManager中
    const value = this.fsm.getParams(FSM_PARAMS_NAME_ENUM.DIRECTION);
    this.currentState = this.stateMachines.get(
      DIRECTION_NUMBER_ENUM[value as number]
    );
  }
}
