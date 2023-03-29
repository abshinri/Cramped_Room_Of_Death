import { _decorator } from "cc";

import State from "db://assets/base/State";
import { StateMachine } from "./StateMachine";

/**
 * 子状态机的基础类
 *
 * @export
 * @abstract
 * @class SubStateMachine
 * @extends {Component}
 */

export abstract class SubStateMachine {
  private _currentState: State | null = null; // 当前状态
  stateMachines: Map<string, State> = new Map(); // 所有的状态Map

  constructor(public fsm: StateMachine) {
    this.fsm = fsm;
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
   * 子类必须实现的运行方法
   *
   * @abstract
   */
  abstract run(): void;
}
