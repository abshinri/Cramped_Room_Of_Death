import { _decorator, Component, director, Event, Node } from "cc";
import { SCENE_ENUM } from "../../enums";
import FaderManager from "../../runtime/FaderManager";
const { ccclass, property } = _decorator;

@ccclass("StartManager")
export class StartManager extends Component {
  protected onLoad(): void {
    FaderManager.instance.fadeIn(1000);
    this.node.once(Node.EventType.TOUCH_END, this.onTouchEnd, this);
  }
  async onTouchEnd(event: Event) {
    await FaderManager.instance.fadeOut(1000);
    director.loadScene(SCENE_ENUM.BATTLE);
  }
}
