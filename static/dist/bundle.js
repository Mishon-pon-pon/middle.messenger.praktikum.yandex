/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/Components/AttentionMessage/index.ts":
/*!**************************************************!*\
  !*** ./src/Components/AttentionMessage/index.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AttentionMessage = void 0;
const HYPO_1 = __webpack_require__(/*! ../../libs/HYPO/HYPO */ "./src/libs/HYPO/HYPO.ts");
const AttentionMessage = () => {
    return new HYPO_1.HYPO({
        templatePath: "attention.template.html",
        data: {
            message: "",
        },
        children: {},
    });
};
exports.AttentionMessage = AttentionMessage;


/***/ }),

/***/ "./src/Components/Button/index.ts":
/*!****************************************!*\
  !*** ./src/Components/Button/index.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Button = void 0;
const HYPO_1 = __webpack_require__(/*! ../../libs/HYPO/HYPO */ "./src/libs/HYPO/HYPO.ts");
const utils_1 = __webpack_require__(/*! ../../libs/utils */ "./src/libs/utils/index.ts");
const Button = (props) => {
    const id = props.id || utils_1.uuidv4();
    return new HYPO_1.HYPO({
        templatePath: "button.template.html",
        data: {
            id: id,
            title: props.title,
            className: props.className,
        },
    }).afterRender(() => {
        var _a;
        (_a = document.getElementById(id)) === null || _a === void 0 ? void 0 : _a.addEventListener("click", (e) => {
            props.onClick(e);
        });
    });
};
exports.Button = Button;


/***/ }),

/***/ "./src/Components/ChatItem/index.ts":
/*!******************************************!*\
  !*** ./src/Components/ChatItem/index.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChatItem = void 0;
const HYPO_1 = __webpack_require__(/*! ../../libs/HYPO/HYPO */ "./src/libs/HYPO/HYPO.ts");
const Transport_1 = __webpack_require__(/*! ../../libs/Transport */ "./src/libs/Transport/index.ts");
const Delete_1 = __webpack_require__(/*! ../Delete */ "./src/Components/Delete/index.ts");
const ChatItem = (props) => {
    return new HYPO_1.HYPO({
        templatePath: "chatItem.template.html",
        data: {
            ChatName: props.title,
            lastTime: props.created_by || "10:22",
            lastMessage: props.id || "Hi, how are you?",
            notificationCount: props.avatar || 3,
        },
        children: {
            delete: Delete_1.Delete({
                id: `deleteItem${props.id}`,
                onClick: () => {
                    new Transport_1.HTTPTransport().DELETE("/chats", {
                        headers: {
                            "Content-type": "application/json",
                        },
                        data: {
                            chatId: String(props.id),
                        },
                    });
                },
            }),
        },
    });
};
exports.ChatItem = ChatItem;


/***/ }),

/***/ "./src/Components/CreateChatModal/index.ts":
/*!*************************************************!*\
  !*** ./src/Components/CreateChatModal/index.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateChatModal = void 0;
const __1 = __webpack_require__(/*! ../.. */ "./src/index.ts");
const Transport_1 = __webpack_require__(/*! ../../libs/Transport */ "./src/libs/Transport/index.ts");
const HYPO_1 = __webpack_require__(/*! ../../libs/HYPO/HYPO */ "./src/libs/HYPO/HYPO.ts");
const Required_1 = __webpack_require__(/*! ../../libs/Validators/Required */ "./src/libs/Validators/Required/index.ts");
const AttentionMessage_1 = __webpack_require__(/*! ../AttentionMessage */ "./src/Components/AttentionMessage/index.ts");
const Button_1 = __webpack_require__(/*! ../Button */ "./src/Components/Button/index.ts");
const Input_1 = __webpack_require__(/*! ../Input */ "./src/Components/Input/index.ts");
const CreateChatModal = () => {
    const attentionMessage = AttentionMessage_1.AttentionMessage();
    const state = attentionMessage.getState();
    let ChatName = "";
    return new HYPO_1.HYPO({
        templatePath: "createchatmodal.template.html",
        data: {},
        children: {
            input: Input_1.Input({
                label: "Chat name",
                type: "text",
                name: "chatname",
                id: "chatname",
                className: "c-c-modal__input",
                ChildAttention: attentionMessage,
                onBlur: (e) => {
                    const input = e.target;
                    if (Required_1.Required.checkFunc(input.value)) {
                        state.message = "";
                        ChatName = input.value;
                    }
                    else {
                        state.message = "⛔ обязательное поле";
                    }
                },
            }),
            create: Button_1.Button({
                title: "Создать",
                className: "create-button",
                onClick: (e) => {
                    if (!ChatName) {
                        state.message = "⛔ обязательное поле";
                    }
                    else {
                        new Transport_1.HTTPTransport()
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
                            __1.router.go("/chat");
                        });
                    }
                },
            }),
            cancel: Button_1.Button({
                title: "Отмена",
                className: "cancel-button",
                onClick: (e) => {
                    document
                        .getElementsByClassName("c-c-modal")[0]
                        .classList.add("hidden");
                },
            }),
        },
    });
};
exports.CreateChatModal = CreateChatModal;


/***/ }),

/***/ "./src/Components/Delete/index.ts":
/*!****************************************!*\
  !*** ./src/Components/Delete/index.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Delete = void 0;
const HYPO_1 = __webpack_require__(/*! ../../libs/HYPO/HYPO */ "./src/libs/HYPO/HYPO.ts");
const Delete = (props) => {
    return new HYPO_1.HYPO({
        templatePath: "delete.template.html",
        data: {
            path: "/media/Vector.svg",
            id: props.id,
        },
        children: {},
    }).afterRender(() => {
        var _a;
        (_a = document.getElementById(props.id)) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
            props.onClick();
        });
    });
};
exports.Delete = Delete;


/***/ }),

/***/ "./src/Components/Empty/index.ts":
/*!***************************************!*\
  !*** ./src/Components/Empty/index.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Empty = void 0;
const HYPO_1 = __webpack_require__(/*! ../../libs/HYPO/HYPO */ "./src/libs/HYPO/HYPO.ts");
const Empty = () => {
    return new HYPO_1.HYPO({
        templatePath: 'empty.template.html',
        data: {}
    });
};
exports.Empty = Empty;


/***/ }),

/***/ "./src/Components/Input/index.ts":
/*!***************************************!*\
  !*** ./src/Components/Input/index.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Input = void 0;
const HYPO_1 = __webpack_require__(/*! ../../libs/HYPO/HYPO */ "./src/libs/HYPO/HYPO.ts");
const Empty_1 = __webpack_require__(/*! ../Empty */ "./src/Components/Empty/index.ts");
//@todo: прикрутить уникальность каждого элемента
const Input = (props) => {
    return new HYPO_1.HYPO({
        templatePath: "input.template.html",
        data: {
            label: {
                name: props.label,
            },
            atribute: {
                type: props.type,
                name: props.name,
                id: props.id,
                className: props.className,
            },
        },
        children: {
            Attention: props.ChildAttention || Empty_1.Empty(),
        },
    }).afterRender(() => {
        var _a, _b;
        (_a = document
            .getElementById(props.id)) === null || _a === void 0 ? void 0 : _a.addEventListener("focus", (e) => {
            var _a, _b, _c;
            const input = e.target;
            const inputLabel = (_b = (_a = input.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.querySelector(".form-input__label");
            inputLabel === null || inputLabel === void 0 ? void 0 : inputLabel.classList.add("form-input__label_select");
            (_c = props.onFocus) === null || _c === void 0 ? void 0 : _c.call(props, e);
        });
        (_b = document.getElementById(props.id)) === null || _b === void 0 ? void 0 : _b.addEventListener("blur", (e) => {
            var _a, _b, _c;
            const input = e.target;
            const inputLabel = (_b = (_a = input.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.querySelector(".form-input__label");
            if (!input.value) {
                inputLabel === null || inputLabel === void 0 ? void 0 : inputLabel.classList.remove("form-input__label_select");
            }
            (_c = props.onBlur) === null || _c === void 0 ? void 0 : _c.call(props, e);
        });
    });
};
exports.Input = Input;


/***/ }),

/***/ "./src/Layouts/ChangePassword/index.ts":
/*!*********************************************!*\
  !*** ./src/Layouts/ChangePassword/index.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChangePassword = void 0;
const HYPO_1 = __webpack_require__(/*! ../../libs/HYPO/HYPO */ "./src/libs/HYPO/HYPO.ts");
const __1 = __webpack_require__(/*! ../.. */ "./src/index.ts");
const Button_1 = __webpack_require__(/*! ../../Components/Button */ "./src/Components/Button/index.ts");
const momize_1 = __webpack_require__(/*! ../../libs/momize */ "./src/libs/momize/index.js");
exports.ChangePassword = momize_1.memoize(() => {
    return new HYPO_1.HYPO({
        renderTo: document.getElementById("#root") || document.body,
        templatePath: "changePassword.template.html",
        data: {},
        children: {
            save: Button_1.Button({
                title: "Сохранить",
                className: "password_edit__action__save",
                onClick: (e) => {
                    __1.router.go("/profile");
                },
            }),
        },
    });
});


/***/ }),

/***/ "./src/Layouts/ChangeProfile/index.ts":
/*!********************************************!*\
  !*** ./src/Layouts/ChangeProfile/index.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChangeProfile = void 0;
const HYPO_1 = __webpack_require__(/*! ../../libs/HYPO/HYPO */ "./src/libs/HYPO/HYPO.ts");
const __1 = __webpack_require__(/*! ../.. */ "./src/index.ts");
const Button_1 = __webpack_require__(/*! ../../Components/Button */ "./src/Components/Button/index.ts");
const ChangeProfile = () => {
    return new HYPO_1.HYPO({
        renderTo: document.getElementById('root') || document.body,
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
            save: Button_1.Button({
                title: "Сохранить",
                className: "profile_edit__action__save",
                onClick: (e) => {
                    __1.router.go("/profile");
                },
            }),
        },
    });
};
exports.ChangeProfile = ChangeProfile;


/***/ }),

/***/ "./src/Layouts/Chat/index.ts":
/*!***********************************!*\
  !*** ./src/Layouts/Chat/index.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChatLayout = void 0;
const HYPO_1 = __webpack_require__(/*! ../../libs/HYPO/HYPO */ "./src/libs/HYPO/HYPO.ts");
const ChatItem_1 = __webpack_require__(/*! ../../Components/ChatItem */ "./src/Components/ChatItem/index.ts");
const __1 = __webpack_require__(/*! ../.. */ "./src/index.ts");
const Button_1 = __webpack_require__(/*! ../../Components/Button */ "./src/Components/Button/index.ts");
const Empty_1 = __webpack_require__(/*! ../../Components/Empty */ "./src/Components/Empty/index.ts");
const CreateChatModal_1 = __webpack_require__(/*! ../../Components/CreateChatModal */ "./src/Components/CreateChatModal/index.ts");
const ChatLayout = (result) => {
    const ChatItemList = [];
    if (Array.isArray(result)) {
        result.forEach((item) => {
            ChatItemList.push(ChatItem_1.ChatItem(Object.assign({}, item)));
        });
    }
    else {
        ChatItemList.push(Empty_1.Empty());
    }
    return new HYPO_1.HYPO({
        renderTo: document.getElementById("root") || document.body,
        templatePath: "chat.template.html",
        data: {},
        children: {
            ProfileLink: Button_1.Button({
                title: "Profile",
                className: "profile-link__button",
                onClick: (e) => {
                    __1.router.go("/profile");
                },
            }),
            chatItem: ChatItemList,
            createChatModal: CreateChatModal_1.CreateChatModal(),
            createChatButton: Button_1.Button({
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
exports.ChatLayout = ChatLayout;


/***/ }),

/***/ "./src/Layouts/Login/index.ts":
/*!************************************!*\
  !*** ./src/Layouts/Login/index.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoginLayout = void 0;
const Input_1 = __webpack_require__(/*! ../../Components/Input */ "./src/Components/Input/index.ts");
const Required_1 = __webpack_require__(/*! ../../libs/Validators/Required */ "./src/libs/Validators/Required/index.ts");
const AttentionMessage_1 = __webpack_require__(/*! ../../Components/AttentionMessage */ "./src/Components/AttentionMessage/index.ts");
const index_1 = __webpack_require__(/*! ../../index */ "./src/index.ts");
const Transport_1 = __webpack_require__(/*! ../../libs/Transport */ "./src/libs/Transport/index.ts");
const HYPO_1 = __webpack_require__(/*! ../../libs/HYPO/HYPO */ "./src/libs/HYPO/HYPO.ts");
const Button_1 = __webpack_require__(/*! ../../Components/Button */ "./src/Components/Button/index.ts");
/**
 * nnnrrr111NN
 */
const LoginLayout = (user) => {
    if (user && user.id) {
        index_1.router.go('/chat');
    }
    const attentionLogin = AttentionMessage_1.AttentionMessage();
    const attentionLoginStore = attentionLogin.getState();
    const attentionPass = AttentionMessage_1.AttentionMessage();
    const attentionPassStore = attentionPass.getState();
    const FormData = {};
    return new HYPO_1.HYPO({
        renderTo: document.getElementById('root') || document.body,
        templatePath: 'login.template.html',
        data: {
            FormName: 'Вход',
        },
        children: {
            InputLogin: Input_1.Input({
                label: 'Логин',
                type: 'text',
                name: 'login',
                id: 'form-input-login',
                className: 'form-login__form-input',
                onBlur: (e) => {
                    const input = e.target;
                    const check = Required_1.Required.checkFunc(input === null || input === void 0 ? void 0 : input.value);
                    if (!check) {
                        attentionLoginStore.message = '⛔ обязательное поле';
                    }
                    else {
                        attentionLoginStore.message = '';
                        FormData['login'] = input.value;
                    }
                },
                ChildAttention: attentionLogin,
            }),
            InputPassword: Input_1.Input({
                label: 'Пароль',
                type: 'password',
                name: 'password',
                id: 'form-input-password',
                className: 'form-login__form-input',
                onBlur: (e) => {
                    const input = e.target;
                    if (!Required_1.Required.checkFunc(input.value)) {
                        attentionPassStore.message = '⛔ обязательное поле';
                    }
                    else {
                        attentionPassStore.message = '';
                        FormData['password'] = input.value;
                    }
                },
                ChildAttention: attentionPass,
            }),
            Button: Button_1.Button({
                title: 'Авторизоваться',
                className: 'form-button',
                onClick: (e) => {
                    const data = {
                        data: {
                            login: FormData.login,
                            password: FormData.password,
                        },
                        headers: {
                            'Content-type': 'application/json',
                        },
                    };
                    new Transport_1.HTTPTransport().POST('/auth/signin', data).then((result) => {
                        if (result.status < 300) {
                            index_1.router.go('/chat');
                        }
                    });
                },
            }),
            LinkToRegistration: Button_1.Button({
                title: 'Зарегистрироваться',
                className: 'form-link',
                onClick: (e) => {
                    index_1.router.go('/registration');
                },
            }),
        },
    });
};
exports.LoginLayout = LoginLayout;


/***/ }),

/***/ "./src/Layouts/Profile/index.ts":
/*!**************************************!*\
  !*** ./src/Layouts/Profile/index.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProfileLayout = void 0;
const HYPO_1 = __webpack_require__(/*! ../../libs/HYPO/HYPO */ "./src/libs/HYPO/HYPO.ts");
const Button_1 = __webpack_require__(/*! ../../Components/Button */ "./src/Components/Button/index.ts");
const __1 = __webpack_require__(/*! ../.. */ "./src/index.ts");
const Transport_1 = __webpack_require__(/*! ../../libs/Transport */ "./src/libs/Transport/index.ts");
const ProfileLayout = (data) => {
    return new HYPO_1.HYPO({
        renderTo: document.querySelector("#root"),
        templatePath: "profile.template.html",
        data: Object.assign({}, data),
        children: {
            EditProfileLink: Button_1.Button({
                title: "Изменить данные",
                className: "action__change-profile",
                onClick: () => {
                    __1.router.go("/editprofile");
                },
            }),
            EditPasswordLink: Button_1.Button({
                title: "Изменить пароль",
                className: "action__change-password",
                onClick: () => {
                    __1.router.go("/editpassword");
                },
            }),
            BackLink: Button_1.Button({
                title: "Назад",
                className: "action__back",
                onClick: () => {
                    __1.router.go("/chat");
                },
            }),
            ExitLink: Button_1.Button({
                title: "Выйти",
                className: "action__exit",
                onClick: () => {
                    new Transport_1.HTTPTransport().POST("/auth/logout").then(() => {
                        __1.router.go("/");
                    });
                },
            }),
        },
    });
};
exports.ProfileLayout = ProfileLayout;


/***/ }),

