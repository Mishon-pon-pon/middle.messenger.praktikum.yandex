import { router } from "../..";
import { HTTPTransport } from "../../libs/Transport";
import { HYPO } from "../../libs/HYPO/HYPO";
import { Required } from "../../libs/Validators/Required";
import { AttentionMessage } from "../AttentionMessage";
import { Button } from "../Button";
import { Input } from "../Input";

export const CreateChatModal = () => {
  const attentionMessage = AttentionMessage();
  const state = attentionMessage.getState();

  let ChatName = "";

  return new HYPO({
    templatePath: "createchatmodal.template.html",
    data: {},
    children: {
      input: Input({
        label: "Chat name",
        type: "text",
        name: "chatname",
        id: "chatname",
        className: "c-c-modal__input",
        ChildAttention: attentionMessage,
        onBlur: (e: Event) => {
          const input = e.target as HTMLInputElement;
          if (Required.checkFunc(input.value)) {
            state.message = "";
            ChatName = input.value;
          } else {
            state.message = "⛔ обязательное поле";
          }
        },
      }),
      create: Button({
        title: "Создать",
        className: "create-button",
        onClick: (e: Event) => {
          if (!ChatName) {
            state.message = "⛔ обязательное поле";
          } else {
            new HTTPTransport()
              .POST("/chats", {
                headers: {
                  "Content-type": "application/json",
                },
                data: {
                  title: ChatName,
                },
              })
              .then(() => {
                document
                  .getElementsByClassName("c-c-modal")[0]
                  .classList.add("hidden");
                router.go("/chat");
              });
          }
        },
      }),
      cancel: Button({
        title: "Отмена",
        className: "cancel-button",
        onClick: (e: Event) => {
          document
            .getElementsByClassName("c-c-modal")[0]
            .classList.add("hidden");
        },
      }),
    },
  });
};
