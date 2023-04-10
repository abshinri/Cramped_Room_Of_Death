import { _decorator } from "cc";
import { EntityManager } from "../../base/EntityManager";
import { SmokeStateMachine } from "./SmokeStateMachine";
import { IEntity } from "../../interfaces";
import { ENTITY_DIRECTION_ENUM, ENTITY_STATE_ENUM } from "../../enums";
import { TILE_WIDTH, TILE_HEIGHT } from "../Stage/TileManager";
const { ccclass, property } = _decorator;

@ccclass("SmokeManager")
export class SmokeManager extends EntityManager {
  async init(param: IEntity) {
    this.fsm = this.addComponent(SmokeStateMachine);
    await this.fsm.init();

    super.init(param);
  }
  // 重生
  respawn(x: number, y: number, direction: ENTITY_DIRECTION_ENUM) {
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.node.setPosition(
      this.x * TILE_WIDTH - TILE_WIDTH * 1.5,
      -this.y * TILE_HEIGHT + TILE_HEIGHT * 1.5
    );
    this.state = ENTITY_STATE_ENUM.IDLE;
  }
  protected onDestroy(): void {
    super.onDestroy();
  }
}
