import { _decorator } from "cc";
import { EnemyManager } from "../../base/EnemyManager";
import {
  EVENT_ENUM,
  ENTITY_STATE_ENUM,
} from "../../enums";
import DataManager from "../../runtime/DataManager";
import EventManager from "../../runtime/EventManager";
import { WoodenSkeletonStateMachine } from "./WoodenSkeletonStateMachine";
const { ccclass, property } = _decorator;

@ccclass("WoodenSkeletonManager")
export class WoodenSkeletonManager extends EnemyManager {
  async init(param) {
    this.fsm = this.addComponent(WoodenSkeletonStateMachine);
    await this.fsm.init();

    super.init(param);

    EventManager.instance.on(
      EVENT_ENUM.PLAYER_MOVE_END,
      this.attackPlayer,
      this
    );
  }

  /**
   * 攻击玩家
   * 如果玩家在敌人的攻击范围(一格范围)内, 则攻击玩家
   *
   * @returns {*}  {void}
   */
  attackPlayer(): void {
    if (this.state === ENTITY_STATE_ENUM.DEAD) return;
    if (!DataManager.instance.player) return;

    // 玩家每次结束移动, 改变敌人的朝向, 其实始终对着玩家
    const {
      x: playerX,
      y: playerY,
      state: playerState,
    } = DataManager.instance.player;

    // 如果玩家已经死亡, 则不攻击
    if (playerState === (ENTITY_STATE_ENUM.DEAD || ENTITY_STATE_ENUM.AIRDEAD)) {
      return;
    }

    // 计算玩家和敌人的x轴距离
    const disX = Math.abs(playerX - this.x);
    // 计算玩家和敌人的y轴距离
    const disY = Math.abs(playerY - this.y);

    if ((disX <= 1 && playerY == this.y) || (disY <= 1 && playerX == this.x)) {
      // 攻击玩家
      this.state = ENTITY_STATE_ENUM.ATTACK;
      EventManager.instance.emit(
        EVENT_ENUM.ATTACK_PLAYER,
        ENTITY_STATE_ENUM.DEAD
      );
    }
  }

  protected onDestroy(): void {
    super.onDestroy();
    EventManager.instance.off(
      EVENT_ENUM.PLAYER_MOVE_END,
      this.attackPlayer,
      this
    );
  }
}
