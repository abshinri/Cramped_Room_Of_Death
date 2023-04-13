import { Vec2, _decorator } from "cc";
import { EntityManager } from "../../base/EntityManager";
import {
  CONTROL_ENUM,
  EVENT_ENUM,
  ENTITY_DIRECTION_ENUM,
  ENTITY_STATE_ENUM,
  ENTITY_TYPE_ENUM,
  ENTITY_DIRECTION_TO_BLOCK_ENUM,
  FSM_PARAMS_NAME_ENUM,
  DIRECTION_NUMBER_ENUM,
} from "../../enums";
import DataManager from "../../runtime/DataManager";
import EventManager from "../../runtime/EventManager";
import { TileManager } from "../Stage/TileManager";
import Utils from "../Utils";
import { PlayerStateMachine } from "./PlayerStateMachine";
import { IEntity } from "../../interfaces";
const { ccclass, property } = _decorator;

@ccclass("PlayerManager")
export class PlayerManager extends EntityManager {
  /**
   * 基类EntityManager包含的x,y是用于控制角色的位移动画的
   * 在实际的数据建模中, 角色的位置是以角色的建模坐标target为准的
   */
  realX: number = 0; // 主角的目标横向位置(实际为角色的建模坐标)
  realY: number = 0; // 主角的目标纵向位置(实际为角色的建模坐标),+为向上,-为向下
  isMoving: boolean = false; // 主角是否正在移动
  private readonly speed = 1 / 10; // 主角移动速度

  inputHandle(input: CONTROL_ENUM) {
    Utils.info("inputHandle input,this", input, this);
    // 如果当前状态不是idle, 则不处理输入
    if (
      this.fsm.currentState !=
      this.fsm.stateMachines.get(FSM_PARAMS_NAME_ENUM.IDLE)
    ) {
      Utils.info("inputHandle-return 状态不是idle");
      return;
    }

    const enemyId = this.willAttackGetEnemyId(input);
    if (enemyId) {
      // 记录游戏状态
      EventManager.instance.emit(EVENT_ENUM.RECORD);
      EventManager.instance.emit(EVENT_ENUM.ENEMY_DEAD, enemyId);
      EventManager.instance.emit(EVENT_ENUM.DOOR_OPEN);
      EventManager.instance.emit(EVENT_ENUM.PLAYER_MOVE_END);

      Utils.info("inputHandle-return 攻击敌人");
      return;
    }

    if (this.willBlock(input)) {
      EventManager.instance.emit(
        EVENT_ENUM.SCREEN_SHAKE,
        this.direction,
        input
      );
      return;
    }

    this.move(input);
  }

  onAttackShake(input) {
    EventManager.instance.emit(EVENT_ENUM.SCREEN_SHAKE, this.direction, input);
  }

