import { IUserAPIClient } from "../IntegrationalLayer/UserAPI";
import { IProfileDTO } from "../UI/Layouts/Profile";

export interface IUserService {
  getUser(): Promise<IProfileDTO>;
  saveUser(user:IProfileDTO):Promise<IProfileDTO>;
}

export class UserService implements IUserService {
  constructor(protected ApiClient: IUserAPIClient) {}
  saveUser(user:IProfileDTO):Promise<IProfileDTO>{
    return this.ApiClient.saveUser(user)
  }
  getUser() {
    return this.ApiClient.getUser();
  }
}
