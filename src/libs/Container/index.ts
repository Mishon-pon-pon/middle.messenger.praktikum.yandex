class SingletonScope {
  InstanceMakers: Map<symbol, any> = new Map<
    symbol,
    { fn: (container: Container) => any; id: symbol }
  >();
  Instances: Map<symbol, any> = new Map<symbol, any>();
}

export class Container {
  containers: Map<symbol, any> = new Map();
  lastId?: symbol;
  constructor(
    protected singletoneScope: SingletonScope = new SingletonScope()
  ) {}
  bind(id: symbol): Container {
    this.lastId = id;
    this.containers.set(id, null);
    return this;
  }
  get = <T>(id: symbol): T => {
    const singleToneContainer = this.singletoneScope.InstanceMakers.get(id);
    if (singleToneContainer) {
      const instance = this.singletoneScope.Instances.get(id);
      if (instance) {
        return instance;
      } else {
        this.singletoneScope.Instances.set(id, singleToneContainer.fn(this));
        return this.singletoneScope.Instances.get(id);
      }
    } else {
      const createContainerFn = this.containers.get(id);
      return createContainerFn.fn(this);
    }
  };

  toDynamicValue(fn: (container: Container) => unknown) {
    if (this.lastId) {
      this.containers.set(this.lastId, { fn: fn, id: this.lastId });
    }

    return this;
  }

  parent(container: Container): Container {
    for (let cont of container.containers) {
      this.containers.set(cont[0], cont[1]);
    }
    return this;
  }

  inSingletoneScope() {
    if (this.lastId) {
      const container = this.containers.get(this.lastId);
      this.singletoneScope.InstanceMakers.set(this.lastId, container);
    }
  }
}
