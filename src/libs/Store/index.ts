import { initStore } from "../../Store";
import { HYPO } from "../HYPO/HYPO";

let obj: any = {};
const map = new Map<Record<string, any>, HYPO>();

class _Store {
  public store: any;

  constructor(store: any) {
    this.store = new Proxy<any>(store, {
      get: (target: any, p: string | number | symbol, receiver: any) => {
        obj[p] = true;
        return target[p];
      },
      set: (target: any, p: string, value: any, receiver: any): boolean => {
        target[p] = value;
        for (let item of map.entries()) {
          if (item[0][p]) {
            const state = item[1].getState();
            item[1].render(target);
          }
        }
        return true;
      },
    });
  }
}

export function observer<T>(component: (props: T) => HYPO) {
  return (props: T) => {
    const _res = component(props);
    const state = _res.getState();
    map.set(obj, _res);
    obj = {};
    return _res;
  };
}

const Store = new _Store(initStore);

export default Store;
