import State, { ANIMATION_SPEED } from "../../base/State";
import { PlayerStateMachine } from "./PlayerStateMachine";
import DirectionSubStateMachine from "../../base/DirectionSubStateMachine";
import { CONTROL_ENUM, ENTITY_DIRECTION_ENUM } from "../../enums";
import { AnimationClip } from "cc";

const BASE_URL = "/texture/player/attack";

export default class AttackSubStateMachine extends DirectionSubStateMachine {
  /**
   * 创建一个攻击子状态机的实例
   * @param {PlayerStateMachine} fsm 玩家角色的状态机
   */
  constructor(fsm: PlayerStateMachine) {
    super(fsm);
    // 配置站立时朝向的相关的状态
    this.stateMachines.set(
      ENTITY_DIRECTION_ENUM.UP,
      new State(fsm, `${BASE_URL}/top`, AnimationClip.WrapMode.Normal, null, [
        {
          frame: ANIMATION_SPEED * 4,
          func: "onAttackShake",
          params: [CONTROL_ENUM.UP],
        },
      ])
    );

    this.stateMachines.set(
      ENTITY_DIRECTION_ENUM.DOWN,
      new State(
        fsm,
        `${BASE_URL}/bottom`,
        AnimationClip.WrapMode.Normal,
        null,
        [
          {
            frame: ANIMATION_SPEED * 4,
            func: "onAttackShake",
            params: [CONTROL_ENUM.DOWN],
          },
        ]
      )
    );

    this.stateMachines.set(
      ENTITY_DIRECTION_ENUM.LEFT,
      new State(fsm, `${BASE_URL}/left`, AnimationClip.WrapMode.Normal, null, [
        {
          frame: ANIMATION_SPEED * 4,
          func: "onAttackShake",
          params: [CONTROL_ENUM.LEFT],
        },
      ])
    );

    this.stateMachines.set(
      ENTITY_DIRECTION_ENUM.RIGHT,
      new State(fsm, `${BASE_URL}/right`, AnimationClip.WrapMode.Normal, null, [
        {
          frame: ANIMATION_SPEED * 4,
          func: "onAttackShake",
          params: [CONTROL_ENUM.RIGHT],
        },
      ])
    );
  }
}
