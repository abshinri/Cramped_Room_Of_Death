import { TILE_TYPE_ENUM, ENTITY_DIRECTION_ENUM, ENTITY_TYPE_ENUM, ENTITY_STATE_ENUM } from '../enums';
import { IEntity, ILevel, ISpikes } from '../interfaces';

const map = [
  [
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
      type: TILE_TYPE_ENUM.WALL_LEFT_BOTTOM,
    },
    {
      src: 18,
      type: TILE_TYPE_ENUM.CLIFF_LEFT,
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
      src: 1,
      type: TILE_TYPE_ENUM.FLOOR,
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
      src: 1,
      type: TILE_TYPE_ENUM.FLOOR,
    },
    {
      src: 17,
      type: TILE_TYPE_ENUM.CLIFF_CENTER,
    },
  ],
  [
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
      src: 9,
      type: TILE_TYPE_ENUM.WALL_ROW,
    },
    {
      src: 17,
      type: TILE_TYPE_ENUM.CLIFF_CENTER,
    },
    {
      src: 20,
      type: TILE_TYPE_ENUM.WALL_ROW,
    },
    {
      src: 18,
      type: TILE_TYPE_ENUM.CLIFF_LEFT,
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
      src: 9,
      type: TILE_TYPE_ENUM.WALL_ROW,
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
      src: 18,
      type: TILE_TYPE_ENUM.CLIFF_LEFT,
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
      src: 9,
      type: TILE_TYPE_ENUM.WALL_ROW,
    },
    {
      src: 17,
      type: TILE_TYPE_ENUM.CLIFF_CENTER,
    },
    {
      src: 21,
      type: TILE_TYPE_ENUM.WALL_ROW,
    },
    {
      src: 18,
      type: TILE_TYPE_ENUM.CLIFF_LEFT,
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
      src: 18,
      type: TILE_TYPE_ENUM.CLIFF_LEFT,
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
    {
      src: null,
      type: null,
    },
  ],
  [
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
      src: 18,
      type: TILE_TYPE_ENUM.CLIFF_LEFT,
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
    {
      src: null,
      type: null,
    },
  ],
  [
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
      src: 18,
      type: TILE_TYPE_ENUM.CLIFF_LEFT,
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
    {
      src: null,
      type: null,
    },
  ],
  [
    {
      src: 9,
      type: TILE_TYPE_ENUM.WALL_ROW,
    },
    {
      src: 1,
      type: TILE_TYPE_ENUM.FLOOR,
    },
    {
      src: 24,
      type: TILE_TYPE_ENUM.WALL_ROW,
    },
    {
      src: 18,
      type: TILE_TYPE_ENUM.CLIFF_LEFT,
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
    {
      src: null,
      type: null,
    },
    {
      src: null,
      type: null,
    },
  ],
];

const player: IEntity = {
  x: 1,
  y: 7,
  direction: ENTITY_DIRECTION_ENUM.UP,
  state: ENTITY_STATE_ENUM.IDLE,
  type: ENTITY_TYPE_ENUM.PLAYER,
};

const enemies: Array<IEntity> = [
  {
    x: 8,
    y: 1,
    direction: ENTITY_DIRECTION_ENUM.LEFT,
    state: ENTITY_STATE_ENUM.IDLE,
    type: ENTITY_TYPE_ENUM.ENEMY_WOODEN_SKELETON,
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
    y: 5,
    state: ENTITY_STATE_ENUM.IDLE,
    type: ENTITY_TYPE_ENUM.BURST,
    direction: ENTITY_DIRECTION_ENUM.UP,
  },
  {
    x: 1,
    y: 6,
    state: ENTITY_STATE_ENUM.IDLE,
    type: ENTITY_TYPE_ENUM.BURST,
    direction: ENTITY_DIRECTION_ENUM.UP,
  },
  {
    x: 2,
    y: 1,
    state: ENTITY_STATE_ENUM.IDLE,
    type: ENTITY_TYPE_ENUM.BURST,
    direction: ENTITY_DIRECTION_ENUM.UP,
  },
  {
    x: 3,
    y: 1,
    state: ENTITY_STATE_ENUM.IDLE,
    type: ENTITY_TYPE_ENUM.BURST,
    direction: ENTITY_DIRECTION_ENUM.UP,
  },
  {
    x: 4,
    y: 1,
    state: ENTITY_STATE_ENUM.IDLE,
    type: ENTITY_TYPE_ENUM.BURST,
    direction: ENTITY_DIRECTION_ENUM.UP,
  },
  {
    x: 5,
    y: 1,
    state: ENTITY_STATE_ENUM.IDLE,
    type: ENTITY_TYPE_ENUM.BURST,
    direction: ENTITY_DIRECTION_ENUM.UP,
  },
  {
    x: 6,
    y: 1,
    state: ENTITY_STATE_ENUM.IDLE,
    type: ENTITY_TYPE_ENUM.BURST,
    direction: ENTITY_DIRECTION_ENUM.UP,
  },
  {
    x: 6,
    y: 2,
    state: ENTITY_STATE_ENUM.IDLE,
    type: ENTITY_TYPE_ENUM.BURST,
    direction: ENTITY_DIRECTION_ENUM.UP,
  },
];

const door: IEntity = {
  x: 9,
  y: 1,
  direction: ENTITY_DIRECTION_ENUM.LEFT,
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
