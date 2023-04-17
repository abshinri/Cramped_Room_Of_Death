import { UITransform, _decorator } from "cc";
import {
  EVENT_ENUM,
  ENTITY_STATE_ENUM,
  ENTITY_DIRECTION_ENUM,
  CONTROL_ENUM,
} from "../../enums";
import DataManager from "../../runtime/DataManager";
import EventManager from "../../runtime/EventManager";
import { BurstStateMachine } from "./BurstStateMachine";
import { EntityManager } from "../../base/EntityManager";
import { TILE_HEIGHT, TILE_WIDTH } from "../Stage/TileManager";
const { ccclass, property } = _decorator;

@ccclass("BurstManager")
export class BurstManager extends EntityManager {
  async init(param) {
    this.fsm = this.addComponent(BurstStateMachine);
    await this.fsm.init();

    super.init(param);

    // 本素材不用放大到4倍,还原到与砖块一样大小
    const transform = this.getComponent(UITransform);
    transform.setContentSize(TILE_WIDTH, TILE_HEIGHT);
    EventManager.instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.broken, this);
  }

  /**
   * 碎裂
   * 玩家踩上去的时候开始碎裂
   *
   * @returns {*}  {void}
   */
  broken(): void {
    if (this.state === ENTITY_STATE_ENUM.DEAD) return;
    if (!DataManager.instance.player) return;

    const {
      realX: playerX,
      realY: playerY,
      state: playerState,
    } = DataManager.instance.player;

    // 如果玩家已经死亡, 则不攻击
    if (playerState === (ENTITY_STATE_ENUM.DEAD || ENTITY_STATE_ENUM.AIRDEAD)) {
      return;
    }

    // 如果和玩家坐标重叠
    if (
      this.x === playerX &&
      this.y === playerY &&
      playerState === ENTITY_STATE_ENUM.IDLE
    ) {
      if (this.state === ENTITY_STATE_ENUM.ATTACK) {
        // 碎裂时触发震动
        EventManager.instance.emit(
          EVENT_ENUM.SCREEN_SHAKE,
          ENTITY_DIRECTION_ENUM.DOWN,
          CONTROL_ENUM.DOWN
        );

        // 如果已经碎裂,触发彻底碎裂
        this.state = ENTITY_STATE_ENUM.DEAD;
        // 同时玩家掉落死亡
        EventManager.instance.emit(
          EVENT_ENUM.ATTACK_PLAYER,
          ENTITY_STATE_ENUM.AIRDEAD
        );
      } else {
        // 如果没有彻底碎裂,开始碎裂
        this.state = ENTITY_STATE_ENUM.ATTACK;
      }
    }
  }

  update(dt: number) {
    // 还原到与砖块一样大小,不需要其他的额外偏移
    this.node.setPosition(this.x * TILE_WIDTH, -this.y * TILE_HEIGHT);
  }

  protected onDestroy(): void {
    super.onDestroy();
    EventManager.instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.broken, this);
  }
}
