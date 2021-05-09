import { SERVICE } from "../BussinesLayer";
import { IChatService } from "../BussinesLayer/ChatService";
import { Container } from "../libs/Container";
import { ChatViewModel } from "./ChatViewModel";

export const VIEW_MODEL = {
  CHAT: Symbol.for("ChatViewModel"),
};

export const ViewModelContainer = new Container();

ViewModelContainer.bind(VIEW_MODEL.CHAT).toDynamicValue((container) => {
  const service = container.get<IChatService>(SERVICE.CHAT);
  return new ChatViewModel(service);
});
