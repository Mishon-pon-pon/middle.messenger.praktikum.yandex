import { HYPO } from "../../HYPO";

export const Required = {
  value: "",
  checkFunc: function (value: string): boolean {
    if (value === "") {
      this.value = "";
      return false;
    }
    this.value = value;
    return true;
  },
  callback: (elem: HYPO, checkResult: boolean) => {
    let state = elem.getState();
    if (!checkResult) {
      state.message = "⛔ обязательное поле";
    } else {
      state.message = "";
    }
  },
};