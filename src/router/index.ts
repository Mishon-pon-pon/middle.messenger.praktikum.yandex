import { LoginLayout } from "../UI/Layouts/Login";
import { ChatLayout } from "../UI/Layouts/Chat";
import { RegistrationLayout } from "../UI/Layouts/Registration";
import { ProfileLayout } from "../UI/Layouts/Profile";
import { ChangeProfile } from "../UI/Layouts/ChangeProfile";
import { ChangePassword } from "../UI/Layouts/ChangePassword";
import { Router } from "../libs/Router";
import { HTTPTransport } from "../libs/Transport";
import { IChatViewModel } from "../ViewModel/ChatViewModel";
import { VIEW_MODEL } from "../ViewModel";
import { Container } from "../libs/Container";
import { IUserViewModel } from "../ViewModel/UserViewModel";

export const RouterInit = (container: Container): Router => {
  return new Router("#root")
    .use("/", LoginLayout, () => {
      return HTTPTransport.getInstance()
        .GET("/auth/user")
        .then((user) => {
          return JSON.parse(user.response);
        });
    })
    .use("/registration", RegistrationLayout)
    .use("/chat", ChatLayout, async () => {
      const chatViewModel = container.get<IChatViewModel>(VIEW_MODEL.CHAT);
      await chatViewModel.getChats();
      return chatViewModel.chats;
    })
    .use("/profile", ProfileLayout, async () => {
      const userViewModel = container.get<IUserViewModel>(VIEW_MODEL.USER);
      await userViewModel.getUser();
      return userViewModel.user;
    })
    .use("/editprofile", ChangeProfile, async () => {
      const userViewModel = container.get<IUserViewModel>(VIEW_MODEL.USER);
      await userViewModel.getUser();
      return userViewModel.user;
    })
    .use("/editpassword", ChangePassword)
    .start();
};
