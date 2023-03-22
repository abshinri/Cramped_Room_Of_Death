/**
 * 单例模式
 *
 * @export
 * @class Singleton
 */
export default class Singleton {
  private static _instance: any = null;
  name = 'Singleton';
  public static getInstance<T>(): T {
    if (this._instance === null) {
      this._instance = new this();
    }
    return this._instance;
  }
}

// 如果如下这么写,子类调用getInstance方法时会有问题,拿到的是Singleton第一次初始化时的相同实例
// export default class Singleton {
//   private static _instance: any = null;
//   name = 'Singleton';
//   public static getInstance<T>(): T {
//     if (this._instance === null) {
//       this._instance = new Singleton();
//     }
//     return this._instance;
//   }
// }



// 如果按如下这么写,每次继承Singleton的子类都是会是同一个实例,而不是每个子类都是一个单例
// 后续的子类都会拿到第一个子类的实例
// export default class Singleton {
//   private static _instance: any = null;
//   public static getInstance<T>(): T {
//     if (!Singleton._instance) {
//       Singleton._instance = new Singleton();
//     }
//     return Singleton._instance;
//   }
// }
