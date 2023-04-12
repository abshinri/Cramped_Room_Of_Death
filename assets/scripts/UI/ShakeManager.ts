import { _decorator, Component, Event, game, Vec2 } from "cc";
import { CONTROL_ENUM, ENTITY_DIRECTION_ENUM, EVENT_ENUM } from "../../enums";
import EventManager from "../../runtime/EventManager";
import Utils from "../Utils";
const { ccclass, property } = _decorator;

@ccclass("ShakeManager")
export class ShakeManager extends Component {
  private isShaking = false;
  private startTime = 0;
  private startPosition: Vec2 = new Vec2(0, 0);
  private playerDirection: ENTITY_DIRECTION_ENUM;
  private playerInput: CONTROL_ENUM;
  init() {
    EventManager.instance.on(EVENT_ENUM.SCREEN_SHAKE, this.onShake, this);
  }

  stopShake() {
    this.isShaking = false;
    this.node.setPosition(this.startPosition.x, this.startPosition.y);
  }

  onShake(direction: ENTITY_DIRECTION_ENUM, input: CONTROL_ENUM) {
    if (this.isShaking) {
      return;
    }
    this.playerDirection = direction;
    this.playerInput = input;
    // 开始震动, 记录开始时间, 屏幕的初始位置
    this.startTime = game.totalTime;
    this.startPosition = new Vec2(this.node.position.x, this.node.position.y);
    this.isShaking = true;
  }

  protected update(dt: number): void {
    if (this.isShaking) {
      // 状态为震动时, 使用正弦函数计算屏幕的位置
      const duration = 200; // 持续时间
      const range = 30; // 值域
      const frequency = 20; // 影响频率的值
      const currentTime = game.totalTime - this.startTime; // 动画已经持续的时间
      // 计算当前的振幅
      const amplitude =
        range * Math.sin((currentTime / duration / 1000) * frequency * Math.PI);

      let amplitudeX = 0;
      let amplitudeY = 0;
      // 根据玩家的方向和输入, 计算偏移量

      switch (this.playerInput) {
        case CONTROL_ENUM.UP:
          amplitudeY = amplitude;
          break;
        case CONTROL_ENUM.DOWN:
          amplitudeY = -amplitude;
          break;
        case CONTROL_ENUM.LEFT:
          amplitudeX = -amplitude;
          break;
        case CONTROL_ENUM.RIGHT:
          amplitudeX = amplitude;
          break;
        case CONTROL_ENUM.TURN_LEFT:
          if (this.playerDirection === ENTITY_DIRECTION_ENUM.UP) {
            amplitudeX = -amplitude;
          } else if (this.playerDirection === ENTITY_DIRECTION_ENUM.DOWN) {
            amplitudeX = amplitude;
          } else if (this.playerDirection === ENTITY_DIRECTION_ENUM.LEFT) {
            amplitudeY = -amplitude;
          } else if (this.playerDirection === ENTITY_DIRECTION_ENUM.RIGHT) {
            amplitudeY = amplitude;
          }
          break;
        case CONTROL_ENUM.TURN_RIGHT:
          if (this.playerDirection === ENTITY_DIRECTION_ENUM.UP) {
            amplitudeX = amplitude;
          } else if (this.playerDirection === ENTITY_DIRECTION_ENUM.DOWN) {
            amplitudeX = -amplitude;
          } else if (this.playerDirection === ENTITY_DIRECTION_ENUM.LEFT) {
            amplitudeY = amplitude;
          } else if (this.playerDirection === ENTITY_DIRECTION_ENUM.RIGHT) {
            amplitudeY = -amplitude;
          }
          break;
      }

      // 设置偏移
      this.node.setPosition(
        this.node.position.x + amplitudeX,
        this.startPosition.y + amplitudeY * 2
      );

      // 如果动画时间大于定义的持续时间, 则停止震动, 并将屏幕位置重置
      if (currentTime > duration) {
        this.isShaking = false;
        this.node.setPosition(this.startPosition.x, this.startPosition.y);
      }
    }
  }

  onDestroy() {
    EventManager.instance.off(EVENT_ENUM.SCREEN_SHAKE, this.onShake, this);
  }
}