  /**
   * 判断玩家是否会触发攻击
   * 我的判断是, 如果武器坐标和敌人单位重叠,则触发攻击动画
   * 现在先根据视频做法, 确定敌人的实例后, 返回敌人的id
   *
   * @param {CONTROL_ENUM} input
   * @return {*}  {string}
   */
  willAttackGetEnemyId(input: CONTROL_ENUM): string {
    // 提取方向,移动目标
    const { realX: x, realY: y } = this;
    /** 玩家当前位置 */
    const playerCurrPos = new Vec2(x, y);
    /** 武器当前位置 */
    const weaponCurrPos = new Vec2(x, y);
    /** 武器接下来的位置 */
    const weaponNextPos = new Vec2(x, y);
    /**  根据玩家面朝的方向, 提前计算武器的位置 */
    if (
      this.direction === ENTITY_DIRECTION_ENUM.UP &&
      input === CONTROL_ENUM.UP
    ) {
      /** 当玩家面朝上 */
      weaponCurrPos.set(playerCurrPos.x, playerCurrPos.y - 1);
      weaponNextPos.set(playerCurrPos.x, playerCurrPos.y - 2);
    } else if (
      this.direction === ENTITY_DIRECTION_ENUM.DOWN &&
      input === CONTROL_ENUM.DOWN
    ) {
      /** 当玩家面朝下 */
      weaponCurrPos.set(playerCurrPos.x, playerCurrPos.y + 1);
      weaponNextPos.set(playerCurrPos.x, playerCurrPos.y + 2);
    } else if (
      this.direction === ENTITY_DIRECTION_ENUM.LEFT &&
      input === CONTROL_ENUM.LEFT
    ) {
      /** 当玩家面朝左 */
      weaponCurrPos.set(playerCurrPos.x - 1, playerCurrPos.y);
      weaponNextPos.set(playerCurrPos.x - 2, playerCurrPos.y);
    } else if (
      this.direction === ENTITY_DIRECTION_ENUM.RIGHT &&
      input === CONTROL_ENUM.RIGHT
    ) {
      /** 当玩家面朝右 */
      weaponCurrPos.set(playerCurrPos.x + 1, playerCurrPos.y);
      weaponNextPos.set(playerCurrPos.x + 2, playerCurrPos.y);
    }
    // 可以先过滤掉死亡的敌人
    const enemies = DataManager.instance.enemies.filter(
      (enemy) => enemy.state !== ENTITY_STATE_ENUM.DEAD
    );
    for (let index = 0; index < enemies.length; index++) {
      const enemy = enemies[index];
      // if (enemy.state === ENTITY_STATE_ENUM.DEAD) continue;
      const { x: enemyX, y: enemyY, id: enemyId } = enemy;
      const enemyCurrPos = new Vec2(enemyX, enemyY);

      if (
        weaponNextPos.equals(enemyCurrPos) ||
        weaponCurrPos.equals(enemyCurrPos)
      ) {
        this.state = ENTITY_STATE_ENUM.ATTACK;
        // enemy.dead();
        return enemyId;
      }
    }
    return "";
  }

