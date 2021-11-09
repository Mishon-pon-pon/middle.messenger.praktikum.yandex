import {HYPO} from '../../HYPO/HYPO';

export const EmailValidator = {
  value: '',
  checkFunc: function (value: string) {
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (!reg.test(value)) {
      this.value = '';
      return false;
    }
    this.value = value;
    return true;
  },
  callback: (elem: HYPO, checkResult: boolean) => {
    let state = elem.getState();
    if (!checkResult) {
      state.message = '⛔ это не похоже на адрес электронной почты';
    } else {
      state.message = '';
    }
  },
};
