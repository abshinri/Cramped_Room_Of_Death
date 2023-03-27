import {
  TILE_TYPE_ENUM,
  FSM_PARAMS_TYPE_ENUM,
  ENTITY_TYPE_ENUM,
  ENTITY_STATE_ENUM,
  ENTITY_DIRECTION_ENUM,
} from "../enums/index";

/**
 * 接口：地图块
 *
 * @export
 * @interface ITile
 */
export interface ITile {
  /**
   * 图片资源索引
   *
   * @type {(number | null)}
   * @memberof ITile
   */
  src: number | null;
  /**
   * 块类型
   * @type {(TILE_TYPE_ENUM | null)}
   * @memberof ITile
   */
  type: TILE_TYPE_ENUM | null;
}

/**
 * 接口：实体基本属性
 *
 * @export
 * @interface IEntity
 */
export interface IEntity {
  x: number;
  y: number;
  type: ENTITY_TYPE_ENUM;
  state: ENTITY_STATE_ENUM;
  direction: ENTITY_DIRECTION_ENUM;
}

/**
 * 接口：一个完整的关卡数据
 *
 * @export
 * @interface ILevel
 * @property {Array<Array<ITile>>} map - 关卡信息
 */
export interface ILevel {
  /**
   * 地图信息
   *
   * @type {Array<Array<ITile>>}
   * @memberof ILevel
   */
  map: Array<Array<ITile>>;
}

/**
 * 接口：状态机参数值
 *
 * @export
 * @interface IParamsValue
 */
export interface IParamsValue {
  /**
   * 参数值类型
   *
   * @type {FSM_PARAMS_TYPE_ENUM}
   * @memberof IParamsValue
   */
  type: FSM_PARAMS_TYPE_ENUM;

  /**
   * 参数值, 可能是布尔值或者数字
   *
   * @type {(boolean|number)}
   * @memberof IParamsValue
   */
  value: boolean | number;
}
