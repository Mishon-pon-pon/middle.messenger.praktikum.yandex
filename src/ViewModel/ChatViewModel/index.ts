import {IChatService} from '../../BussinesLayer/ChatService';
import {makeObservable, observable} from '../../libs/Store';
import {IChatDTO} from '../../UI/Components/ChatItem';

export interface IChatViewModel {
  chats: Array<IChatDTO>;
  counter: number;
  arr: Array<string>;
  push: () => void;
  getChats: () => Promise<IChatDTO[]>;
  saveChat: (data: Record<string, string>) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
  increment: () => void;
  decriment: () => void;
}
export class ChatViewModel implements IChatViewModel {
  chats: Array<IChatDTO> = [];
  counter: number = 0;
  arr: Array<string> = ['hello'];
  constructor(protected service: IChatService) {
    makeObservable(this, {
      chats: observable,
      counter: observable,
      arr: observable,
    });
  }

  push = () => {
    this.arr = [...this.arr, 'hel'];
  };

  increment = () => {
    this.counter++;
  };

  decriment = () => {
    this.counter--;
  };

  getChats = async () => {
    this.chats = await this.service.getChats();
    return this.chats;
  };

  saveChat = async (data: Record<string, string>) => {
    await this.service.saveChat(data);
    await this.getChats();
  };

  deleteChat = async (chatId: string): Promise<void> => {
    await this.service.deleteChat(chatId);
    await this.getChats();
  };
}
