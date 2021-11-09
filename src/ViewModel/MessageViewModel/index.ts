import {makeObservable, observable} from '../../libs/Store';

export interface IMessageViewModel {
  messages: Array<string>;
  pushMessage: (m: string) => void;
}

export class MessageViewModel implements IMessageViewModel {
  messages: Array<string> = ['hello world'];
  constructor() {
    makeObservable(this, {
      messages: observable,
    });
  }

  pushMessage = (m: string) => {
    this.messages = [...this.messages, m];
  };
}
