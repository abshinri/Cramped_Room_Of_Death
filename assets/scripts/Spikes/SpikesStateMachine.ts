import { _decorator, Animation } from "cc";
import {
  getInitParamsTrigger,
  getInitParamsNumber,
  StateMachine,
} from "../../base/StateMachine";
import {
  ENTITY_STATE_ENUM,
  FSM_PARAMS_NAME_ENUM,
  FSM_PARAMS_TYPE_ENUM,
  SPIKES_TYPE_TO_NUMBER_ENUM,
} from "../../enums";
import Utils from "../Utils";
import { SpikesManager } from "./SpikesManager";
import State from "../../base/State";
import SpikesOneSubStateMachine from "./SpikesOneSubStateMachine";
const BASE_URL = "/texture/burst";
const { ccclass, property } = _decorator;

/**
 * 碎地板的状态机
 *
 * @export
 * @class SpikesStateMachine
 * @extends {StateMachine}
 */
@ccclass("SpikesStateMachine")
export class SpikesStateMachine extends StateMachine {
  /**
   * 初始化状态参数Map
   *
   */
  initParams() {
    this.params.set(
      FSM_PARAMS_NAME_ENUM.SPIKES_CUR_COUNT,
      getInitParamsNumber()
    );
    this.params.set(
      FSM_PARAMS_NAME_ENUM.SPIKES_TOTAL_COUNT,
      getInitParamsNumber()
    );
  }

  /**
   * 初始化状态机Map
   *
   */
  initStateMachines() {
    /** 站立动画状态机 */
    this.stateMachines.set(
      FSM_PARAMS_NAME_ENUM.SPIKES_ONE,
      new SpikesOneSubStateMachine(this)
    );
  }

  /**
   * 执行状态机
   * 执行的时候,在状态参数池中寻找值为true的状态,然后执行对应的状态机
   *
   */
  run() {
    // 当前尖刺总计数
    const spikesCount = this.params.get(
      FSM_PARAMS_NAME_ENUM.SPIKES_TOTAL_COUNT
    ).value;
    switch (this.currentState) {
      case this.stateMachines.get(FSM_PARAMS_NAME_ENUM.SPIKES_ONE): // 为1个尖刺的类型, 有两个状态, 一个是尖刺出现, 一个是尖刺消失
        if (
          spikesCount === SPIKES_TYPE_TO_NUMBER_ENUM.SPIKES_ONE
        ) {
          this.currentState = this.stateMachines.get(
            FSM_PARAMS_NAME_ENUM.SPIKES_ONE
          );
        } else {
          // 如果没有状态可以转换,就保持当前状态
          this.currentState = this.currentState;
        }
        break;
      default:
        this.currentState = this.stateMachines.get(
          FSM_PARAMS_NAME_ENUM.SPIKES_ONE
        );
        break;
    }
  }

  async init() {
    this.animationComponent = this.addComponent(Animation);
    this.initParams();
    this.initStateMachines();
    await Promise.all(this.waitingList);
  }
}
