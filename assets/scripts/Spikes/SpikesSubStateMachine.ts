import {
  FSM_PARAMS_NAME_ENUM,
  SPIKES_STATE_TO_NUMBER_ENUM,
} from "../../enums";
import { SubStateMachine } from "../../base/SubStateMachine";

export default class SpikesSubStateMachine extends SubStateMachine {
  run(): void {
    // 获取尖刺陷阱当前的状态
    const value = this.fsm.getParams(FSM_PARAMS_NAME_ENUM.SPIKES_CUR_COUNT);
    this.currentState = this.stateMachines.get(
      SPIKES_STATE_TO_NUMBER_ENUM[value as number]
    );
  }
}
