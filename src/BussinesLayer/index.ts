import { API_CLIENT } from "../IntegrationalLayer";
import { IChatAPIClient } from "../IntegrationalLayer/ChatAPI";
import { Container } from "../libs/Container";
import { ChatService } from "./ChatService";

export const SERVICE = {
  CHAT: Symbol.for("ChatService"),
};

export const ServiceContainer = new Container();

ServiceContainer.bind(SERVICE.CHAT).toDynamicValue((container) => {
  const APIClient = container.get<IChatAPIClient>(API_CLIENT.CHAT);
  return new ChatService(APIClient);
});