  /**
   * 判断是否会被阻挡
   *
   * @param {CONTROL_ENUM} input
   */
  willBlock(input: CONTROL_ENUM) {
    // 提取方向,移动目标
    const { realX: x, realY: y, direction } = this;

    // 获取地图数据
    const { tiles } = DataManager.instance;

    /**
     *  playerNextX, playerNextY: 玩家预计到达的坐标
     *  weaponNextX, weaponNextY: 武器预计到达的坐标
     *  x, y: 玩家的坐标, 取值于realX, realY
     *  因为this.x,this.y是随着update实时更新的, 在动画衔接中操作直接会取到非整数值
     *  所以我们取用建模坐标realX, realY
     *  1.玩家下一步的砖块要存在, 玩家才能移动,
     *  2.玩家下一步的砖块要能踩上去, 玩家才能移动
     *  3.武器下一步的砖块不存在或者能转换方向, 玩家才能移动
     *  满足以上条件则表示玩家的移动不会被阻挡
     * */
    /** 漫长的移动判断 */

    /** 玩家当前位置 */
    const playerCurrPos = new Vec2(x, y);
    /** 武器当前位置 */
    const weaponCurrPos = new Vec2(x, y);
    /** 玩家接下来的位置 */
    const playerNextPos = new Vec2(x, y);
    /** 武器接下来的位置 */
    const weaponNextPos = new Vec2(x, y);

    /**  根据玩家面朝的方向, 提前计算武器的位置 */
    if (this.direction === ENTITY_DIRECTION_ENUM.UP) {
      /** 当玩家面朝上 */
      weaponCurrPos.set(playerCurrPos.x, playerCurrPos.y - 1);
    } else if (this.direction === ENTITY_DIRECTION_ENUM.DOWN) {
      /** 当玩家面朝下 */
      weaponCurrPos.set(playerCurrPos.x, playerCurrPos.y + 1);
    } else if (this.direction === ENTITY_DIRECTION_ENUM.LEFT) {
      /** 当玩家面朝左 */
      weaponCurrPos.set(playerCurrPos.x - 1, playerCurrPos.y);
    } else if (this.direction === ENTITY_DIRECTION_ENUM.RIGHT) {
      /** 当玩家面朝右 */
      weaponCurrPos.set(playerCurrPos.x + 1, playerCurrPos.y);
    }

    if (input === CONTROL_ENUM.UP) {
      /** 向上移动 */
      const moveVec = new Vec2(0, -1);
      playerNextPos.add(moveVec);
      if (playerNextPos.y < 0) {
        Utils.info("willBlock", "上方超出地图边界, 无法移动");
        return true; // 上方超出地图边界, 无法移动
      }
      weaponNextPos.set(weaponCurrPos).add(moveVec);
    } else if (input === CONTROL_ENUM.DOWN) {
      /** 向下移动 */
      const moveVec = new Vec2(0, 1);
      playerNextPos.add(moveVec);
      if (playerNextPos.y > tiles[0]?.length) {
        Utils.info("willBlock", "下方超出地图边界, 无法移动");
        return true; // 下方超出地图边界, 无法移动
      }
      weaponNextPos.set(weaponCurrPos).add(moveVec);
    } else if (input === CONTROL_ENUM.LEFT) {
      /** 向左移动 */
      const moveVec = new Vec2(-1, 0);
      playerNextPos.add(moveVec);
      if (playerNextPos.x < 0) {
        Utils.info("willBlock", "左方超出地图边界, 无法移动");
        return true; // 左方超出地图边界, 无法移动
      }
      weaponNextPos.set(weaponCurrPos).add(moveVec);
    } else if (input === CONTROL_ENUM.RIGHT) {
      /** 向右移动 */
      const moveVec = new Vec2(1, 0);
      playerNextPos.add(moveVec);
      if (playerNextPos.x > tiles.length) {
        Utils.info("willBlock", "右方超出地图边界, 无法移动");
        return true; // 右方超出地图边界, 无法移动
      }
      weaponNextPos.set(weaponCurrPos).add(moveVec);
    } else if (input === CONTROL_ENUM.TURN_LEFT) {
      /**
       * 通过角色的侧方(转向的一边),前方和侧前方的砖块来判断是否能转向
       * 如果前方,侧方和侧前方的砖块都都是可以让武器穿过的,则表示可以转向
       * 转向时,想一想,武器的位置是怎么变化的, 侧前的砖块在哪
       * 因为砖块时数组包数组的形式, 数组下标为从左到右从上到下增加
       * 所以以主人公为中心, 四个象限左上为x-,y- ,右下为x+,y+
       * 转向时,主角中心点不变, 所以依旧取用主角的realX,realY也没问题
       * moveVec取值就是单纯以主角的面朝方向为基准, 对应的武器x,y轴的增量
       * */
      /** 左转 */
      const moveVec: Vec2 = new Vec2(0, 0);
      if (direction === ENTITY_DIRECTION_ENUM.UP) {
        moveVec.set(-1, 0);
      } else if (direction === ENTITY_DIRECTION_ENUM.LEFT) {
        moveVec.set(0, 1);
      } else if (direction === ENTITY_DIRECTION_ENUM.DOWN) {
        moveVec.set(1, 0);
      } else if (direction === ENTITY_DIRECTION_ENUM.RIGHT) {
        moveVec.set(0, -1);
      }
      weaponNextPos.set(playerCurrPos).add(moveVec);
    } else if (input === CONTROL_ENUM.TURN_RIGHT) {
      /** 右转 */
      const moveVec: Vec2 = new Vec2(0, 0);
      if (direction === ENTITY_DIRECTION_ENUM.UP) {
        moveVec.set(1, 0);
      } else if (direction === ENTITY_DIRECTION_ENUM.LEFT) {
        moveVec.set(0, -1);
      } else if (direction === ENTITY_DIRECTION_ENUM.DOWN) {
        moveVec.set(-1, 0);
      } else if (direction === ENTITY_DIRECTION_ENUM.RIGHT) {
        moveVec.set(0, 1);
      }
      weaponNextPos.set(playerCurrPos).add(moveVec);
    }

    if (
      input === CONTROL_ENUM.UP ||
      input === CONTROL_ENUM.DOWN ||
      input === CONTROL_ENUM.LEFT ||
      input === CONTROL_ENUM.RIGHT
    ) {
      /** 平移独有的处理 */
      /** 判断是否能移动到目标位置, 不能则播放撞墙动画 */
      const canMove = this.canMoveToTargetByPos(playerNextPos, weaponNextPos);
      if (canMove) {
        Utils.info("willBlock", "无法移动到目标");
        return false;
      } else {
        this.state = ENTITY_DIRECTION_TO_BLOCK_ENUM[this.direction];
        return true;
      }
    } else if (
      input === CONTROL_ENUM.TURN_LEFT ||
      input === CONTROL_ENUM.TURN_RIGHT
    ) {
      /** 转向独有的处理 */
      /** 判断是否能转向到目标位置, 不能则播放撞墙动画 */
      const canTurn = this.canTurnToTargetByPos(weaponCurrPos, weaponNextPos);
      if (canTurn) {
        Utils.info("willBlock", "无法转向到目标");
        return false;
      } else {
        this.state = ENTITY_DIRECTION_TO_BLOCK_ENUM[input];
        return true;
      }
    }
  }

