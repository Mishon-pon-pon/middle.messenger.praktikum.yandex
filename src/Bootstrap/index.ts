import {Container} from '../libs/Container';
import {infrastructureContainer} from '../InfrastsructureLayer/container';
import {ApiClientContainer} from '../IntegrationalLayer';
import {ServiceContainer} from '../BussinesLayer';
import {ViewModelContainer} from '../ViewModel';

const CreateDIContainer = (
  infrastructureContainer: Container,
  integreationContainer: Container,
  serviceContainer: Container,
  viewModelContainer: Container
) => {
  return viewModelContainer
    .parent(serviceContainer)
    .parent(integreationContainer)
    .parent(infrastructureContainer);
};

export class BootStrap {
  container: Container;
  constructor() {
    this.container = CreateDIContainer(
      infrastructureContainer,
      ApiClientContainer,
      ServiceContainer,
      ViewModelContainer
    );
  }
}
