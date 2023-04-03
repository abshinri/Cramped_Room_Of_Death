import { _decorator } from "cc";
import { EnemyManager } from "../../base/EnemyManager";
import { IronSkeletonMachine } from "./IronSkeletonMachine";
const { ccclass, property } = _decorator;

@ccclass("IronSkeletonManager")
export class IronSkeletonManager extends EnemyManager {
  async init(param) {
    this.fsm = this.addComponent(IronSkeletonMachine);
    await this.fsm.init();

    super.init(param);
  }

  protected onDestroy(): void {
    super.onDestroy();

  }
}
