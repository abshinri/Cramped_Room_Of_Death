import {
  _decorator,
  Component,
  Event,
  AnimationClip,
  Animation,
  SpriteFrame,
} from "cc";
import State from "../../base/State";
import {
  getInitParamsTrigger,
  getInitParamsNumber,
  StateMachine,
} from "../../base/StateMachine";
import { FSM_PARAMS_NAME_ENUM, FSM_PARAMS_TYPE_ENUM } from "../../enums";
import Utils, { CONSOLE_METHODS } from "../Utils";
import IdleSubStateMachine from "./IdleSubStateMachine";
import TurnLeftSubStateMachine from "./TurnLeftSubStateMachine";

const { ccclass, property } = _decorator;

/**
 * 玩家角色的状态机
 *
 * @export
 * @class PlayerStateMachine
 * @extends {StateMachine}
 */
@ccclass("PlayerStateMachine")
export class PlayerStateMachine extends StateMachine {
  /**
   * 初始化参数Map
   *
   */
  initParams() {
    this.params.set(FSM_PARAMS_NAME_ENUM.IDLE, getInitParamsTrigger());
    this.params.set(FSM_PARAMS_NAME_ENUM.TURN_LEFT, getInitParamsTrigger());
    this.params.set(FSM_PARAMS_NAME_ENUM.DIRECTION, getInitParamsNumber());
  }

  /**
   * 初始化状态机Map
   *
   */
  initStateMachines() {
    this.stateMachines.set(
      FSM_PARAMS_NAME_ENUM.IDLE,
      new IdleSubStateMachine(this)
    );
    this.stateMachines.set(
      FSM_PARAMS_NAME_ENUM.TURN_LEFT,
      new TurnLeftSubStateMachine(this)
    );
    // this.stateMachines.set(
    //   FSM_PARAMS_NAME_ENUM.DIRECTION,
    //   new State(this, "/texture/player/turnleft/top")
    // );
    Utils.info(
      "PlayerStateMachine initStateMachines() this.stateMachines end",
      this.stateMachines
    );
  }

  /**
   * 初始化动画事件
   * 每次动画执行完后,应该执行一些操作,比如切换到另外一个状态
   */
  initAnimationEvent() {
    this.animationComponent.on(Animation.EventType.FINISHED, () => {
      const animationName = this.animationComponent?.defaultClip?.name;
      // 如果路径中包含一下数组中的字符串,就在动画执行完后进入idle状态
      const idleList = ["turn"];
      if (idleList.some((item) => animationName?.includes(item))) {
        this.setParams(FSM_PARAMS_NAME_ENUM.IDLE, true);
      }
    });
  }

  /**
   * 执行状态机
   * 执行的时候,根据当前状态,逐个检查是否有可转换的状态,如果有,就转换到该状态
   *
   */
  run() {
    Utils.info(
      "PlayerStateMachine run() this.currentState start",
      this.currentState
    );

    switch (this.currentState) {
      case this.stateMachines.get(FSM_PARAMS_NAME_ENUM.TURN_LEFT):
      case this.stateMachines.get(FSM_PARAMS_NAME_ENUM.IDLE):
        if (this.params.get(FSM_PARAMS_NAME_ENUM.TURN_LEFT).value) {
          this.currentState = this.stateMachines.get(
            FSM_PARAMS_NAME_ENUM.TURN_LEFT
          );
        } else if (this.params.get(FSM_PARAMS_NAME_ENUM.IDLE).value) {
          this.currentState = this.stateMachines.get(FSM_PARAMS_NAME_ENUM.IDLE);
        } else {
          // 如果没有状态可以转换,就保持当前状态
          this.currentState = this.currentState;
        }
        break;
      default:
        this.currentState = this.stateMachines.get(FSM_PARAMS_NAME_ENUM.IDLE);
        break;
    }

    Utils.info(
      "PlayerStateMachine run() this.currentState end",
      this.currentState
    );
  }

  async init() {
    this.animationComponent = this.addComponent(Animation);
    this.initParams();
    this.initStateMachines();
    this.initAnimationEvent();
    await Promise.all(this.waitingList);
  }
}
