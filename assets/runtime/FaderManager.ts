import { Asset, Constructor, RenderRoot2D, director, resources } from "cc";
import Singleton from "../base/Singleton";
import { DrawManager } from "../scripts/UI/DrawManager";
import Utils from "../scripts/Utils";
import { SCREEN_FADE_STATE_ENUM } from "../enums";
/**
 * 转场控制器
 *
 * @export
 * @class FaderManager
 * @extends {Singleton}
 */
export default class FaderManager extends Singleton {
  static get instance() {
    return super.getInstance<FaderManager>();
  }

  private _fader: DrawManager = null;

  get fader() {
    if (!this._fader) {
      const root = Utils.createNode();
      root.addComponent(RenderRoot2D);
      const faderNode = Utils.createNode("fader", root);
      this._fader = faderNode.addComponent(DrawManager);
      this._fader.init();

      // 设置根节点root为常驻节点
      director.addPersistRootNode(root);
    }
    return this._fader;
  }

  fadeIn() {
    return this.fader.fadeIn();
  }

  fadeOut() {
    return this.fader.fadeOut();
  }
}
