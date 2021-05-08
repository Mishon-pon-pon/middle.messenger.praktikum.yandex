import { eventBus } from "../EventBus";
import { memoize } from "../momize";

const StoreHandler: Record<string, StoreComponentHandler> = {};
export interface ComponentHandler {
  event: string;
  callback: Function;
}

export interface StoreComponentHandler {
  id: string;
  handlers: ComponentHandler[];
}

export interface ComponentChild {
  element: HTMLElement | HYPO | HTMLElement[] | HYPO[];
  handlers: ComponentHandler[];
}

interface IEVENT {
  FLOW_CDM: string;
  FLOW_CWR: string;
  FLOW_Validate: string;
}
export interface HYPOParams {
  template: string;
  renderTo?: HTMLElement;
  data: Record<string, unknown>;
  child: Record<string, ComponentChild>;
  handlers?: ComponentHandler[];
}

export class HYPO {
  renderTo: HTMLElement | string;
  templatePath: string;
  data: any;
  childComponents: Record<string, ComponentChild>;
  storeComponentsHandler: Record<string, StoreComponentHandler>;
  state: Record<string, unknown>;

  static EVENTS = {
    FLOW_CDM: "flow:component-did-mount",
    FLOW_CWR: "flow:component-was-rendered",
  };
  EVENTS: IEVENT;

  constructor(setting: HYPOParams) {
    this.templatePath = `./templates/${setting.template}`;
    this.renderTo = setting.renderTo || document.createElement("span");
    this.data = setting.data;
    this.childComponents = setting.child;
    this.storeComponentsHandler = {};
    this.state = this.data;
    this.EVENTS = {
      FLOW_CWR: "one",
      FLOW_CDM: "two",
      FLOW_Validate: "validate",
    };
    const that = this;

    this.ComponentRendered = this.ComponentRendered.bind(this);
    eventBus.on(this.EVENTS.FLOW_CWR, this.ComponentRendered);

    this.getTemplateHTML = memoize(this.getTemplateHTML);
    //TODO - сделать прослушку вложенных объектов
    this.state = new Proxy(this.state, {
      get(target, propName) {
        return target[String(propName)];
      },
      set(target, propName, value): boolean {
        that.data[propName] = value;
        that.render();
        return true;
      },
    });
  }

  render(): void {
    this._render().then((htmlTemplate) => {
      if (this.renderTo instanceof HTMLElement) {
        this.renderTo.innerHTML = htmlTemplate;
      } else {
        if (this.renderTo) {
          const root = document.getElementById(this.renderTo);
          if (root) {
            root.innerHTML = htmlTemplate;
          }
        }
      }

      eventBus.emit(this.EVENTS.FLOW_CWR);
    });
  }

  private async _render(): Promise<string> {
    let HTML = await this.getTemplateHTML().then((htmlTemplate) => {
      let HTML = this.insertComponentWrappersIntoHTML(
        htmlTemplate,
        this.childComponents
      );

      return new Promise<string>((resolve) => {
        this.renderComponentsIntoHTML(HTML, this.childComponents).then(
          (htmlTemplate) => {
            const HTML = this.insertValueIntoHTML(htmlTemplate, this.data);
            resolve(HTML);
          }
        );
      }).then((result) => {
        return result;
      });
    });
    return HTML;
  }

