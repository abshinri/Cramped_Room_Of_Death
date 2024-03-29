import { animation, AnimationClip, Sprite, SpriteFrame } from "cc";
import ResourceManager from "../runtime/ResourceManager";
import Utils from "../scripts/Utils";
import { StateMachine } from "./StateMachine";
export const ANIMATION_SPEED = 1 / 8; // 动画单帧时长(每一帧的时间,单位秒)
/**
 * 状态的基础类
 *
 * @export
 * @class State
 */

export default class State {
  // 不管什么状态下, 都应该能创建并播放对应的动画
  private animationClip: AnimationClip | null = null; // 动画剪辑
  /**
   * 创建一个状态的实例对象
   * 创建的同时配置好私有属性
   * @param {StateMachine} fsm 当前的状态机
   * @param {string} path 动画资源路径
   * @param {AnimationClip.WrapMode} [wrapMode = AnimationClip.WrapMode.Normal] 动画播放模式,默认只播放一次
   * @param {number} [speed = ANIMATION_SPEED] 动画播放速度,默认为1/8
   */
  constructor(
    private fsm: StateMachine, // 当前的状态机引用, 方便拿到实例的动画控制器组件
    private path: string,
    private wrapMode: AnimationClip.WrapMode = AnimationClip.WrapMode.Normal,
    private speed: number | null = null,
    private event: AnimationClip.IEvent[] = [] // 用于储存动画的帧事件
  ) {
    this.init();
  }

  /**
   * 状态的运行方法, 用于切换动画资源
   *
   */
  run() {
    // 动画播放不重复
    if (
      this.fsm.animationComponent?.defaultClip?.name ===
      this.animationClip?.name
    )
      return;
    this.fsm.animationComponent.defaultClip = this.animationClip;
    this.fsm.animationComponent.play();
  }

  async init() {
    // 加载图片资源
    // 放到状态机里的执行列表里
    const promise = ResourceManager.instance.loadResDir(this.path, SpriteFrame);
    this.fsm.waitingList.push(promise);
    const spriteFrames = await promise;
    // 创建一个动画剪辑
    // 以下代码改写于官方文档
    // https://docs.cocos.com/creator/manual/zh/animation/use-animation-curve.html
    this.animationClip = new AnimationClip();

    const track = new animation.ObjectTrack(); // 创建一个对象轨道

    this.animationClip.name = this.path; // 动画剪辑的名字为资源路径,可以确保唯一性
    track.path = new animation.TrackPath()
      .toComponent(Sprite)
      .toProperty("spriteFrame"); // 轨道的路径指向精灵组件,属性为spriteFrame

    // 整理动画资源为关键帧数组
    // 因为资源的加载为异步,可能拿到的资源顺序不一致,所以需要对资源进行排序
    const frames: Array<[number, SpriteFrame]> = Utils.sortSpriteFrames(
      spriteFrames
    ).map((frame, index) => {
      return [index * ANIMATION_SPEED, frame]; // 对应到动画编辑器里,这个数组的含义为 [时间表, 变量]
    });

    // 因为我们用的是ObjectTrack, 只有一个channel, 所以可以直接使用track.channel获取
    // 添加关键帧
    track.channel.curve.assignSorted(frames);

    this.animationClip.duration = frames.length * ANIMATION_SPEED; // 动画关键帧总数*动画帧率=整个动画剪辑的周期时长

    // 最后将轨道添加到动画剪辑以应用
    this.animationClip.addTrack(track);

    // 该动画为循环播放
    this.animationClip.wrapMode = this.wrapMode;

    this.animationClip.events = this.event;

    if (this.speed) {
      this.animationClip.speed = this.animationClip.speed * this.speed;
    }
  }
}
