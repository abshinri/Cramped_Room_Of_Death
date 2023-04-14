import {
  _decorator,
  BlockInputEvents,
  Color,
  Component,
  Event,
  game,
  Graphics,
  UITransform,
  view,
} from "cc";
import { CONTROL_ENUM, EVENT_ENUM, SCREEN_FADE_STATE_ENUM } from "../../enums";
import EventManager from "../../runtime/EventManager";
const { ccclass, property } = _decorator;
const SCREEN = view.getVisibleSize();
const FADE_DURATION = 200;
/**
 * 绘制渐入渐出的黑色遮罩
 *
 * @export
 * @class DrawManager
 * @extends {Component}
 */
@ccclass("DrawManager")
export class DrawManager extends Component {
  private ctx: Graphics = null;
  private _state: SCREEN_FADE_STATE_ENUM = SCREEN_FADE_STATE_ENUM.VISIBLE;
  private _duration: number = FADE_DURATION; // 渐入渐出的用时,单位毫秒ms
  private _startTime: number = 0; // 渐入渐出开始时间
  private fadeResolve: Function = null;
  private blockInput: BlockInputEvents = null; // 根据面积和位置专用于拦截用户输入的组件, 添加就生效
  init() {
    this.ctx = this.addComponent(Graphics);
    this.setAlpha(1);

    // 本节点本身就应该能够拦截用户输入, 把本节点覆盖的区域设置为全屏, 之后通过添加BlockInputEvents组件来拦截用户输入
    const uitransform = this.getComponent(UITransform);
    uitransform.setAnchorPoint(0.5, 0.5);
    uitransform.setContentSize(SCREEN.width, SCREEN.height);
  }

  // 设置全屏黑色遮罩的透明度
  setAlpha(alpha: number) {
    this.ctx.clear();
    this.ctx.rect(0, 0, SCREEN.width, SCREEN.height);
    this.ctx.fillColor = new Color(0, 0, 0, 255 * alpha);
    this.ctx.fill();
    // 根据透明度来决定是否拦截用户输入, 完全透明时不拦截
    if (alpha > 0) {
      if (!this.blockInput) {
        this.blockInput = this.addComponent(BlockInputEvents);
      }
    } else {
      if (this.blockInput) {
        this.blockInput.destroy();
        this.blockInput = null;
      }
    }
  }

  set state(state: SCREEN_FADE_STATE_ENUM) {
    this._state = state;
  }

  get state() {
    return this._state;
  }
  // 渐入游戏画面
  fadeIn(duration: number = FADE_DURATION) {
    this._duration = duration;
    this.setAlpha(1);
    this._state = SCREEN_FADE_STATE_ENUM.FADE_IN;
    this._startTime = game.totalTime;
    // TODO:整理此处逻辑
    // 因为动画的时长不确定, 通过Promise来确保渐入渐出动画结束后再执行后续逻辑
    // 这里的resolve函数我们保存在DrawManager的fadeResolve属性中
    // 当动画在update中结束时, 我们可以手动改变fadeResolve的状态为fulfilled, 从而触发后续逻辑
    return new Promise((resolve) => {
      this.fadeResolve = resolve;
    });
  }
  // 渐出游戏画面
  fadeOut(duration: number = FADE_DURATION) {
    this._duration = duration;
    this.setAlpha(0);
    this._state = SCREEN_FADE_STATE_ENUM.FADE_OUT;
    this._startTime = game.totalTime;
    return new Promise((resolve) => {
      this.fadeResolve = resolve;
    });
  }

  mask(duration: number = FADE_DURATION) {
    this._state = SCREEN_FADE_STATE_ENUM.INVISIBLE;
    this.setAlpha(1);
    return new Promise((resolve) => {
      setTimeout(resolve, duration);
    });
  }

  update(): void {
    /**
     * 计算渐入渐出的进度
     * 动画进度 =（当前游戏已经运行的总时间 - 动画开始时间）/ 用时
     * 进度范围：0~1, 同时对应渐入渐出的透明度
     * 进度=0时，动画刚开始
     * 进度=1时，动画结束
     */
    const progress = (game.totalTime - this._startTime) / this._duration;

    switch (this._state) {
      case SCREEN_FADE_STATE_ENUM.FADE_IN:
        //  渐入游戏画面
        if (progress < 1) {
          this.setAlpha(1 - progress);
        } else {
          this.setAlpha(0);
          this._state = SCREEN_FADE_STATE_ENUM.VISIBLE;
          this.fadeResolve(null);
        }
        break;
      case SCREEN_FADE_STATE_ENUM.FADE_OUT:
        //  渐出游戏画面
        if (progress < 1) {
          this.setAlpha(progress);
        } else {
          this.setAlpha(1);
          this._state = SCREEN_FADE_STATE_ENUM.INVISIBLE;
          this.fadeResolve(null);
        }
        break;
    }
  }
}
