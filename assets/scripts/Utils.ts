import {
  resources,
  Asset,
  Constructor,
  Node,
  Layers,
  UITransform,
  SpriteFrame,
} from "cc";
export enum CONSOLE_METHODS {
  LOG = "log",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
}
export enum CONSOLE_METHODS_COLORS {
  log = "#000000",
  info = "#409eff",
  warn = "#e6a23c",
  error = "#f56c6c",
}

const INDEX_REG = /\((\d+)\)/;

const getNumberWithinString = (str: string) =>
  parseInt(str.match(INDEX_REG)?.[1] || "0");

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
   * 指定长度生成随机字符串
   *
   * @static
   * @param {number} len
   * @returns {*}  {string}
   */
  static randomString(len: number): string {
    const $chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
    const maxPos = $chars.length;
    let randomString = "";
    for (let i = 0; i < len; i++) {
      randomString += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return randomString;
  }

  /**
   * 随机在数组里面取一个元素
   *
   * @static
   * @template T
   * @param {Array<T>} arr
   * @returns {*}  {T}
   */
  static randomByArray<T>(arr: Array<T>): T {
    return arr[Utils.random(0, arr.length - 1)];
  }

  /**
   * 创建一个Node,默认设置好常用的属性
   * 通过这个方法创建的节点,默认会设置好锚点在左上角
   *
   * @static
   * @param {string} [name]
   * @param {Node} [parent]
   * @returns {Node}
   */
  static createNode(name?: string, parent?: Node): Node {
    const node = new Node(name);
    if (parent) node.setParent(parent);
    // 因为我们是手动创建的砖块,没有经过场景编辑器,所以需要手动配置砖块的Layer
    // 我们创建的是一个纯2D游戏,所以我们只需要配置砖块的Layer为UI_2D即可
    node.layer = Layers.Enum.UI_2D;
    const ui_transform = node.addComponent(UITransform);
    ui_transform.setAnchorPoint(0, 1);

    return node;
  }

  /**
   * 一个用于开发模式的log方法
   * 可以传入类型, 用于区分不同的log
   *
   * @static
   * @param {CONSOLE_METHODS} type
   * @param {string} title
   * @param {...any[]} args
   */
  static console(type: CONSOLE_METHODS, title: string, ...args: any[]) {
    console.log(`%c${title}`, `color: ${CONSOLE_METHODS_COLORS[type]}`);
    if (args.length) {
      console.group();
      for (let i = 0; i < args.length; i++) {
        console.log(args[i]);
      }
      console.groupEnd();
    }
    console.log(`
    `);
  }

  static log(title: string, ...args: any[]) {
    this.console(CONSOLE_METHODS.LOG, title, ...args);
  }

  static info(title: string, ...args: any[]) {
    this.console(CONSOLE_METHODS.INFO, title, ...args);
  }

  static warn(title: string, ...args: any[]) {
    this.console(CONSOLE_METHODS.WARN, title, ...args);
  }

  static error(title: string, ...args: any[]) {
    this.console(CONSOLE_METHODS.ERROR, title, ...args);
  }

  // 给SpriteFrame排序
  static sortSpriteFrames(spriteFrames: SpriteFrame[]) {
    return spriteFrames.sort(
      (a, b) => getNumberWithinString(a.name) - getNumberWithinString(b.name)
    );
  }
}
