import { _decorator } from "cc";
import { EntityManager } from "../../base/EntityManager";
import {
  EVENT_ENUM,
  ENTITY_DIRECTION_ENUM,
  ENTITY_STATE_ENUM,
  ENTITY_TYPE_ENUM,
} from "../../enums";
import DataManager from "../../runtime/DataManager";
import EventManager from "../../runtime/EventManager";
import { DoorStateMachine } from "./DoorStateMachine";
import { IEntity } from "../../interfaces";
const { ccclass, property } = _decorator;

@ccclass("DoorManager")
export class DoorManager extends EntityManager {
  async init(param: IEntity) {
    this.fsm = this.addComponent(DoorStateMachine);
    await this.fsm.init();

    super.init(param);

    EventManager.instance.on(EVENT_ENUM.DOOR_OPEN, this.onDoorOpen, this);
  }

  /**
   * 敌人死光了才能开门
   *
   */
  onDoorOpen(): void {
    if (
      DataManager.instance.enemies.every(
        (enemy) => enemy.state === ENTITY_STATE_ENUM.DEAD
      ) &&
      this.state !== ENTITY_STATE_ENUM.DEAD
    ) {
      this.state = ENTITY_STATE_ENUM.DEAD;
    }
  }
  protected onDestroy(): void {
    EventManager.instance.off(EVENT_ENUM.DOOR_OPEN, this.onDoorOpen, this);
  }
}
