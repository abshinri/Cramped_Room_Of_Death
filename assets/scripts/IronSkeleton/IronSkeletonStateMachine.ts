import { _decorator, Animation } from "cc";
import {
  getInitParamsTrigger,
  getInitParamsNumber,
  StateMachine,
} from "../../base/StateMachine";
import { ENTITY_STATE_ENUM, FSM_PARAMS_NAME_ENUM } from "../../enums";
import IdleSubStateMachine from "./IdleSubStateMachine";
import { IronSkeletonManager } from "./IronSkeletonManager";
import DeadSubStateMachine from "./DeadSubStateMachine";

const { ccclass, property } = _decorator;

/**
 * 铁骷髅角色的状态机
 *
 * @export
 * @class IronSkeletonStateMachine
 * @extends {StateMachine}
 */
@ccclass("IronSkeletonStateMachine")
export class IronSkeletonStateMachine extends StateMachine {
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
      new IdleSubStateMachine(this)
    );
    this.stateMachines.set(
      FSM_PARAMS_NAME_ENUM.DEAD,
      new DeadSubStateMachine(this)
    );
  }

  /**
   * 初始化动画事件
   * 每次动画执行完后,应该执行一些操作,比如切换到另外一个状态
   */
  initAnimationEvent() {
    this.animationComponent.on(Animation.EventType.FINISHED, () => {
      const animationName = this.animationComponent?.defaultClip?.name;
      // 如果路径中包含以下字符串,就在动画执行完后进入idle状态
      const idleList = ["attack"];
      if (idleList.some((item) => animationName?.includes(item))) {
        // this.setParams(FSM_PARAMS_NAME_ENUM.IDLE, true); // 这样是直接修改动画状态机了,为了项目更加耦合,我们统一用状态去驱动状态机
        // 通过Cococ的组件内置方法找到ironSkeletonManager组件,然后改变其状态
        const ironSkeletonManager = this.node.getComponent(IronSkeletonManager);
        // const ironSkeletonManager = this.node.getComponent(EntityManager); // 这样也可以,查一下文档
        ironSkeletonManager.state = ENTITY_STATE_ENUM.IDLE;
      }
    });
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
    this.initAnimationEvent();
    await Promise.all(this.waitingList);
  }
}
