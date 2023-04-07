import { ENTITY_DIRECTION_ENUM, ENTITY_TYPE_ENUM, ENTITY_STATE_ENUM, TILE_TYPE_ENUM } from '../enums';
import { IEntity, ILevel, ISpikes } from '../interfaces';

const map = [
  [
    {
      src: null,
      type: null,
    },
    {
      src: 16,
      type: TILE_TYPE_ENUM.WALL_LEFT_TOP,
    },
    {
      src: 5,
      type: TILE_TYPE_ENUM.WALL_COLUMN,
    },
    {
      src: 23,
      type: TILE_TYPE_ENUM.WALL_RIGHT_BOTTOM,
    },
    {
      src: 1,
      type: TILE_TYPE_ENUM.FLOOR,
    },
    {
      src: 20,
      type: TILE_TYPE_ENUM.WALL_ROW,
    },
    {
      src: 18,
      type: TILE_TYPE_ENUM.CLIFF_LEFT,
    },
  ],

  [
    {
      src: null,
      type: null,
    },
    {
      src: 9,
      type: TILE_TYPE_ENUM.WALL_ROW,
    },
    {
      src: 17,
      type: TILE_TYPE_ENUM.CLIFF_CENTER,
    },
    {
      src: null,
      type: null,
    },
    {
      src: 1,
      type: TILE_TYPE_ENUM.FLOOR,
    },
    {
      src: 9,
      type: TILE_TYPE_ENUM.WALL_ROW,
    },
    {
      src: 17,
      type: TILE_TYPE_ENUM.CLIFF_CENTER,
    },
  ],

  [
    {
      src: null,
      type: null,
    },
    {
      src: 9,
      type: TILE_TYPE_ENUM.WALL_ROW,
    },
    {
      src: 1,
      type: TILE_TYPE_ENUM.FLOOR,
    },
    {
      src: 17,
      type: TILE_TYPE_ENUM.CLIFF_CENTER,
    },
    {
      src: null,
      type: null,
    },
    {
      src: 21,
      type: TILE_TYPE_ENUM.WALL_ROW,
    },
    {
      src: 17,
      type: TILE_TYPE_ENUM.CLIFF_CENTER,
    },
  ],

  [
    {
      src: null,
      type: null,
    },
    {
      src: 9,
      type: TILE_TYPE_ENUM.WALL_ROW,
    },
    {
      src: 1,
      type: TILE_TYPE_ENUM.FLOOR,
    },
    {
      src: 17,
      type: TILE_TYPE_ENUM.CLIFF_CENTER,
    },
    {
      src: null,
      type: null,
    },
    {
      src: null,
      type: null,
    },
    {
      src: null,
      type: null,
    },
  ],

  [
    {
      src: null,
      type: null,
    },
    {
      src: 9,
      type: TILE_TYPE_ENUM.WALL_ROW,
    },
    {
      src: 1,
      type: TILE_TYPE_ENUM.FLOOR,
    },
    {
      src: 1,
      type: TILE_TYPE_ENUM.FLOOR,
    },
    {
      src: 1,
      type: TILE_TYPE_ENUM.FLOOR,
    },
    {
      src: 20,
      type: TILE_TYPE_ENUM.WALL_ROW,
    },
    {
      src: 17,
      type: TILE_TYPE_ENUM.CLIFF_CENTER,
    },
  ],

  [
    {
      src: null,
      type: null,
    },
    {
      src: 15,
      type: TILE_TYPE_ENUM.WALL_RIGHT_TOP,
    },
    {
      src: 25,
      type: TILE_TYPE_ENUM.WALL_COLUMN,
    },
    {
      src: 23,
      type: TILE_TYPE_ENUM.WALL_RIGHT_BOTTOM,
    },
    {
      src: 1,
      type: TILE_TYPE_ENUM.FLOOR,
    },
    {
      src: 9,
      type: TILE_TYPE_ENUM.WALL_ROW,
    },
    {
      src: 17,
      type: TILE_TYPE_ENUM.CLIFF_CENTER,
    },
  ],

  [
    {
      src: null,
      type: null,
    },
    {
      src: null,
      type: null,
    },
    {
      src: 9,
      type: TILE_TYPE_ENUM.WALL_ROW,
    },
    {
      src: 1,
      type: TILE_TYPE_ENUM.FLOOR,
    },
    {
      src: 1,
      type: TILE_TYPE_ENUM.FLOOR,
    },
    {
      src: 9,
      type: TILE_TYPE_ENUM.WALL_ROW,
    },
    {
      src: 17,
      type: TILE_TYPE_ENUM.CLIFF_CENTER,
    },
  ],

  [
    {
      src: null,
      type: null,
    },
    {
      src: null,
      type: null,
    },
    {
      src: 21,
      type: TILE_TYPE_ENUM.WALL_ROW,
    },
    {
      src: 1,
      type: TILE_TYPE_ENUM.FLOOR,
    },
    {
      src: 17,
      type: TILE_TYPE_ENUM.CLIFF_CENTER,
    },
    {
      src: 9,
      type: TILE_TYPE_ENUM.WALL_ROW,
    },
    {
      src: 17,
      type: TILE_TYPE_ENUM.CLIFF_CENTER,
    },
  ],

  [
    {
      src: null,
      type: null,
    },
    {
      src: null,
      type: null,
    },
    {
      src: null,
      type: null,
    },
    {
      src: 1,
      type: TILE_TYPE_ENUM.FLOOR,
    },
    {
      src: 1,
      type: TILE_TYPE_ENUM.FLOOR,
    },
    {
      src: 9,
      type: TILE_TYPE_ENUM.WALL_ROW,
    },
    {
      src: 17,
      type: TILE_TYPE_ENUM.CLIFF_CENTER,
    },
  ],

  [
    {
      src: 1,
      type: TILE_TYPE_ENUM.FLOOR,
    },
    {
      src: 1,
      type: TILE_TYPE_ENUM.FLOOR,
    },
    {
      src: 1,
      type: TILE_TYPE_ENUM.FLOOR,
    },
    {
      src: 1,
      type: TILE_TYPE_ENUM.FLOOR,
    },
    {
      src: 1,
      type: TILE_TYPE_ENUM.FLOOR,
    },
    {
      src: 9,
      type: TILE_TYPE_ENUM.WALL_ROW,
    },
    {
      src: 17,
      type: TILE_TYPE_ENUM.CLIFF_CENTER,
    },
  ],

  [
    {
      src: 22,
      type: TILE_TYPE_ENUM.WALL_RIGHT_TOP,
    },
    {
      src: 5,
      type: TILE_TYPE_ENUM.WALL_COLUMN,
    },
    {
      src: 5,
      type: TILE_TYPE_ENUM.WALL_COLUMN,
    },
    {
      src: 5,
      type: TILE_TYPE_ENUM.WALL_COLUMN,
    },
    {
      src: 5,
      type: TILE_TYPE_ENUM.WALL_COLUMN,
    },
    {
      src: 14,
      type: TILE_TYPE_ENUM.WALL_RIGHT_BOTTOM,
    },
    {
      src: 19,
      type: TILE_TYPE_ENUM.CLIFF_RIGHT,
    },
  ],
];

