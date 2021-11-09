import { IAPIModule } from "../InfrastsructureLayer/interfaces";
import { IProfileDTO } from "../UI/Layouts/Profile";

export interface IUserAPIClient {
  getUser(): Promise<IProfileDTO>;
  saveUser(user: IProfileDTO): Promise<IProfileDTO>
}

export class UserAPIClient implements IUserAPIClient {
  constructor(protected APIModule: IAPIModule) { }

  getUser = async () => {
    const user = await this.APIModule.getData<IProfileDTO>("/auth/user", {});
    return user;
  };

  saveUser = (user: IProfileDTO) => {
    return this.APIModule.putData<IProfileDTO>('/user/profile', user)
  }
}
