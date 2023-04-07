import Singleton from "../base/Singleton";
import Utils from "../scripts/Utils";
interface IEventMapItem {
  callback: Function;
  ctx: any;
}

/**
 * 数据管理中心
 *
 * @export
 * @class EventManager
 * @extends {Singleton}
 */
export default class EventManager extends Singleton {
  static get instance() {
    return super.getInstance<EventManager>();
  }

  // 事件Map
  private eventMap: Map<string, Array<IEventMapItem>> = new Map();

  /**
   * 注册事件
   *
   * @param {string} eventName 事件列表名
   * @param {Function} callback 事件
   * @param {*} [ctx] 上下文
   */
  on(eventName: string, callback: Function, ctx?: any) {
    // 如果没有该事件列表名,则创建一个事件列表,并将事件和上下文放到数组里
    if (!this.eventMap.has(eventName)) {
      this.eventMap.set(eventName, [{ callback, ctx }]);
    } else {
      // 如果有该事件列表名,则直接将事件放到对应的事件列表里
      this.eventMap.get(eventName).push({ callback, ctx });
    }
  }

  /**
   * 注销事件
   *
   * @param {string} eventName 事件列表名
   * @param {Function} callback 事件
   * @param {*} [ctx] 上下文
   * @returns {*}
   */
  off(eventName: string, callback: Function, ctx?: any) {
    // 如果没有该事件列表名,则无视
    if (!this.eventMap.has(eventName)) return;
    // 如果有该事件列表名,则将事件从对应的事件列表里移除
    const callbacks = this.eventMap.get(eventName);
    const index = callbacks.indexOf({ callback, ctx });
    if (index !== -1) {
      callbacks.splice(index, 1);
    }
  }

  /**
   * 触发事件
   *
   * @param {string} eventName
   * @param {...any[]} args
   * @returns {*}
   */
  emit(eventName: string, ...args: any[]) {
    // 如果没有该事件列表名,则无视
    if (!this.eventMap.has(eventName)) return;
    // 如果有该事件列表名,则遍历该事件对应的事件列表,并执行每个事件
    const callbacks = this.eventMap.get(eventName);
    callbacks.forEach(({ callback, ctx }) => {
      ctx ? callback.apply(ctx, args) : callback(...args);
    });
  }

  /**
   * 清空事件
   */
  clear() {
    this.eventMap.clear();
  }
}
