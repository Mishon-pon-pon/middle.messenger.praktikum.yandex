import { Container } from "../libs/Container";
import { INTEGRATION_MODULE } from "../InfrastsructureLayer";
import { ChatAPIClient } from "./ChatAPI";
import { IAPIModule } from "../InfrastsructureLayer/interfaces";

export const API_CLIENT = {
  CHAT: Symbol.for("ChatAPIClient"),
};

export const ApiClientContainer = new Container();

ApiClientContainer.bind(API_CLIENT.CHAT).toDynamicValue((container) => {
  const APIModule = container.get<IAPIModule>(INTEGRATION_MODULE.APIModule);
  return new ChatAPIClient(APIModule);
});
