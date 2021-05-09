import { IChatService } from "../../BussinesLayer/ChatService";
import { IChatDTO } from "../../UI/Components/ChatItem";

export interface IChatViewModel {
  chats: Array<IChatDTO>;
  getChats: () => Promise<IChatDTO[]>;
  saveChat: (data: Record<string, string>) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
}
export class ChatViewModel implements IChatViewModel {
  chats: Array<IChatDTO> = [];
  x: number = 12;
  constructor(protected service: IChatService) {}

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
