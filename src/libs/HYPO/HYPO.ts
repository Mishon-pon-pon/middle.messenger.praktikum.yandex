import { uuidv4 } from "../utils";
interface IHYPOProps {
  renderTo?: HTMLElement;
  templatePath: string;
  children?: Record<string, HYPO | HYPO[]>;
  data: Record<string, unknown>;
}

interface ITempateProp {
  html: string;
  templateKey: string;
  magicKey: string;
  isArray: boolean;
}

export class HYPO {
  private renderTo?: HTMLElement;
  private children?: Record<string, HYPO | HYPO[]>;
  private templatePath: string;
  private data: Record<string, unknown>;
  private templatesPromises: Promise<ITempateProp>[];
  private store: Record<string, unknown>;
  private magicKey: string;
  private afterRenderCallback: () => void;
  private afterRenderCallbackArr: Set<() => void>;

  constructor(params: IHYPOProps) {
    this.renderTo = params.renderTo;
    this.data = params.data;
    this.templatePath = `./templates/${params.templatePath}`;
    this.children = params.children;
    this.templatesPromises = [];
    this.store = {};
    this.magicKey = uuidv4();
    this.afterRenderCallback = () => {};
    this.afterRenderCallbackArr = new Set();
  }

  //@todo: прикрутить мемоизацию

