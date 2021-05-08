# MyChat - это веб-чат. 
- Проект находится в разработке.
- Посмотреть можно по адресу https://heuristic-heisenberg-9beb42.netlify.app
- Проект в figma https://www.figma.com/file/MT31nuae9R026e57G5HQqC/Chat
## Установка.
клонируем:
```
git clone https://github.com/Mishon-pon-pon/mf.messenger.praktikum.yandex.git
```
переходим в дерикторию:
```
cd mf.messenger.praktikum.yandex
```
устанавливаем зависимости:
```
yarn install
```
запускаем:
```
yarn dev
```
запустится сервер статики на 3001 порту и webpack встанет на прослушку.

## HYPO.
В разработке чата используется библиотека HYPO(от слова Hypothalamus).
Инициализация компонента:
```javascript
new HYPO({
    template: "some.template.html",
    data: {}, 
    child: {
      childName: {
            element: HTMLElement | HYPO,
            handlers: [
                {
                    event: 'click',
                    callback: (e) => {}
                }
            ]
        }
    }
});
```
параметр | описание
------------ | -------------
template | название шаблона(удобно хранить шаблон в папке с кодом компонента. Остальное сделает за вас webpack при сборке).
data | здесь хранятся данные для шаблона(внутри шаблона участок с данными обозначается как {{someData}}).
child | здесь хранятся дочерние компоненты, которые могут быть представлены как в виде HTMLElement так и в виде экземпляра HYPO(в шаблоне участок с дочерним элементом обозначается как -=childName=-)
childName | то как будет называться ваш компонент внутри шаблона.
element | пока принимает только HTMLElement либо экземпляр класса HYPO(планируется реализовать передачу массива элементов).
handlers | массив обработчиков к дочернему элементу если он HTMLElement(планируется реализовать передачу обработчиков для экземпляров HYPO по ref-у на конкретный элемент шаблона).

### Шаблон.
пример шаблона:
```html
<main>
  <div class="gradient all_display"></div>
  <div class="container all_display">
    <form class="login_form" onsubmit="return false">
      <h1 class="login_form__title">{{FormName}}</h1>
      <div class="login_form__email control">
        <label for="form__email__input" class="control__label">Логин</label>
        -=InputLogin=-
        <div class="message_block">
          <span class="hidden attention_message" data-id="2"
            >⛔ это не похоже на адрес электронной почты</span
          >
        </div>
      </div>
      <div class="login_form__pass control">
        <label for="form__password__input" class="control__label">Пароль</label>
        -=InputPassword=-
        <div class="message_block">
          <span class="hidden attention_message" data-id="1"
            >⛔ обязательное поле</span
          >
        </div>
      </div>
      <div class="login_form__action">
        -=Button=-
        -=LinkToRegistration=-
      </div>
    </form>
  </div>
</main>
```


## ROUTER.
В проекте используется библиотека Router.
Если планируется делать более одной страницы, то можно использовать библиотеку Router для переходя по "страницам".
Пример инициализации:
```javascript
export const router = Router("#app").configureRoute([
  {
    to: "/",
    component: LoginLayout,
  },
  {
    to: "/registration",
    component: RegistrationLayout,
  },
  {
    to: "/chat",
    component: ChatLayout,
  },{
    to: '/profile',
    component: ProfileLayout
  },{
    to: '/editprofile',
    component: ChangeProfile
  },{
    to: '/editpassword',
    component: ChangePassword
  }
]);

router.init()
```

Импортируем HYPO компоненты. Задаём параметры переходов и инициализируем. При инициализации роутера в функцию Router передаем селектор корнего элемента приложения. Внутри используется паттерн Singleton потому в любом месте кода можно сделать импорт функции Router и получить доступ к функционалу роутера.
Для перехода на страницу нужно вызвать:
```javascript
Router().location('/destinationPath');
```