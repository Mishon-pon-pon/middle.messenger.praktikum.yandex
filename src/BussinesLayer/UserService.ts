import { IUserAPIClient } from "../IntegrationalLayer/UserAPI";
import { IProfileDTO } from "../UI/Layouts/Profile";

export interface IUserService {
  getUser(): Promise<IProfileDTO>;
}

export class UserService implements IUserService {
  constructor(protected ApiClient: IUserAPIClient) {}
  getUser() {
    return this.ApiClient.getUser();
  }
}
