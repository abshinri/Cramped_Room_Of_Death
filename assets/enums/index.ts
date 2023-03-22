/**
 * 地图格子类型枚举
 *
 * @export
 * @enum {string}
 */
export enum TILE_TYPE_ENUM {
  /** @member "横向墙" */
  WALL_ROW = "WALL_ROW",
  /** @member "竖向墙" */
  WALL_COLUMN = "WALL_COLUMN",
  /** @member "左上角墙" */
  WALL_LEFT_TOP = "WALL_LEFT_TOP",
  /** @member "左下角墙" */
  WALL_LEFT_BOTTOM = "WALL_LEFT_BOTTOM",
  /** @member "右上角墙" */
  WALL_RIGHT_TOP = "WALL_RIGHT_TOP",
  /** @member "右下角墙" */
  WALL_RIGHT_BOTTOM = "WALL_RIGHT_BOTTOM",
  /** @member "悬崖中心" */
  CLIFF_CENTER = "CLIFF_CENTER",
  /** @member "悬崖左侧" */
  CLIFF_LEFT = "CLIFF_LEFT",
  /** @member "悬崖右侧" */
  CLIFF_RIGHT = "CLIFF_RIGHT",
  /** @member "地板" */
  FLOOR = "FLOOR",
}

/**
 * 事件枚举
 *
 * @export
 * @enum {number}
 */
export enum EVENT_ENUM {
  /** @member "下一关" */
  NEXT_LEVEL = "NEXT_LEVEL",
}