/***/ "./src/Layouts/Registration/index.ts":
/*!*******************************************!*\
  !*** ./src/Layouts/Registration/index.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RegistrationLayout = void 0;
const HYPO_1 = __webpack_require__(/*! ../../libs/HYPO/HYPO */ "./src/libs/HYPO/HYPO.ts");
const Input_1 = __webpack_require__(/*! ../../Components/Input */ "./src/Components/Input/index.ts");
const Email_1 = __webpack_require__(/*! ../../libs/Validators/Email */ "./src/libs/Validators/Email/index.ts");
const Required_1 = __webpack_require__(/*! ../../libs/Validators/Required */ "./src/libs/Validators/Required/index.ts");
const AttentionMessage_1 = __webpack_require__(/*! ../../Components/AttentionMessage */ "./src/Components/AttentionMessage/index.ts");
const __1 = __webpack_require__(/*! ../.. */ "./src/index.ts");
const Transport_1 = __webpack_require__(/*! ../../libs/Transport */ "./src/libs/Transport/index.ts");
const Button_1 = __webpack_require__(/*! ../../Components/Button */ "./src/Components/Button/index.ts");
const RegistrationLayout = () => {
    const AttentionEmail = AttentionMessage_1.AttentionMessage();
    const AttentionLogin = AttentionMessage_1.AttentionMessage();
    const AttentionPassword = AttentionMessage_1.AttentionMessage();
    const AttentionPasswordDouble = AttentionMessage_1.AttentionMessage();
    const AttentionFirstName = AttentionMessage_1.AttentionMessage();
    const AttentionSecondName = AttentionMessage_1.AttentionMessage();
    const AttentionPhone = AttentionMessage_1.AttentionMessage();
    const FormData = {};
    return new HYPO_1.HYPO({
        renderTo: document.querySelector('#root'),
        templatePath: 'registration.template.html',
        data: {
            formTitle: 'Регистрация',
        },
        children: {
            InputEmail: Input_1.Input({
                label: 'Почта',
                type: 'text',
                name: 'email',
                id: 'form__email__input',
                className: 'form-reg__form-input',
                ChildAttention: AttentionEmail,
                onBlur: (e) => {
                    const state = AttentionEmail.getState();
                    const input = e.target;
                    if (Email_1.EmailValidator.checkFunc(input.value)) {
                        FormData['email'] = input.value;
                        state.message = '';
                    }
                    else {
                        state.message = '⛔ это не похоже на адрес электронной почты';
                    }
                },
            }),
            InputLogin: Input_1.Input({
                label: 'Логин',
                type: 'text',
                name: 'login',
                id: 'form__login__input',
                className: 'form-reg__form-input',
                ChildAttention: AttentionLogin,
                onBlur: (e) => {
                    const state = AttentionLogin.getState();
                    const input = e.target;
                    if (Required_1.Required.checkFunc(input.value)) {
                        FormData['login'] = input.value;
                        state.message = '';
                    }
                    else {
                        state.message = '⛔ обязательное поле';
                    }
                },
            }),
            FirstName: Input_1.Input({
                label: 'Имя',
                type: 'text',
                name: 'first_name',
                id: 'form__first_name__input',
                className: 'form-reg__form-input',
                ChildAttention: AttentionFirstName,
                onBlur: (e) => {
                    const state = AttentionFirstName.getState();
                    const input = e.target;
                    if (Required_1.Required.checkFunc(input.value)) {
                        FormData['first_name'] = input.value;
                        state.message = '';
                    }
                    else {
                        state.message = '⛔ обязательное поле';
                    }
                },
            }),
            SecondName: Input_1.Input({
                label: 'Фамилия',
                type: 'text',
                name: 'second_name',
                id: 'form__second_name__input',
                className: 'form-reg__form-input',
                ChildAttention: AttentionSecondName,
                onBlur: (e) => {
                    const state = AttentionSecondName.getState();
                    const input = e.target;
                    if (Required_1.Required.checkFunc(input.value)) {
                        FormData['second_name'] = input.value;
                        state.message = '';
                    }
                    else {
                        state.message = '⛔ обязательное поле';
                    }
                },
            }),
            Phone: Input_1.Input({
                label: 'Телефон',
                type: 'text',
                name: 'phone',
                id: 'form__phone__input',
                className: 'form-reg__form-input',
                ChildAttention: AttentionPhone,
                onBlur: (e) => {
                    const state = AttentionPhone.getState();
                    const input = e.target;
                    if (Required_1.Required.checkFunc(input.value)) {
                        FormData['phone'] = input.value;
                        state.message = '';
                    }
                    else {
                        state.message = '⛔ обязательное поле';
                    }
                },
            }),
            Password: Input_1.Input({
                label: 'Пароль',
                type: 'password',
                name: 'password',
                id: 'form__password__input',
                className: 'form-reg__form-input',
                ChildAttention: AttentionPassword,
                onBlur: (e) => {
                    const input = e.target;
                    const state = AttentionPassword.getState();
                    const stateD = AttentionPasswordDouble.getState();
                    if (Required_1.Required.checkFunc(input.value)) {
                        FormData['password'] = input.value;
                        state.message = '';
                        if (FormData['password'] !== FormData['doublepassword']) {
                            stateD.message = '🔥пароли не совпадают';
                        }
                    }
                    else {
                        state.message = '⛔ обязательное поле';
                    }
                },
            }),
            PasswordDouble: Input_1.Input({
                label: 'Пароль',
                type: 'password',
                name: 'doublepassword',
                id: 'form__doublepassword__input',
                className: 'form-reg__form-input',
                ChildAttention: AttentionPasswordDouble,
                onBlur: (e) => {
                    const input = e.target;
                    const state = AttentionPasswordDouble.getState();
                    if (Required_1.Required.checkFunc(input.value)) {
                        FormData['doublepassword'] = input.value;
                        state.message = '';
                        if (FormData['password'] !== FormData['doublepassword']) {
                            state.message = '🔥пароли не совпадают';
                        }
                    }
                    else {
                        state.message = '⛔ обязательное поле';
                    }
                },
            }),
            RegButton: Button_1.Button({
                title: 'Зарегистрироваться',
                className: 'form-button',
                onClick: (e) => {
                    if (Object.keys(FormData).length == 0 || Object.keys(FormData).find(item => {
                        return FormData[item] === '';
                    })) {
                        return;
                    }
                    const data = {
                        data: {
                            first_name: FormData.first_name,
                            second_name: FormData.second_name,
                            login: FormData.login,
                            email: FormData.email,
                            password: FormData.password,
                            phone: FormData.phone,
                        },
                        headers: {
                            'Content-type': 'application/json',
                        },
                    };
                    new Transport_1.HTTPTransport().POST('/auth/signup', data);
                },
            }),
            LoginLink: Button_1.Button({
                title: 'Войти',
                className: 'form-link',
                onClick: (e) => {
                    __1.router.go('/');
                },
            }),
        },
    });
};
exports.RegistrationLayout = RegistrationLayout;


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.router = void 0;
const Login_1 = __webpack_require__(/*! ./Layouts/Login */ "./src/Layouts/Login/index.ts");
const Chat_1 = __webpack_require__(/*! ./Layouts/Chat */ "./src/Layouts/Chat/index.ts");
const Registration_1 = __webpack_require__(/*! ./Layouts/Registration */ "./src/Layouts/Registration/index.ts");
const Profile_1 = __webpack_require__(/*! ./Layouts/Profile */ "./src/Layouts/Profile/index.ts");
const ChangeProfile_1 = __webpack_require__(/*! ./Layouts/ChangeProfile */ "./src/Layouts/ChangeProfile/index.ts");
const ChangePassword_1 = __webpack_require__(/*! ./Layouts/ChangePassword */ "./src/Layouts/ChangePassword/index.ts");
const Router_1 = __webpack_require__(/*! ./libs/Router */ "./src/libs/Router/index.ts");
const Transport_1 = __webpack_require__(/*! ./libs/Transport */ "./src/libs/Transport/index.ts");
exports.router = new Router_1.Router("#root")
    .use("/", Login_1.LoginLayout, () => {
    return new Transport_1.HTTPTransport().GET("/auth/user").then((user) => {
        return JSON.parse(user.response);
    });
})
    .use("/registration", Registration_1.RegistrationLayout)
    .use("/chat", Chat_1.ChatLayout, () => {
    return new Transport_1.HTTPTransport().GET("/chats").then((result) => {
        const resp = JSON.parse(result.response);
        return resp;
    });
})
    .use("/profile", Profile_1.ProfileLayout, () => {
    return new Transport_1.HTTPTransport().GET("/auth/user").then((result) => {
        const resp = JSON.parse(result.response);
        return resp;
    });
})
    .use("/editprofile", ChangeProfile_1.ChangeProfile)
    .use("/editpassword", ChangePassword_1.ChangePassword)
    .start();


/***/ }),

/***/ "./src/libs/HYPO/HYPO.ts":
/*!*******************************!*\
  !*** ./src/libs/HYPO/HYPO.ts ***!
  \*******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HYPO = void 0;
const utils_1 = __webpack_require__(/*! ../utils */ "./src/libs/utils/index.ts");
class HYPO {
    constructor(params) {
        this.render = () => __awaiter(this, void 0, void 0, function* () {
            const that = this;
            return Promise.all(this.collectTemplates(this, "root", false).templatesPromises).then((arrayTemplates) => {
                const mapTemplates = this.convertArrTemplateToMap(arrayTemplates);
                let rootTemplateHTML = arrayTemplates[arrayTemplates.length - 1].html;
                for (let i = arrayTemplates.length - 2; i >= 0; i--) {
                    let template = mapTemplates[`${arrayTemplates[i].templateKey}-${arrayTemplates[i].magicKey}`];
                    rootTemplateHTML = this.insertTemplateIntoTemplate(rootTemplateHTML, arrayTemplates[i].templateKey, template, arrayTemplates[i].magicKey, arrayTemplates[i].isArray);
                }
                rootTemplateHTML = this.clearEmtpyComponent(rootTemplateHTML);
                if (this.renderTo) {
                    this.renderTo.innerHTML = rootTemplateHTML;
                }
                else {
                    const elem = document.querySelector(`[hypo="${this.magicKey}"]`);
                    if (elem) {
                        this.renderTo = elem;
                        elem.innerHTML = rootTemplateHTML;
                    }
                }
                this.afterRenderCallbackArr.forEach((callback) => {
                    callback();
                });
                this.templatesPromises = [];
                return that;
            });
        });
        this.renderTo = params.renderTo;
        this.data = params.data;
        this.templatePath = `./templates/${params.templatePath}`;
        this.children = params.children;
        this.templatesPromises = [];
        this.store = {};
        this.magicKey = utils_1.uuidv4();
        this.afterRenderCallback = () => { };
        this.afterRenderCallbackArr = new Set();
    }
    //@todo: прикрутить мемоизацию
    getTemplateHTML(key, hypo, isArray) {
        return new Promise((resolve, reject) => {
            fetch(hypo.templatePath)
                .then((html) => {
                if (html.status !== 200) {
                    throw new Error("file do not download");
                }
                return html.blob();
            })
                .then((result) => {
                return result.text();
            })
                .then((text) => {
                text = this.insertDataIntoHTML(text, hypo.data);
                resolve({
                    html: text,
                    templateKey: key,
                    magicKey: hypo.magicKey,
                    isArray: isArray,
                });
            })
                .catch((err) => {
                reject(err);
            });
        });
    }
    collectTemplates(hypo, name, isArray) {
        if (Array.isArray(hypo)) {
            this.handleArrayHYPO(hypo, name);
        }
        else {
            this.handleSimpleHYPO(hypo, name);
            this.templatesPromises.push(this.getTemplateHTML(name, hypo, isArray));
            this.afterRenderCallbackArr.add(hypo.afterRenderCallback);
        }
        return this;
    }
    handleArrayHYPO(hypos, name) {
        hypos.forEach((hypo) => {
            this.collectTemplates(hypo, `${name}`, true);
        });
    }
    handleSimpleHYPO(hypo, name) {
        if (hypo.children) {
            Object.keys(hypo.children).forEach((childName) => {
                if (hypo.children) {
                    return this.collectTemplates(hypo.children[childName], childName, false);
                }
            });
        }
    }
    insertDataIntoHTML(htmlTemplate, data) {
        data = this.getDataWithoutIerarhy(data);
        for (let key in data) {
            if (typeof data[key] !== "object" || data[key] === null) {
                const mask = new RegExp("{{" + key + "}}", "g");
                htmlTemplate = htmlTemplate.replace(mask, String(data[key]));
            }
        }
        const mask = new RegExp(/{{[a-z._]+}}/g);
        htmlTemplate = htmlTemplate.replace(mask, "");
        return htmlTemplate;
    }
    convertArrTemplateToMap(templateArr) {
        const result = {};
        templateArr.forEach((item) => {
            if (result[item.templateKey]) {
                result[item.templateKey] += `<span hypo="${item.magicKey}">${item.html}</span>`;
            }
            else {
                result[`${item.templateKey}-${item.magicKey}`] = item.html;
            }
        });
        return result;
    }
    insertTemplateIntoTemplate(rootTemplateHTML, templateKey, childTemplateHTML, magicKey, isArray) {
        rootTemplateHTML = this.createElemWrapper(rootTemplateHTML, templateKey, magicKey, isArray);
        const mask = new RegExp(`-=${templateKey}-${magicKey}=-`, "g");
        rootTemplateHTML = rootTemplateHTML.replace(mask, childTemplateHTML);
        return rootTemplateHTML;
    }
    createElemWrapper(htmlTemplate, templateKey, magicKey, isArray) {
        const mask = new RegExp(`-=${templateKey}=-`, "g");
        if (isArray) {
            htmlTemplate = htmlTemplate.replace(mask, `<span hypo="${magicKey}">-=${templateKey}-${magicKey}=--=${templateKey}=-</span>`);
        }
        else {
            htmlTemplate = htmlTemplate.replace(mask, `<span hypo="${magicKey}">-=${templateKey}-${magicKey}=-</span>`);
        }
        return htmlTemplate;
    }
    clearEmtpyComponent(html) {
        const regex = /-=[a-z,A-Z,0-9]+=-/g;
        return html.replace(regex, "");
    }
    rerender() {
        this.render();
    }
    getState() {
        this.store = this.createStore(this.data);
        return this.store;
    }
    createStore(store) {
        const that = this;
        const handler = {
            get(target, property) {
                return target[property];
            },
            set(target, property, value) {
                target[property] = value;
                that.rerender();
                return true;
            },
        };
        store = new Proxy(store, handler);
        Object.keys(store).forEach((field) => {
            if (typeof store[field] === "object") {
                store[field] = new Proxy(store[field], handler);
                this.createStore(store[field]);
            }
        });
        return store;
    }
    getDataWithoutIerarhy(data) {
        let pathArr = [];
        let resultObject = {};
        function fnz(obj) {
            for (let key in obj) {
                pathArr.push(key);
                if (typeof obj[key] === "object") {
                    fnz(obj[key]);
                }
                else {
                    resultObject[pathArr.join(".")] = obj[key];
                    pathArr.pop();
                }
            }
            pathArr.pop();
        }
        fnz(data);
        return resultObject;
    }
    afterRender(callback) {
        this.afterRenderCallback = callback;
        return this;
    }
    hide() {
        if (this.renderTo) {
            let children;
            children = this.renderTo.children;
            if (children) {
                for (let child of children) {
                    child.remove();
                }
            }
        }
    }
}
exports.HYPO = HYPO;


/***/ }),

/***/ "./src/libs/Router/index.ts":
/*!**********************************!*\
  !*** ./src/libs/Router/index.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Router = void 0;
class Route {
    constructor(pathname, view, props, asyncFN) {
        this._pathname = "";
        this._pathname = pathname;
        this._props = props;
        this._block = view;
        this.asyncFN = asyncFN;
    }
    navigate(pathname) {
        if (this.match(pathname)) {
            this._pathname = pathname;
            this.render();
        }
    }
    leave() {
        if (this._block) {
            this._block().hide();
        }
    }
    match(pathname) {
        return isEqual(pathname, this._pathname);
    }
    render() {
        if (!this._block) {
            return;
        }
        if (this.asyncFN) {
            this.asyncFN().then((result) => {
                var _a;
                (_a = this._block) === null || _a === void 0 ? void 0 : _a.call(this, result).render();
            });
        }
        else {
            this._block().render();
        }
    }
}
class Router {
    constructor(rootQuery) {
        this.__instance = this;
        this.routes = [];
        this.history = window.history;
        this._currentRoute = null;
        this._rootQuery = "";
        if (this.__instance) {
            return this.__instance;
        }
        this._rootQuery = rootQuery;
    }
    use(pathname, block, asyncFN) {
        const route = new Route(pathname, block, { rootQuery: this._rootQuery }, asyncFN);
        this.routes.push(route);
        return this;
    }
    start() {
        window.onpopstate = (_) => {
            let mask = new RegExp("#", "g");
            const url = window.location.hash.replace(mask, "");
            this._onRoute(url);
        };
        let mask = new RegExp("#", "g");
        const url = window.location.hash.replace(mask, "") || "/";
        this._onRoute(url);
        return this;
    }
    _onRoute(pathname) {
        const route = this.getRoute(pathname);
        if (!route) {
            return;
        }
        if (this._currentRoute) {
            this._currentRoute.leave();
        }
        this._currentRoute = route;
        this._currentRoute.render();
    }
    go(pathname) {
        this.history.pushState({}, "", `#${pathname}`);
        this._onRoute(pathname);
    }
    back() {
        this.history.back();
    }
    forward() {
        this.history.forward();
    }
    getRoute(pathname) {
        return this.routes.find((route) => route.match(pathname));
    }
}
exports.Router = Router;
function isEqual(lhs, rhs) {
    return lhs === rhs;
}


/***/ }),

