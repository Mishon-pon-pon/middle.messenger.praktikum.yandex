import { HYPO } from "../../../libs/HYPO/HYPO";
import { ChatItem, IChatDTO } from "../../Components/ChatItem";
import { container, router } from "../../..";
import { Button } from "../../Components/Button";
import { Empty } from "../../Components/Empty";
import { CreateChatModal } from "../../Components/CreateChatModal";
import { IUserViewModel } from "../../../ViewModel/UserViewModel";
import { VIEW_MODEL } from "../../../ViewModel";

export const ChatLayout = (result: IChatDTO[]) => {
  const ChatItemList: HYPO[] = [];
  if (Array.isArray(result)) {
    result.forEach((item: any) => {
      ChatItemList.push(ChatItem({ ...item }));
    });
  } else {
    ChatItemList.push(Empty());
  }

  return new HYPO({
    renderTo: document.getElementById("root") || document.body,
    templatePath: "chat.template.html",
    data: {},
    children: {
      ProfileLink: Button({
        title: "Profile",
        className: "profile-link__button",
        onClick: (e: Event) => {
          router.go("/profile");
        },
      }),
      chatItem: ChatItemList,
      createChatModal: CreateChatModal(),
      createChatButton: Button({
        title: "+",
        className: "navigation__createChatButton",
        onClick: () => {
          document
            .getElementsByClassName("c-c-modal")[0]
            .classList.remove("hidden");
        },
      }),
    },
  });
};
