import { Asset, Constructor, resources } from "cc";
import Singleton from "../base/Singleton";
/**
 * 资源管理中心
 *
 * @export
 * @class ResourceManager
 * @extends {Singleton}
 */
export default class ResourceManager extends Singleton {
  static get instance() {
    return super.getInstance<ResourceManager>();
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
  loadResDir<T extends Asset>(
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
}
