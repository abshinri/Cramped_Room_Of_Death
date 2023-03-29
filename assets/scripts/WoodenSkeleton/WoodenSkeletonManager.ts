import { Vec2, _decorator } from "cc";
import { EntityManager } from "../../base/EntityManager";
import {
  CONTROL_ENUM,
  EVENT_ENUM,
  ENTITY_DIRECTION_ENUM,
  ENTITY_STATE_ENUM,
  ENTITY_TYPE_ENUM,
  ENTITY_DIRECTION_TO_BLOCK_ENUM,
  FSM_PARAMS_NAME_ENUM,
} from "../../enums";
import DataManager from "../../runtime/DataManager";
import EventManager from "../../runtime/EventManager";
import { TileManager } from "../Stage/TileManager";
import Utils from "../Utils";
import { WoodenSkeletonMachine } from "./WoodenSkeletonMachine";
const { ccclass, property } = _decorator;

@ccclass("WoodenSkeletonManager")
export class WoodenSkeletonManager extends EntityManager {
  async init() {

    this.fsm = this.addComponent(WoodenSkeletonMachine);
    await this.fsm.init();

    super.init({
      x: 7,
      y: 7,
      state: ENTITY_STATE_ENUM.IDLE,
      direction: ENTITY_DIRECTION_ENUM.UP,
      type: ENTITY_TYPE_ENUM.PLAYER,
    });

    // 初始化状态为IDLE
    this.state = ENTITY_STATE_ENUM.IDLE;
    // 初始化方向为UP
    this.direction = ENTITY_DIRECTION_ENUM.UP;

    Utils.info(
      "WoodenSkeletonManager.init()-end DataManager.instance.tiles",
      DataManager.instance.tiles
    );
  }
}
