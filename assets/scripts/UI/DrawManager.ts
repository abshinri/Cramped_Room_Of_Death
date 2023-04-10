import { _decorator, Color, Component, Event, Graphics, view } from "cc";
import { CONTROL_ENUM, EVENT_ENUM, SCREEN_FADE_STATE_ENUM } from "../../enums";
import EventManager from "../../runtime/EventManager";
const { ccclass, property } = _decorator;
const SCREEN = view.getVisibleSize();

@ccclass("DrawManager")
export class DrawManager extends Component {
  private ctx: Graphics = null;
  private state: SCREEN_FADE_STATE_ENUM = SCREEN_FADE_STATE_ENUM.IDLE;
  init() {
    this.ctx = this.getComponent(Graphics);
    this.setAlpha(1);
  }

  setAlpha(alpha: number) {
    this.ctx.clear();
    this.ctx.rect(0, 0, SCREEN.width, SCREEN.height);
    this.ctx.fillColor = new Color(0, 0, 0, 255 * alpha);
    this.ctx.fill();
  }

  protected update(dt: number): void {
    switch (this.state) {
      case SCREEN_FADE_STATE_ENUM.IDLE:
        break;
      case SCREEN_FADE_STATE_ENUM.FADE_IN:
        this.setAlpha(0);
        this.setAlpha(this.ctx.fillColor.a / 255 - dt);
        if (this.ctx.fillColor.a / 255 <= 0) {
          this.state = SCREEN_FADE_STATE_ENUM.IDLE;
        }
        break;
      case SCREEN_FADE_STATE_ENUM.FADE_OUT:
        this.setAlpha(1);
        this.setAlpha(this.ctx.fillColor.a / 255 + dt);
        if (this.ctx.fillColor.a / 255 >= 1) {
          this.state = SCREEN_FADE_STATE_ENUM.IDLE;
        }
        break;
    }
  }
}
