import { HYPO } from "../../../libs/HYPO/HYPO";
import Store from "../../../libs/Store";
import { ListItem } from "../ListItem";

interface IProps {
  menuId: string;
}

const menulist = ["Удалить чат", "Подробности", "Settings"];

export const MenuButton = ({ menuId }: IProps) => {
  const Menu = new HYPO({
    templatePath: "menubutton.template.html",
    data: { class: "hide", menuId: menuId },
    children: {
      list: menulist
        .map((text) => {
          return ListItem({
            text: text,
            onClick: () => {
              alert(Store.store.chat);
            },
          });
        })
        .reverse(),
    },
  }).afterRender(() => {
    const elem = document.getElementById(menuId);
    elem?.addEventListener("click", () => {
      const state = Menu.getState();
      const menuList = document.querySelector(".menu .menuList");
      const isHide = Array.from(menuList?.classList || []).includes("hide");
      if (isHide) {
        state.class = "show";
      } else {
        state.class = "hide";
      }
    });
  });

  return Menu;
};
