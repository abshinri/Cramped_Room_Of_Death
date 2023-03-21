/**
 * 单例模式
 *
 * @export
 * @class Singleton
 */
export default class Singleton {
  private static _instance: any = null;
  public static getInstance<T>(): T {
    if (!Singleton._instance) {
      Singleton._instance = new Singleton();
    }
    return Singleton._instance;
  }
}
