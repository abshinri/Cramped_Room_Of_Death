import { _decorator, Component, director, ProgressBar, resources } from "cc";
import { SCENE_ENUM } from "../../enums";
const { ccclass, property } = _decorator;

@ccclass("LoadingManager")
export class LoadingManager extends Component {
  @property({ type: ProgressBar })
  bar: ProgressBar = null;
  protected onLoad(): void {
    // 预加载资源, 重载方法
    resources.preloadDir(
      "texture",
      (completedCount, totalCount) => {
        this.bar.progress = completedCount / totalCount;
      },
      (err) => {
        // 如果加载完成, 跳转到菜单
        if (!err) {
          director.loadScene(SCENE_ENUM.START);
        }
      }
    );
  }
}
