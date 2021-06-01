import { HYPO } from "../../../libs/HYPO/HYPO";
import { container, router } from "../../..";
import { Button } from "../../Components/Button";
import { IProfileDTO } from "../Profile";
import { IUserViewModel } from "../../../ViewModel/UserViewModel";
import { VIEW_MODEL } from "../../../ViewModel";

export const ChangeProfile = (data: IProfileDTO) => {
  return new HYPO({
    renderTo: document.getElementById("root") || document.body,
    templatePath: "changeProfile.template.html",
    data: {
      email: data?.email,
      login: data?.login,
      firstName: data?.first_name,
      secondName: data?.second_name,
      displayName: data?.display_name,
      phone: data?.phone,
    },
    children: {
      save: Button({
        title: "Сохранить",
        className: "profile_edit__action__save",
        onClick: (e: Event) => {
          const userViewModel = container.get<IUserViewModel>(VIEW_MODEL.USER);
          if (userViewModel.user) {
            console.log(userViewModel.user);
            // userViewModel.user.display_name = 'ivan'
            // userViewModel.saveUser(userViewModel.user)
          }
        },
      }),
    },
  });
};
