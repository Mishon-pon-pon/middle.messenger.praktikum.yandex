import {Input} from '../../Components/Input';
import {Required} from '../../libs/Validators/Required';
import {AttentionMessage} from '../../Components/AttentionMessage';
import {router} from '../../index';
import {HTTPTransport} from '../../libs/Transport';
import {HYPO} from '../../libs/HYPO/HYPO';
import {Button} from '../../Components/Button';
import {IProfileDTO} from '../Profile';

/**
 * nnnrrr111NN
 */

export const LoginLayout = (user: IProfileDTO): HYPO => {
  if (user && user.id) {
    router.go('/chat');
  }

  const attentionLogin = AttentionMessage();
  const attentionLoginStore = attentionLogin.getState();
  const attentionPass = AttentionMessage();
  const attentionPassStore = attentionPass.getState();

  const FormData: Record<string, string> = {};
  return new HYPO({
    renderTo: document.getElementById('root') || document.body,
    templatePath: 'login.template.html',
    data: {
      FormName: 'Вход',
    },
    children: {
      InputLogin: Input({
        label: 'Логин',
        type: 'text',
        name: 'login',
        id: 'form-input-login',
        className: 'form-login__form-input',
        onBlur: (e: Event) => {
          const input = e.target as HTMLInputElement;
          const check = Required.checkFunc(input?.value);
          if (!check) {
            attentionLoginStore.message = '⛔ обязательное поле';
          } else {
            attentionLoginStore.message = '';
            FormData['login'] = input.value;
          }
        },
        ChildAttention: attentionLogin,
      }),
      InputPassword: Input({
        label: 'Пароль',
        type: 'password',
        name: 'password',
        id: 'form-input-password',
        className: 'form-login__form-input',
        onBlur: (e: Event) => {
          const input = e.target as HTMLInputElement;
          if (!Required.checkFunc(input.value)) {
            attentionPassStore.message = '⛔ обязательное поле';
          } else {
            attentionPassStore.message = '';
            FormData['password'] = input.value;
          }
        },
        ChildAttention: attentionPass,
      }),
      Button: Button({
        title: 'Авторизоваться',
        className: 'form-button',
        onClick: (e: Event) => {
          const data: {[key: string]: Record<string, string>} = {
            data: {
              login: FormData.login,
              password: FormData.password,
            },
            headers: {
              'Content-type': 'application/json',
            },
          };
          new HTTPTransport().POST('/auth/signin', data).then((result) => {
            if (result.status < 300) {
              router.go('/chat');
            }
          });
        },
      }),
      LinkToRegistration: Button({
        title: 'Зарегистрироваться',
        className: 'form-link',
        onClick: (e: Event) => {
          router.go('/registration');
        },
      }),
    },
  });
};
