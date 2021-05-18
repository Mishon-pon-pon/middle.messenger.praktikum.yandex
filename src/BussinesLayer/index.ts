import { API_CLIENT } from "../IntegrationalLayer";
import { IChatAPIClient } from "../IntegrationalLayer/ChatAPI";
import { IUserAPIClient } from "../IntegrationalLayer/UserAPI";
import { Container } from "../libs/Container";
import { ChatService } from "./ChatService";
import { UserService } from "./UserService";

export const SERVICE = {
  CHAT: Symbol.for("ChatService"),
  USER: Symbol.for("UserServcie"),
};

export const ServiceContainer = new Container();

ServiceContainer.bind(SERVICE.CHAT).toDynamicValue((container) => {
  const APIClient = container.get<IChatAPIClient>(API_CLIENT.CHAT);
  return new ChatService(APIClient);
});

ServiceContainer.bind(SERVICE.USER).toDynamicValue((container) => {
  const APIClient = container.get<IUserAPIClient>(API_CLIENT.USER);
  return new UserService(APIClient);
});
