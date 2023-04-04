import { _decorator, Animation } from "cc";
import {
  getInitParamsTrigger,
  getInitParamsNumber,
  StateMachine,
} from "../../base/StateMachine";
import { ENTITY_STATE_ENUM, FSM_PARAMS_NAME_ENUM } from "../../enums";
import Utils from "../Utils";
import { BurstManager } from "./BurstManager";
import State from "../../base/State";
const BASE_URL = "/texture/burst";
const { ccclass, property } = _decorator;

/**
 * 碎地板的状态机
 *
 * @export
 * @class BurstStateMachine
 * @extends {StateMachine}
 */
@ccclass("BurstStateMachine")
export class BurstStateMachine extends StateMachine {
  /**
   * 初始化状态参数Map
   *
   */
  initParams() {
    this.params.set(FSM_PARAMS_NAME_ENUM.IDLE, getInitParamsTrigger());
    this.params.set(FSM_PARAMS_NAME_ENUM.DEAD, getInitParamsTrigger());
    this.params.set(FSM_PARAMS_NAME_ENUM.ATTACK, getInitParamsTrigger());
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
      new State(this, `${BASE_URL}/idle`)
    );
    this.stateMachines.set(
      FSM_PARAMS_NAME_ENUM.DEAD,
      new State(this, `${BASE_URL}/death`)
    );
    this.stateMachines.set(
      FSM_PARAMS_NAME_ENUM.ATTACK,
      new State(this, `${BASE_URL}/attack`)
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
      case this.stateMachines.get(FSM_PARAMS_NAME_ENUM.ATTACK):
        if (this.params.get(FSM_PARAMS_NAME_ENUM.IDLE).value) {
          this.currentState = this.stateMachines.get(FSM_PARAMS_NAME_ENUM.IDLE);
        } else if (this.params.get(FSM_PARAMS_NAME_ENUM.DEAD).value) {
          this.currentState = this.stateMachines.get(FSM_PARAMS_NAME_ENUM.DEAD);
          break;
        } else if (this.params.get(FSM_PARAMS_NAME_ENUM.ATTACK).value) {
          this.currentState = this.stateMachines.get(
            FSM_PARAMS_NAME_ENUM.ATTACK
          );
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
