import {
  _decorator,
  Component,
  Event,
  AnimationClip,
  Animation,
  SpriteFrame,
} from "cc";
import State from "../../base/State";
import { FSM_PARAMS_NAME_ENUM, FSM_PARAMS_TYPE_ENUM } from "../../enums";
import { IParamsValue } from "../../interfaces";

import EventManager from "../../runtime/EventManager";
const { ccclass, property } = _decorator;

/**
 * 获取默认的Trigger类型的参数值
 * @returns {IParamsValue}
 */
export const getInitParamsTrigger = () => {
  return {
    type: FSM_PARAMS_TYPE_ENUM.TRIGGER,
    value: false,
  };
};

@ccclass("PlayerStateMachine")
export class PlayerStateMachine extends Component {
  private _currentState: State | null = null; // 当前状态
  params: Map<string, IParamsValue> = new Map(); // 状态机参数
  stateMachines: Map<string, State> = new Map(); // 所有的状态Map
  animationComponent: Animation | null = null; // 动画组件
  // 因为状态机改变的时候,会触发动画的切换,
  // 动画的切换涉及资源的加载,是一个异步的过程,所以这些异步操作我们需要放到一个返回值为SpriteFrame数组的Promise队列中,依次执行
  waitingList: Array<Promise<SpriteFrame[]>> = []; // 等待队列

  /**
   * 获取参数的值
   *
   * @param {string} paramsName
   * @returns {*}
   */
  getParams(paramsName: string) {
    if (this.params.has(paramsName)) {
      return this.params.get(paramsName).value;
    }
  }

  /**
   * 设置参数的值
   *
   * @param {string} paramsName
   * @param {(boolean | number)} value
   */
  setParams(paramsName: string, value: boolean | number) {
    if (this.params.has(paramsName)) {
      this.params.get(paramsName).value = value;
      console.log("setParams");
      console.log(paramsName, value);
      console.log(this.params);
      console.log(this.params.get(paramsName));
      this.run();
      // this.resetTrigger();
    }
  }
  /**
   * 获取当前状态
   *
   */
  get currentState() {
    return this._currentState;
  }

  /**
   * 设置当前状态
   *
   */
  set currentState(state: State | null) {
    this._currentState = state;
    this._currentState.run();
  }

  /**
   * 初始化参数Map
   *
   */
  initParams() {
    this.params.set(FSM_PARAMS_NAME_ENUM.IDLE, getInitParamsTrigger());
    this.params.set(FSM_PARAMS_NAME_ENUM.TURN_LEFT, getInitParamsTrigger());
  }

  /**
   * 重置所有的Trigger类型的参数
   * 每次触发一个值为true的Trigger类型的参数后,都应该重置所有的Trigger类型的参数
   * 否则,下一次触发的时候, 依次寻找第一个值为true的Trigger类型的参数,就会找到上一次触发的参数,导致状态机出现问题
   *
   */
  resetTrigger() {
    // 解构的时候使用_表示忽略该参数
    for (const [_, value] of this.params) {
      if (value.type === FSM_PARAMS_TYPE_ENUM.TRIGGER) {
        value.value = false;
      }
    }
  }

  /**
   * 初始化状态机Map
   *
   */
  initStateMachines() {
    this.stateMachines.set(
      FSM_PARAMS_NAME_ENUM.IDLE,
      new State(this, "/texture/player/idle/top", AnimationClip.WrapMode.Loop)
    );
    this.stateMachines.set(
      FSM_PARAMS_NAME_ENUM.TURN_LEFT,
      new State(this, "/texture/player/turnleft/top")
    );
  }

  /**
   * 初始化动画事件
   * 每次动画执行完后,应该执行一些操作,比如切换到另外一个状态
   */
  initAnimationEvent() {
    console.log("initAnimationEvent");
    this.animationComponent.on(Animation.EventType.FINISHED, () => {
      const animationName = this.animationComponent?.defaultClip?.name;
      // 如果路径中包含一下数组中的字符串,就在动画执行完后进入idle状态
      const idleList = ["turn"];
      console.log(Animation.EventType.FINISHED);
      console.log(animationName);
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
    switch (this.currentState) {
      case this.stateMachines.get(FSM_PARAMS_NAME_ENUM.TURN_LEFT):
        break;

      case this.stateMachines.get(FSM_PARAMS_NAME_ENUM.IDLE):
        if (this.params.get(FSM_PARAMS_NAME_ENUM.TURN_LEFT).value) {
          this.currentState = this.stateMachines.get(
            FSM_PARAMS_NAME_ENUM.TURN_LEFT
          );
        } else if (this.params.get(FSM_PARAMS_NAME_ENUM.IDLE).value) {
          this.currentState = this.stateMachines.get(FSM_PARAMS_NAME_ENUM.IDLE);
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
    this.initAnimationEvent();
    console.log(this.waitingList);
    await Promise.all(this.waitingList);
  }
}
