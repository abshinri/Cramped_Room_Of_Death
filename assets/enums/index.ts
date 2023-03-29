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
 * @enum {string}
 */
export enum EVENT_ENUM {
  /** @member "下一关" */
  NEXT_LEVEL = "NEXT_LEVEL",
  /** @member "玩家操作" */
  PLAYER_CONTROL = "PLAYER_CONTROL",
}

/**
 * 控制枚举
 *
 * @export
 * @enum {string}
 */
export enum CONTROL_ENUM {
  /** @member "上" */
  UP = "UP",
  /** @member "下" */
  DOWN = "DOWN",
  /** @member "左" */
  LEFT = "LEFT",
  /** @member "右" */
  RIGHT = "RIGHT",
  /** @member "左转" */
  TURN_LEFT = "TURN_LEFT",
  /** @member "右转" */
  TURN_RIGHT = "TURN_RIGHT",
}

/**
 * 动画状态机的参数类型枚举
 *
 * @export
 * @enum {string}
 */
export enum FSM_PARAMS_TYPE_ENUM {
  /** @member "为NUMBER类型时,接收数字" */
  NUMBER = "NUMBER",
  /** @member "为TRIGGER类型时,接收一个布尔值" */
  TRIGGER = "TRIGGER",
}

/**
 * 动画状态机的名字枚举
 *
 * @export
 * @enum {string}
 */
export enum FSM_PARAMS_NAME_ENUM {
  /** @member "站立" */
  IDLE = "IDLE",
  /** @member "执行左转中" */
  TURN_LEFT = "TURN_LEFT",
  /** @member "执行右转中" */
  TURN_RIGHT = "TURN_RIGHT",

  /** @member "人物朝向" */
  DIRECTION = "DIRECTION",

  /** @member "朝上的碰撞" */
  BLOCK_UP = "BLOCK_UP",
  /** @member "朝下的碰撞" */
  BLOCK_DOWN = "BLOCK_DOWN",
  /** @member "朝左的碰撞" */
  BLOCK_LEFT = "BLOCK_LEFT",
  /** @member "朝右的碰撞" */
  BLOCK_RIGHT = "BLOCK_RIGHT",

  /** @member "左转的碰撞" */
  BLOCK_TURN_LEFT = "BLOCK_TURN_LEFT",
  /** @member "右转的碰撞" */
  BLOCK_TURN_RIGHT = "BLOCK_TURN_RIGHT",
}

/**
 * 角色方向枚举
 *
 * @export
 * @enum {string}
 */
export enum ENTITY_DIRECTION_ENUM {
  /** @member "上" */
  UP = "UP",
  /** @member "下" */
  DOWN = "DOWN",
  /** @member "左" */
  LEFT = "LEFT",
  /** @member "右" */
  RIGHT = "RIGHT",
}

/**
 * 角色方向转碰撞的枚举
 *
 * @export
 * @enum {string}
 */
export enum ENTITY_DIRECTION_TO_BLOCK_ENUM {
  /** @member "朝上的碰撞" */
  UP = "BLOCK_UP",
  /** @member "朝下的碰撞" */
  DOWN = "BLOCK_DOWN",
  /** @member "朝左的碰撞" */
  LEFT = "BLOCK_LEFT",
  /** @member "朝右的碰撞" */
  RIGHT = "BLOCK_RIGHT",

  /** @member "左转的碰撞" */
  TURN_LEFT = "BLOCK_TURN_LEFT",
  /** @member "右转的碰撞" */
  TURN_RIGHT = "BLOCK_TURN_RIGHT",
}

/**
 * 方向数字枚举
 *
 * @export
 * @enum {number}
 */
export enum DIRECTION_NUMBER_ENUM {
  /** @member "上" */
  UP = 0,
  /** @member "下" */
  DOWN = 1,
  /** @member "左" */
  LEFT = 2,
  /** @member "右" */
  RIGHT = 3,
}

/**
 * 角色的动作状态枚举
 *
 * @export
 * @enum {string}
 */
export enum ENTITY_STATE_ENUM {
  /** @member "站立" */
  IDLE = "IDLE",
  /** @member "左转" */
  TURN_LEFT = "TURN_LEFT",
  /** @member "右转" */
  TURN_RIGHT = "TURN_RIGHT",

  /** @member "朝上的碰撞" */
  BLOCK_UP = "BLOCK_UP",
  /** @member "朝下的碰撞" */
  BLOCK_DOWN = "BLOCK_DOWN",
  /** @member "朝左的碰撞" */
  BLOCK_LEFT = "BLOCK_LEFT",
  /** @member "朝右的碰撞" */
  BLOCK_RIGHT = "BLOCK_RIGHT",

  /** @member "左转的碰撞" */
  BLOCK_TURN_LEFT = "BLOCK_TURN_LEFT",
  /** @member "右转的碰撞" */
  BLOCK_TURN_RIGHT = "BLOCK_TURN_RIGHT",
}

/**
 * 角色类型枚举
 *
 * @export
 * @enum {string}
 */
export enum ENTITY_TYPE_ENUM {
  /** @member "玩家" */
  PLAYER = "PLAYER",
  /** @member "敌人" */
  ENEMY = "ENEMY",
}