/***/ "./src/libs/Transport/index.ts":
/*!*************************************!*\
  !*** ./src/libs/Transport/index.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HTTPTransport = void 0;
const METHODS = {
    GET: "GET",
    PUT: "PUT",
    POST: "POST",
    DELETE: "DELETE",
};
const DOMEN = "https://ya-praktikum.tech/api/v2";
class HTTPTransport {
    constructor() {
        this.defaultOptions = {
            headers: {},
            data: {},
        };
        this.GET = (url, options = this.defaultOptions) => {
            const requestParams = queryStringify(options.data);
            url += requestParams;
            return this.request(url, Object.assign(Object.assign({}, options), { method: METHODS.GET }), Number(options.timeout) || 5000);
        };
        this.PUT = (url, options = this.defaultOptions) => {
            return this.request(url, Object.assign(Object.assign({}, options), { method: METHODS.PUT }), Number(options.timeout) || 5000);
        };
        this.POST = (url, options = this
            .defaultOptions) => {
            return this.request(url, Object.assign(Object.assign({}, options), { method: METHODS.POST }), Number(options.timeout) || 5000);
        };
        this.DELETE = (url, options = this.defaultOptions) => {
            return this.request(url, Object.assign(Object.assign({}, options), { method: METHODS.DELETE }), Number(options.timeout) || 5000);
        };
        this.request = (url, options, timeout = 5000) => {
            url = DOMEN + url;
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.withCredentials = true;
                xhr.open(options.method, url);
                const headers = options.headers;
                for (let header in headers) {
                    //@ts-ignore
                    xhr.setRequestHeader(header, headers[header]);
                }
                xhr.onload = () => {
                    resolve(xhr);
                };
                xhr.onerror = (e) => {
                    reject(e);
                };
                xhr.onabort = (e) => {
                    reject(e);
                };
                setTimeout(() => {
                    xhr.abort();
                }, timeout);
                xhr.send(JSON.stringify(options.data));
            });
        };
    }
}
exports.HTTPTransport = HTTPTransport;
function queryStringify(data) {
    let requestParams = "?";
    for (let key in data) {
        requestParams += `${key}=${data[key]}&`;
    }
    requestParams = requestParams.substring(0, requestParams.length - 1);
    return requestParams;
}


/***/ }),

/***/ "./src/libs/Validators/Email/index.ts":
/*!********************************************!*\
  !*** ./src/libs/Validators/Email/index.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EmailValidator = void 0;
exports.EmailValidator = {
    value: "",
    checkFunc: function (value) {
        var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if (!reg.test(value)) {
            this.value = "";
            return false;
        }
        this.value = value;
        return true;
    },
    callback: (elem, checkResult) => {
        let state = elem.getState();
        if (!checkResult) {
            state.message = "⛔ это не похоже на адрес электронной почты";
        }
        else {
            state.message = "";
        }
    },
};


/***/ }),

/***/ "./src/libs/Validators/Required/index.ts":
/*!***********************************************!*\
  !*** ./src/libs/Validators/Required/index.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Required = void 0;
exports.Required = {
    value: "",
    checkFunc: function (value) {
        if (value === "") {
            this.value = "";
            return false;
        }
        this.value = value;
        return true;
    },
    callback: (elem, checkResult) => {
        let state = elem.getState();
        if (!checkResult) {
            state.message = "⛔ обязательное поле";
        }
        else {
            state.message = "";
        }
    },
};


/***/ }),

/***/ "./src/libs/utils/index.ts":
/*!*********************************!*\
  !*** ./src/libs/utils/index.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.uuidv4 = void 0;
function uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0, v = c == "x" ? r : (r & 0x3) | 0x8;
        return `${v.toString(16)}`;
    });
}
exports.uuidv4 = uuidv4;


/***/ }),

/***/ "./src/libs/momize/index.js":
/*!**********************************!*\
  !*** ./src/libs/momize/index.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "memoize": () => /* binding */ memoize
/* harmony export */ });
function memoize(func, resolver) {
  if (
    typeof func != "function" ||
    (resolver != null && typeof resolver != "function")
  ) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function () {
    var args = arguments,
      key = resolver ? resolver.apply(this, args) : args[0],
      cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache)();
  return memoized;
}

