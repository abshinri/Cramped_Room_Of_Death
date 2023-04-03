import { _decorator, Animation } from "cc";
import {
  getInitParamsTrigger,
  getInitParamsNumber,
  StateMachine,
} from "../../base/StateMachine";
import { ENTITY_STATE_ENUM, FSM_PARAMS_NAME_ENUM } from "../../enums";
import Utils from "../Utils";
import IdleSubStateMachine from "./IdleSubStateMachine";
import DeadSubStateMachine from "./DeadSubStateMachine";

const { ccclass, property } = _decorator;

/**
 * 门的状态机
 *
 * @export
 * @class DoorStateMachine
 * @extends {StateMachine}
 */
@ccclass("DoorStateMachine")
export class DoorStateMachine extends StateMachine {
  /**
   * 初始化状态参数Map
   *
   */
  initParams() {
    this.params.set(FSM_PARAMS_NAME_ENUM.IDLE, getInitParamsTrigger());
    this.params.set(FSM_PARAMS_NAME_ENUM.DEAD, getInitParamsTrigger());
    this.params.set(FSM_PARAMS_NAME_ENUM.DIRECTION, getInitParamsNumber());
  }

  /**
   * 初始化状态机Map
   *
   */
  initStateMachines() {
    /** 站立动画状态机 */
    this.stateMachines.set(
      FSM_PARAMS_NAME_ENUM.IDLE,
      new IdleSubStateMachine(this)
    );
    this.stateMachines.set(
      FSM_PARAMS_NAME_ENUM.DEAD,
      new DeadSubStateMachine(this)
    );
  }


  /**
   * 执行状态机
   * 执行的时候,在状态参数池中寻找值为true的状态,然后执行对应的状态机
   *
   */
  run() {
    switch (this.currentState) {
      case this.stateMachines.get(FSM_PARAMS_NAME_ENUM.DEAD):
      case this.stateMachines.get(FSM_PARAMS_NAME_ENUM.IDLE):
        if (this.params.get(FSM_PARAMS_NAME_ENUM.IDLE).value) {
          this.currentState = this.stateMachines.get(FSM_PARAMS_NAME_ENUM.IDLE);
        } else if (this.params.get(FSM_PARAMS_NAME_ENUM.DEAD).value) {
          this.currentState = this.stateMachines.get(FSM_PARAMS_NAME_ENUM.DEAD);
          break;
        } else {
          // 如果没有状态可以转换,就保持当前状态
          this.currentState = this.currentState;
        }
        break;
      default:
        this.currentState = this.stateMachines.get(FSM_PARAMS_NAME_ENUM.IDLE);
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
