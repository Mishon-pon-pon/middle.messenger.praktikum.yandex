export class Container {
  containers: Map<symbol, any> = new Map();
  lastId?: symbol;
  constructor() {}
  bind(id: symbol): Container {
    this.lastId = id;
    this.containers.set(id, null);
    return this;
  }
  get = <T>(id: symbol): T => {
    const createContainerFn = this.containers.get(id);
    const createContainer = createContainerFn.fn(this);
    return createContainer;
  };

  toDynamicValue(fn: (container: Container) => unknown) {
    if (this.lastId)
      this.containers.set(this.lastId, { fn: fn, id: this.lastId });
  }

  parent(container: Container): Container {
    for (let cont of container.containers) {
      this.containers.set(cont[0], cont[1]);
    }
    return this;
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
