import { _decorator, Animation } from "cc";
import {
  getInitParamsTrigger,
  getInitParamsNumber,
  StateMachine,
} from "../../base/StateMachine";
import { ENTITY_STATE_ENUM, FSM_PARAMS_NAME_ENUM } from "../../enums";
import Utils from "../Utils";
import AttackSubStateMachine from "./AttackSubStateMachine";
import BlockDownSubStateMachine from "./BlockDownSubStateMachine";
import BlockLeftSubStateMachine from "./BlockLeftSubStateMachine";
import BlockRightSubStateMachine from "./BlockRightSubStateMachine";
import BlockTurnLeftSubStateMachine from "./BlockTurnLeftSubStateMachine";
import BlockTurnRightSubStateMachine from "./BlockTurnRightSubStateMachine";
import BlockUpSubStateMachine from "./BlockUpSubStateMachine";
import DeadAirSubStateMachine from "./DeadAirSubStateMachine";
import DeadSubStateMachine from "./DeadSubStateMachine";
import IdleSubStateMachine from "./IdleSubStateMachine";
import { PlayerManager } from "./PlayerManager";
import TurnLeftSubStateMachine from "./TurnLeftSubStateMachine";
import TurnRightSubStateMachine from "./TurnRightSubStateMachine";

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
   * 初始化状态参数Map
   *
   */
  initParams() {
    this.params.set(FSM_PARAMS_NAME_ENUM.IDLE, getInitParamsTrigger());
    this.params.set(FSM_PARAMS_NAME_ENUM.TURN_LEFT, getInitParamsTrigger());
    this.params.set(FSM_PARAMS_NAME_ENUM.TURN_RIGHT, getInitParamsTrigger());
    this.params.set(FSM_PARAMS_NAME_ENUM.DIRECTION, getInitParamsNumber());

    /** 碰撞动画 */
    this.params.set(FSM_PARAMS_NAME_ENUM.BLOCK_UP, getInitParamsTrigger());
    this.params.set(FSM_PARAMS_NAME_ENUM.BLOCK_DOWN, getInitParamsTrigger());
    this.params.set(FSM_PARAMS_NAME_ENUM.BLOCK_LEFT, getInitParamsTrigger());
    this.params.set(FSM_PARAMS_NAME_ENUM.BLOCK_RIGHT, getInitParamsTrigger());

    /** 旋转碰撞动画 */
    this.params.set(
      FSM_PARAMS_NAME_ENUM.BLOCK_TURN_LEFT,
      getInitParamsTrigger()
    );
    this.params.set(
      FSM_PARAMS_NAME_ENUM.BLOCK_TURN_RIGHT,
      getInitParamsTrigger()
    );

    /** 攻击动画 */
    this.params.set(FSM_PARAMS_NAME_ENUM.ATTACK, getInitParamsTrigger());

    /** 死亡动画 */
    this.params.set(FSM_PARAMS_NAME_ENUM.DEAD, getInitParamsTrigger());
    this.params.set(FSM_PARAMS_NAME_ENUM.AIRDEAD, getInitParamsTrigger());
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
    /** 左转动画状态机 */
    this.stateMachines.set(
      FSM_PARAMS_NAME_ENUM.TURN_LEFT,
      new TurnLeftSubStateMachine(this)
    );
    /** 右转动画状态机 */
    this.stateMachines.set(
      FSM_PARAMS_NAME_ENUM.TURN_RIGHT,
      new TurnRightSubStateMachine(this)
    );

    /** 碰撞动画状态机 */
    this.stateMachines.set(
      FSM_PARAMS_NAME_ENUM.BLOCK_UP,
      new BlockUpSubStateMachine(this)
    );
    this.stateMachines.set(
      FSM_PARAMS_NAME_ENUM.BLOCK_DOWN,
      new BlockDownSubStateMachine(this)
    );
    this.stateMachines.set(
      FSM_PARAMS_NAME_ENUM.BLOCK_LEFT,
      new BlockLeftSubStateMachine(this)
    );
    this.stateMachines.set(
      FSM_PARAMS_NAME_ENUM.BLOCK_RIGHT,
      new BlockRightSubStateMachine(this)
    );
    this.stateMachines.set(
      FSM_PARAMS_NAME_ENUM.BLOCK_TURN_LEFT,
      new BlockTurnLeftSubStateMachine(this)
    );
    this.stateMachines.set(
      FSM_PARAMS_NAME_ENUM.BLOCK_TURN_RIGHT,
      new BlockTurnRightSubStateMachine(this)
    );

    /** 攻击动画状态机 */
    this.stateMachines.set(
      FSM_PARAMS_NAME_ENUM.ATTACK,
      new AttackSubStateMachine(this)
    );

    /** 死亡动画状态机 */
    this.stateMachines.set(
      FSM_PARAMS_NAME_ENUM.DEAD,
      new DeadSubStateMachine(this)
    );
    this.stateMachines.set(
      FSM_PARAMS_NAME_ENUM.AIRDEAD,
      new DeadAirSubStateMachine(this)
    );
    Utils.info(
      "PlayerStateMachine.initStateMachines()-end this.stateMachines",
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
      // 如果路径中包含以下字符串,就在动画执行完后进入idle状态
      const idleList = ["block", "turn", "attack"];
      if (idleList.some((item) => animationName?.includes(item))) {
        // this.setParams(FSM_PARAMS_NAME_ENUM.IDLE, true); // 这样是直接修改动画状态机了,为了项目更加耦合,我们统一用状态去驱动状态机
        // 通过Cococ的组件内置方法找到PlayerManager组件,然后改变其状态
        const playerManager = this.node.getComponent(PlayerManager);
        // const playerManager = this.node.getComponent(EntityManager); // 这样也可以,查一下文档
        playerManager.state = ENTITY_STATE_ENUM.IDLE;
      }
    });
  }

  /**
   * 执行状态机
   * 执行的时候,在状态参数池中寻找值为true的状态,然后执行对应的状态机
   *
   */
  run() {
    Utils.info(
      "PlayerStateMachine.run()-start this.currentState",
      this.currentState
    );

    switch (this.currentState) {
      case this.stateMachines.get(FSM_PARAMS_NAME_ENUM.IDLE):
      case this.stateMachines.get(FSM_PARAMS_NAME_ENUM.TURN_LEFT):
      case this.stateMachines.get(FSM_PARAMS_NAME_ENUM.TURN_RIGHT):
      case this.stateMachines.get(FSM_PARAMS_NAME_ENUM.BLOCK_UP):
      case this.stateMachines.get(FSM_PARAMS_NAME_ENUM.BLOCK_DOWN):
      case this.stateMachines.get(FSM_PARAMS_NAME_ENUM.BLOCK_LEFT):
      case this.stateMachines.get(FSM_PARAMS_NAME_ENUM.BLOCK_RIGHT):
      case this.stateMachines.get(FSM_PARAMS_NAME_ENUM.BLOCK_TURN_LEFT):
      case this.stateMachines.get(FSM_PARAMS_NAME_ENUM.BLOCK_TURN_RIGHT):
      case this.stateMachines.get(FSM_PARAMS_NAME_ENUM.ATTACK):
      case this.stateMachines.get(FSM_PARAMS_NAME_ENUM.DEAD):
      case this.stateMachines.get(FSM_PARAMS_NAME_ENUM.AIRDEAD):
        if (this.params.get(FSM_PARAMS_NAME_ENUM.BLOCK_UP).value) {
          this.currentState = this.stateMachines.get(
            FSM_PARAMS_NAME_ENUM.BLOCK_UP
          );
        } else if (this.params.get(FSM_PARAMS_NAME_ENUM.BLOCK_DOWN).value) {
          this.currentState = this.stateMachines.get(
            FSM_PARAMS_NAME_ENUM.BLOCK_DOWN
          );
        } else if (this.params.get(FSM_PARAMS_NAME_ENUM.BLOCK_LEFT).value) {
          this.currentState = this.stateMachines.get(
            FSM_PARAMS_NAME_ENUM.BLOCK_LEFT
          );
        } else if (this.params.get(FSM_PARAMS_NAME_ENUM.BLOCK_RIGHT).value) {
          this.currentState = this.stateMachines.get(
            FSM_PARAMS_NAME_ENUM.BLOCK_RIGHT
          );
        } else if (
          this.params.get(FSM_PARAMS_NAME_ENUM.BLOCK_TURN_RIGHT).value
        ) {
          this.currentState = this.stateMachines.get(
            FSM_PARAMS_NAME_ENUM.BLOCK_TURN_RIGHT
          );
        } else if (
          this.params.get(FSM_PARAMS_NAME_ENUM.BLOCK_TURN_LEFT).value
        ) {
          this.currentState = this.stateMachines.get(
            FSM_PARAMS_NAME_ENUM.BLOCK_TURN_LEFT
          );
        } else if (this.params.get(FSM_PARAMS_NAME_ENUM.TURN_LEFT).value) {
          this.currentState = this.stateMachines.get(
            FSM_PARAMS_NAME_ENUM.TURN_LEFT
          );
        } else if (this.params.get(FSM_PARAMS_NAME_ENUM.TURN_RIGHT).value) {
          this.currentState = this.stateMachines.get(
            FSM_PARAMS_NAME_ENUM.TURN_RIGHT
          );
        } else if (this.params.get(FSM_PARAMS_NAME_ENUM.ATTACK).value) {
          this.currentState = this.stateMachines.get(
            FSM_PARAMS_NAME_ENUM.ATTACK
          );
        } else if (this.params.get(FSM_PARAMS_NAME_ENUM.DEAD).value) {
          this.currentState = this.stateMachines.get(FSM_PARAMS_NAME_ENUM.DEAD);
        } else if (this.params.get(FSM_PARAMS_NAME_ENUM.AIRDEAD).value) {
          this.currentState = this.stateMachines.get(
            FSM_PARAMS_NAME_ENUM.AIRDEAD
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
      "PlayerStateMachine.run()-end this.currentState",
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
