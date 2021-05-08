import { HYPO } from "../../libs/HYPO/HYPO";
import { Button } from "../../Components/Button";
import { router } from "../..";
import { HTTPTransport } from "../../libs/Transport";

export interface IProfileDTO {
  id: number;
  display_name: string;
  email: string;
  first_name: string;
  second_name: string;
  login: string;
  phone: string;
}

export const ProfileLayout = (data: IProfileDTO) => {

  return new HYPO({
    renderTo: <HTMLElement>document.querySelector("#root"),
    templatePath: "profile.template.html",
    data: {
      ...data,
    },
    children: {
      EditProfileLink: Button({
        title: "Изменить данные",
        className: "action__change-profile",
        onClick: () => {
          router.go("/editprofile");
        },
      }),
      EditPasswordLink: Button({
        title: "Изменить пароль",
        className: "action__change-password",
        onClick: () => {
          router.go("/editpassword");
        },
      }),
      BackLink: Button({
        title: "Назад",
        className: "action__back",
        onClick: () => {
          router.go("/chat");
        },
      }),
      ExitLink: Button({
        title: "Выйти",
        className: "action__exit",
        onClick: () => {
          new HTTPTransport().POST("/auth/logout").then(() => {
            router.go("/");
          });
        },
      }),
    },
  });
};
