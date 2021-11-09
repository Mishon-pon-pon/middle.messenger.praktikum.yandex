import { IUserService } from "../../BussinesLayer/UserService";
import { IProfileDTO } from "../../UI/Layouts/Profile";

export interface IUserViewModel {
  user?: IProfileDTO;
  getUser: () => Promise<void>;
  saveUser: (user: IProfileDTO) => Promise<IProfileDTO>;
  setUserField: (name: keyof IProfileDTO, value: any) => void;
}

export class UserViewModel implements IUserViewModel {
  user?: IProfileDTO;
  constructor(protected service: IUserService) {}

  getUser = async () => {
    this.user = await this.service.getUser();
  };

  saveUser = async (user: IProfileDTO) => {
    return this.service.saveUser(user);
  };

  setUserField(name: keyof IProfileDTO, value: any) {
    if (this.user) {
      this.user[name] = value as never;
    } else {
      this.user = {} as IProfileDTO;
      this.user[name] = value as never;
    }
  }
}
