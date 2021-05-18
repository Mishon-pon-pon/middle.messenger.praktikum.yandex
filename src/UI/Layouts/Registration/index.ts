import { HYPO } from "../../../libs/HYPO/HYPO";
import { Input } from "../../Components/Input";
// import { Validator, Rule } from "../../libs/Validator";
import { EmailValidator } from "../../../libs/Validators/Email";
import { Required } from "../../../libs/Validators/Required";
import { AttentionMessage } from "../../Components/AttentionMessage";
import { router } from "../../..";
import { HTTPTransport } from "../../../libs/Transport";
import { Button } from "../../Components/Button";

export const RegistrationLayout = () => {
  const AttentionEmail = AttentionMessage();
  const AttentionLogin = AttentionMessage();
  const AttentionPassword = AttentionMessage();
  const AttentionPasswordDouble = AttentionMessage();
  const AttentionFirstName = AttentionMessage();
  const AttentionSecondName = AttentionMessage();
  const AttentionPhone = AttentionMessage();

  const FormData: Record<string, string> = {};

  return new HYPO({
    renderTo: <HTMLElement>document.querySelector("#root"),
    templatePath: "registration.template.html",
    data: {
      formTitle: "Регистрация",
    },
    children: {
      InputEmail: Input({
        label: "Почта",
        type: "text",
        name: "email",
        id: "form__email__input",
        className: "form-reg__form-input",
        ChildAttention: AttentionEmail,
        onBlur: (e: Event) => {
          const state = AttentionEmail.getState();
          const input = e.target as HTMLInputElement;
          if (EmailValidator.checkFunc(input.value)) {
            FormData["email"] = input.value;
            state.message = "";
          } else {
            state.message = "⛔ это не похоже на адрес электронной почты";
          }
        },
      }),
      InputLogin: Input({
        label: "Логин",
        type: "text",
        name: "login",
        id: "form__login__input",
        className: "form-reg__form-input",
        ChildAttention: AttentionLogin,
        onBlur: (e: Event) => {
          const state = AttentionLogin.getState();
          const input = e.target as HTMLInputElement;
          if (Required.checkFunc(input.value)) {
            FormData["login"] = input.value;
            state.message = "";
          } else {
            state.message = "⛔ обязательное поле";
          }
        },
      }),
      FirstName: Input({
        label: "Имя",
        type: "text",
        name: "first_name",
        id: "form__first_name__input",
        className: "form-reg__form-input",
        ChildAttention: AttentionFirstName,
        onBlur: (e: Event) => {
          const state = AttentionFirstName.getState();
          const input = e.target as HTMLInputElement;
          if (Required.checkFunc(input.value)) {
            FormData["first_name"] = input.value;
            state.message = "";
          } else {
            state.message = "⛔ обязательное поле";
          }
        },
      }),
      SecondName: Input({
        label: "Фамилия",
        type: "text",
        name: "second_name",
        id: "form__second_name__input",
        className: "form-reg__form-input",
        ChildAttention: AttentionSecondName,
        onBlur: (e: Event) => {
          const state = AttentionSecondName.getState();
          const input = e.target as HTMLInputElement;
          if (Required.checkFunc(input.value)) {
            FormData["second_name"] = input.value;
            state.message = "";
          } else {
            state.message = "⛔ обязательное поле";
          }
        },
      }),
      Phone: Input({
        label: "Телефон",
        type: "text",
        name: "phone",
        id: "form__phone__input",
        className: "form-reg__form-input",
        ChildAttention: AttentionPhone,
        onBlur: (e: Event) => {
          const state = AttentionPhone.getState();
          const input = e.target as HTMLInputElement;
          if (Required.checkFunc(input.value)) {
            FormData["phone"] = input.value;
            state.message = "";
          } else {
            state.message = "⛔ обязательное поле";
          }
        },
      }),
      Password: Input({
        label: "Пароль",
        type: "password",
        name: "password",
        id: "form__password__input",
        className: "form-reg__form-input",
        ChildAttention: AttentionPassword,
        onBlur: (e: Event) => {
          const input = e.target as HTMLInputElement;
          const state = AttentionPassword.getState();
          const stateD = AttentionPasswordDouble.getState();
          if (Required.checkFunc(input.value)) {
            FormData["password"] = input.value;
            state.message = "";
            if (FormData["password"] !== FormData["doublepassword"]) {
              stateD.message = "🔥пароли не совпадают";
            }
          } else {
            state.message = "⛔ обязательное поле";
          }
        },
      }),
      PasswordDouble: Input({
        label: "Пароль",
        type: "password",
        name: "doublepassword",
        id: "form__doublepassword__input",
        className: "form-reg__form-input",
        ChildAttention: AttentionPasswordDouble,
        onBlur: (e: Event) => {
          const input = e.target as HTMLInputElement;
          const state = AttentionPasswordDouble.getState();
          if (Required.checkFunc(input.value)) {
            FormData["doublepassword"] = input.value;
            state.message = "";
            if (FormData["password"] !== FormData["doublepassword"]) {
              state.message = "🔥пароли не совпадают";
            }
          } else {
            state.message = "⛔ обязательное поле";
          }
        },
      }),
      RegButton: Button({
        title: "Зарегистрироваться",
        className: "form-button",
        onClick: (e: Event) => {
          if (
            Object.keys(FormData).length == 0 ||
            Object.keys(FormData).find((item) => {
              return FormData[item] === "";
            })
          ) {
            return;
          }
          const data: { [key: string]: Record<string, string> } = {
            data: {
              first_name: FormData.first_name,
              second_name: FormData.second_name,
              login: FormData.login,
              email: FormData.email,
              password: FormData.password,
              phone: FormData.phone,
            },
            headers: {
              "Content-type": "application/json",
            },
          };
          HTTPTransport.getInstance().POST("/auth/signup", data);
        },
      }),
      LoginLink: Button({
        title: "Войти",
        className: "form-link",
        onClick: (e: Event) => {
          router.go("/");
        },
      }),
    },
  });
};