memoize.Cache = Map;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	__webpack_require__("./src/index.ts");
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9Db21wb25lbnRzL0F0dGVudGlvbk1lc3NhZ2UvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvQ29tcG9uZW50cy9CdXR0b24vaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvQ29tcG9uZW50cy9DaGF0SXRlbS9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9Db21wb25lbnRzL0NyZWF0ZUNoYXRNb2RhbC9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9Db21wb25lbnRzL0RlbGV0ZS9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9Db21wb25lbnRzL0VtcHR5L2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL0NvbXBvbmVudHMvSW5wdXQvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvTGF5b3V0cy9DaGFuZ2VQYXNzd29yZC9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9MYXlvdXRzL0NoYW5nZVByb2ZpbGUvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvTGF5b3V0cy9DaGF0L2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL0xheW91dHMvTG9naW4vaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvTGF5b3V0cy9Qcm9maWxlL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL0xheW91dHMvUmVnaXN0cmF0aW9uL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL2xpYnMvSFlQTy9IWVBPLnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL2xpYnMvUm91dGVyL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL2xpYnMvVHJhbnNwb3J0L2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL2xpYnMvVmFsaWRhdG9ycy9FbWFpbC9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9saWJzL1ZhbGlkYXRvcnMvUmVxdWlyZWQvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvbGlicy91dGlscy9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9saWJzL21vbWl6ZS9pbmRleC5qcyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4L3dlYnBhY2svc3RhcnR1cCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUEsMEZBQTRDO0FBRXJDLE1BQU0sZ0JBQWdCLEdBQUcsR0FBUyxFQUFFO0lBQ3pDLE9BQU8sSUFBSSxXQUFJLENBQUM7UUFDZCxZQUFZLEVBQUUseUJBQXlCO1FBQ3ZDLElBQUksRUFBRTtZQUNKLE9BQU8sRUFBRSxFQUFFO1NBQ1o7UUFDRCxRQUFRLEVBQUUsRUFBRTtLQUNiLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQztBQVJXLHdCQUFnQixvQkFRM0I7Ozs7Ozs7Ozs7Ozs7O0FDVkYsMEZBQTJDO0FBQzNDLHlGQUF1QztBQVNoQyxNQUFNLE1BQU0sR0FBRyxDQUFDLEtBQWEsRUFBRSxFQUFFO0lBQ3RDLE1BQU0sRUFBRSxHQUFHLEtBQUssQ0FBQyxFQUFFLElBQUksY0FBTSxFQUFFLENBQUM7SUFDaEMsT0FBTyxJQUFJLFdBQUksQ0FBQztRQUNkLFlBQVksRUFBRSxzQkFBc0I7UUFDcEMsSUFBSSxFQUFFO1lBQ0osRUFBRSxFQUFFLEVBQUU7WUFDTixLQUFLLEVBQUUsS0FBSyxDQUFDLEtBQUs7WUFDbEIsU0FBUyxFQUFFLEtBQUssQ0FBQyxTQUFTO1NBQzNCO0tBQ0YsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUU7O1FBQ2xCLGNBQVEsQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLDBDQUFFLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFO1lBQzNELEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbkIsQ0FBQyxFQUFFO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUM7QUFkVyxjQUFNLFVBY2pCOzs7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eUM7V0FDakY7V0FDQTtXQUNBLEU7Ozs7O1dDUEEsc0Y7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0Esc0RBQXNELGtCQUFrQjtXQUN4RTtXQUNBLCtDQUErQyxjQUFjO1dBQzdELEU7Ozs7VUNOQTtVQUNBO1VBQ0E7VUFDQSIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBIWVBPIH0gZnJvbSBcIi4uLy4uL2xpYnMvSFlQTy9IWVBPXCI7XG5cbmV4cG9ydCBjb25zdCBBdHRlbnRpb25NZXNzYWdlID0gKCk6IEhZUE8gPT4ge1xuICByZXR1cm4gbmV3IEhZUE8oe1xuICAgIHRlbXBsYXRlUGF0aDogXCJhdHRlbnRpb24udGVtcGxhdGUuaHRtbFwiLFxuICAgIGRhdGE6IHtcbiAgICAgIG1lc3NhZ2U6IFwiXCIsXG4gICAgfSxcbiAgICBjaGlsZHJlbjoge30sXG4gIH0pO1xufTtcbiIsImltcG9ydCB7IEhZUE99IGZyb20gXCIuLi8uLi9saWJzL0hZUE8vSFlQT1wiO1xuaW1wb3J0IHt1dWlkdjR9IGZyb20gJy4uLy4uL2xpYnMvdXRpbHMnXG5cbmludGVyZmFjZSBJUHJvcHMge1xuICBpZD86IHN0cmluZztcbiAgdGl0bGU6IHN0cmluZztcbiAgY2xhc3NOYW1lOiBzdHJpbmc7XG4gIG9uQ2xpY2s6IChlOiBFdmVudCkgPT4gdm9pZDtcbn1cblxuZXhwb3J0IGNvbnN0IEJ1dHRvbiA9IChwcm9wczogSVByb3BzKSA9PiB7XG4gIGNvbnN0IGlkID0gcHJvcHMuaWQgfHwgdXVpZHY0KCk7XG4gIHJldHVybiBuZXcgSFlQTyh7XG4gICAgdGVtcGxhdGVQYXRoOiBcImJ1dHRvbi50ZW1wbGF0ZS5odG1sXCIsXG4gICAgZGF0YToge1xuICAgICAgaWQ6IGlkLFxuICAgICAgdGl0bGU6IHByb3BzLnRpdGxlLFxuICAgICAgY2xhc3NOYW1lOiBwcm9wcy5jbGFzc05hbWUsXG4gICAgfSxcbiAgfSkuYWZ0ZXJSZW5kZXIoKCkgPT4ge1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKT8uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG4gICAgICBwcm9wcy5vbkNsaWNrKGUpO1xuICAgIH0pO1xuICB9KTtcbn07XG4iLCJpbXBvcnQgeyBIWVBPIH0gZnJvbSBcIi4uLy4uL2xpYnMvSFlQTy9IWVBPXCI7XG5pbXBvcnQgeyBIVFRQVHJhbnNwb3J0IH0gZnJvbSBcIi4uLy4uL2xpYnMvVHJhbnNwb3J0XCI7XG5pbXBvcnQgeyBEZWxldGUgfSBmcm9tIFwiLi4vRGVsZXRlXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUNoYXREVE8ge1xuICB0aXRsZTogc3RyaW5nO1xuICBhdmF0YXI6IHN0cmluZyB8IG51bGw7XG4gIGNyZWF0ZWRfYnk6IG51bWJlcjtcbiAgaWQ6IG51bWJlcjtcbn1cblxuaW50ZXJmYWNlIElQcm9wcyBleHRlbmRzIElDaGF0RFRPIHtcbiAgY2xhc3NOYW1lPzogc3RyaW5nO1xufVxuXG5leHBvcnQgY29uc3QgQ2hhdEl0ZW0gPSAocHJvcHM6IElDaGF0RFRPKSA9PiB7XG4gIHJldHVybiBuZXcgSFlQTyh7XG4gICAgdGVtcGxhdGVQYXRoOiBcImNoYXRJdGVtLnRlbXBsYXRlLmh0bWxcIixcbiAgICBkYXRhOiB7XG4gICAgICBDaGF0TmFtZTogcHJvcHMudGl0bGUsXG4gICAgICBsYXN0VGltZTogcHJvcHMuY3JlYXRlZF9ieSB8fCBcIjEwOjIyXCIsXG4gICAgICBsYXN0TWVzc2FnZTogcHJvcHMuaWQgfHwgXCJIaSwgaG93IGFyZSB5b3U/XCIsXG4gICAgICBub3RpZmljYXRpb25Db3VudDogcHJvcHMuYXZhdGFyIHx8IDMsXG4gICAgfSxcbiAgICBjaGlsZHJlbjoge1xuICAgICAgZGVsZXRlOiBEZWxldGUoe1xuICAgICAgICBpZDogYGRlbGV0ZUl0ZW0ke3Byb3BzLmlkfWAsXG4gICAgICAgIG9uQ2xpY2s6ICgpID0+IHtcbiAgICAgICAgICBuZXcgSFRUUFRyYW5zcG9ydCgpLkRFTEVURShcIi9jaGF0c1wiLCB7XG4gICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgIFwiQ29udGVudC10eXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgY2hhdElkOiBTdHJpbmcocHJvcHMuaWQpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgIH0sXG4gIH0pO1xufTtcbiIsImltcG9ydCB7IHJvdXRlciB9IGZyb20gXCIuLi8uLlwiO1xuaW1wb3J0IHsgSFRUUFRyYW5zcG9ydCB9IGZyb20gXCIuLi8uLi9saWJzL1RyYW5zcG9ydFwiO1xuaW1wb3J0IHsgSFlQTyB9IGZyb20gXCIuLi8uLi9saWJzL0hZUE8vSFlQT1wiO1xuaW1wb3J0IHsgUmVxdWlyZWQgfSBmcm9tIFwiLi4vLi4vbGlicy9WYWxpZGF0b3JzL1JlcXVpcmVkXCI7XG5pbXBvcnQgeyBBdHRlbnRpb25NZXNzYWdlIH0gZnJvbSBcIi4uL0F0dGVudGlvbk1lc3NhZ2VcIjtcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gXCIuLi9CdXR0b25cIjtcbmltcG9ydCB7IElucHV0IH0gZnJvbSBcIi4uL0lucHV0XCI7XG5cbmV4cG9ydCBjb25zdCBDcmVhdGVDaGF0TW9kYWwgPSAoKSA9PiB7XG4gIGNvbnN0IGF0dGVudGlvbk1lc3NhZ2UgPSBBdHRlbnRpb25NZXNzYWdlKCk7XG4gIGNvbnN0IHN0YXRlID0gYXR0ZW50aW9uTWVzc2FnZS5nZXRTdGF0ZSgpO1xuXG4gIGxldCBDaGF0TmFtZSA9IFwiXCI7XG5cbiAgcmV0dXJuIG5ldyBIWVBPKHtcbiAgICB0ZW1wbGF0ZVBhdGg6IFwiY3JlYXRlY2hhdG1vZGFsLnRlbXBsYXRlLmh0bWxcIixcbiAgICBkYXRhOiB7fSxcbiAgICBjaGlsZHJlbjoge1xuICAgICAgaW5wdXQ6IElucHV0KHtcbiAgICAgICAgbGFiZWw6IFwiQ2hhdCBuYW1lXCIsXG4gICAgICAgIHR5cGU6IFwidGV4dFwiLFxuICAgICAgICBuYW1lOiBcImNoYXRuYW1lXCIsXG4gICAgICAgIGlkOiBcImNoYXRuYW1lXCIsXG4gICAgICAgIGNsYXNzTmFtZTogXCJjLWMtbW9kYWxfX2lucHV0XCIsXG4gICAgICAgIENoaWxkQXR0ZW50aW9uOiBhdHRlbnRpb25NZXNzYWdlLFxuICAgICAgICBvbkJsdXI6IChlOiBFdmVudCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGlucHV0ID0gZS50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICAgICAgICBpZiAoUmVxdWlyZWQuY2hlY2tGdW5jKGlucHV0LnZhbHVlKSkge1xuICAgICAgICAgICAgc3RhdGUubWVzc2FnZSA9IFwiXCI7XG4gICAgICAgICAgICBDaGF0TmFtZSA9IGlucHV0LnZhbHVlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdGF0ZS5tZXNzYWdlID0gXCLim5Qg0L7QsdGP0LfQsNGC0LXQu9GM0L3QvtC1INC/0L7Qu9C1XCI7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICBjcmVhdGU6IEJ1dHRvbih7XG4gICAgICAgIHRpdGxlOiBcItCh0L7Qt9C00LDRgtGMXCIsXG4gICAgICAgIGNsYXNzTmFtZTogXCJjcmVhdGUtYnV0dG9uXCIsXG4gICAgICAgIG9uQ2xpY2s6IChlOiBFdmVudCkgPT4ge1xuICAgICAgICAgIGlmICghQ2hhdE5hbWUpIHtcbiAgICAgICAgICAgIHN0YXRlLm1lc3NhZ2UgPSBcIuKblCDQvtCx0Y/Qt9Cw0YLQtdC70YzQvdC+0LUg0L/QvtC70LVcIjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV3IEhUVFBUcmFuc3BvcnQoKVxuICAgICAgICAgICAgICAuUE9TVChcIi9jaGF0c1wiLCB7XG4gICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgXCJDb250ZW50LXR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICB0aXRsZTogQ2hhdE5hbWUsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50XG4gICAgICAgICAgICAgICAgICAuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImMtYy1tb2RhbFwiKVswXVxuICAgICAgICAgICAgICAgICAgLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gICAgICAgICAgICAgICAgcm91dGVyLmdvKFwiL2NoYXRcIik7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgY2FuY2VsOiBCdXR0b24oe1xuICAgICAgICB0aXRsZTogXCLQntGC0LzQtdC90LBcIixcbiAgICAgICAgY2xhc3NOYW1lOiBcImNhbmNlbC1idXR0b25cIixcbiAgICAgICAgb25DbGljazogKGU6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgZG9jdW1lbnRcbiAgICAgICAgICAgIC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiYy1jLW1vZGFsXCIpWzBdXG4gICAgICAgICAgICAuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgIH0sXG4gIH0pO1xufTtcbiIsImltcG9ydCB7IEhZUE8gfSBmcm9tIFwiLi4vLi4vbGlicy9IWVBPL0hZUE9cIjtcblxuaW50ZXJmYWNlIElQcm9wcyB7XG4gIGlkOiBzdHJpbmc7XG4gIG9uQ2xpY2s6ICgpID0+IHZvaWQ7XG59XG5leHBvcnQgY29uc3QgRGVsZXRlID0gKHByb3BzOiBJUHJvcHMpID0+IHtcbiAgcmV0dXJuIG5ldyBIWVBPKHtcbiAgICB0ZW1wbGF0ZVBhdGg6IFwiZGVsZXRlLnRlbXBsYXRlLmh0bWxcIixcbiAgICBkYXRhOiB7XG4gICAgICBwYXRoOiBcIi9tZWRpYS9WZWN0b3Iuc3ZnXCIsXG4gICAgICBpZDogcHJvcHMuaWQsXG4gICAgfSxcbiAgICBjaGlsZHJlbjoge30sXG4gIH0pLmFmdGVyUmVuZGVyKCgpID0+IHtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChwcm9wcy5pZCk/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICBwcm9wcy5vbkNsaWNrKCk7XG4gICAgfSk7XG4gIH0pO1xufTtcbiIsImltcG9ydCB7IEhZUE8gfSBmcm9tIFwiLi4vLi4vbGlicy9IWVBPL0hZUE9cIlxuXG5leHBvcnQgY29uc3QgRW1wdHkgPSAoKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBIWVBPKHtcbiAgICAgICAgdGVtcGxhdGVQYXRoOiAnZW1wdHkudGVtcGxhdGUuaHRtbCcsXG4gICAgICAgIGRhdGE6e31cbiAgICB9KVxufSIsImltcG9ydCB7IEhZUE8gfSBmcm9tIFwiLi4vLi4vbGlicy9IWVBPL0hZUE9cIjtcbmltcG9ydCB7IEVtcHR5IH0gZnJvbSBcIi4uL0VtcHR5XCI7XG5cbmludGVyZmFjZSBJUHJvcHMge1xuICBsYWJlbDogc3RyaW5nO1xuICB0eXBlOiBzdHJpbmc7XG4gIG5hbWU6IHN0cmluZztcbiAgaWQ6IHN0cmluZztcbiAgY2xhc3NOYW1lOiBzdHJpbmc7XG4gIENoaWxkQXR0ZW50aW9uPzogSFlQTztcbiAgb25Gb2N1cz86IChlOiBFdmVudCkgPT4gdm9pZDtcbiAgb25CbHVyPzogKGU6IEV2ZW50KSA9PiB2b2lkO1xufVxuXG4vL0B0b2RvOiDQv9GA0LjQutGA0YPRgtC40YLRjCDRg9C90LjQutCw0LvRjNC90L7RgdGC0Ywg0LrQsNC20LTQvtCz0L4g0Y3Qu9C10LzQtdC90YLQsFxuXG5leHBvcnQgY29uc3QgSW5wdXQgPSAocHJvcHM6IElQcm9wcykgPT4ge1xuICBcbiAgcmV0dXJuIG5ldyBIWVBPKHtcbiAgICB0ZW1wbGF0ZVBhdGg6IFwiaW5wdXQudGVtcGxhdGUuaHRtbFwiLFxuICAgIGRhdGE6IHtcbiAgICAgIGxhYmVsOiB7XG4gICAgICAgIG5hbWU6IHByb3BzLmxhYmVsLFxuICAgICAgfSxcbiAgICAgIGF0cmlidXRlOiB7XG4gICAgICAgIHR5cGU6IHByb3BzLnR5cGUsXG4gICAgICAgIG5hbWU6IHByb3BzLm5hbWUsXG4gICAgICAgIGlkOiBwcm9wcy5pZCxcbiAgICAgICAgY2xhc3NOYW1lOiBwcm9wcy5jbGFzc05hbWUsXG4gICAgICB9LFxuICAgIH0sXG4gICAgY2hpbGRyZW46IHtcbiAgICAgIEF0dGVudGlvbjogcHJvcHMuQ2hpbGRBdHRlbnRpb24gfHwgRW1wdHkoKSxcbiAgICB9LFxuICB9KS5hZnRlclJlbmRlcigoKSA9PiB7XG4gICAgZG9jdW1lbnRcbiAgICAgIC5nZXRFbGVtZW50QnlJZChwcm9wcy5pZClcbiAgICAgID8uYWRkRXZlbnRMaXN0ZW5lcihcImZvY3VzXCIsIChlOiBGb2N1c0V2ZW50KSA9PiB7XG4gICAgICAgIGNvbnN0IGlucHV0ID0gZS50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICAgICAgY29uc3QgaW5wdXRMYWJlbCA9IGlucHV0LnBhcmVudEVsZW1lbnQ/LnBhcmVudEVsZW1lbnQ/LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgICAgXCIuZm9ybS1pbnB1dF9fbGFiZWxcIlxuICAgICAgICApO1xuICAgICAgICBpbnB1dExhYmVsPy5jbGFzc0xpc3QuYWRkKFwiZm9ybS1pbnB1dF9fbGFiZWxfc2VsZWN0XCIpO1xuICAgICAgICBwcm9wcy5vbkZvY3VzPy4oZSk7XG4gICAgICB9KTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChwcm9wcy5pZCk/LmFkZEV2ZW50TGlzdGVuZXIoXCJibHVyXCIsIChlOiBFdmVudCkgPT4ge1xuICAgICAgY29uc3QgaW5wdXQgPSBlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgICAgY29uc3QgaW5wdXRMYWJlbCA9IGlucHV0LnBhcmVudEVsZW1lbnQ/LnBhcmVudEVsZW1lbnQ/LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIFwiLmZvcm0taW5wdXRfX2xhYmVsXCJcbiAgICAgICk7XG4gICAgICBpZiAoIWlucHV0LnZhbHVlKSB7XG4gICAgICAgIGlucHV0TGFiZWw/LmNsYXNzTGlzdC5yZW1vdmUoXCJmb3JtLWlucHV0X19sYWJlbF9zZWxlY3RcIik7XG4gICAgICB9XG4gICAgICBwcm9wcy5vbkJsdXI/LihlKTtcbiAgICB9KTtcbiAgfSk7XG59O1xuIiwiaW1wb3J0IHsgSFlQTyB9IGZyb20gXCIuLi8uLi9saWJzL0hZUE8vSFlQT1wiO1xuaW1wb3J0IHsgcm91dGVyIH0gZnJvbSBcIi4uLy4uXCI7XG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tIFwiLi4vLi4vQ29tcG9uZW50cy9CdXR0b25cIjtcbmltcG9ydCB7IG1lbW9pemUgfSBmcm9tIFwiLi4vLi4vbGlicy9tb21pemVcIjtcblxuZXhwb3J0IGNvbnN0IENoYW5nZVBhc3N3b3JkID0gbWVtb2l6ZSgoKSA9PiB7XG4gIHJldHVybiBuZXcgSFlQTyh7XG4gICAgcmVuZGVyVG86IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiI3Jvb3RcIikgfHwgZG9jdW1lbnQuYm9keSxcbiAgICB0ZW1wbGF0ZVBhdGg6IFwiY2hhbmdlUGFzc3dvcmQudGVtcGxhdGUuaHRtbFwiLFxuICAgIGRhdGE6IHt9LFxuICAgIGNoaWxkcmVuOiB7XG4gICAgICBzYXZlOiBCdXR0b24oe1xuICAgICAgICB0aXRsZTogXCLQodC+0YXRgNCw0L3QuNGC0YxcIixcbiAgICAgICAgY2xhc3NOYW1lOiBcInBhc3N3b3JkX2VkaXRfX2FjdGlvbl9fc2F2ZVwiLFxuICAgICAgICBvbkNsaWNrOiAoZTogRXZlbnQpID0+IHtcbiAgICAgICAgICByb3V0ZXIuZ28oXCIvcHJvZmlsZVwiKTtcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgIH0sXG4gIH0pO1xufSk7XG4iLCJpbXBvcnQgeyBIWVBPIH0gZnJvbSBcIi4uLy4uL2xpYnMvSFlQTy9IWVBPXCI7XG5pbXBvcnQgeyByb3V0ZXIgfSBmcm9tIFwiLi4vLi5cIjtcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gXCIuLi8uLi9Db21wb25lbnRzL0J1dHRvblwiO1xuXG5leHBvcnQgY29uc3QgQ2hhbmdlUHJvZmlsZSA9ICgpID0+IHtcbiAgcmV0dXJuIG5ldyBIWVBPKHtcbiAgICByZW5kZXJUbzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jvb3QnKSB8fCBkb2N1bWVudC5ib2R5LFxuICAgIHRlbXBsYXRlUGF0aDogXCJjaGFuZ2VQcm9maWxlLnRlbXBsYXRlLmh0bWxcIixcbiAgICBkYXRhOiB7XG4gICAgICB1c2VyTmFtZTogXCJwb2NodGFAeWFuZGV4LnJ1XCIsXG4gICAgICBsb2dpbjogXCJpdmFuaXZhbm92XCIsXG4gICAgICBmaXJzdE5hbWU6IFwi0JjQstCw0L1cIixcbiAgICAgIHNlY29uZE5hbWU6IFwi0JjQstCw0L3QvtCyXCIsXG4gICAgICBkaXNwbGF5TmFtZTogXCLQmNCy0LDQvVwiLFxuICAgICAgcGhvbmU6IFwiKzcgKDEyMykgNDU2IDc4IDkwXCIsXG4gICAgfSxcbiAgICBjaGlsZHJlbjoge1xuICAgICAgc2F2ZTogQnV0dG9uKHtcbiAgICAgICAgdGl0bGU6IFwi0KHQvtGF0YDQsNC90LjRgtGMXCIsXG4gICAgICAgIGNsYXNzTmFtZTogXCJwcm9maWxlX2VkaXRfX2FjdGlvbl9fc2F2ZVwiLFxuICAgICAgICBvbkNsaWNrOiAoZTogRXZlbnQpID0+IHtcbiAgICAgICAgICByb3V0ZXIuZ28oXCIvcHJvZmlsZVwiKTtcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgIH0sXG4gIH0pO1xufTtcbiIsImltcG9ydCB7IEhZUE8gfSBmcm9tIFwiLi4vLi4vbGlicy9IWVBPL0hZUE9cIjtcbmltcG9ydCB7IENoYXRJdGVtLCBJQ2hhdERUTyB9IGZyb20gXCIuLi8uLi9Db21wb25lbnRzL0NoYXRJdGVtXCI7XG5pbXBvcnQgeyByb3V0ZXIgfSBmcm9tIFwiLi4vLi5cIjtcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gXCIuLi8uLi9Db21wb25lbnRzL0J1dHRvblwiO1xuaW1wb3J0IHsgRW1wdHkgfSBmcm9tIFwiLi4vLi4vQ29tcG9uZW50cy9FbXB0eVwiO1xuaW1wb3J0IHsgQ3JlYXRlQ2hhdE1vZGFsIH0gZnJvbSBcIi4uLy4uL0NvbXBvbmVudHMvQ3JlYXRlQ2hhdE1vZGFsXCI7XG5cbmV4cG9ydCBjb25zdCBDaGF0TGF5b3V0ID0gKHJlc3VsdDogSUNoYXREVE9bXSkgPT4ge1xuICBjb25zdCBDaGF0SXRlbUxpc3Q6IEhZUE9bXSA9IFtdO1xuICBpZiAoQXJyYXkuaXNBcnJheShyZXN1bHQpKSB7XG4gICAgcmVzdWx0LmZvckVhY2goKGl0ZW06IGFueSkgPT4ge1xuICAgICAgQ2hhdEl0ZW1MaXN0LnB1c2goQ2hhdEl0ZW0oeyAuLi5pdGVtIH0pKTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBDaGF0SXRlbUxpc3QucHVzaChFbXB0eSgpKTtcbiAgfVxuXG4gIHJldHVybiBuZXcgSFlQTyh7XG4gICAgcmVuZGVyVG86IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm9vdFwiKSB8fCBkb2N1bWVudC5ib2R5LFxuICAgIHRlbXBsYXRlUGF0aDogXCJjaGF0LnRlbXBsYXRlLmh0bWxcIixcbiAgICBkYXRhOiB7fSxcbiAgICBjaGlsZHJlbjoge1xuICAgICAgUHJvZmlsZUxpbms6IEJ1dHRvbih7XG4gICAgICAgIHRpdGxlOiBcIlByb2ZpbGVcIixcbiAgICAgICAgY2xhc3NOYW1lOiBcInByb2ZpbGUtbGlua19fYnV0dG9uXCIsXG4gICAgICAgIG9uQ2xpY2s6IChlOiBFdmVudCkgPT4ge1xuICAgICAgICAgIHJvdXRlci5nbyhcIi9wcm9maWxlXCIpO1xuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICBjaGF0SXRlbTogQ2hhdEl0ZW1MaXN0LFxuICAgICAgY3JlYXRlQ2hhdE1vZGFsOiBDcmVhdGVDaGF0TW9kYWwoKSxcbiAgICAgIGNyZWF0ZUNoYXRCdXR0b246IEJ1dHRvbih7XG4gICAgICAgIHRpdGxlOiBcIitcIixcbiAgICAgICAgY2xhc3NOYW1lOiBcIm5hdmlnYXRpb25fX2NyZWF0ZUNoYXRCdXR0b25cIixcbiAgICAgICAgb25DbGljazogKCkgPT4ge1xuICAgICAgICAgIGRvY3VtZW50XG4gICAgICAgICAgICAuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImMtYy1tb2RhbFwiKVswXVxuICAgICAgICAgICAgLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICB9LFxuICB9KTtcbn07XG4iLCJpbXBvcnQge0lucHV0fSBmcm9tICcuLi8uLi9Db21wb25lbnRzL0lucHV0JztcbmltcG9ydCB7UmVxdWlyZWR9IGZyb20gJy4uLy4uL2xpYnMvVmFsaWRhdG9ycy9SZXF1aXJlZCc7XG5pbXBvcnQge0F0dGVudGlvbk1lc3NhZ2V9IGZyb20gJy4uLy4uL0NvbXBvbmVudHMvQXR0ZW50aW9uTWVzc2FnZSc7XG5pbXBvcnQge3JvdXRlcn0gZnJvbSAnLi4vLi4vaW5kZXgnO1xuaW1wb3J0IHtIVFRQVHJhbnNwb3J0fSBmcm9tICcuLi8uLi9saWJzL1RyYW5zcG9ydCc7XG5pbXBvcnQge0hZUE99IGZyb20gJy4uLy4uL2xpYnMvSFlQTy9IWVBPJztcbmltcG9ydCB7QnV0dG9ufSBmcm9tICcuLi8uLi9Db21wb25lbnRzL0J1dHRvbic7XG5pbXBvcnQge0lQcm9maWxlRFRPfSBmcm9tICcuLi9Qcm9maWxlJztcblxuLyoqXG4gKiBubm5ycnIxMTFOTlxuICovXG5cbmV4cG9ydCBjb25zdCBMb2dpbkxheW91dCA9ICh1c2VyOiBJUHJvZmlsZURUTyk6IEhZUE8gPT4ge1xuICBpZiAodXNlciAmJiB1c2VyLmlkKSB7XG4gICAgcm91dGVyLmdvKCcvY2hhdCcpO1xuICB9XG5cbiAgY29uc3QgYXR0ZW50aW9uTG9naW4gPSBBdHRlbnRpb25NZXNzYWdlKCk7XG4gIGNvbnN0IGF0dGVudGlvbkxvZ2luU3RvcmUgPSBhdHRlbnRpb25Mb2dpbi5nZXRTdGF0ZSgpO1xuICBjb25zdCBhdHRlbnRpb25QYXNzID0gQXR0ZW50aW9uTWVzc2FnZSgpO1xuICBjb25zdCBhdHRlbnRpb25QYXNzU3RvcmUgPSBhdHRlbnRpb25QYXNzLmdldFN0YXRlKCk7XG5cbiAgY29uc3QgRm9ybURhdGE6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcbiAgcmV0dXJuIG5ldyBIWVBPKHtcbiAgICByZW5kZXJUbzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jvb3QnKSB8fCBkb2N1bWVudC5ib2R5LFxuICAgIHRlbXBsYXRlUGF0aDogJ2xvZ2luLnRlbXBsYXRlLmh0bWwnLFxuICAgIGRhdGE6IHtcbiAgICAgIEZvcm1OYW1lOiAn0JLRhdC+0LQnLFxuICAgIH0sXG4gICAgY2hpbGRyZW46IHtcbiAgICAgIElucHV0TG9naW46IElucHV0KHtcbiAgICAgICAgbGFiZWw6ICfQm9C+0LPQuNC9JyxcbiAgICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgICBuYW1lOiAnbG9naW4nLFxuICAgICAgICBpZDogJ2Zvcm0taW5wdXQtbG9naW4nLFxuICAgICAgICBjbGFzc05hbWU6ICdmb3JtLWxvZ2luX19mb3JtLWlucHV0JyxcbiAgICAgICAgb25CbHVyOiAoZTogRXZlbnQpID0+IHtcbiAgICAgICAgICBjb25zdCBpbnB1dCA9IGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgICAgICAgY29uc3QgY2hlY2sgPSBSZXF1aXJlZC5jaGVja0Z1bmMoaW5wdXQ/LnZhbHVlKTtcbiAgICAgICAgICBpZiAoIWNoZWNrKSB7XG4gICAgICAgICAgICBhdHRlbnRpb25Mb2dpblN0b3JlLm1lc3NhZ2UgPSAn4puUINC+0LHRj9C30LDRgtC10LvRjNC90L7QtSDQv9C+0LvQtSc7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGF0dGVudGlvbkxvZ2luU3RvcmUubWVzc2FnZSA9ICcnO1xuICAgICAgICAgICAgRm9ybURhdGFbJ2xvZ2luJ10gPSBpbnB1dC52YWx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIENoaWxkQXR0ZW50aW9uOiBhdHRlbnRpb25Mb2dpbixcbiAgICAgIH0pLFxuICAgICAgSW5wdXRQYXNzd29yZDogSW5wdXQoe1xuICAgICAgICBsYWJlbDogJ9Cf0LDRgNC+0LvRjCcsXG4gICAgICAgIHR5cGU6ICdwYXNzd29yZCcsXG4gICAgICAgIG5hbWU6ICdwYXNzd29yZCcsXG4gICAgICAgIGlkOiAnZm9ybS1pbnB1dC1wYXNzd29yZCcsXG4gICAgICAgIGNsYXNzTmFtZTogJ2Zvcm0tbG9naW5fX2Zvcm0taW5wdXQnLFxuICAgICAgICBvbkJsdXI6IChlOiBFdmVudCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGlucHV0ID0gZS50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICAgICAgICBpZiAoIVJlcXVpcmVkLmNoZWNrRnVuYyhpbnB1dC52YWx1ZSkpIHtcbiAgICAgICAgICAgIGF0dGVudGlvblBhc3NTdG9yZS5tZXNzYWdlID0gJ+KblCDQvtCx0Y/Qt9Cw0YLQtdC70YzQvdC+0LUg0L/QvtC70LUnO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhdHRlbnRpb25QYXNzU3RvcmUubWVzc2FnZSA9ICcnO1xuICAgICAgICAgICAgRm9ybURhdGFbJ3Bhc3N3b3JkJ10gPSBpbnB1dC52YWx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIENoaWxkQXR0ZW50aW9uOiBhdHRlbnRpb25QYXNzLFxuICAgICAgfSksXG4gICAgICBCdXR0b246IEJ1dHRvbih7XG4gICAgICAgIHRpdGxlOiAn0JDQstGC0L7RgNC40LfQvtCy0LDRgtGM0YHRjycsXG4gICAgICAgIGNsYXNzTmFtZTogJ2Zvcm0tYnV0dG9uJyxcbiAgICAgICAgb25DbGljazogKGU6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgY29uc3QgZGF0YToge1trZXk6IHN0cmluZ106IFJlY29yZDxzdHJpbmcsIHN0cmluZz59ID0ge1xuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICBsb2dpbjogRm9ybURhdGEubG9naW4sXG4gICAgICAgICAgICAgIHBhc3N3b3JkOiBGb3JtRGF0YS5wYXNzd29yZCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgICdDb250ZW50LXR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH07XG4gICAgICAgICAgbmV3IEhUVFBUcmFuc3BvcnQoKS5QT1NUKCcvYXV0aC9zaWduaW4nLCBkYXRhKS50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgICAgIGlmIChyZXN1bHQuc3RhdHVzIDwgMzAwKSB7XG4gICAgICAgICAgICAgIHJvdXRlci5nbygnL2NoYXQnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgTGlua1RvUmVnaXN0cmF0aW9uOiBCdXR0b24oe1xuICAgICAgICB0aXRsZTogJ9CX0LDRgNC10LPQuNGB0YLRgNC40YDQvtCy0LDRgtGM0YHRjycsXG4gICAgICAgIGNsYXNzTmFtZTogJ2Zvcm0tbGluaycsXG4gICAgICAgIG9uQ2xpY2s6IChlOiBFdmVudCkgPT4ge1xuICAgICAgICAgIHJvdXRlci5nbygnL3JlZ2lzdHJhdGlvbicpO1xuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgfSxcbiAgfSk7XG59O1xuIiwiaW1wb3J0IHsgSFlQTyB9IGZyb20gXCIuLi8uLi9saWJzL0hZUE8vSFlQT1wiO1xuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSBcIi4uLy4uL0NvbXBvbmVudHMvQnV0dG9uXCI7XG5pbXBvcnQgeyByb3V0ZXIgfSBmcm9tIFwiLi4vLi5cIjtcbmltcG9ydCB7IEhUVFBUcmFuc3BvcnQgfSBmcm9tIFwiLi4vLi4vbGlicy9UcmFuc3BvcnRcIjtcblxuZXhwb3J0IGludGVyZmFjZSBJUHJvZmlsZURUTyB7XG4gIGlkOiBudW1iZXI7XG4gIGRpc3BsYXlfbmFtZTogc3RyaW5nO1xuICBlbWFpbDogc3RyaW5nO1xuICBmaXJzdF9uYW1lOiBzdHJpbmc7XG4gIHNlY29uZF9uYW1lOiBzdHJpbmc7XG4gIGxvZ2luOiBzdHJpbmc7XG4gIHBob25lOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjb25zdCBQcm9maWxlTGF5b3V0ID0gKGRhdGE6IElQcm9maWxlRFRPKSA9PiB7XG5cbiAgcmV0dXJuIG5ldyBIWVBPKHtcbiAgICByZW5kZXJUbzogPEhUTUxFbGVtZW50PmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcm9vdFwiKSxcbiAgICB0ZW1wbGF0ZVBhdGg6IFwicHJvZmlsZS50ZW1wbGF0ZS5odG1sXCIsXG4gICAgZGF0YToge1xuICAgICAgLi4uZGF0YSxcbiAgICB9LFxuICAgIGNoaWxkcmVuOiB7XG4gICAgICBFZGl0UHJvZmlsZUxpbms6IEJ1dHRvbih7XG4gICAgICAgIHRpdGxlOiBcItCY0LfQvNC10L3QuNGC0Ywg0LTQsNC90L3Ri9C1XCIsXG4gICAgICAgIGNsYXNzTmFtZTogXCJhY3Rpb25fX2NoYW5nZS1wcm9maWxlXCIsXG4gICAgICAgIG9uQ2xpY2s6ICgpID0+IHtcbiAgICAgICAgICByb3V0ZXIuZ28oXCIvZWRpdHByb2ZpbGVcIik7XG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICAgIEVkaXRQYXNzd29yZExpbms6IEJ1dHRvbih7XG4gICAgICAgIHRpdGxlOiBcItCY0LfQvNC10L3QuNGC0Ywg0L/QsNGA0L7Qu9GMXCIsXG4gICAgICAgIGNsYXNzTmFtZTogXCJhY3Rpb25fX2NoYW5nZS1wYXNzd29yZFwiLFxuICAgICAgICBvbkNsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgcm91dGVyLmdvKFwiL2VkaXRwYXNzd29yZFwiKTtcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgQmFja0xpbms6IEJ1dHRvbih7XG4gICAgICAgIHRpdGxlOiBcItCd0LDQt9Cw0LRcIixcbiAgICAgICAgY2xhc3NOYW1lOiBcImFjdGlvbl9fYmFja1wiLFxuICAgICAgICBvbkNsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgcm91dGVyLmdvKFwiL2NoYXRcIik7XG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICAgIEV4aXRMaW5rOiBCdXR0b24oe1xuICAgICAgICB0aXRsZTogXCLQktGL0LnRgtC4XCIsXG4gICAgICAgIGNsYXNzTmFtZTogXCJhY3Rpb25fX2V4aXRcIixcbiAgICAgICAgb25DbGljazogKCkgPT4ge1xuICAgICAgICAgIG5ldyBIVFRQVHJhbnNwb3J0KCkuUE9TVChcIi9hdXRoL2xvZ291dFwiKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHJvdXRlci5nbyhcIi9cIik7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICB9LFxuICB9KTtcbn07XG4iLCJpbXBvcnQgeyBIWVBPIH0gZnJvbSAnLi4vLi4vbGlicy9IWVBPL0hZUE8nO1xuaW1wb3J0IHsgSW5wdXQgfSBmcm9tICcuLi8uLi9Db21wb25lbnRzL0lucHV0Jztcbi8vIGltcG9ydCB7IFZhbGlkYXRvciwgUnVsZSB9IGZyb20gXCIuLi8uLi9saWJzL1ZhbGlkYXRvclwiO1xuaW1wb3J0IHsgVmFsaWRhdG9yIH0gZnJvbSAnLi4vLi4vbGlicy9WYWxpZGF0b3JzJztcbmltcG9ydCB7IEVtYWlsVmFsaWRhdG9yIH0gZnJvbSAnLi4vLi4vbGlicy9WYWxpZGF0b3JzL0VtYWlsJztcbmltcG9ydCB7IFJlcXVpcmVkIH0gZnJvbSAnLi4vLi4vbGlicy9WYWxpZGF0b3JzL1JlcXVpcmVkJztcbmltcG9ydCB7IEF0dGVudGlvbk1lc3NhZ2UgfSBmcm9tICcuLi8uLi9Db21wb25lbnRzL0F0dGVudGlvbk1lc3NhZ2UnO1xuaW1wb3J0IHsgZXZlbnRCdXMgfSBmcm9tICcuLi8uLi9saWJzL0V2ZW50QnVzJztcbmltcG9ydCB7IHJvdXRlciB9IGZyb20gJy4uLy4uJztcbmltcG9ydCB7IEhUVFBUcmFuc3BvcnQgfSBmcm9tICcuLi8uLi9saWJzL1RyYW5zcG9ydCc7XG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tICcuLi8uLi9Db21wb25lbnRzL0J1dHRvbic7XG5cbmV4cG9ydCBjb25zdCBSZWdpc3RyYXRpb25MYXlvdXQgPSAoKSA9PiB7XG4gIGNvbnN0IEF0dGVudGlvbkVtYWlsID0gQXR0ZW50aW9uTWVzc2FnZSgpO1xuICBjb25zdCBBdHRlbnRpb25Mb2dpbiA9IEF0dGVudGlvbk1lc3NhZ2UoKTtcbiAgY29uc3QgQXR0ZW50aW9uUGFzc3dvcmQgPSBBdHRlbnRpb25NZXNzYWdlKCk7XG4gIGNvbnN0IEF0dGVudGlvblBhc3N3b3JkRG91YmxlID0gQXR0ZW50aW9uTWVzc2FnZSgpO1xuICBjb25zdCBBdHRlbnRpb25GaXJzdE5hbWUgPSBBdHRlbnRpb25NZXNzYWdlKCk7XG4gIGNvbnN0IEF0dGVudGlvblNlY29uZE5hbWUgPSBBdHRlbnRpb25NZXNzYWdlKCk7XG4gIGNvbnN0IEF0dGVudGlvblBob25lID0gQXR0ZW50aW9uTWVzc2FnZSgpO1xuXG4gIGNvbnN0IEZvcm1EYXRhOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG5cbiAgcmV0dXJuIG5ldyBIWVBPKHtcbiAgICByZW5kZXJUbzogPEhUTUxFbGVtZW50PmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNyb290JyksXG4gICAgdGVtcGxhdGVQYXRoOiAncmVnaXN0cmF0aW9uLnRlbXBsYXRlLmh0bWwnLFxuICAgIGRhdGE6IHtcbiAgICAgIGZvcm1UaXRsZTogJ9Cg0LXQs9C40YHRgtGA0LDRhtC40Y8nLFxuICAgIH0sXG4gICAgY2hpbGRyZW46IHtcbiAgICAgIElucHV0RW1haWw6IElucHV0KHtcbiAgICAgICAgbGFiZWw6ICfQn9C+0YfRgtCwJyxcbiAgICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgICBuYW1lOiAnZW1haWwnLFxuICAgICAgICBpZDogJ2Zvcm1fX2VtYWlsX19pbnB1dCcsXG4gICAgICAgIGNsYXNzTmFtZTogJ2Zvcm0tcmVnX19mb3JtLWlucHV0JyxcbiAgICAgICAgQ2hpbGRBdHRlbnRpb246IEF0dGVudGlvbkVtYWlsLFxuICAgICAgICBvbkJsdXI6IChlOiBFdmVudCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHN0YXRlID0gQXR0ZW50aW9uRW1haWwuZ2V0U3RhdGUoKTtcbiAgICAgICAgICBjb25zdCBpbnB1dCA9IGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgICAgICAgaWYgKEVtYWlsVmFsaWRhdG9yLmNoZWNrRnVuYyhpbnB1dC52YWx1ZSkpIHtcbiAgICAgICAgICAgIEZvcm1EYXRhWydlbWFpbCddID0gaW5wdXQudmFsdWU7XG4gICAgICAgICAgICBzdGF0ZS5tZXNzYWdlID0gJyc7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0YXRlLm1lc3NhZ2UgPSAn4puUINGN0YLQviDQvdC1INC/0L7RhdC+0LbQtSDQvdCwINCw0LTRgNC10YEg0Y3Qu9C10LrRgtGA0L7QvdC90L7QuSDQv9C+0YfRgtGLJztcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICAgIElucHV0TG9naW46IElucHV0KHtcbiAgICAgICAgbGFiZWw6ICfQm9C+0LPQuNC9JyxcbiAgICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgICBuYW1lOiAnbG9naW4nLFxuICAgICAgICBpZDogJ2Zvcm1fX2xvZ2luX19pbnB1dCcsXG4gICAgICAgIGNsYXNzTmFtZTogJ2Zvcm0tcmVnX19mb3JtLWlucHV0JyxcbiAgICAgICAgQ2hpbGRBdHRlbnRpb246IEF0dGVudGlvbkxvZ2luLFxuICAgICAgICBvbkJsdXI6IChlOiBFdmVudCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHN0YXRlID0gQXR0ZW50aW9uTG9naW4uZ2V0U3RhdGUoKTtcbiAgICAgICAgICBjb25zdCBpbnB1dCA9IGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgICAgICAgaWYgKFJlcXVpcmVkLmNoZWNrRnVuYyhpbnB1dC52YWx1ZSkpIHtcbiAgICAgICAgICAgIEZvcm1EYXRhWydsb2dpbiddID0gaW5wdXQudmFsdWU7XG4gICAgICAgICAgICBzdGF0ZS5tZXNzYWdlID0gJyc7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0YXRlLm1lc3NhZ2UgPSAn4puUINC+0LHRj9C30LDRgtC10LvRjNC90L7QtSDQv9C+0LvQtSc7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICBGaXJzdE5hbWU6IElucHV0KHtcbiAgICAgICAgbGFiZWw6ICfQmNC80Y8nLFxuICAgICAgICB0eXBlOiAndGV4dCcsXG4gICAgICAgIG5hbWU6ICdmaXJzdF9uYW1lJyxcbiAgICAgICAgaWQ6ICdmb3JtX19maXJzdF9uYW1lX19pbnB1dCcsXG4gICAgICAgIGNsYXNzTmFtZTogJ2Zvcm0tcmVnX19mb3JtLWlucHV0JyxcbiAgICAgICAgQ2hpbGRBdHRlbnRpb246IEF0dGVudGlvbkZpcnN0TmFtZSxcbiAgICAgICAgb25CbHVyOiAoZTogRXZlbnQpID0+IHtcbiAgICAgICAgICBjb25zdCBzdGF0ZSA9IEF0dGVudGlvbkZpcnN0TmFtZS5nZXRTdGF0ZSgpO1xuICAgICAgICAgIGNvbnN0IGlucHV0ID0gZS50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICAgICAgICBpZiAoUmVxdWlyZWQuY2hlY2tGdW5jKGlucHV0LnZhbHVlKSkge1xuICAgICAgICAgICAgRm9ybURhdGFbJ2ZpcnN0X25hbWUnXSA9IGlucHV0LnZhbHVlO1xuICAgICAgICAgICAgc3RhdGUubWVzc2FnZSA9ICcnO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdGF0ZS5tZXNzYWdlID0gJ+KblCDQvtCx0Y/Qt9Cw0YLQtdC70YzQvdC+0LUg0L/QvtC70LUnO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgU2Vjb25kTmFtZTogSW5wdXQoe1xuICAgICAgICBsYWJlbDogJ9Ck0LDQvNC40LvQuNGPJyxcbiAgICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgICBuYW1lOiAnc2Vjb25kX25hbWUnLFxuICAgICAgICBpZDogJ2Zvcm1fX3NlY29uZF9uYW1lX19pbnB1dCcsXG4gICAgICAgIGNsYXNzTmFtZTogJ2Zvcm0tcmVnX19mb3JtLWlucHV0JyxcbiAgICAgICAgQ2hpbGRBdHRlbnRpb246IEF0dGVudGlvblNlY29uZE5hbWUsXG4gICAgICAgIG9uQmx1cjogKGU6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgY29uc3Qgc3RhdGUgPSBBdHRlbnRpb25TZWNvbmROYW1lLmdldFN0YXRlKCk7XG4gICAgICAgICAgY29uc3QgaW5wdXQgPSBlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgICAgICAgIGlmIChSZXF1aXJlZC5jaGVja0Z1bmMoaW5wdXQudmFsdWUpKSB7XG4gICAgICAgICAgICBGb3JtRGF0YVsnc2Vjb25kX25hbWUnXSA9IGlucHV0LnZhbHVlO1xuICAgICAgICAgICAgc3RhdGUubWVzc2FnZSA9ICcnO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdGF0ZS5tZXNzYWdlID0gJ+KblCDQvtCx0Y/Qt9Cw0YLQtdC70YzQvdC+0LUg0L/QvtC70LUnO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgUGhvbmU6IElucHV0KHtcbiAgICAgICAgbGFiZWw6ICfQotC10LvQtdGE0L7QvScsXG4gICAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgICAgbmFtZTogJ3Bob25lJyxcbiAgICAgICAgaWQ6ICdmb3JtX19waG9uZV9faW5wdXQnLFxuICAgICAgICBjbGFzc05hbWU6ICdmb3JtLXJlZ19fZm9ybS1pbnB1dCcsXG4gICAgICAgIENoaWxkQXR0ZW50aW9uOiBBdHRlbnRpb25QaG9uZSxcbiAgICAgICAgb25CbHVyOiAoZTogRXZlbnQpID0+IHtcbiAgICAgICAgICBjb25zdCBzdGF0ZSA9IEF0dGVudGlvblBob25lLmdldFN0YXRlKCk7XG4gICAgICAgICAgY29uc3QgaW5wdXQgPSBlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgICAgICAgIGlmIChSZXF1aXJlZC5jaGVja0Z1bmMoaW5wdXQudmFsdWUpKSB7XG4gICAgICAgICAgICBGb3JtRGF0YVsncGhvbmUnXSA9IGlucHV0LnZhbHVlO1xuICAgICAgICAgICAgc3RhdGUubWVzc2FnZSA9ICcnO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdGF0ZS5tZXNzYWdlID0gJ+KblCDQvtCx0Y/Qt9Cw0YLQtdC70YzQvdC+0LUg0L/QvtC70LUnO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgUGFzc3dvcmQ6IElucHV0KHtcbiAgICAgICAgbGFiZWw6ICfQn9Cw0YDQvtC70YwnLFxuICAgICAgICB0eXBlOiAncGFzc3dvcmQnLFxuICAgICAgICBuYW1lOiAncGFzc3dvcmQnLFxuICAgICAgICBpZDogJ2Zvcm1fX3Bhc3N3b3JkX19pbnB1dCcsXG4gICAgICAgIGNsYXNzTmFtZTogJ2Zvcm0tcmVnX19mb3JtLWlucHV0JyxcbiAgICAgICAgQ2hpbGRBdHRlbnRpb246IEF0dGVudGlvblBhc3N3b3JkLFxuICAgICAgICBvbkJsdXI6IChlOiBFdmVudCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGlucHV0ID0gZS50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICAgICAgICBjb25zdCBzdGF0ZSA9IEF0dGVudGlvblBhc3N3b3JkLmdldFN0YXRlKCk7XG4gICAgICAgICAgY29uc3Qgc3RhdGVEID0gQXR0ZW50aW9uUGFzc3dvcmREb3VibGUuZ2V0U3RhdGUoKTtcbiAgICAgICAgICBpZiAoUmVxdWlyZWQuY2hlY2tGdW5jKGlucHV0LnZhbHVlKSkge1xuICAgICAgICAgICAgRm9ybURhdGFbJ3Bhc3N3b3JkJ10gPSBpbnB1dC52YWx1ZTtcbiAgICAgICAgICAgIHN0YXRlLm1lc3NhZ2UgPSAnJztcbiAgICAgICAgICAgIGlmIChGb3JtRGF0YVsncGFzc3dvcmQnXSAhPT0gRm9ybURhdGFbJ2RvdWJsZXBhc3N3b3JkJ10pIHtcbiAgICAgICAgICAgICAgc3RhdGVELm1lc3NhZ2UgPSAn8J+UpdC/0LDRgNC+0LvQuCDQvdC1INGB0L7QstC/0LDQtNCw0Y7Rgic7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0YXRlLm1lc3NhZ2UgPSAn4puUINC+0LHRj9C30LDRgtC10LvRjNC90L7QtSDQv9C+0LvQtSc7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICBQYXNzd29yZERvdWJsZTogSW5wdXQoe1xuICAgICAgICBsYWJlbDogJ9Cf0LDRgNC+0LvRjCcsXG4gICAgICAgIHR5cGU6ICdwYXNzd29yZCcsXG4gICAgICAgIG5hbWU6ICdkb3VibGVwYXNzd29yZCcsXG4gICAgICAgIGlkOiAnZm9ybV9fZG91YmxlcGFzc3dvcmRfX2lucHV0JyxcbiAgICAgICAgY2xhc3NOYW1lOiAnZm9ybS1yZWdfX2Zvcm0taW5wdXQnLFxuICAgICAgICBDaGlsZEF0dGVudGlvbjogQXR0ZW50aW9uUGFzc3dvcmREb3VibGUsXG4gICAgICAgIG9uQmx1cjogKGU6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgY29uc3QgaW5wdXQgPSBlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgICAgICAgIGNvbnN0IHN0YXRlID0gQXR0ZW50aW9uUGFzc3dvcmREb3VibGUuZ2V0U3RhdGUoKTtcbiAgICAgICAgICBpZiAoUmVxdWlyZWQuY2hlY2tGdW5jKGlucHV0LnZhbHVlKSkge1xuICAgICAgICAgICAgRm9ybURhdGFbJ2RvdWJsZXBhc3N3b3JkJ10gPSBpbnB1dC52YWx1ZTtcbiAgICAgICAgICAgIHN0YXRlLm1lc3NhZ2UgPSAnJztcbiAgICAgICAgICAgIGlmIChGb3JtRGF0YVsncGFzc3dvcmQnXSAhPT0gRm9ybURhdGFbJ2RvdWJsZXBhc3N3b3JkJ10pIHtcbiAgICAgICAgICAgICAgc3RhdGUubWVzc2FnZSA9ICfwn5Sl0L/QsNGA0L7Qu9C4INC90LUg0YHQvtCy0L/QsNC00LDRjtGCJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RhdGUubWVzc2FnZSA9ICfim5Qg0L7QsdGP0LfQsNGC0LXQu9GM0L3QvtC1INC/0L7Qu9C1JztcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICAgIFJlZ0J1dHRvbjogQnV0dG9uKHtcbiAgICAgICAgdGl0bGU6ICfQl9Cw0YDQtdCz0LjRgdGC0YDQuNGA0L7QstCw0YLRjNGB0Y8nLFxuICAgICAgICBjbGFzc05hbWU6ICdmb3JtLWJ1dHRvbicsXG4gICAgICAgIG9uQ2xpY2s6IChlOiBFdmVudCkgPT4ge1xuICAgICAgICAgIGlmIChPYmplY3Qua2V5cyhGb3JtRGF0YSkubGVuZ3RoID09IDAgfHwgT2JqZWN0LmtleXMoRm9ybURhdGEpLmZpbmQoaXRlbSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gRm9ybURhdGFbaXRlbV0gPT09ICcnXG4gICAgICAgICAgfSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgZGF0YTogeyBba2V5OiBzdHJpbmddOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IH0gPSB7XG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgIGZpcnN0X25hbWU6IEZvcm1EYXRhLmZpcnN0X25hbWUsXG4gICAgICAgICAgICAgIHNlY29uZF9uYW1lOiBGb3JtRGF0YS5zZWNvbmRfbmFtZSxcbiAgICAgICAgICAgICAgbG9naW46IEZvcm1EYXRhLmxvZ2luLFxuICAgICAgICAgICAgICBlbWFpbDogRm9ybURhdGEuZW1haWwsXG4gICAgICAgICAgICAgIHBhc3N3b3JkOiBGb3JtRGF0YS5wYXNzd29yZCxcbiAgICAgICAgICAgICAgcGhvbmU6IEZvcm1EYXRhLnBob25lLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgJ0NvbnRlbnQtdHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfTtcbiAgICAgICAgICBuZXcgSFRUUFRyYW5zcG9ydCgpLlBPU1QoJy9hdXRoL3NpZ251cCcsIGRhdGEpO1xuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICBMb2dpbkxpbms6IEJ1dHRvbih7XG4gICAgICAgIHRpdGxlOiAn0JLQvtC50YLQuCcsXG4gICAgICAgIGNsYXNzTmFtZTogJ2Zvcm0tbGluaycsXG4gICAgICAgIG9uQ2xpY2s6IChlOiBFdmVudCkgPT4ge1xuICAgICAgICAgIHJvdXRlci5nbygnLycpO1xuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgfSxcbiAgfSk7XG59O1xuIiwiaW1wb3J0IHsgTG9naW5MYXlvdXQgfSBmcm9tIFwiLi9MYXlvdXRzL0xvZ2luXCI7XG5pbXBvcnQgeyBDaGF0TGF5b3V0IH0gZnJvbSBcIi4vTGF5b3V0cy9DaGF0XCI7XG5pbXBvcnQgeyBSZWdpc3RyYXRpb25MYXlvdXQgfSBmcm9tIFwiLi9MYXlvdXRzL1JlZ2lzdHJhdGlvblwiO1xuaW1wb3J0IHsgUHJvZmlsZUxheW91dCB9IGZyb20gXCIuL0xheW91dHMvUHJvZmlsZVwiO1xuaW1wb3J0IHsgQ2hhbmdlUHJvZmlsZSB9IGZyb20gXCIuL0xheW91dHMvQ2hhbmdlUHJvZmlsZVwiO1xuaW1wb3J0IHsgQ2hhbmdlUGFzc3dvcmQgfSBmcm9tIFwiLi9MYXlvdXRzL0NoYW5nZVBhc3N3b3JkXCI7XG5pbXBvcnQgeyBSb3V0ZXIgfSBmcm9tIFwiLi9saWJzL1JvdXRlclwiO1xuaW1wb3J0IHsgSFRUUFRyYW5zcG9ydCB9IGZyb20gXCIuL2xpYnMvVHJhbnNwb3J0XCI7XG5cbmV4cG9ydCBjb25zdCByb3V0ZXIgPSBuZXcgUm91dGVyKFwiI3Jvb3RcIilcbiAgLnVzZShcIi9cIiwgTG9naW5MYXlvdXQsICgpID0+IHtcbiAgICByZXR1cm4gbmV3IEhUVFBUcmFuc3BvcnQoKS5HRVQoXCIvYXV0aC91c2VyXCIpLnRoZW4oKHVzZXIpID0+IHtcbiAgICAgIHJldHVybiBKU09OLnBhcnNlKHVzZXIucmVzcG9uc2UpO1xuICAgIH0pO1xuICB9KVxuICAudXNlKFwiL3JlZ2lzdHJhdGlvblwiLCBSZWdpc3RyYXRpb25MYXlvdXQpXG4gIC51c2UoXCIvY2hhdFwiLCBDaGF0TGF5b3V0LCAoKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBIVFRQVHJhbnNwb3J0KCkuR0VUKFwiL2NoYXRzXCIpLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgY29uc3QgcmVzcCA9IEpTT04ucGFyc2UocmVzdWx0LnJlc3BvbnNlKTtcbiAgICAgIHJldHVybiByZXNwO1xuICAgIH0pO1xuICB9KVxuICAudXNlKFwiL3Byb2ZpbGVcIiwgUHJvZmlsZUxheW91dCwgKCkgPT4ge1xuICAgIHJldHVybiBuZXcgSFRUUFRyYW5zcG9ydCgpLkdFVChcIi9hdXRoL3VzZXJcIikudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICBjb25zdCByZXNwID0gSlNPTi5wYXJzZShyZXN1bHQucmVzcG9uc2UpO1xuICAgICAgcmV0dXJuIHJlc3A7XG4gICAgfSk7XG4gIH0pXG4gIC51c2UoXCIvZWRpdHByb2ZpbGVcIiwgQ2hhbmdlUHJvZmlsZSlcbiAgLnVzZShcIi9lZGl0cGFzc3dvcmRcIiwgQ2hhbmdlUGFzc3dvcmQpXG4gIC5zdGFydCgpO1xuIiwiaW1wb3J0IHsgdXVpZHY0IH0gZnJvbSBcIi4uL3V0aWxzXCI7XG5pbnRlcmZhY2UgSUhZUE9Qcm9wcyB7XG4gIHJlbmRlclRvPzogSFRNTEVsZW1lbnQ7XG4gIHRlbXBsYXRlUGF0aDogc3RyaW5nO1xuICBjaGlsZHJlbj86IFJlY29yZDxzdHJpbmcsIEhZUE8gfCBIWVBPW10+O1xuICBkYXRhOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPjtcbn1cblxuaW50ZXJmYWNlIElUZW1wYXRlUHJvcCB7XG4gIGh0bWw6IHN0cmluZztcbiAgdGVtcGxhdGVLZXk6IHN0cmluZztcbiAgbWFnaWNLZXk6IHN0cmluZztcbiAgaXNBcnJheTogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGNsYXNzIEhZUE8ge1xuICBwcml2YXRlIHJlbmRlclRvPzogSFRNTEVsZW1lbnQ7XG4gIHByaXZhdGUgY2hpbGRyZW4/OiBSZWNvcmQ8c3RyaW5nLCBIWVBPIHwgSFlQT1tdPjtcbiAgcHJpdmF0ZSB0ZW1wbGF0ZVBhdGg6IHN0cmluZztcbiAgcHJpdmF0ZSBkYXRhOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPjtcbiAgcHJpdmF0ZSB0ZW1wbGF0ZXNQcm9taXNlczogUHJvbWlzZTxJVGVtcGF0ZVByb3A+W107XG4gIHByaXZhdGUgc3RvcmU6IFJlY29yZDxzdHJpbmcsIHVua25vd24+O1xuICBwcml2YXRlIG1hZ2ljS2V5OiBzdHJpbmc7XG4gIHByaXZhdGUgYWZ0ZXJSZW5kZXJDYWxsYmFjazogKCkgPT4gdm9pZDtcbiAgcHJpdmF0ZSBhZnRlclJlbmRlckNhbGxiYWNrQXJyOiBTZXQ8KCkgPT4gdm9pZD47XG5cbiAgY29uc3RydWN0b3IocGFyYW1zOiBJSFlQT1Byb3BzKSB7XG4gICAgdGhpcy5yZW5kZXJUbyA9IHBhcmFtcy5yZW5kZXJUbztcbiAgICB0aGlzLmRhdGEgPSBwYXJhbXMuZGF0YTtcbiAgICB0aGlzLnRlbXBsYXRlUGF0aCA9IGAuL3RlbXBsYXRlcy8ke3BhcmFtcy50ZW1wbGF0ZVBhdGh9YDtcbiAgICB0aGlzLmNoaWxkcmVuID0gcGFyYW1zLmNoaWxkcmVuO1xuICAgIHRoaXMudGVtcGxhdGVzUHJvbWlzZXMgPSBbXTtcbiAgICB0aGlzLnN0b3JlID0ge307XG4gICAgdGhpcy5tYWdpY0tleSA9IHV1aWR2NCgpO1xuICAgIHRoaXMuYWZ0ZXJSZW5kZXJDYWxsYmFjayA9ICgpID0+IHt9O1xuICAgIHRoaXMuYWZ0ZXJSZW5kZXJDYWxsYmFja0FyciA9IG5ldyBTZXQoKTtcbiAgfVxuXG4gIC8vQHRvZG86INC/0YDQuNC60YDRg9GC0LjRgtGMINC80LXQvNC+0LjQt9Cw0YbQuNGOXG5cbiAgcHVibGljIGdldFRlbXBsYXRlSFRNTChcbiAgICBrZXk6IHN0cmluZyxcbiAgICBoeXBvOiBIWVBPLFxuICAgIGlzQXJyYXk6IGJvb2xlYW5cbiAgKTogUHJvbWlzZTxJVGVtcGF0ZVByb3A+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2U8SVRlbXBhdGVQcm9wPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBmZXRjaChoeXBvLnRlbXBsYXRlUGF0aClcbiAgICAgICAgLnRoZW4oKGh0bWwpID0+IHtcbiAgICAgICAgICBpZiAoaHRtbC5zdGF0dXMgIT09IDIwMCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiZmlsZSBkbyBub3QgZG93bmxvYWRcIik7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBodG1sLmJsb2IoKTtcbiAgICAgICAgfSlcbiAgICAgICAgLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICAgIHJldHVybiByZXN1bHQudGV4dCgpO1xuICAgICAgICB9KVxuICAgICAgICAudGhlbigodGV4dCkgPT4ge1xuICAgICAgICAgIHRleHQgPSB0aGlzLmluc2VydERhdGFJbnRvSFRNTCh0ZXh0LCBoeXBvLmRhdGEpO1xuICAgICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgaHRtbDogdGV4dCxcbiAgICAgICAgICAgIHRlbXBsYXRlS2V5OiBrZXksXG4gICAgICAgICAgICBtYWdpY0tleTogaHlwby5tYWdpY0tleSxcbiAgICAgICAgICAgIGlzQXJyYXk6IGlzQXJyYXksXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBjb2xsZWN0VGVtcGxhdGVzKFxuICAgIGh5cG86IEhZUE8gfCBIWVBPW10sXG4gICAgbmFtZTogc3RyaW5nLFxuICAgIGlzQXJyYXk6IGJvb2xlYW5cbiAgKTogSFlQTyB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoaHlwbykpIHtcbiAgICAgIHRoaXMuaGFuZGxlQXJyYXlIWVBPKGh5cG8sIG5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmhhbmRsZVNpbXBsZUhZUE8oaHlwbywgbmFtZSk7XG4gICAgICB0aGlzLnRlbXBsYXRlc1Byb21pc2VzLnB1c2godGhpcy5nZXRUZW1wbGF0ZUhUTUwobmFtZSwgaHlwbywgaXNBcnJheSkpO1xuICAgICAgdGhpcy5hZnRlclJlbmRlckNhbGxiYWNrQXJyLmFkZChoeXBvLmFmdGVyUmVuZGVyQ2FsbGJhY2spO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHByaXZhdGUgaGFuZGxlQXJyYXlIWVBPKGh5cG9zOiBIWVBPW10sIG5hbWU6IHN0cmluZyk6IHZvaWQge1xuICAgIGh5cG9zLmZvckVhY2goKGh5cG8pID0+IHtcbiAgICAgIHRoaXMuY29sbGVjdFRlbXBsYXRlcyhoeXBvLCBgJHtuYW1lfWAsIHRydWUpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBoYW5kbGVTaW1wbGVIWVBPKGh5cG86IEhZUE8sIG5hbWU6IHN0cmluZyk6IHZvaWQge1xuICAgIGlmIChoeXBvLmNoaWxkcmVuKSB7XG4gICAgICBPYmplY3Qua2V5cyhoeXBvLmNoaWxkcmVuKS5mb3JFYWNoKChjaGlsZE5hbWUpID0+IHtcbiAgICAgICAgaWYgKGh5cG8uY2hpbGRyZW4pIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5jb2xsZWN0VGVtcGxhdGVzKFxuICAgICAgICAgICAgaHlwby5jaGlsZHJlbltjaGlsZE5hbWVdLFxuICAgICAgICAgICAgY2hpbGROYW1lLFxuICAgICAgICAgICAgZmFsc2VcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGluc2VydERhdGFJbnRvSFRNTChcbiAgICBodG1sVGVtcGxhdGU6IHN0cmluZyxcbiAgICBkYXRhOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPlxuICApOiBzdHJpbmcge1xuICAgIGRhdGEgPSB0aGlzLmdldERhdGFXaXRob3V0SWVyYXJoeShkYXRhKTtcbiAgICBmb3IgKGxldCBrZXkgaW4gZGF0YSkge1xuICAgICAgaWYgKHR5cGVvZiBkYXRhW2tleV0gIT09IFwib2JqZWN0XCIgfHwgZGF0YVtrZXldID09PSBudWxsKSB7XG4gICAgICAgIGNvbnN0IG1hc2sgPSBuZXcgUmVnRXhwKFwie3tcIiArIGtleSArIFwifX1cIiwgXCJnXCIpO1xuICAgICAgICBodG1sVGVtcGxhdGUgPSBodG1sVGVtcGxhdGUucmVwbGFjZShtYXNrLCBTdHJpbmcoZGF0YVtrZXldKSk7XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IG1hc2sgPSBuZXcgUmVnRXhwKC97e1thLXouX10rfX0vZyk7XG4gICAgaHRtbFRlbXBsYXRlID0gaHRtbFRlbXBsYXRlLnJlcGxhY2UobWFzaywgXCJcIik7XG4gICAgcmV0dXJuIGh0bWxUZW1wbGF0ZTtcbiAgfVxuXG4gIHByaXZhdGUgY29udmVydEFyclRlbXBsYXRlVG9NYXAoXG4gICAgdGVtcGxhdGVBcnI6IHtcbiAgICAgIGh0bWw6IHN0cmluZztcbiAgICAgIHRlbXBsYXRlS2V5OiBzdHJpbmc7XG4gICAgICBtYWdpY0tleTogc3RyaW5nO1xuICAgICAgaXNBcnJheTogYm9vbGVhbiB8IHVuZGVmaW5lZDtcbiAgICB9W11cbiAgKTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiB7XG4gICAgY29uc3QgcmVzdWx0OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG4gICAgdGVtcGxhdGVBcnIuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgaWYgKHJlc3VsdFtpdGVtLnRlbXBsYXRlS2V5XSkge1xuICAgICAgICByZXN1bHRbXG4gICAgICAgICAgaXRlbS50ZW1wbGF0ZUtleVxuICAgICAgICBdICs9IGA8c3BhbiBoeXBvPVwiJHtpdGVtLm1hZ2ljS2V5fVwiPiR7aXRlbS5odG1sfTwvc3Bhbj5gO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0W2Ake2l0ZW0udGVtcGxhdGVLZXl9LSR7aXRlbS5tYWdpY0tleX1gXSA9IGl0ZW0uaHRtbDtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwcml2YXRlIGluc2VydFRlbXBsYXRlSW50b1RlbXBsYXRlKFxuICAgIHJvb3RUZW1wbGF0ZUhUTUw6IHN0cmluZyxcbiAgICB0ZW1wbGF0ZUtleTogc3RyaW5nLFxuICAgIGNoaWxkVGVtcGxhdGVIVE1MOiBzdHJpbmcsXG4gICAgbWFnaWNLZXk6IHN0cmluZyxcbiAgICBpc0FycmF5OiBib29sZWFuXG4gICk6IHN0cmluZyB7XG4gICAgcm9vdFRlbXBsYXRlSFRNTCA9IHRoaXMuY3JlYXRlRWxlbVdyYXBwZXIoXG4gICAgICByb290VGVtcGxhdGVIVE1MLFxuICAgICAgdGVtcGxhdGVLZXksXG4gICAgICBtYWdpY0tleSxcbiAgICAgIGlzQXJyYXlcbiAgICApO1xuICAgIGNvbnN0IG1hc2sgPSBuZXcgUmVnRXhwKGAtPSR7dGVtcGxhdGVLZXl9LSR7bWFnaWNLZXl9PS1gLCBcImdcIik7XG4gICAgcm9vdFRlbXBsYXRlSFRNTCA9IHJvb3RUZW1wbGF0ZUhUTUwucmVwbGFjZShtYXNrLCBjaGlsZFRlbXBsYXRlSFRNTCk7XG4gICAgcmV0dXJuIHJvb3RUZW1wbGF0ZUhUTUw7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZUVsZW1XcmFwcGVyKFxuICAgIGh0bWxUZW1wbGF0ZTogc3RyaW5nLFxuICAgIHRlbXBsYXRlS2V5OiBzdHJpbmcsXG4gICAgbWFnaWNLZXk6IHN0cmluZyxcbiAgICBpc0FycmF5OiBib29sZWFuXG4gICkge1xuICAgIGNvbnN0IG1hc2sgPSBuZXcgUmVnRXhwKGAtPSR7dGVtcGxhdGVLZXl9PS1gLCBcImdcIik7XG4gICAgaWYgKGlzQXJyYXkpIHtcbiAgICAgIGh0bWxUZW1wbGF0ZSA9IGh0bWxUZW1wbGF0ZS5yZXBsYWNlKFxuICAgICAgICBtYXNrLFxuICAgICAgICBgPHNwYW4gaHlwbz1cIiR7bWFnaWNLZXl9XCI+LT0ke3RlbXBsYXRlS2V5fS0ke21hZ2ljS2V5fT0tLT0ke3RlbXBsYXRlS2V5fT0tPC9zcGFuPmBcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGh0bWxUZW1wbGF0ZSA9IGh0bWxUZW1wbGF0ZS5yZXBsYWNlKFxuICAgICAgICBtYXNrLFxuICAgICAgICBgPHNwYW4gaHlwbz1cIiR7bWFnaWNLZXl9XCI+LT0ke3RlbXBsYXRlS2V5fS0ke21hZ2ljS2V5fT0tPC9zcGFuPmBcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGh0bWxUZW1wbGF0ZTtcbiAgfVxuXG4gIHByaXZhdGUgY2xlYXJFbXRweUNvbXBvbmVudChodG1sOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGNvbnN0IHJlZ2V4ID0gLy09W2EteixBLVosMC05XSs9LS9nO1xuICAgIHJldHVybiBodG1sLnJlcGxhY2UocmVnZXgsIFwiXCIpO1xuICB9XG5cbiAgcHVibGljIHJlbmRlciA9IGFzeW5jICgpOiBQcm9taXNlPEhZUE8+ID0+IHtcbiAgICBjb25zdCB0aGF0ID0gdGhpcztcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwoXG4gICAgICB0aGlzLmNvbGxlY3RUZW1wbGF0ZXModGhpcywgXCJyb290XCIsIGZhbHNlKS50ZW1wbGF0ZXNQcm9taXNlc1xuICAgICkudGhlbigoYXJyYXlUZW1wbGF0ZXMpID0+IHtcbiAgICAgIGNvbnN0IG1hcFRlbXBsYXRlcyA9IHRoaXMuY29udmVydEFyclRlbXBsYXRlVG9NYXAoYXJyYXlUZW1wbGF0ZXMpO1xuICAgICAgbGV0IHJvb3RUZW1wbGF0ZUhUTUw6IHN0cmluZyA9XG4gICAgICAgIGFycmF5VGVtcGxhdGVzW2FycmF5VGVtcGxhdGVzLmxlbmd0aCAtIDFdLmh0bWw7XG4gICAgICBmb3IgKGxldCBpID0gYXJyYXlUZW1wbGF0ZXMubGVuZ3RoIC0gMjsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgbGV0IHRlbXBsYXRlID1cbiAgICAgICAgICBtYXBUZW1wbGF0ZXNbXG4gICAgICAgICAgICBgJHthcnJheVRlbXBsYXRlc1tpXS50ZW1wbGF0ZUtleX0tJHthcnJheVRlbXBsYXRlc1tpXS5tYWdpY0tleX1gXG4gICAgICAgICAgXTtcbiAgICAgICAgcm9vdFRlbXBsYXRlSFRNTCA9IHRoaXMuaW5zZXJ0VGVtcGxhdGVJbnRvVGVtcGxhdGUoXG4gICAgICAgICAgcm9vdFRlbXBsYXRlSFRNTCxcbiAgICAgICAgICBhcnJheVRlbXBsYXRlc1tpXS50ZW1wbGF0ZUtleSxcbiAgICAgICAgICB0ZW1wbGF0ZSxcbiAgICAgICAgICBhcnJheVRlbXBsYXRlc1tpXS5tYWdpY0tleSxcbiAgICAgICAgICBhcnJheVRlbXBsYXRlc1tpXS5pc0FycmF5XG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIHJvb3RUZW1wbGF0ZUhUTUwgPSB0aGlzLmNsZWFyRW10cHlDb21wb25lbnQocm9vdFRlbXBsYXRlSFRNTCk7XG5cbiAgICAgIGlmICh0aGlzLnJlbmRlclRvKSB7XG4gICAgICAgIHRoaXMucmVuZGVyVG8uaW5uZXJIVE1MID0gcm9vdFRlbXBsYXRlSFRNTDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGVsZW0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbaHlwbz1cIiR7dGhpcy5tYWdpY0tleX1cIl1gKTtcbiAgICAgICAgaWYgKGVsZW0pIHtcbiAgICAgICAgICB0aGlzLnJlbmRlclRvID0gZWxlbSBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgICBlbGVtLmlubmVySFRNTCA9IHJvb3RUZW1wbGF0ZUhUTUw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMuYWZ0ZXJSZW5kZXJDYWxsYmFja0Fyci5mb3JFYWNoKChjYWxsYmFjaykgPT4ge1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLnRlbXBsYXRlc1Byb21pc2VzID0gW107XG4gICAgICByZXR1cm4gdGhhdDtcbiAgICB9KTtcbiAgfTtcblxuICBwcml2YXRlIHJlcmVuZGVyKCkge1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBwdWJsaWMgZ2V0U3RhdGUoKTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4ge1xuICAgIHRoaXMuc3RvcmUgPSB0aGlzLmNyZWF0ZVN0b3JlKHRoaXMuZGF0YSk7XG4gICAgcmV0dXJuIHRoaXMuc3RvcmU7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZVN0b3JlKHN0b3JlOiBhbnkpIHtcbiAgICBjb25zdCB0aGF0ID0gdGhpcztcbiAgICBjb25zdCBoYW5kbGVyOiBQcm94eUhhbmRsZXI8UmVjb3JkPHN0cmluZywgdW5rbm93bj4+ID0ge1xuICAgICAgZ2V0KHRhcmdldCwgcHJvcGVydHkpIHtcbiAgICAgICAgcmV0dXJuIHRhcmdldFs8c3RyaW5nPnByb3BlcnR5XTtcbiAgICAgIH0sXG4gICAgICBzZXQodGFyZ2V0LCBwcm9wZXJ0eSwgdmFsdWUpIHtcbiAgICAgICAgdGFyZ2V0WzxzdHJpbmc+cHJvcGVydHldID0gdmFsdWU7XG4gICAgICAgIHRoYXQucmVyZW5kZXIoKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9LFxuICAgIH07XG4gICAgc3RvcmUgPSBuZXcgUHJveHkoc3RvcmUsIGhhbmRsZXIpO1xuXG4gICAgT2JqZWN0LmtleXMoc3RvcmUpLmZvckVhY2goKGZpZWxkKSA9PiB7XG4gICAgICBpZiAodHlwZW9mIHN0b3JlW2ZpZWxkXSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICBzdG9yZVtmaWVsZF0gPSBuZXcgUHJveHkoc3RvcmVbZmllbGRdLCBoYW5kbGVyKTtcbiAgICAgICAgdGhpcy5jcmVhdGVTdG9yZShzdG9yZVtmaWVsZF0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHN0b3JlO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXREYXRhV2l0aG91dEllcmFyaHkoZGF0YTogYW55KSB7XG4gICAgbGV0IHBhdGhBcnI6IHN0cmluZ1tdID0gW107XG4gICAgbGV0IHJlc3VsdE9iamVjdDogYW55ID0ge307XG4gICAgZnVuY3Rpb24gZm56KG9iajogYW55KSB7XG4gICAgICBmb3IgKGxldCBrZXkgaW4gb2JqKSB7XG4gICAgICAgIHBhdGhBcnIucHVzaChrZXkpO1xuICAgICAgICBpZiAodHlwZW9mIG9ialtrZXldID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgZm56KG9ialtrZXldKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXN1bHRPYmplY3RbcGF0aEFyci5qb2luKFwiLlwiKV0gPSBvYmpba2V5XTtcbiAgICAgICAgICBwYXRoQXJyLnBvcCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBwYXRoQXJyLnBvcCgpO1xuICAgIH1cbiAgICBmbnooZGF0YSk7XG5cbiAgICByZXR1cm4gcmVzdWx0T2JqZWN0O1xuICB9XG5cbiAgcHVibGljIGFmdGVyUmVuZGVyKGNhbGxiYWNrOiAoKSA9PiB2b2lkKTogSFlQTyB7XG4gICAgdGhpcy5hZnRlclJlbmRlckNhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBwdWJsaWMgaGlkZSgpIHtcbiAgICBpZiAodGhpcy5yZW5kZXJUbykge1xuICAgICAgbGV0IGNoaWxkcmVuO1xuXG4gICAgICBjaGlsZHJlbiA9IHRoaXMucmVuZGVyVG8uY2hpbGRyZW47XG4gICAgICBpZiAoY2hpbGRyZW4pIHtcbiAgICAgICAgZm9yIChsZXQgY2hpbGQgb2YgY2hpbGRyZW4pIHtcbiAgICAgICAgICBjaGlsZC5yZW1vdmUoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHsgSFlQTyB9IGZyb20gXCIuLi9IWVBPL0hZUE9cIjtcblxuY2xhc3MgUm91dGUge1xuICBwcml2YXRlIF9wYXRobmFtZTogc3RyaW5nID0gXCJcIjtcbiAgcHJpdmF0ZSBfYmxvY2s/OiAocmVzdWx0PzogYW55KSA9PiBIWVBPO1xuICBwcml2YXRlIF9wcm9wczogUmVjb3JkPHN0cmluZywgdW5rbm93bj47XG4gIGFzeW5jRk4/OiAoKSA9PiBQcm9taXNlPGFueT47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcGF0aG5hbWU6IHN0cmluZyxcbiAgICB2aWV3OiAoKSA9PiBIWVBPLFxuICAgIHByb3BzOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPixcbiAgICBhc3luY0ZOPzogKCkgPT4gUHJvbWlzZTxhbnk+XG4gICkge1xuICAgIHRoaXMuX3BhdGhuYW1lID0gcGF0aG5hbWU7XG4gICAgdGhpcy5fcHJvcHMgPSBwcm9wcztcbiAgICB0aGlzLl9ibG9jayA9IHZpZXc7XG4gICAgdGhpcy5hc3luY0ZOID0gYXN5bmNGTjtcbiAgfVxuXG4gIG5hdmlnYXRlKHBhdGhuYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5tYXRjaChwYXRobmFtZSkpIHtcbiAgICAgIHRoaXMuX3BhdGhuYW1lID0gcGF0aG5hbWU7XG4gICAgICB0aGlzLnJlbmRlcigpO1xuICAgIH1cbiAgfVxuXG4gIGxlYXZlKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9ibG9jaykge1xuICAgICAgdGhpcy5fYmxvY2soKS5oaWRlKCk7XG4gICAgfVxuICB9XG5cbiAgbWF0Y2gocGF0aG5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBpc0VxdWFsKHBhdGhuYW1lLCB0aGlzLl9wYXRobmFtZSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgaWYgKCF0aGlzLl9ibG9jaykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy5hc3luY0ZOKSB7XG4gICAgICB0aGlzLmFzeW5jRk4oKS50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgdGhpcy5fYmxvY2s/LihyZXN1bHQpLnJlbmRlcigpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2Jsb2NrKCkucmVuZGVyKCk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBSb3V0ZXIge1xuICBwcml2YXRlIF9faW5zdGFuY2U6IFJvdXRlciA9IHRoaXM7XG4gIHJvdXRlczogUm91dGVbXSA9IFtdO1xuICBwcml2YXRlIGhpc3Rvcnk6IEhpc3RvcnkgPSB3aW5kb3cuaGlzdG9yeTtcbiAgcHJpdmF0ZSBfY3VycmVudFJvdXRlOiBSb3V0ZSB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIF9yb290UXVlcnk6IHN0cmluZyA9IFwiXCI7XG4gIHByaXZhdGUgYXN5bmNGTj86ICgpID0+IFByb21pc2U8YW55PjtcblxuICBjb25zdHJ1Y3Rvcihyb290UXVlcnk6IHN0cmluZykge1xuICAgIGlmICh0aGlzLl9faW5zdGFuY2UpIHtcbiAgICAgIHJldHVybiB0aGlzLl9faW5zdGFuY2U7XG4gICAgfVxuICAgIHRoaXMuX3Jvb3RRdWVyeSA9IHJvb3RRdWVyeTtcbiAgfVxuXG4gIHVzZShcbiAgICBwYXRobmFtZTogc3RyaW5nLFxuICAgIGJsb2NrOiAocmVzdWx0PzogYW55KSA9PiBIWVBPLFxuICAgIGFzeW5jRk4/OiAoKSA9PiBQcm9taXNlPGFueT5cbiAgKTogUm91dGVyIHtcbiAgICBjb25zdCByb3V0ZSA9IG5ldyBSb3V0ZShwYXRobmFtZSwgYmxvY2ssIHsgcm9vdFF1ZXJ5OiB0aGlzLl9yb290UXVlcnkgfSwgYXN5bmNGTik7XG4gICAgdGhpcy5yb3V0ZXMucHVzaChyb3V0ZSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBzdGFydCgpOiBSb3V0ZXIge1xuICAgIHdpbmRvdy5vbnBvcHN0YXRlID0gKF86IFBvcFN0YXRlRXZlbnQpID0+IHtcbiAgICAgIGxldCBtYXNrID0gbmV3IFJlZ0V4cChcIiNcIiwgXCJnXCIpO1xuICAgICAgY29uc3QgdXJsID0gd2luZG93LmxvY2F0aW9uLmhhc2gucmVwbGFjZShtYXNrLCBcIlwiKTtcbiAgICAgIHRoaXMuX29uUm91dGUodXJsKTtcbiAgICB9O1xuICAgIGxldCBtYXNrID0gbmV3IFJlZ0V4cChcIiNcIiwgXCJnXCIpO1xuICAgIGNvbnN0IHVybCA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoLnJlcGxhY2UobWFzaywgXCJcIikgfHwgXCIvXCI7XG4gICAgdGhpcy5fb25Sb3V0ZSh1cmwpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgX29uUm91dGUocGF0aG5hbWU6IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnN0IHJvdXRlID0gdGhpcy5nZXRSb3V0ZShwYXRobmFtZSk7XG4gICAgaWYgKCFyb3V0ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy5fY3VycmVudFJvdXRlKSB7XG4gICAgICB0aGlzLl9jdXJyZW50Um91dGUubGVhdmUoKTtcbiAgICB9XG4gICAgdGhpcy5fY3VycmVudFJvdXRlID0gcm91dGU7XG4gICAgdGhpcy5fY3VycmVudFJvdXRlLnJlbmRlcigpO1xuICB9XG5cbiAgZ28ocGF0aG5hbWU6IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMuaGlzdG9yeS5wdXNoU3RhdGUoe30sIFwiXCIsIGAjJHtwYXRobmFtZX1gKTtcbiAgICB0aGlzLl9vblJvdXRlKHBhdGhuYW1lKTtcbiAgfVxuXG4gIGJhY2soKTogdm9pZCB7XG4gICAgdGhpcy5oaXN0b3J5LmJhY2soKTtcbiAgfVxuXG4gIGZvcndhcmQoKTogdm9pZCB7XG4gICAgdGhpcy5oaXN0b3J5LmZvcndhcmQoKTtcbiAgfVxuXG4gIGdldFJvdXRlKHBhdGhuYW1lOiBzdHJpbmcpOiBSb3V0ZSB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHRoaXMucm91dGVzLmZpbmQoKHJvdXRlKSA9PiByb3V0ZS5tYXRjaChwYXRobmFtZSkpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGlzRXF1YWwobGhzOiB1bmtub3duLCByaHM6IHVua25vd24pIHtcbiAgcmV0dXJuIGxocyA9PT0gcmhzO1xufVxuIiwiY29uc3QgTUVUSE9EUyA9IHtcbiAgR0VUOiBcIkdFVFwiLFxuICBQVVQ6IFwiUFVUXCIsXG4gIFBPU1Q6IFwiUE9TVFwiLFxuICBERUxFVEU6IFwiREVMRVRFXCIsXG59O1xuXG5jb25zdCBET01FTiA9IFwiaHR0cHM6Ly95YS1wcmFrdGlrdW0udGVjaC9hcGkvdjJcIjtcblxuZXhwb3J0IGNsYXNzIEhUVFBUcmFuc3BvcnQge1xuICBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgICBoZWFkZXJzOiB7fSxcbiAgICBkYXRhOiB7fSxcbiAgfTtcbiAgR0VUID0gKFxuICAgIHVybDogc3RyaW5nLFxuICAgIG9wdGlvbnM6IHsgW2tleTogc3RyaW5nXTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiB9ID0gdGhpcy5kZWZhdWx0T3B0aW9uc1xuICApID0+IHtcbiAgICBjb25zdCByZXF1ZXN0UGFyYW1zID0gcXVlcnlTdHJpbmdpZnkob3B0aW9ucy5kYXRhKTtcbiAgICB1cmwgKz0gcmVxdWVzdFBhcmFtcztcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KFxuICAgICAgdXJsLFxuICAgICAgeyAuLi5vcHRpb25zLCBtZXRob2Q6IE1FVEhPRFMuR0VUIH0sXG4gICAgICBOdW1iZXIob3B0aW9ucy50aW1lb3V0KSB8fCA1MDAwXG4gICAgKTtcbiAgfTtcbiAgUFVUID0gKFxuICAgIHVybDogc3RyaW5nLFxuICAgIG9wdGlvbnM6IHsgW2tleTogc3RyaW5nXTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiB9ID0gdGhpcy5kZWZhdWx0T3B0aW9uc1xuICApID0+IHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KFxuICAgICAgdXJsLFxuICAgICAgeyAuLi5vcHRpb25zLCBtZXRob2Q6IE1FVEhPRFMuUFVUIH0sXG4gICAgICBOdW1iZXIob3B0aW9ucy50aW1lb3V0KSB8fCA1MDAwXG4gICAgKTtcbiAgfTtcbiAgUE9TVCA9IChcbiAgICB1cmw6IHN0cmluZyxcbiAgICBvcHRpb25zOiB7IFtrZXk6IHN0cmluZ106IFJlY29yZDxzdHJpbmcsIHN0cmluZyB8IG51bWJlcj4gfSA9IHRoaXNcbiAgICAgIC5kZWZhdWx0T3B0aW9uc1xuICApID0+IHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KFxuICAgICAgdXJsLFxuICAgICAgeyAuLi5vcHRpb25zLCBtZXRob2Q6IE1FVEhPRFMuUE9TVCB9LFxuICAgICAgTnVtYmVyKG9wdGlvbnMudGltZW91dCkgfHwgNTAwMFxuICAgICk7XG4gIH07XG4gIERFTEVURSA9IChcbiAgICB1cmw6IHN0cmluZyxcbiAgICBvcHRpb25zOiB7IFtrZXk6IHN0cmluZ106IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gfSA9IHRoaXMuZGVmYXVsdE9wdGlvbnNcbiAgKSA9PiB7XG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdChcbiAgICAgIHVybCxcbiAgICAgIHsgLi4ub3B0aW9ucywgbWV0aG9kOiBNRVRIT0RTLkRFTEVURSB9LFxuICAgICAgTnVtYmVyKG9wdGlvbnMudGltZW91dCkgfHwgNTAwMFxuICAgICk7XG4gIH07XG4gIHJlcXVlc3QgPSAoXG4gICAgdXJsOiBzdHJpbmcsXG4gICAgb3B0aW9uczogeyBba2V5OiBzdHJpbmddOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IH0gfCBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+LFxuICAgIHRpbWVvdXQ6IG51bWJlciA9IDUwMDBcbiAgKSA9PiB7XG4gICAgdXJsID0gRE9NRU4gKyB1cmw7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPGFueT4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICB4aHIud2l0aENyZWRlbnRpYWxzID0gdHJ1ZTtcbiAgICAgIHhoci5vcGVuKDxzdHJpbmc+b3B0aW9ucy5tZXRob2QsIHVybCk7XG4gICAgICBjb25zdCBoZWFkZXJzID0gb3B0aW9ucy5oZWFkZXJzO1xuICAgICAgZm9yIChsZXQgaGVhZGVyIGluIDxSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+PmhlYWRlcnMpIHtcbiAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKGhlYWRlciwgaGVhZGVyc1toZWFkZXJdKTtcbiAgICAgIH1cbiAgICAgIHhoci5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgIHJlc29sdmUoeGhyKTtcbiAgICAgIH07XG4gICAgICB4aHIub25lcnJvciA9IChlKSA9PiB7XG4gICAgICAgIHJlamVjdChlKTtcbiAgICAgIH07XG4gICAgICB4aHIub25hYm9ydCA9IChlKSA9PiB7XG4gICAgICAgIHJlamVjdChlKTtcbiAgICAgIH07XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgeGhyLmFib3J0KCk7XG4gICAgICB9LCB0aW1lb3V0KTtcblxuICAgICAgeGhyLnNlbmQoSlNPTi5zdHJpbmdpZnkob3B0aW9ucy5kYXRhKSk7XG4gICAgfSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHF1ZXJ5U3RyaW5naWZ5KGRhdGE6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4pIHtcbiAgbGV0IHJlcXVlc3RQYXJhbXMgPSBcIj9cIjtcbiAgZm9yIChsZXQga2V5IGluIGRhdGEpIHtcbiAgICByZXF1ZXN0UGFyYW1zICs9IGAke2tleX09JHtkYXRhW2tleV19JmA7XG4gIH1cbiAgcmVxdWVzdFBhcmFtcyA9IHJlcXVlc3RQYXJhbXMuc3Vic3RyaW5nKDAsIHJlcXVlc3RQYXJhbXMubGVuZ3RoIC0gMSk7XG4gIHJldHVybiByZXF1ZXN0UGFyYW1zO1xufVxuIiwiaW1wb3J0IHsgSFlQTyB9IGZyb20gXCIuLi8uLi9IWVBPXCI7XG5cbmV4cG9ydCBjb25zdCBFbWFpbFZhbGlkYXRvciA9IHtcbiAgdmFsdWU6IFwiXCIsXG4gIGNoZWNrRnVuYzogZnVuY3Rpb24gKHZhbHVlOiBzdHJpbmcpIHtcbiAgICB2YXIgcmVnID0gL14oW0EtWmEtejAtOV9cXC1cXC5dKStcXEAoW0EtWmEtejAtOV9cXC1cXC5dKStcXC4oW0EtWmEtel17Miw0fSkkLztcbiAgICBpZiAoIXJlZy50ZXN0KHZhbHVlKSkge1xuICAgICAgdGhpcy52YWx1ZSA9IFwiXCI7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSxcbiAgY2FsbGJhY2s6IChlbGVtOiBIWVBPLCBjaGVja1Jlc3VsdDogYm9vbGVhbikgPT4ge1xuICAgIGxldCBzdGF0ZSA9IGVsZW0uZ2V0U3RhdGUoKTtcbiAgICBpZiAoIWNoZWNrUmVzdWx0KSB7XG4gICAgICBzdGF0ZS5tZXNzYWdlID0gXCLim5Qg0Y3RgtC+INC90LUg0L/QvtGF0L7QttC1INC90LAg0LDQtNGA0LXRgSDRjdC70LXQutGC0YDQvtC90L3QvtC5INC/0L7Rh9GC0YtcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RhdGUubWVzc2FnZSA9IFwiXCI7XG4gICAgfVxuICB9LFxufTtcbiIsImltcG9ydCB7IEhZUE8gfSBmcm9tIFwiLi4vLi4vSFlQT1wiO1xuXG5leHBvcnQgY29uc3QgUmVxdWlyZWQgPSB7XG4gIHZhbHVlOiBcIlwiLFxuICBjaGVja0Z1bmM6IGZ1bmN0aW9uICh2YWx1ZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgaWYgKHZhbHVlID09PSBcIlwiKSB7XG4gICAgICB0aGlzLnZhbHVlID0gXCJcIjtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgIHJldHVybiB0cnVlO1xuICB9LFxuICBjYWxsYmFjazogKGVsZW06IEhZUE8sIGNoZWNrUmVzdWx0OiBib29sZWFuKSA9PiB7XG4gICAgbGV0IHN0YXRlID0gZWxlbS5nZXRTdGF0ZSgpO1xuICAgIGlmICghY2hlY2tSZXN1bHQpIHtcbiAgICAgIHN0YXRlLm1lc3NhZ2UgPSBcIuKblCDQvtCx0Y/Qt9Cw0YLQtdC70YzQvdC+0LUg0L/QvtC70LVcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RhdGUubWVzc2FnZSA9IFwiXCI7XG4gICAgfVxuICB9LFxufTsiLCJleHBvcnQgZnVuY3Rpb24gdXVpZHY0KCkge1xuICByZXR1cm4gXCJ4eHh4eHh4eC14eHh4LTR4eHgteXh4eC14eHh4eHh4eHh4eHhcIi5yZXBsYWNlKC9beHldL2csIGZ1bmN0aW9uIChjKSB7XG4gICAgdmFyIHIgPSAoTWF0aC5yYW5kb20oKSAqIDE2KSB8IDAsXG4gICAgICB2ID0gYyA9PSBcInhcIiA/IHIgOiAociAmIDB4MykgfCAweDg7XG4gICAgcmV0dXJuIGAke3YudG9TdHJpbmcoMTYpfWA7XG4gIH0pO1xufSIsImV4cG9ydCBmdW5jdGlvbiBtZW1vaXplKGZ1bmMsIHJlc29sdmVyKSB7XG4gIGlmIChcbiAgICB0eXBlb2YgZnVuYyAhPSBcImZ1bmN0aW9uXCIgfHxcbiAgICAocmVzb2x2ZXIgIT0gbnVsbCAmJiB0eXBlb2YgcmVzb2x2ZXIgIT0gXCJmdW5jdGlvblwiKVxuICApIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEZVTkNfRVJST1JfVEVYVCk7XG4gIH1cbiAgdmFyIG1lbW9pemVkID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBhcmdzID0gYXJndW1lbnRzLFxuICAgICAga2V5ID0gcmVzb2x2ZXIgPyByZXNvbHZlci5hcHBseSh0aGlzLCBhcmdzKSA6IGFyZ3NbMF0sXG4gICAgICBjYWNoZSA9IG1lbW9pemVkLmNhY2hlO1xuXG4gICAgaWYgKGNhY2hlLmhhcyhrZXkpKSB7XG4gICAgICByZXR1cm4gY2FjaGUuZ2V0KGtleSk7XG4gICAgfVxuICAgIHZhciByZXN1bHQgPSBmdW5jLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIG1lbW9pemVkLmNhY2hlID0gY2FjaGUuc2V0KGtleSwgcmVzdWx0KSB8fCBjYWNoZTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuICBtZW1vaXplZC5jYWNoZSA9IG5ldyAobWVtb2l6ZS5DYWNoZSB8fCBNYXBDYWNoZSkoKTtcbiAgcmV0dXJuIG1lbW9pemVkO1xufVxuXG5tZW1vaXplLkNhY2hlID0gTWFwO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0aWYoX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSkge1xuXHRcdHJldHVybiBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxuX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2luZGV4LnRzXCIpO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==