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
import SpikesFourSubStateMachine from "./SpikesFourSubStateMachine";
import SpikesThreeSubStateMachine from "./SpikesThreeSubStateMachine";
import SpikesTwoSubStateMachine from "./SpikesTwoSubStateMachine";
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
    /** 各种尖刺的动画状态机 */
    this.stateMachines.set(
      FSM_PARAMS_NAME_ENUM.SPIKES_ONE,
      new SpikesOneSubStateMachine(this)
    );
    this.stateMachines.set(
      FSM_PARAMS_NAME_ENUM.SPIKES_TWO,
      new SpikesTwoSubStateMachine(this)
    );
    this.stateMachines.set(
      FSM_PARAMS_NAME_ENUM.SPIKES_THREE,
      new SpikesThreeSubStateMachine(this)
    );
    this.stateMachines.set(
      FSM_PARAMS_NAME_ENUM.SPIKES_FOUR,
      new SpikesFourSubStateMachine(this)
    );
  }
  /**
   * 初始化动画事件
   * 每次动画执行完后,应该执行一些操作,比如切换到另外一个状态
   */
  initAnimationEvent() {
    this.animationComponent.on(Animation.EventType.FINISHED, () => {
      const animationName = this.animationComponent?.defaultClip?.name;
      const spikesType = this.params.get(
        FSM_PARAMS_NAME_ENUM.SPIKES_TOTAL_COUNT
      ).value;
      if (
        (spikesType === SPIKES_TYPE_TO_NUMBER_ENUM.SPIKES_ONE &&
          animationName.includes("spikesone/two")) ||
        (spikesType === SPIKES_TYPE_TO_NUMBER_ENUM.SPIKES_TWO &&
          animationName.includes("spikestwo/three")) ||
        (spikesType === SPIKES_TYPE_TO_NUMBER_ENUM.SPIKES_THREE &&
          animationName.includes("spikesthree/four")) ||
        (spikesType === SPIKES_TYPE_TO_NUMBER_ENUM.SPIKES_FOUR &&
          animationName.includes("spikesfour/five"))
      ) {
        this.node.getComponent(SpikesManager)?.resetState();
      }
    });
  }

  /**
   * 执行状态机
   * 执行的时候,在状态参数池中寻找值为true的状态,然后执行对应的状态机
   *
   */
  run() {
    // 当前尖刺总计数,同时也能表示当前尖刺的类型
    // 如果是1个尖刺的陷阱,那么就是存在尖刺放出,尖刺收回,尖刺准备放出的三个个状态
    // 如果是2个尖刺的陷阱,那么就是存在尖刺放出,两个尖刺收回,尖刺准备放出共四个状态,以此类推
    const spikesType = this.params.get(
      FSM_PARAMS_NAME_ENUM.SPIKES_TOTAL_COUNT
    ).value;
    switch (this.currentState) {
      case this.stateMachines.get(FSM_PARAMS_NAME_ENUM.SPIKES_ONE): // 为1个尖刺的类型, 有三个状态, 一个是尖刺出现,一个是尖刺准备出现 一个是尖刺消失
      case this.stateMachines.get(FSM_PARAMS_NAME_ENUM.SPIKES_TWO): // 为2个尖刺的类型, 有四个状态, 一个是尖刺出现,一个是尖刺准备出现 二个是尖刺消失
      case this.stateMachines.get(FSM_PARAMS_NAME_ENUM.SPIKES_THREE): // 为3个尖刺的类型, 有五个状态, 一个是尖刺出现,一个是尖刺准备出现 三个是尖刺消失
      case this.stateMachines.get(FSM_PARAMS_NAME_ENUM.SPIKES_FOUR): // 为4个尖刺的类型, 有六个状态, 一个是尖刺出现,一个是尖刺准备出现 四个是尖刺消失
        if (spikesType === SPIKES_TYPE_TO_NUMBER_ENUM.SPIKES_ONE) {
          // 此时 spikesType===SPIKES_TYPE_TO_NUMBER_ENUM.SPIKES_ONE===2,类型为一尖刺陷阱
          this.currentState = this.stateMachines.get(
            FSM_PARAMS_NAME_ENUM.SPIKES_ONE
          );
        } else if (spikesType === SPIKES_TYPE_TO_NUMBER_ENUM.SPIKES_TWO) {
          // 此时 spikesType===SPIKES_TYPE_TO_NUMBER_ENUM.SPIKES_TWO===3,类型为二尖刺陷阱
          this.currentState = this.stateMachines.get(
            FSM_PARAMS_NAME_ENUM.SPIKES_TWO
          );
        } else if (spikesType === SPIKES_TYPE_TO_NUMBER_ENUM.SPIKES_THREE) {
          // 此时 spikesType===SPIKES_TYPE_TO_NUMBER_ENUM.SPIKES_THREE===4,类型为三尖刺陷阱
          this.currentState = this.stateMachines.get(
            FSM_PARAMS_NAME_ENUM.SPIKES_THREE
          );
        } else if (spikesType === SPIKES_TYPE_TO_NUMBER_ENUM.SPIKES_FOUR) {
          // 此时 spikesType===SPIKES_TYPE_TO_NUMBER_ENUM.SPIKES_FOUR===5,类型为四尖刺陷阱
          this.currentState = this.stateMachines.get(
            FSM_PARAMS_NAME_ENUM.SPIKES_FOUR
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
    this.initAnimationEvent();
    await Promise.all(this.waitingList);
  }
}
