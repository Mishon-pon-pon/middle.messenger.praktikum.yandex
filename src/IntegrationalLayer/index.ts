import {Container} from '../libs/Container';
import {INTEGRATION_MODULE} from '../InfrastsructureLayer/container';
import {ChatAPIClient} from './ChatAPI';
import {IAPIModule} from '../InfrastsructureLayer/interfaces';
import {UserAPIClient} from './UserAPI';

export const API_CLIENT = {
  CHAT: Symbol.for('ChatAPIClient'),
  USER: Symbol.for('UserAPIClient'),
};

export const ApiClientContainer = new Container();

ApiClientContainer.bind(API_CLIENT.CHAT).toDynamicValue((container) => {
  const APIModule = container.get<IAPIModule>(INTEGRATION_MODULE.APIModule);
  return new ChatAPIClient(APIModule);
});

ApiClientContainer.bind(API_CLIENT.USER).toDynamicValue((container) => {
  const APIModule = container.get<IAPIModule>(INTEGRATION_MODULE.APIModule);
  return new UserAPIClient(APIModule);
});
