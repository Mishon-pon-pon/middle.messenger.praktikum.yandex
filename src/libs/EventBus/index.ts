export class EventBus {
  listeners: Map<string | symbol, Function[]>;
  constructor() {
    this.listeners = new Map();
  }

  on(event: string | symbol, callback: Function) {
    if (!this.listeners.get(event)) {
      this.listeners.set(event, []);
    }

    this.listeners.get(event)?.push(callback);
  }

  off(event: string | symbol, callback: Function) {
    if (!this.listeners.get(event)) {
      throw new Error(`Нет события: ${typeof event === "symbol" ? "" : event}`);
    }

    const callbacks = this.listeners
      .get(event)
      ?.filter((callback) => callback !== callback);

    this.listeners.set(event, callbacks as Function[]);
  }

  emit(event: string | symbol, ...args: unknown[]) {
    if (!this.listeners.get(event)) {
      throw new Error(`Нет события: ${typeof event === "symbol" ? "" : event}`);
    }

    this.listeners.get(event)?.forEach(function (listener) {
      listener(...args);
    });
  }
}

let _eventBus: EventBus;

function getEventBus() {
  if (!_eventBus) {
    _eventBus = new EventBus();
  }

  return _eventBus;
}

export const eventBus = getEventBus();
