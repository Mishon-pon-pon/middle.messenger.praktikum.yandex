import { IChatDTO } from "../UI/Components/ChatItem";
import { IChatAPIClient } from "../IntegrationalLayer/ChatAPI";

export interface IChatService {
  getChats: () => Promise<Array<IChatDTO>>;
  saveChat: (data: Record<string, string>) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
}

export class ChatService implements IChatService {
  constructor(protected ApiClient: IChatAPIClient) {}

  getChats = (): Promise<Array<IChatDTO>> => {
    return this.ApiClient.getChats();
  };

  saveChat = (data: Record<string, string>) => {
    return this.ApiClient.saveChat(data);
  };

  deleteChat(chatId: string): Promise<void> {
    return this.ApiClient.deleteChat(chatId);
  }
}
