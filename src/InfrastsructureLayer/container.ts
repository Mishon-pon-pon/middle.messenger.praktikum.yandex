import {APIModule} from '.';
import {Container} from '../libs/Container';

export const INTEGRATION_MODULE = {
  APIModule: Symbol.for('API'),
};

export const infrastructureContainer = new Container();

infrastructureContainer
  .bind(INTEGRATION_MODULE.APIModule)
  .toDynamicValue((container) => {
    return new APIModule();
  });
