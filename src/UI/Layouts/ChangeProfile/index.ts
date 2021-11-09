import { HYPO } from "../../../libs/HYPO/HYPO";
import { container, router } from "../../..";
import { Button } from "../../Components/Button";
import { IProfileDTO } from "../Profile";
import { IUserViewModel } from "../../../ViewModel/UserViewModel";
import { VIEW_MODEL } from "../../../ViewModel";
import { ProfileInput } from "../../Components/ProfileInput";

const Config: { [key in keyof IProfileDTO]?: { label: string } } = {
  email: {
    label: "Почта",
  },
  login: {
    label: "Логин",
  },
  first_name: {
    label: "Имя",
  },
  second_name: {
    label: "Фамилия",
  },
  display_name: {
    label: "Имя в чатах",
  },
  phone: {
    label: "Телефон",
  },
};

export const ChangeProfile = (data: IProfileDTO) => {
  const userViewModel = container.get<IUserViewModel>(VIEW_MODEL.USER);
  return new HYPO({
    renderTo: document.getElementById("root") || document.body,
    templatePath: "changeProfile.template.html",
    data: {
      email: data?.email,
      login: data?.login,
      firstName: data?.first_name,
      secondName: data?.second_name,
      displayName: data?.display_name || "",
      phone: data?.phone,
    },
    children: {
      save: Button({
        title: "Сохранить",
        className: "profile_edit__action__save",
        onClick: (e: Event) => {
          if (userViewModel.user) {
            const form = document.getElementsByClassName(
              "profile_edit"
            )[0] as HTMLFormElement;
            console.log(userViewModel.user);
            userViewModel.saveUser(userViewModel.user).finally(() => {
              router.go("/profile");
            });
          }
        },
      }),
      inputs: Object.keys(Config)
        .reverse()
        .map((item) => {
          const key = item as keyof typeof data;
          const label = Config[item as keyof typeof Config]?.label as string;
          const value = data ? (data[key] as string) : "";
          return ProfileInput({
            label: label,
            value: value,
            id: key,
            onChage: ({ value }) => {
              console.log(value);
              userViewModel.user = {
                ...userViewModel.user,
                [item]: value,
              } as IProfileDTO;
            },
          });
        }),
    },
  });
};