  /**
   * 实时获取砖块信息
   *
   * @param {Vec2} pos
   * @returns {TileManager}
   */
  getTileByPos(pos: Vec2): TileManager {
    return DataManager.instance.tiles[pos.x]?.[pos.y];
  }

  /**
   * 位置是否存在实体
   *
   * @param {Vec2} pos
   * @param {IEntity} entity
   * @returns {*}  {boolean}
   */
  haveEntityByPos(pos: Vec2, entity: EntityManager): boolean {
    if (
      entity.x === pos.x &&
      entity.y === pos.y &&
      entity.state !== ENTITY_STATE_ENUM.DEAD
    ) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * 根据地形判断角色是否能够移动到目标位置
   * 如果玩家和武器接下来的位置有墙或者活着的实体, 则被挡住
   *
   * @param {Vec2} playerNextPos 玩家接下来的位置信息
   * @param {Vec2} weaponNextPos 武器接下来的位置信息
   * @returns {boolean}
   */
  canMoveToTargetByPos(playerNextPos: Vec2, weaponNextPos: Vec2): boolean {
    const playerNextTile = this.getTileByPos(playerNextPos);
    const weaponNextTile = this.getTileByPos(weaponNextPos);

    // 获取地图,门,敌人,掉落陷阱数据
    const { door, enemies, bursts } = DataManager.instance;

    if (
      door &&
      (this.haveEntityByPos(playerNextPos, door) ||
        this.haveEntityByPos(weaponNextPos, door))
    ) {
      // 门
      Utils.info("canMoveToTargetByPos-false 门");
      return false;
    } else if (
      enemies &&
      (enemies.some((enemy) => this.haveEntityByPos(playerNextPos, enemy)) ||
        enemies.some((enemy) => this.haveEntityByPos(weaponNextPos, enemy)))
    ) {
      // 敌人
      Utils.info("canMoveToTargetByPos-false 敌人");
      return false;
    } else if (
      !(
        playerNextTile &&
        playerNextTile.moveable &&
        (!weaponNextTile || weaponNextTile.turnable)
      )
    ) {
      // 如果有未完全破碎的掉落陷阱, 那也可以走
      if (
        bursts.some(
          (burst) =>
            burst.x === playerNextPos.x &&
            burst.y === playerNextPos.y &&
            burst.state !== ENTITY_STATE_ENUM.DEAD
        )
      ) {
        return true;
      } else {
        // 有墙和悬崖
        Utils.info("canMoveToTargetByPos-false 有墙和悬崖");
        return false;
      }
    } else {
      return true;
    }
  }

  /**
   * 根据地形判断角色是否能够转动到目标位置
   * 我想法是, 要判断武器能否转动, 就要看武器的当前位置,武器转动方向一侧一格,转动后的位置是否有墙或者活着的实体, 如果有, 则被挡住
   * @param {Vec2} weaponCurrPos 武器现在的位置信息
   * @param {Vec2} weaponNextPos 武器接下来的位置信息
   * @returns {boolean}
   */
  canTurnToTargetByPos(weaponCurrPos: Vec2, weaponNextPos: Vec2): boolean {
    // 获取地图,门,敌人数据
    const { door, enemies } = DataManager.instance;
    if (
      (door.x === weaponCurrPos.x && door.y === weaponCurrPos.y) ||
      (door.x === weaponNextPos.x && door.y === weaponNextPos.y) ||
      (door.x === weaponNextPos.x &&
        door.y === weaponCurrPos.y &&
        (this.direction === ENTITY_DIRECTION_ENUM.UP ||
          this.direction === ENTITY_DIRECTION_ENUM.DOWN)) ||
      (door.x === weaponCurrPos.x &&
        door.y === weaponNextPos.y &&
        (this.direction === ENTITY_DIRECTION_ENUM.LEFT ||
          this.direction === ENTITY_DIRECTION_ENUM.RIGHT))
    ) {
      // 门
      return false;
    } else if (
      enemies.some(
        (enemy) =>
          (enemy.x === weaponCurrPos.x && enemy.y === weaponCurrPos.y) ||
          (enemy.x === weaponNextPos.x && enemy.y === weaponNextPos.y) ||
          (enemy.x === weaponNextPos.x &&
            enemy.y === weaponCurrPos.y &&
            (this.direction === ENTITY_DIRECTION_ENUM.UP ||
              this.direction === ENTITY_DIRECTION_ENUM.DOWN)) ||
          (enemy.x === weaponCurrPos.x &&
            enemy.y === weaponNextPos.y &&
            (this.direction === ENTITY_DIRECTION_ENUM.LEFT ||
              this.direction === ENTITY_DIRECTION_ENUM.RIGHT))
      )
    ) {
      // 敌人
      return false;
    } else if (!this.checkWallTurnableByPos(weaponCurrPos, weaponNextPos)) {
      // 检测结果为不能转动, 因为玩家的前方,侧前方,侧方有墙
      return false;
    } else {
      return true;
    }
  }

  /**
   * 根据朝向判断武器前方,侧前方,侧方是否有墙
   *
   * @param {Vec2} weaponCurrPos
   * @param {Vec2} weaponNextPos
   * @returns {boolean}
   */
  checkWallTurnableByPos(weaponCurrPos: Vec2, weaponNextPos: Vec2): boolean {
    let checkBlocks = [
      DataManager.instance.tiles[weaponCurrPos.x][weaponCurrPos.y],
      DataManager.instance.tiles[weaponNextPos.x][weaponNextPos.y],
    ];
    if (
      this.direction === ENTITY_DIRECTION_ENUM.UP ||
      this.direction === ENTITY_DIRECTION_ENUM.DOWN
    ) {
      checkBlocks.push(
        DataManager.instance.tiles[weaponNextPos.x][weaponCurrPos.y]
      );
    } else if (
      this.direction === ENTITY_DIRECTION_ENUM.LEFT ||
      this.direction === ENTITY_DIRECTION_ENUM.RIGHT
    ) {
      checkBlocks.push(
        DataManager.instance.tiles[weaponCurrPos.x][weaponNextPos.y]
      );
    }

    return checkBlocks.every((block) => block && block.turnable);
  }

  // 控制角色移动
  move(input: CONTROL_ENUM) {
    // 记录游戏状态
    EventManager.instance.emit(EVENT_ENUM.RECORD);
    if (input === CONTROL_ENUM.UP) {
      this.realY -= 1;
      this.isMoving = true;
      Utils.info("move 上");
    } else if (input === CONTROL_ENUM.DOWN) {
      this.realY += 1;
      this.isMoving = true;
      Utils.info("move 下");
    } else if (input === CONTROL_ENUM.LEFT) {
      this.realX -= 1;
      this.isMoving = true;
      Utils.info("move 左");
    } else if (input === CONTROL_ENUM.RIGHT) {
      this.realX += 1;
      this.isMoving = true;
      Utils.info("move 右");
    } else if (input === CONTROL_ENUM.TURN_LEFT) {
      this.state = ENTITY_STATE_ENUM.TURN_LEFT;
      Utils.info("move 左转");
      if (this.direction === ENTITY_DIRECTION_ENUM.UP) {
        this.direction = ENTITY_DIRECTION_ENUM.LEFT;
      } else if (this.direction === ENTITY_DIRECTION_ENUM.LEFT) {
        this.direction = ENTITY_DIRECTION_ENUM.DOWN;
      } else if (this.direction === ENTITY_DIRECTION_ENUM.DOWN) {
        this.direction = ENTITY_DIRECTION_ENUM.RIGHT;
      } else if (this.direction === ENTITY_DIRECTION_ENUM.RIGHT) {
        this.direction = ENTITY_DIRECTION_ENUM.UP;
      }
    } else if (input === CONTROL_ENUM.TURN_RIGHT) {
      this.state = ENTITY_STATE_ENUM.TURN_RIGHT;
      Utils.info("move 右转");
      if (this.direction === ENTITY_DIRECTION_ENUM.UP) {
        this.direction = ENTITY_DIRECTION_ENUM.RIGHT;
      } else if (this.direction === ENTITY_DIRECTION_ENUM.LEFT) {
        this.direction = ENTITY_DIRECTION_ENUM.UP;
      } else if (this.direction === ENTITY_DIRECTION_ENUM.DOWN) {
        this.direction = ENTITY_DIRECTION_ENUM.LEFT;
      } else if (this.direction === ENTITY_DIRECTION_ENUM.RIGHT) {
        this.direction = ENTITY_DIRECTION_ENUM.DOWN;
      }
    }

    // 触发烟雾
    this.showSmoke(input);

    // 触发操作结束事件
    EventManager.instance.emit(EVENT_ENUM.PLAYER_MOVE_END);
  }

  // 展示人物移动的飘起的灰尘动画
  showSmoke(input: CONTROL_ENUM) {
    if (input === CONTROL_ENUM.TURN_LEFT || input === CONTROL_ENUM.TURN_RIGHT)
      return;

    EventManager.instance.emit(EVENT_ENUM.SHOW_SMOKE, this.x, this.y, input);
  }

  // 让角色的坐标根据速度趋近于目标坐标,实现有动画的移动效果
  updatePosition() {
    if (!this.isMoving) return;
    // 逼近realX
    if (this.realX < this.x) {
      this.x -= this.speed;
    } else if (this.realX > this.x) {
      this.x += this.speed;
    }

    // 逼近realY
    if (this.realY < this.y) {
      this.y -= this.speed;
    } else if (this.realY > this.y) {
      this.y += this.speed;
    }

    // 坐标近似时就结束移动, 避免出现精度问题
    if (
      Math.abs(this.realX - this.x) < 0.1 &&
      Math.abs(this.realY - this.y) < 0.1
    ) {
      this.isMoving = false;
      this.x = this.realX;
      this.y = this.realY;
    }
  }

  // 处理玩家死亡事件
  playerDead(type: ENTITY_STATE_ENUM) {
    this.state = type;
  }

  update(dt: number) {
    this.updatePosition();
    super.update(dt);
  }

  async init(params: IEntity) {
    // 加载玩家角色的状态机
    this.fsm = this.addComponent(PlayerStateMachine);
    await this.fsm.init();

    super.init(params);
    this.realX = this.x;
    this.realY = this.y;

    // 当玩家按下操作按钮时, 触发move事件
    EventManager.instance.on(EVENT_ENUM.PLAYER_CONTROL, this.inputHandle, this);
    // 当玩家收到攻击时, 直接挂
    EventManager.instance.on(EVENT_ENUM.ATTACK_PLAYER, this.playerDead, this);
  }
  onDestroy() {
    EventManager.instance.off(
      EVENT_ENUM.PLAYER_CONTROL,
      this.inputHandle,
      this
    );
    EventManager.instance.off(EVENT_ENUM.ATTACK_PLAYER, this.playerDead, this);
  }
}
