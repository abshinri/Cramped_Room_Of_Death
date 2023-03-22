import { _decorator, Component } from "cc";
import { EVENT_ENUM } from "../../enums";
import EventManager from "../../runtime/EventManager";
const { ccclass, property } = _decorator;

@ccclass("ControllerManager")
export class ControllerManager extends Component {
  handleController() {
    EventManager.instance.emit(EVENT_ENUM.NEXT_LEVEL);
  }
}
