import { LoginLayout } from "./Layouts/Login";
import { ChatLayout } from "./Layouts/Chat";
import { RegistrationLayout } from "./Layouts/Registration";
import { ProfileLayout } from "./Layouts/Profile";
import { ChangeProfile } from "./Layouts/ChangeProfile";
import { ChangePassword } from "./Layouts/ChangePassword";
import { Router } from "./libs/Router";
import { HTTPTransport } from "./libs/Transport";

export const router = new Router("#root")
  .use("/", LoginLayout, () => {
    return new HTTPTransport().GET("/auth/user").then((user) => {
      return JSON.parse(user.response);
    });
  })
  .use("/registration", RegistrationLayout)
  .use("/chat", ChatLayout, () => {
    return new HTTPTransport().GET("/chats").then((result) => {
      const resp = JSON.parse(result.response);
      return resp;
    });
  })
  .use("/profile", ProfileLayout, () => {
    return new HTTPTransport().GET("/auth/user").then((result) => {
      const resp = JSON.parse(result.response);
      return resp;
    });
  })
  .use("/editprofile", ChangeProfile)
  .use("/editpassword", ChangePassword)
  .start();
