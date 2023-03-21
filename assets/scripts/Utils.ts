import { resources, Asset, Constructor, Node, Layers, UITransform } from "cc";
// 一些工具方法
export default class Utils {
  /**
   * 生成随机数
   * @param min 最小值
   * @param max 最大值
   */
  static random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  /**
   * 加载文件夹资源,返回一个Promise
   *
   * @static
   * @template T
   * @param {string} path
   * @param {(Constructor<T> | null)} [type]
   * @returns {*}  {Promise<T[]>}
   */
  public static loadResDir<T extends Asset>(
    path: string,
    type?: Constructor<T> | null
  ): Promise<T[]> {
    return new Promise<T[]>((resolve, reject) => {
      resources.loadDir(path, type, (err, asset) => {
        if (err) {
          reject(err);
        } else {
          resolve(asset);
        }
      });
    });
  }
  /**
   * 创建一个Node,默认设置好常用的属性
   *
   * @static
   * @param {string} [name]
   * @param {Node} [parent]
   * @returns {Node}
   */
  public static createNode(name?: string, parent?: Node): Node {
    const node = new Node(name);
    if (parent) node.setParent(parent);
        // 因为我们是手动创建的砖块,没有经过场景编辑器,所以需要手动配置砖块的Layer
    // 我们创建的是一个纯2D游戏,所以我们只需要配置砖块的Layer为UI_2D即可
    node.layer = Layers.Enum.UI_2D;
    const ui_transform = node.addComponent(UITransform);
    ui_transform.setAnchorPoint(0, 1);

    return node;
  }
}
