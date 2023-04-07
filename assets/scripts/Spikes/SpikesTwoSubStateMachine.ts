import State from "../../base/State";
import { SpikesStateMachine } from "./SpikesStateMachine";
import {
  SPIKES_STATE_ENUM,
} from "../../enums";
import SpikesSubStateMachine from "./SpikesSubStateMachine";

const BASE_URL = "/texture/spikes/spikestwo";

export default class SpikesTwoSubStateMachine extends SpikesSubStateMachine {
  /**
   * 创建一个二尖刺陷阱子状态机的实例
   * @param {SpikesStateMachine} fsm 尖刺陷阱的状态机
   */
  constructor(fsm: SpikesStateMachine) {
    super(fsm);
    // 配置尖刺各状态时的动画
    this.stateMachines.set(
      SPIKES_STATE_ENUM.ZERO,
      new State(fsm, `${BASE_URL}/zero`)
    );

    this.stateMachines.set(
      SPIKES_STATE_ENUM.ONE,
      new State(fsm, `${BASE_URL}/one`)
    );

    this.stateMachines.set(
      SPIKES_STATE_ENUM.TWO,
      new State(fsm, `${BASE_URL}/two`)
    );
    
    this.stateMachines.set(
      SPIKES_STATE_ENUM.THREE,
      new State(fsm, `${BASE_URL}/three`)
    );
  }
}
