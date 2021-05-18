import { IUserService } from "../../BussinesLayer/UserService";
import { IProfileDTO } from "../../UI/Layouts/Profile";

export interface IUserViewModel {
  user?: IProfileDTO;
  getUser: () => Promise<void>;
}

export class UserViewModel implements IUserViewModel {
  user?: IProfileDTO;
  constructor(protected service: IUserService) {}
  getUser = async () => {
    this.user = await this.service.getUser();
  };
}
