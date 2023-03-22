import {
  _decorator,
  Component,
  Sprite,
  UITransform,
  Animation,
  animation,
  AnimationClip,
  SpriteFrame,
} from "cc";
import { EVENT_ENUM } from "../../enums";
import EventManager from "../../runtime/EventManager";
import ResourceManager from "../../runtime/ResourceManager";
import { TILE_WIDTH, TILE_HEIGHT } from "../Stage/MapManager";
const { ccclass, property } = _decorator;

const ANIMATION_SPEED = 1 / 8; // 动画单帧时长(每一帧的时间,单位秒)

@ccclass("PlayerManager")
export class PlayerManager extends Component {
  async init() {
    // 创建精灵
    const sprite = this.addComponent(Sprite);
    // 设置精灵的大小模式为自定义
    sprite.sizeMode = Sprite.SizeMode.CUSTOM;
    // 引入UITransform组件,缩放到砖块大小
    const transform = this.getComponent(UITransform);
    transform.setContentSize(TILE_WIDTH*4, TILE_HEIGHT*4);

    // 加载主角图片资源
    const spriteFrames = await ResourceManager.instance.loadResDir(
      "/texture/player/idle/top",
      SpriteFrame
    );

    // 添加动画组件
    const animationComponent = this.addComponent(Animation);

    // 创建一个动画剪辑
    // 以下代码改写于官方文档
    // https://docs.cocos.com/creator/manual/zh/animation/use-animation-curve.html
    const animationClip = new AnimationClip();

    const track = new animation.ObjectTrack(); // 创建一个对象轨道
    track.path = new animation.TrackPath()
      .toComponent(Sprite)
      .toProperty("spriteFrame"); // 轨道的路径指向精灵组件,属性为spriteFrame

    // 整理动画资源为关键帧数组
    const frames: Array<[number, SpriteFrame]> = spriteFrames.map(
      (frame, index) => {
        return [index * ANIMATION_SPEED, frame]; // 对应到动画编辑器里,这个数组的含义为 [时间表, 变量]
      }
    );

    // 因为我们用的是ObjectTrack, 只有一个channel, 所以可以直接使用track.channel获取
    // 添加关键帧
    track.channel.curve.assignSorted(frames);

    animationClip.duration = frames.length * ANIMATION_SPEED; // 动画关键帧总数*动画帧率=整个动画剪辑的周期时长

    // 该动画为循环播放
    animationClip.wrapMode = AnimationClip.WrapMode.Loop;

    // 最后将轨道添加到动画剪辑以应用
    animationClip.addTrack(track);

    // 配置默认动画Clip
    animationComponent.defaultClip = animationClip;
    animationComponent.play(); // 加载时自动播放
  }
}
