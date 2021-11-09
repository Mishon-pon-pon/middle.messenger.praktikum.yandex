import {HYPO} from '../HYPO/HYPO';

let components: any = {};
const mapComponent = new Map<Record<string, any>, HYPO>();

class _Store {
  public store: any;

  constructor(store: any) {
    this.store = new Proxy<any>(store, {
      get: (target: any, prop: string | number | symbol, receiver: any) => {
        // components[prop] = true;
        // return target[prop];
      },
      set: (target: any, prop: string, value: any, receiver: any): boolean => {
        // target[prop] = value;
        // for (let [usableProps, component] of mapComponent.entries()) {
        //   if (usableProps[prop]) {
        //     component.render(target);
        //   }
        // }
        return true;
      },
    });
  }
}

let _component: HYPO;

let isComponent = false;

const ViewModels: Record<string, Array<HYPO>> = {};

export function observer<T>(component: (props: T) => HYPO) {
  return (props: T) => {
    isComponent = true;
    _component = component(props);
    receiversArr.forEach((item: any) => {
      if (ViewModels[item.constructor.name]) {
        ViewModels[item.constructor.name].push(_component);
      } else {
        ViewModels[item.constructor.name] = [_component];
      }
    });
    isComponent = false;
    mapComponent.set(components, _component);
    components = {};
    return _component;
  };
}

const _StoreGlobal: Record<string, Object> = {};

const mapHypoToViewModel = new Map<HYPO, any>();

const receiversArr = new Set();

export function makeObservable<T>(
  that: ThisType<T>,
  state: Record<string, boolean>
) {
  const entityState: Record<string, any> = {};
  const name = that.constructor.name;
  const xxx = {...that};

  //@ts-ignore
  const proto = that.__proto__;

  for (let key in that) {
    if (state[key]) {
      if (typeof that[key as keyof typeof that] === 'object') {
        entityState[key] = new Proxy(xxx[key as keyof typeof that], {
          set: (target: any, prop: string, value: any, receiver: any) => {
            debugger;
            target[prop] = value;
            ViewModels?.[receiver.constructor.name]?.forEach((component) => {
              component.render(target);
            });
            return true;
          },
          get: (target: any, prop: string | number | symbol, receiver: any) => {
            if (isComponent) receiversArr.add(receiver);
            components[prop] = true;
            return target[prop];
          },
        });
      } else {
        entityState[key] = xxx[key as keyof typeof that];
      }

      delete that[key as keyof typeof that];
    }
  }

  const observableValidation = {
    set: (target: any, prop: string, value: any, receiver: any) => {
      target[prop] = value;
      ViewModels?.[receiver.constructor.name]?.forEach((component) => {
        component.render(target);
      });
      return true;
    },
    //@ts-ignore
    get: (target: any, prop: string | number | symbol, receiver: any) => {
      if (isComponent) receiversArr.add(receiver);
      components[prop] = true;
      // if (target[prop] && typeof target[prop] === 'object') {
      //   target[prop] = new Proxy(target[prop], observableValidation);
      //   return new Proxy(target[prop], observableValidation);
      // }
      return target[prop];
    },
  };

  const proxy = new Proxy(entityState, observableValidation);

  proxy.__proto__ = proto;

  //@ts-ignore
  that.__proto__ = proxy;

  _StoreGlobal[name] = proxy;
}

export const observable = true;
