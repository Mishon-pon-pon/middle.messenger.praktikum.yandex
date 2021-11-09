import { HYPO } from "../../../libs/HYPO/HYPO";
import { router } from "../../..";
import { Button } from "../../Components/Button";
import { memoize } from "../../../libs/momize";

export const ChangePassword = memoize(() => {
  return new HYPO({
    renderTo: document.getElementById("#root") || document.body,
    templatePath: "changePassword.template.html",
    data: {},
    children: {
      save: Button({
        title: "Сохранить",
        className: "password_edit__action__save",
        onClick: (e: Event) => {
          router.go("/profile");
        },
      }),
    },
  });
});