  private getTemplateHTML() {
    return new Promise<string>((resolve, reject) => {
      fetch(this.templatePath)
        .then((html) => {
          if (html.status !== 200) {
            throw new Error("file do not download");
          }
          return html.blob();
        })
        .then((result) => result.text())
        .then((text) => {
          resolve(text);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  private insertComponentWrappersIntoHTML(
    htmlTemplate: string,
    components: Record<string, ComponentChild>
  ): string {
    for (let key in components) {
      const mask = new RegExp(`-=${key}=-`, "g");
      htmlTemplate = htmlTemplate.replace(mask, `<span id=${key}></span>`);
    }
    return htmlTemplate;
  }

  private async renderComponentsIntoHTML(
    htmlTemplate: string,
    components: Record<string, ComponentChild>
  ): Promise<string> {
    const ghostRoot = document.createElement("div");
    ghostRoot.innerHTML = htmlTemplate;
    for (let key in components) {
      if (Array.isArray(components[key].element)) {
        let elementList = <HTMLElement[] | HYPO[]>components[key].element;
        const componentParentEl = ghostRoot.querySelector(`[id="${key}"]`);
        for (let element of elementList) {
          let uniqueId = uuidv4();
          if (componentParentEl) {
            let zigotaInstance = <HYPO>element;
            zigotaInstance.renderTo = uniqueId;
            if (zigotaInstance instanceof HYPO) {
              let z = await zigotaInstance._render();
              componentParentEl.innerHTML += `<span id="${uniqueId}">${z}</span>`;
            } else {
              const className = `${key}-${uuidv4()}`;
              const handlers = <ComponentHandler[]>(
                this.childComponents[key].handlers
              );
              StoreHandler[key] = {
                id: className,
                handlers: handlers,
              };
              let childHTMLElement = <HTMLElement>components[key].element;
              let clonechildHTMLElement = <HTMLElement>(
                childHTMLElement.cloneNode(true)
              );
              clonechildHTMLElement.classList.add(className);
              componentParentEl.append(clonechildHTMLElement);
            }
          }
        }
      } else {
        const componentParentEl = ghostRoot.querySelector(`[id="${key}"]`);
        if (componentParentEl) {
          let zigotaInstance = <HYPO>components[key].element;
          if (zigotaInstance instanceof HYPO) {
            await zigotaInstance._render().then((html) => {
              componentParentEl.innerHTML = html;
            });
          } else {
            const className = `${key}-${uuidv4()}`;
            const handlers = <ComponentHandler[]>(
              this.childComponents[key].handlers
            );
            StoreHandler[key] = {
              id: className,
              handlers: handlers,
            };
            let childHTMLElement = <HTMLElement>components[key].element;
            let clonechildHTMLElement = <HTMLElement>(
              childHTMLElement.cloneNode(true)
            );
            clonechildHTMLElement.classList.add(className);
            componentParentEl.append(clonechildHTMLElement);
          }
        }
      }
    }

    const HTML = this.removeComponentWrappers(ghostRoot.innerHTML);

    eventBus.on(this.EVENTS.FLOW_CWR, () => {
      for (let key in StoreHandler) {
        for (let handler of StoreHandler[key].handlers) {
          let element = document.querySelector(
            `.${StoreHandler[key].id}`
          ) as HTMLElement;
          if (!element) {
            console.error(`Не удалось найти элемент ${StoreHandler[key].id}`);
          } else {
            element?.addEventListener(handler.event, (e) => {
              handler.callback(e, element);
            });
          }
        }
        delete StoreHandler[key];
      }
    });
    return HTML;
  }

  private insertValueIntoHTML(
    htmlTemplate: string,
    data: Record<string, unknown>
  ): string {
    for (let key in data) {
      if (typeof data[key] !== "object") {
        const mask = new RegExp("{{" + key + "}}", "g");
        htmlTemplate = htmlTemplate.replace(mask, String(data[key]));
      }
    }

    return htmlTemplate;
  }

  private removeComponentWrappers(htmlTemplate: string): string {
    let div = document.createElement("div");
    div.innerHTML = htmlTemplate;
    for (let childName in this.childComponents) {
      if (this.childComponents[childName].element instanceof HYPO) {
        const zigotaInstanse = <HYPO>this.childComponents[childName].element;
        zigotaInstanse.renderTo = childName;
      } else {
        let elem = div.querySelector(`[id="${childName}"]`);
        const parentElem = elem?.parentElement;
        const childElems = elem?.children;
        elem?.remove();
        if (childElems) {
          for (let i = 0; i < childElems?.length; i++) {
            parentElem?.append(childElems[i]);
          }
        }
      }
    }
    return div.innerHTML;
  }

  getState(): Record<string, unknown> {
    return this.state;
  }

  public ComponentRendered(fn: Function = () => {}): HYPO {
    eventBus.on(this.EVENTS.FLOW_CWR, fn);
    return this;
  }

  public hide() {
    if (this.renderTo) {
      let children;
      if (typeof this.renderTo === "string") {
        children = document.querySelector(this.renderTo)?.children;
      } else {
        children = this.renderTo.children;
      }
      if (children) {
        for (let child of children) {
          child.remove();
        }
      }
    }
  }
}

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return `${v.toString(16)}`;
  });
}
