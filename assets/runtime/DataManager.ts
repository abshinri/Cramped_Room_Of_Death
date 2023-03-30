import { EntityManager } from "../base/EntityManager";
import Singleton from "../base/Singleton";
import { ITile } from "../interfaces";
import { PlayerManager } from "../scripts/Player/PlayerManager";
import { TileManager } from "../scripts/Stage/TileManager";

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
   * @type {Array<EntityManager>}
   * @memberof DataManager
   */
  enemies: Array<EntityManager> = [];

  /**
   * 重置数据
   *
   */
  reset() {
    this.map = [];
    this.mapRowCount = 0;
    this.mapCol = 0;
    this.levelIndex = 1;
    this.tiles = [];
    this.player = null;
    this.enemies = [];
  }
}
