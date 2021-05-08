import { HYPO } from "../HYPO";

interface IValidator {
  checkFunc(value: string): boolean;
  callback(elem: HYPO, isCheck: boolean): void;
  value: string;
  hypo: HYPO;
}

export class Validator {
  private Validators: Record<string, IValidator>;
  private FormData: Record<string, string>;
  constructor() {
    this.Validators = {};
    this.FormData = {};
  }
  registryValidator(name: string, validator: IValidator): Validator {
    this.Validators[name] = validator;
    return this;
  }
  getFormData(): Record<string, string> {
    this.checkAllValidators();
    for (let validator in this.Validators) {
      this.FormData[validator] = this.Validators[validator].value;
    }
    return this.FormData;
  }
  private checkAllValidators(): void {
    for (let validator in this.Validators) {
      const valid = this.Validators[validator];
      const input = document.querySelector(
        `[name="${validator}"]`
      ) as HTMLInputElement;

      valid.callback(valid.hypo, valid.checkFunc(input.value));
    }
  }
  runValidator(name: string, value: string) {
    const validator = this.Validators[name];
    validator.callback(validator.hypo, validator.checkFunc(value));
  }
}