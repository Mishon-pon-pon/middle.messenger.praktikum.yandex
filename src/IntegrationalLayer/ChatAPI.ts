import { IAPIModule } from "../InfrastsructureLayer/interfaces";
import { IChatDTO } from "../UI/Components/ChatItem";

export interface IChatAPIClient {
  getChats(): Promise<Array<IChatDTO>>;
  saveChat(data: Record<string, string>): Promise<void>;
  deleteChat(id: string): Promise<void>;
}

export class ChatAPIClient implements IChatAPIClient {
  constructor(protected APIModule: IAPIModule) {}

  getChats = async (): Promise<Array<IChatDTO>> => {
    return await this.APIModule.getData<IChatDTO[]>("/chats", {}).then(
      (result) => {
        return result;
      }
    );
  };

  saveChat = async (data: Record<string, string>): Promise<void> => {
    await this.APIModule.postData("/chats", data);
  };

  deleteChat(id: string): Promise<void> {
    return this.APIModule.deleteData("/chats", { chatId: id });
  }
}
