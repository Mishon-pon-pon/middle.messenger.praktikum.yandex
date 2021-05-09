import { HYPO } from "../../../libs/HYPO/HYPO";
import { router } from "../../..";
import { Button } from "../../Components/Button";

export const ChangeProfile = () => {
  return new HYPO({
    renderTo: document.getElementById("root") || document.body,
    templatePath: "changeProfile.template.html",
    data: {
      userName: "pochta@yandex.ru",
      login: "ivanivanov",
      firstName: "Иван",
      secondName: "Иванов",
      displayName: "Иван",
      phone: "+7 (123) 456 78 90",
    },
    children: {
      save: Button({
        title: "Сохранить",
        className: "profile_edit__action__save",
        onClick: (e: Event) => {
          router.go("/profile");
        },
      }),
    },
  });
};