const player: IEntity = {
  x: 0,
  y: 4,
  direction: ENTITY_DIRECTION_ENUM.RIGHT,
  state: ENTITY_STATE_ENUM.IDLE,
  type: ENTITY_TYPE_ENUM.PLAYER,
};

const enemies: Array<IEntity> = [
  {
    x: 9,
    y: 1,
    direction: ENTITY_DIRECTION_ENUM.LEFT,
    state: ENTITY_STATE_ENUM.IDLE,
    type: ENTITY_TYPE_ENUM.ENEMY_WOODEN_SKELETON,
  },
  {
    x: 9,
    y: 3,
    direction: ENTITY_DIRECTION_ENUM.LEFT,
    state: ENTITY_STATE_ENUM.IDLE,
    type: ENTITY_TYPE_ENUM.ENEMY_IRON_SKELETON,
  },
  {
    x: 9,
    y: 4,
    direction: ENTITY_DIRECTION_ENUM.LEFT,
    state: ENTITY_STATE_ENUM.IDLE,
    type: ENTITY_TYPE_ENUM.ENEMY_IRON_SKELETON,
  },
];

const spikes: Array<ISpikes> = [];

const bursts: Array<IEntity> = [
  {
    x: 1,
    y: 2,
    state: ENTITY_STATE_ENUM.IDLE,
    type: ENTITY_TYPE_ENUM.BURST,
    direction: ENTITY_DIRECTION_ENUM.UP,
  },
  {
    x: 1,
    y: 3,
    state: ENTITY_STATE_ENUM.IDLE,
    type: ENTITY_TYPE_ENUM.BURST,
    direction: ENTITY_DIRECTION_ENUM.UP,
  },
  {
    x: 2,
    y: 3,
    state: ENTITY_STATE_ENUM.IDLE,
    type: ENTITY_TYPE_ENUM.BURST,
    direction: ENTITY_DIRECTION_ENUM.UP,
  },
  {
    x: 2,
    y: 4,
    state: ENTITY_STATE_ENUM.IDLE,
    type: ENTITY_TYPE_ENUM.BURST,
    direction: ENTITY_DIRECTION_ENUM.UP,
  },
  {
    x: 7,
    y: 4,
    state: ENTITY_STATE_ENUM.IDLE,
    type: ENTITY_TYPE_ENUM.BURST,
    direction: ENTITY_DIRECTION_ENUM.UP,
  },
];

const door: IEntity = {
  x: 9,
  y: 0,
  direction: ENTITY_DIRECTION_ENUM.DOWN,
  state: ENTITY_STATE_ENUM.IDLE,
  type: ENTITY_TYPE_ENUM.DOOR,
};

const level: ILevel = {
  map,
  player,
  enemies,
  spikes,
  bursts,
  door,
};

export default level;
