import {
  _decorator,
  Component,
  Event,
  AnimationClip,
  Animation,
  SpriteFrame,
} from "cc";

import State from "db://assets/base/State";

import {
  FSM_PARAMS_NAME_ENUM,
  FSM_PARAMS_TYPE_ENUM,
} from "db://assets/enums/index";
import { IParamsValue } from "db://assets/interfaces/index";
import Utils, { CONSOLE_METHODS } from "../scripts/Utils";
import { SubStateMachine } from "./SubStateMachine";

const { ccclass, property } = _decorator;

/**
 * 获取默认的TRIGGER类型状态的参数值
 * @returns {IParamsValue}
 */
export const getInitParamsTrigger = () => {
  return {
    type: FSM_PARAMS_TYPE_ENUM.TRIGGER,
    value: false,
  };
};

/**
 * 获取默认的NUMBER类型状态的参数值
 * @returns {IParamsValue}
 */
export const getInitParamsNumber = () => {
  return {
    type: FSM_PARAMS_TYPE_ENUM.NUMBER,
    value: 0,
  };
};

/**
 * 角色状态机的基础类
 *
 * @export
 * @abstract
 * @class StateMachine
 * @extends {Component}
 */
@ccclass("StateMachine")
export abstract class StateMachine extends Component {
  private _currentState: State | SubStateMachine = null; // 当前状态
  params: Map<string, IParamsValue> = new Map(); // 状态机参数
  stateMachines: Map<string, State | SubStateMachine> = new Map(); // 所有的状态Map
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

      Utils.console(
        CONSOLE_METHODS.INFO,
        "StateMachine setParams() paramsName,value,this.params start",
        paramsName,
        value,
        this.params
      );
      this.run();
      this.resetTrigger();
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
  set currentState(state: State | SubStateMachine | null) {
    this._currentState = state;
    this._currentState.run();
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
   * 子类必须实现的初始化方法
   *
   * @abstract
   */
  abstract init(): void;

  /**
   * 子类必须实现的运行方法
   *
   * @abstract
   */
  abstract run(): void;
}
