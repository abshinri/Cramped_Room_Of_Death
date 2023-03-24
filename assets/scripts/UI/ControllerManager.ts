import { _decorator, Component, Event } from "cc";
import { CONTROL_ENUM, EVENT_ENUM } from "../../enums";
import EventManager from "../../runtime/EventManager";
import Utils from "../Utils";
const { ccclass, property } = _decorator;

@ccclass("ControllerManager")
export class ControllerManager extends Component {
  // 接受玩家操作
  handleController(event: Event, input: CONTROL_ENUM) {
    Utils.info("ControllerManager handleController() input", input);
    EventManager.instance.emit(EVENT_ENUM.PLAYER_CONTROL, input);
  }
}
