export interface Rule {
  fieldName: string;
  checkFunc: (value: string) => boolean;
  callback: (checkResult: boolean) => void;
}
export class Validator {
  private isInit: boolean = false;
  private rules: Rule[];
  private fields?: HTMLInputElement[];
  constructor(rules: Rule[]) {
    this.rules = rules;
  }

  private findFields(): HTMLInputElement[] {
    return this.rules.map((rule) => {
      return (
        document.querySelector(`[name="${rule.fieldName}"]`) ||
        document.createElement("input")
      );
    });
  }

  private setHandler() {
    if (this.fields) {
      this.fields.forEach((field: HTMLInputElement) => {
        field.addEventListener("blur", (e: Event) => {
          const target = e.target as HTMLInputElement;
          const rule = this.findCheckFunc(target.name);
          let result = rule.checkFunc(target.value);
          rule.callback(result);
        });
      });
    }
  }

  private findCheckFunc(fieldName: string): Rule {
    for (let rule of this.rules) {
      if (rule.fieldName === fieldName) {
        return rule;
      }
    }
    return { fieldName: fieldName, checkFunc: () => true, callback: () => {} };
  }

  public checkForm(fn: Function) {
    const result = this.fields?.map((field) => {
      const rule = this.findCheckFunc(field.name);
      return {
        check: rule.checkFunc(field.value),
        name: field.name,
        value: field.value,
      };
    });

    fn(result);
  }

  init() {
    if (!this.isInit) {
      this.fields = this.findFields();
      this.setHandler();
    }
    this.isInit = true;
  }
}