  public getTemplateHTML(
    key: string,
    hypo: HYPO,
    isArray: boolean
  ): Promise<ITempateProp> {
    return new Promise<ITempateProp>((resolve, reject) => {
      fetch(hypo.templatePath)
        .then((html) => {
          if (html.status !== 200) {
            throw new Error("file do not download");
          }
          return html.blob();
        })
        .then((result) => {
          return result.text();
        })
        .then((text) => {
          text = this.insertDataIntoHTML(text, hypo.data);
          resolve({
            html: text,
            templateKey: key,
            magicKey: hypo.magicKey,
            isArray: isArray,
          });
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  private collectTemplates(
    hypo: HYPO | HYPO[],
    name: string,
    isArray: boolean
  ): HYPO {
    if (Array.isArray(hypo)) {
      this.handleArrayHYPO(hypo, name);
    } else {
      this.handleSimpleHYPO(hypo, name);
      this.templatesPromises.push(this.getTemplateHTML(name, hypo, isArray));
      this.afterRenderCallbackArr.add(hypo.afterRenderCallback);
    }
    return this;
  }

  private handleArrayHYPO(hypos: HYPO[], name: string): void {
    hypos.forEach((hypo) => {
      this.collectTemplates(hypo, `${name}`, true);
    });
  }

  private handleSimpleHYPO(hypo: HYPO, name: string): void {
    if (hypo.children) {
      Object.keys(hypo.children).forEach((childName) => {
        if (hypo.children) {
          return this.collectTemplates(
            hypo.children[childName],
            childName,
            false
          );
        }
      });
    }
  }

  private insertDataIntoHTML(
    htmlTemplate: string,
    data: Record<string, unknown>
  ): string {
    data = this.getDataWithoutIerarhy(data);
    for (let key in data) {
      if (typeof data[key] !== "object" || data[key] === null) {
        const mask = new RegExp("{{" + key + "}}", "g");
        htmlTemplate = htmlTemplate.replace(mask, String(data[key]));
      }
    }
    const mask = new RegExp(/{{[a-z._]+}}/g);
    htmlTemplate = htmlTemplate.replace(mask, "");
    return htmlTemplate;
  }

  private convertArrTemplateToMap(
    templateArr: {
      html: string;
      templateKey: string;
      magicKey: string;
      isArray: boolean | undefined;
    }[]
  ): Record<string, string> {
    const result: Record<string, string> = {};
    templateArr.forEach((item) => {
      if (result[item.templateKey]) {
        result[
          item.templateKey
        ] += `<span hypo="${item.magicKey}">${item.html}</span>`;
      } else {
        result[`${item.templateKey}-${item.magicKey}`] = item.html;
      }
    });

    return result;
  }

  private insertTemplateIntoTemplate(
    rootTemplateHTML: string,
    templateKey: string,
    childTemplateHTML: string,
    magicKey: string,
    isArray: boolean
  ): string {
    rootTemplateHTML = this.createElemWrapper(
      rootTemplateHTML,
      templateKey,
      magicKey,
      isArray
    );
    const mask = new RegExp(`-=${templateKey}-${magicKey}=-`, "g");
    rootTemplateHTML = rootTemplateHTML.replace(mask, childTemplateHTML);
    return rootTemplateHTML;
  }

  private createElemWrapper(
    htmlTemplate: string,
    templateKey: string,
    magicKey: string,
    isArray: boolean
  ) {
    const mask = new RegExp(`-=${templateKey}=-`, "g");
    if (isArray) {
      htmlTemplate = htmlTemplate.replace(
        mask,
        `<span hypo="${magicKey}">-=${templateKey}-${magicKey}=--=${templateKey}=-</span>`
      );
    } else {
      htmlTemplate = htmlTemplate.replace(
        mask,
        `<span hypo="${magicKey}">-=${templateKey}-${magicKey}=-</span>`
      );
    }

    return htmlTemplate;
  }

  private clearEmtpyComponent(html: string): string {
    const regex = /-=[a-z,A-Z,0-9]+=-/g;
    return html.replace(regex, "");
  }

  public render = async (): Promise<HYPO> => {
    const that = this;
    return Promise.all(
      this.collectTemplates(this, "root", false).templatesPromises
    ).then((arrayTemplates) => {
      const mapTemplates = this.convertArrTemplateToMap(arrayTemplates);
      let rootTemplateHTML: string =
        arrayTemplates[arrayTemplates.length - 1].html;
      for (let i = arrayTemplates.length - 2; i >= 0; i--) {
        let template =
          mapTemplates[
            `${arrayTemplates[i].templateKey}-${arrayTemplates[i].magicKey}`
          ];
        rootTemplateHTML = this.insertTemplateIntoTemplate(
          rootTemplateHTML,
          arrayTemplates[i].templateKey,
          template,
          arrayTemplates[i].magicKey,
          arrayTemplates[i].isArray
        );
      }

      rootTemplateHTML = this.clearEmtpyComponent(rootTemplateHTML);

      if (this.renderTo) {
        this.renderTo.innerHTML = rootTemplateHTML;
      } else {
        const elem = document.querySelector(`[hypo="${this.magicKey}"]`);
        if (elem) {
          this.renderTo = elem as HTMLElement;
          elem.innerHTML = rootTemplateHTML;
        }
      }
      this.afterRenderCallbackArr.forEach((callback) => {
        callback();
      });
      this.templatesPromises = [];
      return that;
    });
  };

  private rerender() {
    this.render();
  }

  public getState(): Record<string, unknown> {
    this.store = this.createStore(this.data);
    return this.store;
  }

  private createStore(store: any) {
    const that = this;
    const handler: ProxyHandler<Record<string, unknown>> = {
      get(target, property) {
        return target[<string>property];
      },
      set(target, property, value) {
        target[<string>property] = value;
        that.rerender();
        return true;
      },
    };
    store = new Proxy(store, handler);

    Object.keys(store).forEach((field) => {
      if (typeof store[field] === "object") {
        store[field] = new Proxy(store[field], handler);
        this.createStore(store[field]);
      }
    });

    return store;
  }

  private getDataWithoutIerarhy(data: any) {
    let pathArr: string[] = [];
    let resultObject: any = {};
    function fnz(obj: any) {
      for (let key in obj) {
        pathArr.push(key);
        if (typeof obj[key] === "object") {
          fnz(obj[key]);
        } else {
          resultObject[pathArr.join(".")] = obj[key];
          pathArr.pop();
        }
      }
      pathArr.pop();
    }
    fnz(data);

    return resultObject;
  }

  public afterRender(callback: () => void): HYPO {
    this.afterRenderCallback = callback;
    return this;
  }

  public hide() {
    if (this.renderTo) {
      let children;

      children = this.renderTo.children;
      if (children) {
        for (let child of children) {
          child.remove();
        }
      }
    }
  }
}
