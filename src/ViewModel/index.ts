import { SERVICE } from "../BussinesLayer";
import { IChatService } from "../BussinesLayer/ChatService";
import { IUserService } from "../BussinesLayer/UserService";
import { Container } from "../libs/Container";
import { ChatViewModel } from "./ChatViewModel";
import { UserViewModel } from "./UserViewModel";

export const VIEW_MODEL = {
  CHAT: Symbol.for("ChatViewModel"),
  USER: Symbol.for("UserViewModel"),
};

export const ViewModelContainer = new Container();

ViewModelContainer.bind(VIEW_MODEL.CHAT).toDynamicValue((container) => {
  const service = container.get<IChatService>(SERVICE.CHAT);
  return new ChatViewModel(service);
});

ViewModelContainer.bind(VIEW_MODEL.USER)
  .toDynamicValue((container) => {
    const service = container.get<IUserService>(SERVICE.USER);
    return new UserViewModel(service);
  })
  .inSingletoneScope();
