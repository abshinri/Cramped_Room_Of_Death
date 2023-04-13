import { _decorator, Component, Event } from "cc";
import { CONTROL_ENUM, EVENT_ENUM } from "../../enums";
import EventManager from "../../runtime/EventManager";
import Utils from "../Utils";
const { ccclass, property } = _decorator;

@ccclass("MenuManager")
export class MenuManager extends Component {
  // 撤销
  handleUndo(event: Event, input: CONTROL_ENUM) {
    EventManager.instance.emit(EVENT_ENUM.REVOKE);
  }
}
