const SingleToneContainers = new Map<symbol, any>()
const SingleTonesInstances = new Map<symbol, any>();
export class Container {
  containers: Map<symbol, any> = new Map();
  lastId?: symbol;
  constructor() { }
  bind(id: symbol): Container {
    this.lastId = id;
    this.containers.set(id, null);
    return this;
  }
  get = <T>(id: symbol): T => {
    const singleToneContainer = SingleToneContainers.get(id);
    if (singleToneContainer) {
      const instance = SingleTonesInstances.get(id)
      if(instance) {
        return instance
      } else {
        SingleTonesInstances.set(id, singleToneContainer.fn(this))
        return SingleTonesInstances.get(id)
      }
    } else {
      const createContainerFn = this.containers.get(id);
      return createContainerFn.fn(this)
    }
  };

  toDynamicValue(fn: (container: Container) => unknown) {
    if (this.lastId)
      this.containers.set(this.lastId, { fn: fn, id: this.lastId });

    return this;
  }

  parent(container: Container): Container {
    for (let cont of container.containers) {
      this.containers.set(cont[0], cont[1]);
    }
    return this;
  }

  isSingletone() {
    if (this.lastId) {
      const container = this.containers.get(this.lastId)
      SingleToneContainers.set(this.lastId, container)
    }

  }
}

// const VIEW_MODEL = {
//   Chat: Symbol.for("ChatViewModel"),
// };

// const SERVICE = {
//   CHAT: Symbol.for("ChatService"),
// };

// const ViewModelContainer = new Container();
// const ServiceContainer = new Container();

// class S {
//   constructor(public v: V) {}
//   x: number = 1;
// }

// class V {
//   y: number = 2;
// }

// ViewModelContainer.bind(VIEW_MODEL.Chat).toDynamicValue((container) => {
//   return new V();
// });

// ServiceContainer.bind(SERVICE.CHAT).toDynamicValue((container) => {
//   const viewModelContainer = container.get<V>(VIEW_MODEL.Chat);
//   return new S(viewModelContainer);
// });

// ServiceContainer.parent(ViewModelContainer);

// const service = ServiceContainer.get<S>(SERVICE.CHAT);
// console.log(service);

// const viewModel = ServiceContainer.get<V>(VIEW_MODEL.Chat);
// console.log(viewModel);
