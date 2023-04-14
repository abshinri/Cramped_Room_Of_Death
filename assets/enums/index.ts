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
 * 事件类型枚举
 *
 * @export
 * @enum {string}
 */
export enum EVENT_ENUM {
  /** @member "下一关" */
  NEXT_LEVEL = "NEXT_LEVEL",
  /** @member "玩家操作" */
  PLAYER_CONTROL = "PLAYER_CONTROL",
  /** @member "玩家移动结束" */
  PLAYER_MOVE_END = "PLAYER_MOVE_END",
  /** @member "玩家创建结束" */
  PLAYER_CREATE_END = "PLAYER_CREATE_END",
  /** @member "攻击玩家" */
  ATTACK_PLAYER = "ATTACK_PLAYER",
  /** @member "敌人死亡" */
  ENEMY_DEAD = "ENEMY_DEAD",
  /** @member "开门" */
  DOOR_OPEN = "DOOR_OPEN",
  /** @member "扬起尘土" */
  SHOW_SMOKE = "SHOW_SMOKE",

  /** @member "屏幕震动" */
  SCREEN_SHAKE = "SCREEN_SHAKE",

  /** @member "记录操作" */
  RECORD = "RECORD",
  /** @member "撤销操作" */
  REVOKE = "REVOKE",
  /** @member "重开" */
  RESTART = "RESTART",
  /** @member "退出" */
  OUT = "OUT",
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

  /** @member "攻击" */
  ATTACK = "ATTACK",

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

  /** @member "死亡" */
  DEAD = "DEAD",
  /** @member "死在天上" */
  AIRDEAD = "AIRDEAD",

  /** @member "尖刺陷阱当前计数" */
  SPIKES_CUR_COUNT = "SPIKES_CUR_COUNT",
  /** @member "尖刺陷阱总计数" */
  SPIKES_TOTAL_COUNT = "SPIKES_TOTAL_COUNT",

  /** @member "一尖刺陷阱" */
  SPIKES_ONE = "SPIKES_ONE",
  /** @member "二尖刺陷阱" */
  SPIKES_TWO = "SPIKES_TWO",
  /** @member "三尖刺陷阱" */
  SPIKES_THREE = "SPIKES_THREE",
  /** @member "四尖刺陷阱" */
  SPIKES_FOUR = "SPIKES_FOUR",
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

  /** @member "攻击" */
  ATTACK = "ATTACK",

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

  /** @member "死亡" */
  DEAD = "DEAD",
  /** @member "死在天上" */
  AIRDEAD = "AIRDEAD",
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
  /** @member "敌人_木骷髅" */
  ENEMY_WOODEN_SKELETON = "ENEMY_WOODEN_SKELETON",
  /** @member "敌人_铁骷髅" */
  ENEMY_IRON_SKELETON = "ENEMY_IRON_SKELETON",
  /** @member "门" */
  DOOR = "DOOR",
  /** @member "掉落陷阱" */
  BURST = "BURST",
  /** @member "一尖刺陷阱" */
  SPIKES_ONE = "SPIKES_ONE",
  /** @member "二尖刺陷阱" */
  SPIKES_TWO = "SPIKES_TWO",
  /** @member "三尖刺陷阱" */
  SPIKES_THREE = "SPIKES_THREE",
  /** @member "四尖刺陷阱" */
  SPIKES_FOUR = "SPIKES_FOUR",
  /** @member "烟雾" */
  SMOKE = "SMOKE",
}

/**
 * 尖刺陷阱类型转状态类型总数数字枚举
 * 同时状态也表示了尖刺陷阱存在的状态总数
 * 例如：SPIKES_ONE = 2，表示一尖刺陷阱有0,1,2三种状态
 *
 * @export
 * @enum {number}
 */
export enum SPIKES_TYPE_TO_NUMBER_ENUM {
  /** @member "一尖刺陷阱" */
  SPIKES_ONE = 2,
  /** @member "二尖刺陷阱" */
  SPIKES_TWO = 3,
  /** @member "三尖刺陷阱" */
  SPIKES_THREE = 4,
  /** @member "四尖刺陷阱" */
  SPIKES_FOUR = 5,
}

// 尖刺状态枚举
export enum SPIKES_STATE_ENUM {
  /** @member "零" */
  ZERO = "ZERO",
  /** @member "一" */
  ONE = "ONE",
  /** @member "二" */
  TWO = "TWO",
  /** @member "三" */
  THREE = "THREE",
  /** @member "四" */
  FOUR = "FOUR",
  /** @member "五" */
  FIVE = "FIVE",
}

// 尖刺状态字符串转数字枚举
export enum SPIKES_STATE_TO_NUMBER_ENUM {
  /** @member "零" */
  ZERO = 0,
  /** @member "一" */
  ONE = 1,
  /** @member "二" */
  TWO = 2,
  /** @member "三" */
  THREE = 3,
  /** @member "四" */
  FOUR = 4,
  /** @member "五" */
  FIVE = 5,
}

// 屏幕渐入渐出状态枚举
export enum SCREEN_FADE_STATE_ENUM {
  /** @member "游戏可见" */
  VISIBLE = "VISIBLE",
  /** @member "游戏不可见" */
  INVISIBLE = "INVISIBLE",

  /** @member "渐入游戏画面" */
  FADE_IN = "FADE_IN",
  /** @member "渐出游戏画面" */
  FADE_OUT = "FADE_OUT",
}

export enum SCENE_ENUM {
  /** @member "游戏场景" */
  BATTLE = "Battle",
  /** @member "开始场景" */
  START = "Start",
  /** @member "加载场景" */
  LOADING = "Loading",
}
