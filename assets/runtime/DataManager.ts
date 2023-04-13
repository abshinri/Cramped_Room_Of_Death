import Singleton from "../base/Singleton";
import { IRecord, ITile } from "../interfaces";
import { BurstManager } from "../scripts/Burst/BurstManager";
import { DoorManager } from "../scripts/Door/DoorManager";
import { IronSkeletonManager } from "../scripts/IronSkeleton/IronSkeletonManager";
import { PlayerManager } from "../scripts/Player/PlayerManager";
import { SmokeManager } from "../scripts/Smoke/SmokeManager";
import { SpikesManager } from "../scripts/Spikes/SpikesManager";
import { TileManager } from "../scripts/Stage/TileManager";
import { WoodenSkeletonManager } from "../scripts/WoodenSkeleton/WoodenSkeletonManager";

/**
 * 数据管理中心
 *
 * @export
 * @class DataManager
 * @extends {Singleton}
 */
export default class DataManager extends Singleton {
  static get instance() {
    return super.getInstance<DataManager>();
  }

  /**
   * 当前的关卡数据
   *
   * @type {Array<Array<ITile>>}
   */
  map: Array<Array<ITile>>;

  /**
   * 砖块信息
   *
   * @type {Array<Array<TileManager>>}
   */
  tiles: Array<Array<TileManager>>;

  /**
   * 当前的关卡行数
   *
   * @type {number}
   */
  mapRowCount: number = 0;

  /**
   * 当前的关卡列数
   *
   * @type {number}
   */
  mapCol: number = 0;

  /**
   * 当前的关卡索引
   *
   * @type {number}
   */
  levelIndex: number = 1;

  /**
   * 玩家信息
   *
   * @type {PlayerManager}
   */
  player: PlayerManager = null;

  /**
   * 敌人信息
   * @type {Array<WoodenSkeletonManager|IronSkeletonManager>}
   * @memberof DataManager
   */
  enemies: Array<WoodenSkeletonManager | IronSkeletonManager> = [];

  /**
   * 门信息
   *
   * @type {DoorManager}
   */
  door: DoorManager = null;

  /**
   * 掉落陷阱信息
   *
   * @type {Array<BurstManager>}
   */
  bursts: Array<BurstManager> = [];

  /**
   * 掉落尖刺信息
   *
   * @type {Array<SpikesManager>}
   */
  spikes: Array<SpikesManager> = [];

  /**
   * 移动烟雾信息
   *
   * @type {Array<SmokeManager>}
   */
  smokes: Array<SmokeManager> = [];


  /**
   * 当前关卡的记录信息
   *
   * @type {Array<IRecord>}
   */
  record:Array<IRecord> = []
  /**
   * 重置数据
   *
   */
  reset() {
    this.map = [];
    this.mapRowCount = 0;
    this.mapCol = 0;
    this.tiles = [];
    this.player = null;
    this.enemies = [];
    this.door = null;
    this.bursts = [];
    this.spikes = [];
    this.smokes = [];
    this.record = [];
  }
}
