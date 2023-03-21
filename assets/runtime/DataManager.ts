import Singleton from "../base/Singleton";
import { ITile } from "../interfaces";
export default class DataManager extends Singleton {
  static get instance() {
    return super.getInstance<DataManager>();
  }

  map: Array<Array<ITile>>;
  mapRowCount: number;
  mapCol: number;
}
