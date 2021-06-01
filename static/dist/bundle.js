/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/Bootstrap/index.ts":
/*!********************************!*\
  !*** ./src/Bootstrap/index.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BootStrap = void 0;
const InfrastsructureLayer_1 = __webpack_require__(/*! ../InfrastsructureLayer */ "./src/InfrastsructureLayer/index.ts");
const IntegrationalLayer_1 = __webpack_require__(/*! ../IntegrationalLayer */ "./src/IntegrationalLayer/index.ts");
const BussinesLayer_1 = __webpack_require__(/*! ../BussinesLayer */ "./src/BussinesLayer/index.ts");
const ViewModel_1 = __webpack_require__(/*! ../ViewModel */ "./src/ViewModel/index.ts");
const CreateDIContainer = (infrastructureContainer, integreationContainer, serviceContainer, viewModelContainer) => {
    return viewModelContainer
        .parent(serviceContainer)
        .parent(integreationContainer)
        .parent(infrastructureContainer);
};
class BootStrap {
    constructor() {
        this.container = CreateDIContainer(InfrastsructureLayer_1.infrastructureContainer, IntegrationalLayer_1.ApiClientContainer, BussinesLayer_1.ServiceContainer, ViewModel_1.ViewModelContainer);
    }
}
exports.BootStrap = BootStrap;


/***/ }),

/***/ "./src/BussinesLayer/ChatService.ts":
/*!******************************************!*\
  !*** ./src/BussinesLayer/ChatService.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChatService = void 0;
class ChatService {
    constructor(ApiClient) {
        this.ApiClient = ApiClient;
        this.getChats = () => {
            return this.ApiClient.getChats();
        };
        this.saveChat = (data) => {
            return this.ApiClient.saveChat(data);
        };
    }
    deleteChat(chatId) {
        return this.ApiClient.deleteChat(chatId);
    }
}
exports.ChatService = ChatService;


/***/ }),

/***/ "./src/BussinesLayer/UserService.ts":
/*!******************************************!*\
  !*** ./src/BussinesLayer/UserService.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserService = void 0;
class UserService {
    constructor(ApiClient) {
        this.ApiClient = ApiClient;
    }
    saveUser(user) {
        return this.ApiClient.saveUser(user);
    }
    getUser() {
        return this.ApiClient.getUser();
    }
}
exports.UserService = UserService;


/***/ }),

/***/ "./src/BussinesLayer/index.ts":
/*!************************************!*\
  !*** ./src/BussinesLayer/index.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ServiceContainer = exports.SERVICE = void 0;
const IntegrationalLayer_1 = __webpack_require__(/*! ../IntegrationalLayer */ "./src/IntegrationalLayer/index.ts");
const Container_1 = __webpack_require__(/*! ../libs/Container */ "./src/libs/Container/index.ts");
const ChatService_1 = __webpack_require__(/*! ./ChatService */ "./src/BussinesLayer/ChatService.ts");
const UserService_1 = __webpack_require__(/*! ./UserService */ "./src/BussinesLayer/UserService.ts");
exports.SERVICE = {
    CHAT: Symbol.for("ChatService"),
    USER: Symbol.for("UserServcie"),
};
exports.ServiceContainer = new Container_1.Container();
exports.ServiceContainer.bind(exports.SERVICE.CHAT).toDynamicValue((container) => {
    const APIClient = container.get(IntegrationalLayer_1.API_CLIENT.CHAT);
    return new ChatService_1.ChatService(APIClient);
});
exports.ServiceContainer.bind(exports.SERVICE.USER).toDynamicValue((container) => {
    const APIClient = container.get(IntegrationalLayer_1.API_CLIENT.USER);
    return new UserService_1.UserService(APIClient);
});


/***/ }),

/***/ "./src/InfrastsructureLayer/index.ts":
/*!*******************************************!*\
  !*** ./src/InfrastsructureLayer/index.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.infrastructureContainer = exports.INTEGRATION_MODULE = void 0;
const Container_1 = __webpack_require__(/*! ../libs/Container */ "./src/libs/Container/index.ts");
const interfaces_1 = __webpack_require__(/*! ./interfaces */ "./src/InfrastsructureLayer/interfaces.ts");
exports.INTEGRATION_MODULE = {
    APIModule: Symbol.for("API"),
};
exports.infrastructureContainer = new Container_1.Container();
exports.infrastructureContainer
    .bind(exports.INTEGRATION_MODULE.APIModule)
    .toDynamicValue((container) => {
    return new interfaces_1.APIModule();
});


/***/ }),

/***/ "./src/InfrastsructureLayer/interfaces.ts":
/*!************************************************!*\
  !*** ./src/InfrastsructureLayer/interfaces.ts ***!
  \************************************************/
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
exports.APIModule = void 0;
const Transport_1 = __webpack_require__(/*! ../libs/Transport */ "./src/libs/Transport/index.ts");
class APIModule {
    constructor() {
        this.getData = (url, data) => {
            return Transport_1.HTTPTransport.getInstance()
                .GET(url, this.getParms(data))
                .then((result) => {
                return JSON.parse(result.response);
            });
        };
        this.postData = (url, data) => __awaiter(this, void 0, void 0, function* () {
            return Transport_1.HTTPTransport.getInstance()
                .POST(url, this.getParms(data))
                .then((result) => {
                return JSON.parse(result.response);
            });
        });
        this.deleteData = (url, data) => {
            return Transport_1.HTTPTransport.getInstance()
                .DELETE(url, this.getParms(data))
                .then((result) => {
                return JSON.parse(result.response);
            });
        };
        this.putData = (url, data) => {
            return Transport_1.HTTPTransport.getInstance().PUT(url, this.getParms(data));
        };
    }
    getParms(data) {
        return {
            headers: {
                "Content-type": "application/json",
            },
            data: Object.assign({}, data),
        };
    }
}
exports.APIModule = APIModule;


/***/ }),

/***/ "./src/IntegrationalLayer/ChatAPI.ts":
/*!*******************************************!*\
  !*** ./src/IntegrationalLayer/ChatAPI.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports) {


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
exports.ChatAPIClient = void 0;
class ChatAPIClient {
    constructor(APIModule) {
        this.APIModule = APIModule;
        this.getChats = () => __awaiter(this, void 0, void 0, function* () {
            return yield this.APIModule.getData("/chats", {}).then((result) => {
                return result;
            });
        });
        this.saveChat = (data) => __awaiter(this, void 0, void 0, function* () {
            yield this.APIModule.postData("/chats", data);
        });
    }
    deleteChat(id) {
        return this.APIModule.deleteData("/chats", { chatId: id });
    }
}
exports.ChatAPIClient = ChatAPIClient;


/***/ }),

/***/ "./src/IntegrationalLayer/UserAPI.ts":
/*!*******************************************!*\
  !*** ./src/IntegrationalLayer/UserAPI.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports) {


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
exports.UserAPIClient = void 0;
class UserAPIClient {
    constructor(APIModule) {
        this.APIModule = APIModule;
        this.getUser = () => __awaiter(this, void 0, void 0, function* () {
            const user = yield this.APIModule.getData("/auth/user", {});
            return user;
        });
        this.saveUser = (user) => {
            return this.APIModule.putData('/user/profile', user);
        };
    }
}
exports.UserAPIClient = UserAPIClient;


/***/ }),

/***/ "./src/IntegrationalLayer/index.ts":
/*!*****************************************!*\
  !*** ./src/IntegrationalLayer/index.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ApiClientContainer = exports.API_CLIENT = void 0;
const Container_1 = __webpack_require__(/*! ../libs/Container */ "./src/libs/Container/index.ts");
const InfrastsructureLayer_1 = __webpack_require__(/*! ../InfrastsructureLayer */ "./src/InfrastsructureLayer/index.ts");
const ChatAPI_1 = __webpack_require__(/*! ./ChatAPI */ "./src/IntegrationalLayer/ChatAPI.ts");
const UserAPI_1 = __webpack_require__(/*! ./UserAPI */ "./src/IntegrationalLayer/UserAPI.ts");
exports.API_CLIENT = {
    CHAT: Symbol.for("ChatAPIClient"),
    USER: Symbol.for("UserAPIClient"),
};
exports.ApiClientContainer = new Container_1.Container();
exports.ApiClientContainer.bind(exports.API_CLIENT.CHAT).toDynamicValue((container) => {
    const APIModule = container.get(InfrastsructureLayer_1.INTEGRATION_MODULE.APIModule);
    return new ChatAPI_1.ChatAPIClient(APIModule);
});
exports.ApiClientContainer.bind(exports.API_CLIENT.USER).toDynamicValue((container) => {
    const APIModule = container.get(InfrastsructureLayer_1.INTEGRATION_MODULE.APIModule);
    return new UserAPI_1.UserAPIClient(APIModule);
});


/***/ }),

/***/ "./src/UI/Components/AttentionMessage/index.ts":
/*!*****************************************************!*\
  !*** ./src/UI/Components/AttentionMessage/index.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AttentionMessage = void 0;
const HYPO_1 = __webpack_require__(/*! ../../../libs/HYPO/HYPO */ "./src/libs/HYPO/HYPO.ts");
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

/***/ "./src/UI/Components/Button/index.ts":
/*!*******************************************!*\
  !*** ./src/UI/Components/Button/index.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Button = void 0;
const HYPO_1 = __webpack_require__(/*! ../../../libs/HYPO/HYPO */ "./src/libs/HYPO/HYPO.ts");
const utils_1 = __webpack_require__(/*! ../../../libs/utils */ "./src/libs/utils/index.ts");
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

/***/ "./src/UI/Components/ChatItem/index.ts":
/*!*********************************************!*\
  !*** ./src/UI/Components/ChatItem/index.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChatItem = void 0;
const __1 = __webpack_require__(/*! ../../.. */ "./src/index.ts");
const Chat_1 = __webpack_require__(/*! ../../Layouts/Chat */ "./src/UI/Layouts/Chat/index.ts");
const HYPO_1 = __webpack_require__(/*! ../../../libs/HYPO/HYPO */ "./src/libs/HYPO/HYPO.ts");
const Delete_1 = __webpack_require__(/*! ../Delete */ "./src/UI/Components/Delete/index.ts");
const ViewModel_1 = __webpack_require__(/*! ../../../ViewModel */ "./src/ViewModel/index.ts");
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
                    const chatViewModel = __1.container.get(ViewModel_1.VIEW_MODEL.CHAT);
                    chatViewModel.deleteChat(String(props.id)).then(() => {
                        Chat_1.ChatLayout(chatViewModel.chats).render();
                    });
                },
            }),
        },
    });
};
exports.ChatItem = ChatItem;


/***/ }),

/***/ "./src/UI/Components/CreateChatModal/index.ts":
/*!****************************************************!*\
  !*** ./src/UI/Components/CreateChatModal/index.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateChatModal = void 0;
const __1 = __webpack_require__(/*! ../../.. */ "./src/index.ts");
const HYPO_1 = __webpack_require__(/*! ../../../libs/HYPO/HYPO */ "./src/libs/HYPO/HYPO.ts");
const Required_1 = __webpack_require__(/*! ../../../libs/Validators/Required */ "./src/libs/Validators/Required/index.ts");
const AttentionMessage_1 = __webpack_require__(/*! ../AttentionMessage */ "./src/UI/Components/AttentionMessage/index.ts");
const Button_1 = __webpack_require__(/*! ../Button */ "./src/UI/Components/Button/index.ts");
const Input_1 = __webpack_require__(/*! ../Input */ "./src/UI/Components/Input/index.ts");
const Chat_1 = __webpack_require__(/*! ../../Layouts/Chat */ "./src/UI/Layouts/Chat/index.ts");
const ViewModel_1 = __webpack_require__(/*! ../../../ViewModel */ "./src/ViewModel/index.ts");
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
                        const chatViewModel = __1.container.get(ViewModel_1.VIEW_MODEL.CHAT);
                        chatViewModel.saveChat({ title: ChatName }).then(() => {
                            document
                                .getElementsByClassName("c-c-modal")[0]
                                .classList.add("hidden");
                            Chat_1.ChatLayout(chatViewModel.chats).render();
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

/***/ "./src/UI/Components/Delete/index.ts":
/*!*******************************************!*\
  !*** ./src/UI/Components/Delete/index.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Delete = void 0;
const HYPO_1 = __webpack_require__(/*! ../../../libs/HYPO/HYPO */ "./src/libs/HYPO/HYPO.ts");
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

/***/ "./src/UI/Components/Empty/index.ts":
/*!******************************************!*\
  !*** ./src/UI/Components/Empty/index.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Empty = void 0;
const HYPO_1 = __webpack_require__(/*! ../../../libs/HYPO/HYPO */ "./src/libs/HYPO/HYPO.ts");
const Empty = () => {
    return new HYPO_1.HYPO({
        templatePath: "empty.template.html",
        data: {},
    });
};
exports.Empty = Empty;


/***/ }),

/***/ "./src/UI/Components/Input/index.ts":
/*!******************************************!*\
  !*** ./src/UI/Components/Input/index.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Input = void 0;
const HYPO_1 = __webpack_require__(/*! ../../../libs/HYPO/HYPO */ "./src/libs/HYPO/HYPO.ts");
const Empty_1 = __webpack_require__(/*! ../Empty */ "./src/UI/Components/Empty/index.ts");
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

/***/ "./src/UI/Components/ProfileInput/index.ts":
/*!*************************************************!*\
  !*** ./src/UI/Components/ProfileInput/index.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProfileInput = void 0;
const HYPO_1 = __webpack_require__(/*! ../../../libs/HYPO/HYPO */ "./src/libs/HYPO/HYPO.ts");
const ProfileInput = ({ label, value, id, onChage }) => {
    return new HYPO_1.HYPO({
        templatePath: "profileInput.template.html",
        data: {
            label: label,
            value: value,
            id: id,
        },
    }).afterRender(() => {
        const input = document.getElementById(id);
        input === null || input === void 0 ? void 0 : input.addEventListener("blur", () => {
            onChage({ value: input.value });
        });
    });
};
exports.ProfileInput = ProfileInput;


/***/ }),

/***/ "./src/UI/Layouts/ChangePassword/index.ts":
/*!************************************************!*\
  !*** ./src/UI/Layouts/ChangePassword/index.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChangePassword = void 0;
const HYPO_1 = __webpack_require__(/*! ../../../libs/HYPO/HYPO */ "./src/libs/HYPO/HYPO.ts");
const __1 = __webpack_require__(/*! ../../.. */ "./src/index.ts");
const Button_1 = __webpack_require__(/*! ../../Components/Button */ "./src/UI/Components/Button/index.ts");
const momize_1 = __webpack_require__(/*! ../../../libs/momize */ "./src/libs/momize/index.js");
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

/***/ "./src/UI/Layouts/ChangeProfile/index.ts":
/*!***********************************************!*\
  !*** ./src/UI/Layouts/ChangeProfile/index.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChangeProfile = void 0;
const HYPO_1 = __webpack_require__(/*! ../../../libs/HYPO/HYPO */ "./src/libs/HYPO/HYPO.ts");
const __1 = __webpack_require__(/*! ../../.. */ "./src/index.ts");
const Button_1 = __webpack_require__(/*! ../../Components/Button */ "./src/UI/Components/Button/index.ts");
const ViewModel_1 = __webpack_require__(/*! ../../../ViewModel */ "./src/ViewModel/index.ts");
const ProfileInput_1 = __webpack_require__(/*! ../../Components/ProfileInput */ "./src/UI/Components/ProfileInput/index.ts");
const Config = {
    email: {
        label: "Почта",
    },
    login: {
        label: "Логин",
    },
    first_name: {
        label: "Имя",
    },
    second_name: {
        label: "Фамилия",
    },
    display_name: {
        label: "Имя в чатах",
    },
    phone: {
        label: "Телефон",
    },
};
const ChangeProfile = (data) => {
    const userViewModel = __1.container.get(ViewModel_1.VIEW_MODEL.USER);
    return new HYPO_1.HYPO({
        renderTo: document.getElementById("root") || document.body,
        templatePath: "changeProfile.template.html",
        data: {
            email: data === null || data === void 0 ? void 0 : data.email,
            login: data === null || data === void 0 ? void 0 : data.login,
            firstName: data === null || data === void 0 ? void 0 : data.first_name,
            secondName: data === null || data === void 0 ? void 0 : data.second_name,
            displayName: (data === null || data === void 0 ? void 0 : data.display_name) || "",
            phone: data === null || data === void 0 ? void 0 : data.phone,
        },
        children: {
            save: Button_1.Button({
                title: "Сохранить",
                className: "profile_edit__action__save",
                onClick: (e) => {
                    if (userViewModel.user) {
                        const form = document.getElementsByClassName("profile_edit")[0];
                        console.log(userViewModel.user);
                        userViewModel.saveUser(userViewModel.user).finally(() => {
                            __1.router.go("/profile");
                        });
                    }
                },
            }),
            inputs: Object.keys(Config)
                .reverse()
                .map((item) => {
                var _a;
                const key = item;
                const label = (_a = Config[item]) === null || _a === void 0 ? void 0 : _a.label;
                const value = data ? data[key] : "";
                return ProfileInput_1.ProfileInput({
                    label: label,
                    value: value,
                    id: key,
                    onChage: ({ value }) => {
                        console.log(value);
                        userViewModel.user = Object.assign(Object.assign({}, userViewModel.user), { [item]: value });
                    },
                });
            }),
        },
    });
};
exports.ChangeProfile = ChangeProfile;


/***/ }),

/***/ "./src/UI/Layouts/Chat/index.ts":
/*!**************************************!*\
  !*** ./src/UI/Layouts/Chat/index.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChatLayout = void 0;
const HYPO_1 = __webpack_require__(/*! ../../../libs/HYPO/HYPO */ "./src/libs/HYPO/HYPO.ts");
const ChatItem_1 = __webpack_require__(/*! ../../Components/ChatItem */ "./src/UI/Components/ChatItem/index.ts");
const __1 = __webpack_require__(/*! ../../.. */ "./src/index.ts");
const Button_1 = __webpack_require__(/*! ../../Components/Button */ "./src/UI/Components/Button/index.ts");
const Empty_1 = __webpack_require__(/*! ../../Components/Empty */ "./src/UI/Components/Empty/index.ts");
const CreateChatModal_1 = __webpack_require__(/*! ../../Components/CreateChatModal */ "./src/UI/Components/CreateChatModal/index.ts");
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

/***/ "./src/UI/Layouts/Login/index.ts":
/*!***************************************!*\
  !*** ./src/UI/Layouts/Login/index.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoginLayout = void 0;
const Input_1 = __webpack_require__(/*! ../../Components/Input */ "./src/UI/Components/Input/index.ts");
const Required_1 = __webpack_require__(/*! ../../../libs/Validators/Required */ "./src/libs/Validators/Required/index.ts");
const AttentionMessage_1 = __webpack_require__(/*! ../../Components/AttentionMessage */ "./src/UI/Components/AttentionMessage/index.ts");
const index_1 = __webpack_require__(/*! ../../../index */ "./src/index.ts");
const Transport_1 = __webpack_require__(/*! ../../../libs/Transport */ "./src/libs/Transport/index.ts");
const HYPO_1 = __webpack_require__(/*! ../../../libs/HYPO/HYPO */ "./src/libs/HYPO/HYPO.ts");
const Button_1 = __webpack_require__(/*! ../../Components/Button */ "./src/UI/Components/Button/index.ts");
/**
 * nnnrrr111NN
 */
const LoginLayout = (user) => {
    if (user && user.id) {
        index_1.router.go("/chat");
    }
    const attentionLogin = AttentionMessage_1.AttentionMessage();
    const attentionLoginStore = attentionLogin.getState();
    const attentionPass = AttentionMessage_1.AttentionMessage();
    const attentionPassStore = attentionPass.getState();
    const FormData = {};
    return new HYPO_1.HYPO({
        renderTo: document.getElementById("root") || document.body,
        templatePath: "login.template.html",
        data: {
            FormName: "Вход",
        },
        children: {
            InputLogin: Input_1.Input({
                label: "Логин",
                type: "text",
                name: "login",
                id: "form-input-login",
                className: "form-login__form-input",
                onBlur: (e) => {
                    const input = e.target;
                    const check = Required_1.Required.checkFunc(input === null || input === void 0 ? void 0 : input.value);
                    if (!check) {
                        attentionLoginStore.message = "⛔ обязательное поле";
                    }
                    else {
                        attentionLoginStore.message = "";
                        FormData["login"] = input.value;
                    }
                },
                ChildAttention: attentionLogin,
            }),
            InputPassword: Input_1.Input({
                label: "Пароль",
                type: "password",
                name: "password",
                id: "form-input-password",
                className: "form-login__form-input",
                onBlur: (e) => {
                    const input = e.target;
                    if (!Required_1.Required.checkFunc(input.value)) {
                        attentionPassStore.message = "⛔ обязательное поле";
                    }
                    else {
                        attentionPassStore.message = "";
                        FormData["password"] = input.value;
                    }
                },
                ChildAttention: attentionPass,
            }),
            Button: Button_1.Button({
                title: "Авторизоваться",
                className: "form-button",
                onClick: (e) => {
                    const data = {
                        data: {
                            login: FormData.login,
                            password: FormData.password,
                        },
                        headers: {
                            "Content-type": "application/json",
                        },
                    };
                    Transport_1.HTTPTransport.getInstance()
                        .POST("/auth/signin", data)
                        .then((result) => {
                        if (result.status < 300) {
                            index_1.router.go("/chat");
                        }
                    });
                },
            }),
            LinkToRegistration: Button_1.Button({
                title: "Зарегистрироваться",
                className: "form-link",
                onClick: (e) => {
                    index_1.router.go("/registration");
                },
            }),
        },
    });
};
exports.LoginLayout = LoginLayout;


/***/ }),

/***/ "./src/UI/Layouts/Profile/index.ts":
/*!*****************************************!*\
  !*** ./src/UI/Layouts/Profile/index.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProfileLayout = void 0;
const HYPO_1 = __webpack_require__(/*! ../../../libs/HYPO/HYPO */ "./src/libs/HYPO/HYPO.ts");
const Button_1 = __webpack_require__(/*! ../../Components/Button */ "./src/UI/Components/Button/index.ts");
const __1 = __webpack_require__(/*! ../../.. */ "./src/index.ts");
const Transport_1 = __webpack_require__(/*! ../../../libs/Transport */ "./src/libs/Transport/index.ts");
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
                    Transport_1.HTTPTransport.getInstance()
                        .POST("/auth/logout")
                        .then(() => {
                        __1.router.go("/");
                    });
                },
            }),
        },
    });
};
exports.ProfileLayout = ProfileLayout;


/***/ }),

/***/ "./src/UI/Layouts/Registration/index.ts":
/*!**********************************************!*\
  !*** ./src/UI/Layouts/Registration/index.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RegistrationLayout = void 0;
const HYPO_1 = __webpack_require__(/*! ../../../libs/HYPO/HYPO */ "./src/libs/HYPO/HYPO.ts");
const Input_1 = __webpack_require__(/*! ../../Components/Input */ "./src/UI/Components/Input/index.ts");
// import { Validator, Rule } from "../../libs/Validator";
const Email_1 = __webpack_require__(/*! ../../../libs/Validators/Email */ "./src/libs/Validators/Email/index.ts");
const Required_1 = __webpack_require__(/*! ../../../libs/Validators/Required */ "./src/libs/Validators/Required/index.ts");
const AttentionMessage_1 = __webpack_require__(/*! ../../Components/AttentionMessage */ "./src/UI/Components/AttentionMessage/index.ts");
const __1 = __webpack_require__(/*! ../../.. */ "./src/index.ts");
const Transport_1 = __webpack_require__(/*! ../../../libs/Transport */ "./src/libs/Transport/index.ts");
const Button_1 = __webpack_require__(/*! ../../Components/Button */ "./src/UI/Components/Button/index.ts");
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
        renderTo: document.querySelector("#root"),
        templatePath: "registration.template.html",
        data: {
            formTitle: "Регистрация",
        },
        children: {
            InputEmail: Input_1.Input({
                label: "Почта",
                type: "text",
                name: "email",
                id: "form__email__input",
                className: "form-reg__form-input",
                ChildAttention: AttentionEmail,
                onBlur: (e) => {
                    const state = AttentionEmail.getState();
                    const input = e.target;
                    if (Email_1.EmailValidator.checkFunc(input.value)) {
                        FormData["email"] = input.value;
                        state.message = "";
                    }
                    else {
                        state.message = "⛔ это не похоже на адрес электронной почты";
                    }
                },
            }),
            InputLogin: Input_1.Input({
                label: "Логин",
                type: "text",
                name: "login",
                id: "form__login__input",
                className: "form-reg__form-input",
                ChildAttention: AttentionLogin,
                onBlur: (e) => {
                    const state = AttentionLogin.getState();
                    const input = e.target;
                    if (Required_1.Required.checkFunc(input.value)) {
                        FormData["login"] = input.value;
                        state.message = "";
                    }
                    else {
                        state.message = "⛔ обязательное поле";
                    }
                },
            }),
            FirstName: Input_1.Input({
                label: "Имя",
                type: "text",
                name: "first_name",
                id: "form__first_name__input",
                className: "form-reg__form-input",
                ChildAttention: AttentionFirstName,
                onBlur: (e) => {
                    const state = AttentionFirstName.getState();
                    const input = e.target;
                    if (Required_1.Required.checkFunc(input.value)) {
                        FormData["first_name"] = input.value;
                        state.message = "";
                    }
                    else {
                        state.message = "⛔ обязательное поле";
                    }
                },
            }),
            SecondName: Input_1.Input({
                label: "Фамилия",
                type: "text",
                name: "second_name",
                id: "form__second_name__input",
                className: "form-reg__form-input",
                ChildAttention: AttentionSecondName,
                onBlur: (e) => {
                    const state = AttentionSecondName.getState();
                    const input = e.target;
                    if (Required_1.Required.checkFunc(input.value)) {
                        FormData["second_name"] = input.value;
                        state.message = "";
                    }
                    else {
                        state.message = "⛔ обязательное поле";
                    }
                },
            }),
            Phone: Input_1.Input({
                label: "Телефон",
                type: "text",
                name: "phone",
                id: "form__phone__input",
                className: "form-reg__form-input",
                ChildAttention: AttentionPhone,
                onBlur: (e) => {
                    const state = AttentionPhone.getState();
                    const input = e.target;
                    if (Required_1.Required.checkFunc(input.value)) {
                        FormData["phone"] = input.value;
                        state.message = "";
                    }
                    else {
                        state.message = "⛔ обязательное поле";
                    }
                },
            }),
            Password: Input_1.Input({
                label: "Пароль",
                type: "password",
                name: "password",
                id: "form__password__input",
                className: "form-reg__form-input",
                ChildAttention: AttentionPassword,
                onBlur: (e) => {
                    const input = e.target;
                    const state = AttentionPassword.getState();
                    const stateD = AttentionPasswordDouble.getState();
                    if (Required_1.Required.checkFunc(input.value)) {
                        FormData["password"] = input.value;
                        state.message = "";
                        if (FormData["password"] !== FormData["doublepassword"]) {
                            stateD.message = "🔥пароли не совпадают";
                        }
                    }
                    else {
                        state.message = "⛔ обязательное поле";
                    }
                },
            }),
            PasswordDouble: Input_1.Input({
                label: "Пароль",
                type: "password",
                name: "doublepassword",
                id: "form__doublepassword__input",
                className: "form-reg__form-input",
                ChildAttention: AttentionPasswordDouble,
                onBlur: (e) => {
                    const input = e.target;
                    const state = AttentionPasswordDouble.getState();
                    if (Required_1.Required.checkFunc(input.value)) {
                        FormData["doublepassword"] = input.value;
                        state.message = "";
                        if (FormData["password"] !== FormData["doublepassword"]) {
                            state.message = "🔥пароли не совпадают";
                        }
                    }
                    else {
                        state.message = "⛔ обязательное поле";
                    }
                },
            }),
            RegButton: Button_1.Button({
                title: "Зарегистрироваться",
                className: "form-button",
                onClick: (e) => {
                    if (Object.keys(FormData).length == 0 ||
                        Object.keys(FormData).find((item) => {
                            return FormData[item] === "";
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
                            "Content-type": "application/json",
                        },
                    };
                    Transport_1.HTTPTransport.getInstance()
                        .POST("/auth/signup", data)
                        .then(() => {
                        __1.router.go("/chat");
                    });
                },
            }),
            LoginLink: Button_1.Button({
                title: "Войти",
                className: "form-link",
                onClick: (e) => {
                    __1.router.go("/");
                },
            }),
        },
    });
};
exports.RegistrationLayout = RegistrationLayout;


/***/ }),

/***/ "./src/ViewModel/ChatViewModel/index.ts":
/*!**********************************************!*\
  !*** ./src/ViewModel/ChatViewModel/index.ts ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, exports) {


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
exports.ChatViewModel = void 0;
class ChatViewModel {
    constructor(service) {
        this.service = service;
        this.chats = [];
        this.x = 12;
        this.getChats = () => __awaiter(this, void 0, void 0, function* () {
            this.chats = yield this.service.getChats();
            return this.chats;
        });
        this.saveChat = (data) => __awaiter(this, void 0, void 0, function* () {
            yield this.service.saveChat(data);
            yield this.getChats();
        });
        this.deleteChat = (chatId) => __awaiter(this, void 0, void 0, function* () {
            yield this.service.deleteChat(chatId);
            yield this.getChats();
        });
    }
}
exports.ChatViewModel = ChatViewModel;


/***/ }),

/***/ "./src/ViewModel/UserViewModel/index.ts":
/*!**********************************************!*\
  !*** ./src/ViewModel/UserViewModel/index.ts ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, exports) {


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
exports.UserViewModel = void 0;
class UserViewModel {
    constructor(service) {
        this.service = service;
        this.getUser = () => __awaiter(this, void 0, void 0, function* () {
            this.user = yield this.service.getUser();
        });
        this.saveUser = (user) => __awaiter(this, void 0, void 0, function* () {
            return this.service.saveUser(user);
        });
    }
    setUserField(name, value) {
        if (this.user) {
            this.user[name] = value;
        }
        else {
            this.user = {};
            this.user[name] = value;
        }
    }
}
exports.UserViewModel = UserViewModel;


/***/ }),

/***/ "./src/ViewModel/index.ts":
/*!********************************!*\
  !*** ./src/ViewModel/index.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ViewModelContainer = exports.VIEW_MODEL = void 0;
const BussinesLayer_1 = __webpack_require__(/*! ../BussinesLayer */ "./src/BussinesLayer/index.ts");
const Container_1 = __webpack_require__(/*! ../libs/Container */ "./src/libs/Container/index.ts");
const ChatViewModel_1 = __webpack_require__(/*! ./ChatViewModel */ "./src/ViewModel/ChatViewModel/index.ts");
const UserViewModel_1 = __webpack_require__(/*! ./UserViewModel */ "./src/ViewModel/UserViewModel/index.ts");
exports.VIEW_MODEL = {
    CHAT: Symbol.for("ChatViewModel"),
    USER: Symbol.for("UserViewModel"),
};
exports.ViewModelContainer = new Container_1.Container();
exports.ViewModelContainer.bind(exports.VIEW_MODEL.CHAT).toDynamicValue((container) => {
    const service = container.get(BussinesLayer_1.SERVICE.CHAT);
    return new ChatViewModel_1.ChatViewModel(service);
});
exports.ViewModelContainer.bind(exports.VIEW_MODEL.USER)
    .toDynamicValue((container) => {
    const service = container.get(BussinesLayer_1.SERVICE.USER);
    return new UserViewModel_1.UserViewModel(service);
})
    .inSingletoneScope();


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.container = exports.router = void 0;
const Bootstrap_1 = __webpack_require__(/*! ./Bootstrap */ "./src/Bootstrap/index.ts");
const router_1 = __webpack_require__(/*! ./router */ "./src/router/index.ts");
const InitApp = () => {
    const { container } = new Bootstrap_1.BootStrap();
    const router = router_1.RouterInit(container);
    return { router, container };
};
_a = InitApp(), exports.router = _a.router, exports.container = _a.container;


/***/ }),

/***/ "./src/libs/Container/index.ts":
/*!*************************************!*\
  !*** ./src/libs/Container/index.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Container = void 0;
class SingletonScope {
    constructor() {
        this.InstanceMakers = new Map();
        this.Instances = new Map();
    }
}
class Container {
    constructor(singletoneScope = new SingletonScope()) {
        this.singletoneScope = singletoneScope;
        this.containers = new Map();
        this.get = (id) => {
            const singleToneContainer = this.singletoneScope.InstanceMakers.get(id);
            if (singleToneContainer) {
                const instance = this.singletoneScope.Instances.get(id);
                if (instance) {
                    return instance;
                }
                else {
                    this.singletoneScope.Instances.set(id, singleToneContainer.fn(this));
                    return this.singletoneScope.Instances.get(id);
                }
            }
            else {
                const createContainerFn = this.containers.get(id);
                return createContainerFn.fn(this);
            }
        };
    }
    bind(id) {
        this.lastId = id;
        this.containers.set(id, null);
        return this;
    }
    toDynamicValue(fn) {
        if (this.lastId) {
            this.containers.set(this.lastId, { fn: fn, id: this.lastId });
        }
        return this;
    }
    parent(container) {
        for (let cont of container.containers) {
            this.containers.set(cont[0], cont[1]);
        }
        return this;
    }
    inSingletoneScope() {
        if (this.lastId) {
            const container = this.containers.get(this.lastId);
            this.singletoneScope.InstanceMakers.set(this.lastId, container);
        }
    }
}
exports.Container = Container;


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
class HTTPTransportClass {
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
        this.socket = (url) => {
            return new WebSocket(url);
        };
        this.request = (url, options, timeout = 5000) => {
            url = DOMEN + url;
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.withCredentials = true;
                xhr.open(options.method, url);
                const headers = options.headers;
                for (let header in headers) {
                    const value = headers[header];
                    xhr.setRequestHeader(header, value);
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
function queryStringify(data) {
    let requestParams = "?";
    for (let key in data) {
        requestParams += `${key}=${data[key]}&`;
    }
    requestParams = requestParams.substring(0, requestParams.length - 1);
    return requestParams;
}
exports.HTTPTransport = (() => {
    let instance;
    return {
        getInstance: () => instance || (instance = new HTTPTransportClass()),
    };
})();


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

/***/ "./src/router/index.ts":
/*!*****************************!*\
  !*** ./src/router/index.ts ***!
  \*****************************/
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
exports.RouterInit = void 0;
const Login_1 = __webpack_require__(/*! ../UI/Layouts/Login */ "./src/UI/Layouts/Login/index.ts");
const Chat_1 = __webpack_require__(/*! ../UI/Layouts/Chat */ "./src/UI/Layouts/Chat/index.ts");
const Registration_1 = __webpack_require__(/*! ../UI/Layouts/Registration */ "./src/UI/Layouts/Registration/index.ts");
const Profile_1 = __webpack_require__(/*! ../UI/Layouts/Profile */ "./src/UI/Layouts/Profile/index.ts");
const ChangeProfile_1 = __webpack_require__(/*! ../UI/Layouts/ChangeProfile */ "./src/UI/Layouts/ChangeProfile/index.ts");
const ChangePassword_1 = __webpack_require__(/*! ../UI/Layouts/ChangePassword */ "./src/UI/Layouts/ChangePassword/index.ts");
const Router_1 = __webpack_require__(/*! ../libs/Router */ "./src/libs/Router/index.ts");
const Transport_1 = __webpack_require__(/*! ../libs/Transport */ "./src/libs/Transport/index.ts");
const ViewModel_1 = __webpack_require__(/*! ../ViewModel */ "./src/ViewModel/index.ts");
const RouterInit = (container) => {
    return new Router_1.Router("#root")
        .use("/", Login_1.LoginLayout, () => {
        return Transport_1.HTTPTransport.getInstance()
            .GET("/auth/user")
            .then((user) => {
            return JSON.parse(user.response);
        });
    })
        .use("/registration", Registration_1.RegistrationLayout)
        .use("/chat", Chat_1.ChatLayout, () => __awaiter(void 0, void 0, void 0, function* () {
        const chatViewModel = container.get(ViewModel_1.VIEW_MODEL.CHAT);
        yield chatViewModel.getChats();
        return chatViewModel.chats;
        return Transport_1.HTTPTransport.getInstance()
            .GET("/chats")
            .then((result) => {
            const resp = JSON.parse(result.response);
            return resp;
        });
    }))
        .use("/profile", Profile_1.ProfileLayout, () => __awaiter(void 0, void 0, void 0, function* () {
        // return HTTPTransport.getInstance()
        //   .GET("/auth/user")
        //   .then((result) => {
        //     const resp = JSON.parse(result.response);
        //     return resp;
        //   });
        const userViewModel = container.get(ViewModel_1.VIEW_MODEL.USER);
        yield userViewModel.getUser();
        return userViewModel.user;
    }))
        .use("/editprofile", ChangeProfile_1.ChangeProfile, () => __awaiter(void 0, void 0, void 0, function* () {
        const userViewModel = container.get(ViewModel_1.VIEW_MODEL.USER);
        yield userViewModel.getUser();
        return userViewModel.user;
    }))
        .use("/editpassword", ChangePassword_1.ChangePassword)
        .start();
};
exports.RouterInit = RouterInit;


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9Cb290c3RyYXAvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvQnVzc2luZXNMYXllci9DaGF0U2VydmljZS50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9CdXNzaW5lc0xheWVyL1VzZXJTZXJ2aWNlLnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL0J1c3NpbmVzTGF5ZXIvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvSW5mcmFzdHNydWN0dXJlTGF5ZXIvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvSW5mcmFzdHNydWN0dXJlTGF5ZXIvaW50ZXJmYWNlcy50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9JbnRlZ3JhdGlvbmFsTGF5ZXIvQ2hhdEFQSS50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9JbnRlZ3JhdGlvbmFsTGF5ZXIvVXNlckFQSS50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9JbnRlZ3JhdGlvbmFsTGF5ZXIvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvVUkvQ29tcG9uZW50cy9BdHRlbnRpb25NZXNzYWdlL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL1VJL0NvbXBvbmVudHMvQnV0dG9uL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL1VJL0NvbXBvbmVudHMvQ2hhdEl0ZW0vaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvVUkvQ29tcG9uZW50cy9DcmVhdGVDaGF0TW9kYWwvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvVUkvQ29tcG9uZW50cy9EZWxldGUvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvVUkvQ29tcG9uZW50cy9FbXB0eS9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9VSS9Db21wb25lbnRzL0lucHV0L2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL1VJL0NvbXBvbmVudHMvUHJvZmlsZUlucHV0L2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL1VJL0xheW91dHMvQ2hhbmdlUGFzc3dvcmQvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvVUkvTGF5b3V0cy9DaGFuZ2VQcm9maWxlL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL1VJL0xheW91dHMvQ2hhdC9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9VSS9MYXlvdXRzL0xvZ2luL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL1VJL0xheW91dHMvUHJvZmlsZS9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9VSS9MYXlvdXRzL1JlZ2lzdHJhdGlvbi9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9WaWV3TW9kZWwvQ2hhdFZpZXdNb2RlbC9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9WaWV3TW9kZWwvVXNlclZpZXdNb2RlbC9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9WaWV3TW9kZWwvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvbGlicy9Db250YWluZXIvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvbGlicy9IWVBPL0hZUE8udHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvbGlicy9Sb3V0ZXIvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvbGlicy9UcmFuc3BvcnQvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvbGlicy9WYWxpZGF0b3JzL0VtYWlsL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL2xpYnMvVmFsaWRhdG9ycy9SZXF1aXJlZC9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9saWJzL3V0aWxzL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL3JvdXRlci9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9saWJzL21vbWl6ZS9pbmRleC5qcyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4L3dlYnBhY2svc3RhcnR1cCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQ0EseUhBQWtFO0FBQ2xFLG1IQUEyRDtBQUMzRCxvR0FBb0Q7QUFDcEQsd0ZBQWtEO0FBRWxELE1BQU0saUJBQWlCLEdBQUcsQ0FDeEIsdUJBQWtDLEVBQ2xDLHFCQUFnQyxFQUNoQyxnQkFBMkIsRUFDM0Isa0JBQTZCLEVBQzdCLEVBQUU7SUFDRixPQUFPLGtCQUFrQjtTQUN0QixNQUFNLENBQUMsZ0JBQWdCLENBQUM7U0FDeEIsTUFBTSxDQUFDLHFCQUFxQixDQUFDO1NBQzdCLE1BQU0sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBQ3JDLENBQUMsQ0FBQztBQUVGLE1BQWEsU0FBUztJQUVwQjtRQUNFLElBQUksQ0FBQyxTQUFTLEdBQUcsaUJBQWlCLENBQ2hDLDhDQUF1QixFQUN2Qix1Q0FBa0IsRUFDbEIsZ0NBQWdCLEVBQ2hCLDhCQUFrQixDQUNuQixDQUFDO0lBQ0osQ0FBQztDQUNGO0FBVkQsOEJBVUM7Ozs7Ozs7Ozs7Ozs7O0FDbkJELE1BQWEsV0FBVztJQUN0QixZQUFzQixTQUF5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bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbnRhaW5lciB9IGZyb20gXCIuLi9saWJzL0NvbnRhaW5lclwiO1xuaW1wb3J0IHsgaW5mcmFzdHJ1Y3R1cmVDb250YWluZXIgfSBmcm9tIFwiLi4vSW5mcmFzdHNydWN0dXJlTGF5ZXJcIjtcbmltcG9ydCB7IEFwaUNsaWVudENvbnRhaW5lciB9IGZyb20gXCIuLi9JbnRlZ3JhdGlvbmFsTGF5ZXJcIjtcbmltcG9ydCB7IFNlcnZpY2VDb250YWluZXIgfSBmcm9tIFwiLi4vQnVzc2luZXNMYXllclwiO1xuaW1wb3J0IHsgVmlld01vZGVsQ29udGFpbmVyIH0gZnJvbSBcIi4uL1ZpZXdNb2RlbFwiO1xuXG5jb25zdCBDcmVhdGVESUNvbnRhaW5lciA9IChcbiAgaW5mcmFzdHJ1Y3R1cmVDb250YWluZXI6IENvbnRhaW5lcixcbiAgaW50ZWdyZWF0aW9uQ29udGFpbmVyOiBDb250YWluZXIsXG4gIHNlcnZpY2VDb250YWluZXI6IENvbnRhaW5lcixcbiAgdmlld01vZGVsQ29udGFpbmVyOiBDb250YWluZXJcbikgPT4ge1xuICByZXR1cm4gdmlld01vZGVsQ29udGFpbmVyXG4gICAgLnBhcmVudChzZXJ2aWNlQ29udGFpbmVyKVxuICAgIC5wYXJlbnQoaW50ZWdyZWF0aW9uQ29udGFpbmVyKVxuICAgIC5wYXJlbnQoaW5mcmFzdHJ1Y3R1cmVDb250YWluZXIpO1xufTtcblxuZXhwb3J0IGNsYXNzIEJvb3RTdHJhcCB7XG4gIGNvbnRhaW5lcjogQ29udGFpbmVyO1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmNvbnRhaW5lciA9IENyZWF0ZURJQ29udGFpbmVyKFxuICAgICAgaW5mcmFzdHJ1Y3R1cmVDb250YWluZXIsXG4gICAgICBBcGlDbGllbnRDb250YWluZXIsXG4gICAgICBTZXJ2aWNlQ29udGFpbmVyLFxuICAgICAgVmlld01vZGVsQ29udGFpbmVyXG4gICAgKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgSUNoYXREVE8gfSBmcm9tIFwiLi4vVUkvQ29tcG9uZW50cy9DaGF0SXRlbVwiO1xuaW1wb3J0IHsgSUNoYXRBUElDbGllbnQgfSBmcm9tIFwiLi4vSW50ZWdyYXRpb25hbExheWVyL0NoYXRBUElcIjtcblxuZXhwb3J0IGludGVyZmFjZSBJQ2hhdFNlcnZpY2Uge1xuICBnZXRDaGF0czogKCkgPT4gUHJvbWlzZTxBcnJheTxJQ2hhdERUTz4+O1xuICBzYXZlQ2hhdDogKGRhdGE6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4pID0+IFByb21pc2U8dm9pZD47XG4gIGRlbGV0ZUNoYXQ6IChjaGF0SWQ6IHN0cmluZykgPT4gUHJvbWlzZTx2b2lkPjtcbn1cblxuZXhwb3J0IGNsYXNzIENoYXRTZXJ2aWNlIGltcGxlbWVudHMgSUNoYXRTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIEFwaUNsaWVudDogSUNoYXRBUElDbGllbnQpIHt9XG5cbiAgZ2V0Q2hhdHMgPSAoKTogUHJvbWlzZTxBcnJheTxJQ2hhdERUTz4+ID0+IHtcbiAgICByZXR1cm4gdGhpcy5BcGlDbGllbnQuZ2V0Q2hhdHMoKTtcbiAgfTtcblxuICBzYXZlQ2hhdCA9IChkYXRhOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+KSA9PiB7XG4gICAgcmV0dXJuIHRoaXMuQXBpQ2xpZW50LnNhdmVDaGF0KGRhdGEpO1xuICB9O1xuXG4gIGRlbGV0ZUNoYXQoY2hhdElkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gdGhpcy5BcGlDbGllbnQuZGVsZXRlQ2hhdChjaGF0SWQpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBJVXNlckFQSUNsaWVudCB9IGZyb20gXCIuLi9JbnRlZ3JhdGlvbmFsTGF5ZXIvVXNlckFQSVwiO1xuaW1wb3J0IHsgSVByb2ZpbGVEVE8gfSBmcm9tIFwiLi4vVUkvTGF5b3V0cy9Qcm9maWxlXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVVzZXJTZXJ2aWNlIHtcbiAgZ2V0VXNlcigpOiBQcm9taXNlPElQcm9maWxlRFRPPjtcbiAgc2F2ZVVzZXIodXNlcjpJUHJvZmlsZURUTyk6UHJvbWlzZTxJUHJvZmlsZURUTz47XG59XG5cbmV4cG9ydCBjbGFzcyBVc2VyU2VydmljZSBpbXBsZW1lbnRzIElVc2VyU2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBBcGlDbGllbnQ6IElVc2VyQVBJQ2xpZW50KSB7fVxuICBzYXZlVXNlcih1c2VyOklQcm9maWxlRFRPKTpQcm9taXNlPElQcm9maWxlRFRPPntcbiAgICByZXR1cm4gdGhpcy5BcGlDbGllbnQuc2F2ZVVzZXIodXNlcilcbiAgfVxuICBnZXRVc2VyKCkge1xuICAgIHJldHVybiB0aGlzLkFwaUNsaWVudC5nZXRVc2VyKCk7XG4gIH1cbn1cbiIsImltcG9ydCB7IEFQSV9DTElFTlQgfSBmcm9tIFwiLi4vSW50ZWdyYXRpb25hbExheWVyXCI7XG5pbXBvcnQgeyBJQ2hhdEFQSUNsaWVudCB9IGZyb20gXCIuLi9JbnRlZ3JhdGlvbmFsTGF5ZXIvQ2hhdEFQSVwiO1xuaW1wb3J0IHsgSVVzZXJBUElDbGllbnQgfSBmcm9tIFwiLi4vSW50ZWdyYXRpb25hbExheWVyL1VzZXJBUElcIjtcbmltcG9ydCB7IENvbnRhaW5lciB9IGZyb20gXCIuLi9saWJzL0NvbnRhaW5lclwiO1xuaW1wb3J0IHsgQ2hhdFNlcnZpY2UgfSBmcm9tIFwiLi9DaGF0U2VydmljZVwiO1xuaW1wb3J0IHsgVXNlclNlcnZpY2UgfSBmcm9tIFwiLi9Vc2VyU2VydmljZVwiO1xuXG5leHBvcnQgY29uc3QgU0VSVklDRSA9IHtcbiAgQ0hBVDogU3ltYm9sLmZvcihcIkNoYXRTZXJ2aWNlXCIpLFxuICBVU0VSOiBTeW1ib2wuZm9yKFwiVXNlclNlcnZjaWVcIiksXG59O1xuXG5leHBvcnQgY29uc3QgU2VydmljZUNvbnRhaW5lciA9IG5ldyBDb250YWluZXIoKTtcblxuU2VydmljZUNvbnRhaW5lci5iaW5kKFNFUlZJQ0UuQ0hBVCkudG9EeW5hbWljVmFsdWUoKGNvbnRhaW5lcikgPT4ge1xuICBjb25zdCBBUElDbGllbnQgPSBjb250YWluZXIuZ2V0PElDaGF0QVBJQ2xpZW50PihBUElfQ0xJRU5ULkNIQVQpO1xuICByZXR1cm4gbmV3IENoYXRTZXJ2aWNlKEFQSUNsaWVudCk7XG59KTtcblxuU2VydmljZUNvbnRhaW5lci5iaW5kKFNFUlZJQ0UuVVNFUikudG9EeW5hbWljVmFsdWUoKGNvbnRhaW5lcikgPT4ge1xuICBjb25zdCBBUElDbGllbnQgPSBjb250YWluZXIuZ2V0PElVc2VyQVBJQ2xpZW50PihBUElfQ0xJRU5ULlVTRVIpO1xuICByZXR1cm4gbmV3IFVzZXJTZXJ2aWNlKEFQSUNsaWVudCk7XG59KTtcbiIsImltcG9ydCB7IENvbnRhaW5lciB9IGZyb20gXCIuLi9saWJzL0NvbnRhaW5lclwiO1xuaW1wb3J0IHsgQVBJTW9kdWxlIH0gZnJvbSBcIi4vaW50ZXJmYWNlc1wiO1xuXG5leHBvcnQgY29uc3QgSU5URUdSQVRJT05fTU9EVUxFID0ge1xuICBBUElNb2R1bGU6IFN5bWJvbC5mb3IoXCJBUElcIiksXG59O1xuXG5leHBvcnQgY29uc3QgaW5mcmFzdHJ1Y3R1cmVDb250YWluZXIgPSBuZXcgQ29udGFpbmVyKCk7XG5cbmluZnJhc3RydWN0dXJlQ29udGFpbmVyXG4gIC5iaW5kKElOVEVHUkFUSU9OX01PRFVMRS5BUElNb2R1bGUpXG4gIC50b0R5bmFtaWNWYWx1ZSgoY29udGFpbmVyKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBBUElNb2R1bGUoKTtcbiAgfSk7XG4iLCJpbXBvcnQgeyBIVFRQVHJhbnNwb3J0IH0gZnJvbSBcIi4uL2xpYnMvVHJhbnNwb3J0XCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUFQSU1vZHVsZSB7XG4gIGdldERhdGE6IDxQPih1cmw6IHN0cmluZywgcGFyYW1zOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+KSA9PiBQcm9taXNlPFA+O1xuICBwb3N0RGF0YTogPFAgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+PihcbiAgICB1cmw6IHN0cmluZyxcbiAgICBwYXJhbXM6IFBcbiAgKSA9PiBQcm9taXNlPFA+O1xuICBwdXREYXRhOiA8UD4odXJsOiBzdHJpbmcsIHBhcmFtczogUmVjb3JkPHN0cmluZywgYW55PikgPT4gUHJvbWlzZTxQPjtcbiAgZGVsZXRlRGF0YTogKHVybDogc3RyaW5nLCBwYXJhbXM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4pID0+IFByb21pc2U8dm9pZD47XG59XG5cbmV4cG9ydCBjbGFzcyBBUElNb2R1bGUgaW1wbGVtZW50cyBJQVBJTW9kdWxlIHtcbiAgY29uc3RydWN0b3IoKSB7fVxuICBnZXREYXRhID0gPFA+KHVybDogc3RyaW5nLCBkYXRhOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+KTogUHJvbWlzZTxQPiA9PiB7XG4gICAgcmV0dXJuIEhUVFBUcmFuc3BvcnQuZ2V0SW5zdGFuY2UoKVxuICAgICAgLkdFVCh1cmwsIHRoaXMuZ2V0UGFybXMoZGF0YSkpXG4gICAgICAudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKHJlc3VsdC5yZXNwb25zZSk7XG4gICAgICB9KTtcbiAgfTtcblxuICBwb3N0RGF0YSA9IGFzeW5jIDxQIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgc3RyaW5nPj4oXG4gICAgdXJsOiBzdHJpbmcsXG4gICAgZGF0YTogUFxuICApOiBQcm9taXNlPFA+ID0+IHtcbiAgICByZXR1cm4gSFRUUFRyYW5zcG9ydC5nZXRJbnN0YW5jZSgpXG4gICAgICAuUE9TVCh1cmwsIHRoaXMuZ2V0UGFybXMoZGF0YSkpXG4gICAgICAudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKHJlc3VsdC5yZXNwb25zZSk7XG4gICAgICB9KTtcbiAgfTtcblxuICBkZWxldGVEYXRhID0gKHVybDogc3RyaW5nLCBkYXRhOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+KTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgcmV0dXJuIEhUVFBUcmFuc3BvcnQuZ2V0SW5zdGFuY2UoKVxuICAgICAgLkRFTEVURSh1cmwsIHRoaXMuZ2V0UGFybXMoZGF0YSkpXG4gICAgICAudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKHJlc3VsdC5yZXNwb25zZSk7XG4gICAgICB9KTtcbiAgfTtcblxuICBwdXREYXRhID0gPFA+KHVybDogc3RyaW5nLCBkYXRhOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+KTogUHJvbWlzZTxQPiA9PiB7XG4gICAgcmV0dXJuIEhUVFBUcmFuc3BvcnQuZ2V0SW5zdGFuY2UoKS5QVVQodXJsLCB0aGlzLmdldFBhcm1zKGRhdGEpKTtcbiAgfTtcblxuICBwcml2YXRlIGdldFBhcm1zPFQgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+PihcbiAgICBkYXRhOiBUXG4gICk6IHsgW2tleTogc3RyaW5nXTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiB9IHtcbiAgICByZXR1cm4ge1xuICAgICAgaGVhZGVyczoge1xuICAgICAgICBcIkNvbnRlbnQtdHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICAgIH0sXG4gICAgICBkYXRhOiB7XG4gICAgICAgIC4uLmRhdGEsXG4gICAgICB9LFxuICAgIH07XG4gIH1cbn1cbiIsImltcG9ydCB7IElBUElNb2R1bGUgfSBmcm9tIFwiLi4vSW5mcmFzdHNydWN0dXJlTGF5ZXIvaW50ZXJmYWNlc1wiO1xuaW1wb3J0IHsgSUNoYXREVE8gfSBmcm9tIFwiLi4vVUkvQ29tcG9uZW50cy9DaGF0SXRlbVwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIElDaGF0QVBJQ2xpZW50IHtcbiAgZ2V0Q2hhdHMoKTogUHJvbWlzZTxBcnJheTxJQ2hhdERUTz4+O1xuICBzYXZlQ2hhdChkYXRhOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+KTogUHJvbWlzZTx2b2lkPjtcbiAgZGVsZXRlQ2hhdChpZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPjtcbn1cblxuZXhwb3J0IGNsYXNzIENoYXRBUElDbGllbnQgaW1wbGVtZW50cyBJQ2hhdEFQSUNsaWVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBBUElNb2R1bGU6IElBUElNb2R1bGUpIHt9XG5cbiAgZ2V0Q2hhdHMgPSBhc3luYyAoKTogUHJvbWlzZTxBcnJheTxJQ2hhdERUTz4+ID0+IHtcbiAgICByZXR1cm4gYXdhaXQgdGhpcy5BUElNb2R1bGUuZ2V0RGF0YTxJQ2hhdERUT1tdPihcIi9jaGF0c1wiLCB7fSkudGhlbihcbiAgICAgIChyZXN1bHQpID0+IHtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1cbiAgICApO1xuICB9O1xuXG4gIHNhdmVDaGF0ID0gYXN5bmMgKGRhdGE6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4pOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBhd2FpdCB0aGlzLkFQSU1vZHVsZS5wb3N0RGF0YShcIi9jaGF0c1wiLCBkYXRhKTtcbiAgfTtcblxuICBkZWxldGVDaGF0KGlkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gdGhpcy5BUElNb2R1bGUuZGVsZXRlRGF0YShcIi9jaGF0c1wiLCB7IGNoYXRJZDogaWQgfSk7XG4gIH1cbn1cbiIsImltcG9ydCB7IElBUElNb2R1bGUgfSBmcm9tIFwiLi4vSW5mcmFzdHNydWN0dXJlTGF5ZXIvaW50ZXJmYWNlc1wiO1xuaW1wb3J0IHsgSVByb2ZpbGVEVE8gfSBmcm9tIFwiLi4vVUkvTGF5b3V0cy9Qcm9maWxlXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVVzZXJBUElDbGllbnQge1xuICBnZXRVc2VyKCk6IFByb21pc2U8SVByb2ZpbGVEVE8+O1xuICBzYXZlVXNlcih1c2VyOiBJUHJvZmlsZURUTyk6IFByb21pc2U8SVByb2ZpbGVEVE8+XG59XG5cbmV4cG9ydCBjbGFzcyBVc2VyQVBJQ2xpZW50IGltcGxlbWVudHMgSVVzZXJBUElDbGllbnQge1xuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgQVBJTW9kdWxlOiBJQVBJTW9kdWxlKSB7IH1cblxuICBnZXRVc2VyID0gYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHVzZXIgPSBhd2FpdCB0aGlzLkFQSU1vZHVsZS5nZXREYXRhPElQcm9maWxlRFRPPihcIi9hdXRoL3VzZXJcIiwge30pO1xuICAgIHJldHVybiB1c2VyO1xuICB9O1xuXG4gIHNhdmVVc2VyID0gKHVzZXI6IElQcm9maWxlRFRPKSA9PiB7XG4gICAgcmV0dXJuIHRoaXMuQVBJTW9kdWxlLnB1dERhdGE8SVByb2ZpbGVEVE8+KCcvdXNlci9wcm9maWxlJywgdXNlcilcbiAgfVxufVxuIiwiaW1wb3J0IHsgQ29udGFpbmVyIH0gZnJvbSBcIi4uL2xpYnMvQ29udGFpbmVyXCI7XG5pbXBvcnQgeyBJTlRFR1JBVElPTl9NT0RVTEUgfSBmcm9tIFwiLi4vSW5mcmFzdHNydWN0dXJlTGF5ZXJcIjtcbmltcG9ydCB7IENoYXRBUElDbGllbnQgfSBmcm9tIFwiLi9DaGF0QVBJXCI7XG5pbXBvcnQgeyBJQVBJTW9kdWxlIH0gZnJvbSBcIi4uL0luZnJhc3RzcnVjdHVyZUxheWVyL2ludGVyZmFjZXNcIjtcbmltcG9ydCB7IGNvbnRhaW5lciB9IGZyb20gXCIuLlwiO1xuaW1wb3J0IHsgVXNlckFQSUNsaWVudCB9IGZyb20gXCIuL1VzZXJBUElcIjtcblxuZXhwb3J0IGNvbnN0IEFQSV9DTElFTlQgPSB7XG4gIENIQVQ6IFN5bWJvbC5mb3IoXCJDaGF0QVBJQ2xpZW50XCIpLFxuICBVU0VSOiBTeW1ib2wuZm9yKFwiVXNlckFQSUNsaWVudFwiKSxcbn07XG5cbmV4cG9ydCBjb25zdCBBcGlDbGllbnRDb250YWluZXIgPSBuZXcgQ29udGFpbmVyKCk7XG5cbkFwaUNsaWVudENvbnRhaW5lci5iaW5kKEFQSV9DTElFTlQuQ0hBVCkudG9EeW5hbWljVmFsdWUoKGNvbnRhaW5lcikgPT4ge1xuICBjb25zdCBBUElNb2R1bGUgPSBjb250YWluZXIuZ2V0PElBUElNb2R1bGU+KElOVEVHUkFUSU9OX01PRFVMRS5BUElNb2R1bGUpO1xuICByZXR1cm4gbmV3IENoYXRBUElDbGllbnQoQVBJTW9kdWxlKTtcbn0pO1xuXG5BcGlDbGllbnRDb250YWluZXIuYmluZChBUElfQ0xJRU5ULlVTRVIpLnRvRHluYW1pY1ZhbHVlKChjb250YWluZXIpID0+IHtcbiAgY29uc3QgQVBJTW9kdWxlID0gY29udGFpbmVyLmdldDxJQVBJTW9kdWxlPihJTlRFR1JBVElPTl9NT0RVTEUuQVBJTW9kdWxlKTtcbiAgcmV0dXJuIG5ldyBVc2VyQVBJQ2xpZW50KEFQSU1vZHVsZSk7XG59KTtcbiIsImltcG9ydCB7IEhZUE8gfSBmcm9tIFwiLi4vLi4vLi4vbGlicy9IWVBPL0hZUE9cIjtcblxuZXhwb3J0IGNvbnN0IEF0dGVudGlvbk1lc3NhZ2UgPSAoKTogSFlQTyA9PiB7XG4gIHJldHVybiBuZXcgSFlQTyh7XG4gICAgdGVtcGxhdGVQYXRoOiBcImF0dGVudGlvbi50ZW1wbGF0ZS5odG1sXCIsXG4gICAgZGF0YToge1xuICAgICAgbWVzc2FnZTogXCJcIixcbiAgICB9LFxuICAgIGNoaWxkcmVuOiB7fSxcbiAgfSk7XG59O1xuIiwiaW1wb3J0IHsgSFlQTyB9IGZyb20gXCIuLi8uLi8uLi9saWJzL0hZUE8vSFlQT1wiO1xuaW1wb3J0IHsgdXVpZHY0IH0gZnJvbSBcIi4uLy4uLy4uL2xpYnMvdXRpbHNcIjtcblxuaW50ZXJmYWNlIElQcm9wcyB7XG4gIGlkPzogc3RyaW5nO1xuICB0aXRsZTogc3RyaW5nO1xuICBjbGFzc05hbWU6IHN0cmluZztcbiAgb25DbGljazogKGU6IEV2ZW50KSA9PiB2b2lkO1xufVxuXG5leHBvcnQgY29uc3QgQnV0dG9uID0gKHByb3BzOiBJUHJvcHMpID0+IHtcbiAgY29uc3QgaWQgPSBwcm9wcy5pZCB8fCB1dWlkdjQoKTtcbiAgcmV0dXJuIG5ldyBIWVBPKHtcbiAgICB0ZW1wbGF0ZVBhdGg6IFwiYnV0dG9uLnRlbXBsYXRlLmh0bWxcIixcbiAgICBkYXRhOiB7XG4gICAgICBpZDogaWQsXG4gICAgICB0aXRsZTogcHJvcHMudGl0bGUsXG4gICAgICBjbGFzc05hbWU6IHByb3BzLmNsYXNzTmFtZSxcbiAgICB9LFxuICB9KS5hZnRlclJlbmRlcigoKSA9PiB7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpPy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcbiAgICAgIHByb3BzLm9uQ2xpY2soZSk7XG4gICAgfSk7XG4gIH0pO1xufTtcbiIsImltcG9ydCB7IGNvbnRhaW5lciwgcm91dGVyIH0gZnJvbSBcIi4uLy4uLy4uXCI7XG5pbXBvcnQgeyBDaGF0TGF5b3V0IH0gZnJvbSBcIi4uLy4uL0xheW91dHMvQ2hhdFwiO1xuaW1wb3J0IHsgSFlQTyB9IGZyb20gXCIuLi8uLi8uLi9saWJzL0hZUE8vSFlQT1wiO1xuaW1wb3J0IHsgSFRUUFRyYW5zcG9ydCB9IGZyb20gXCIuLi8uLi8uLi9saWJzL1RyYW5zcG9ydFwiO1xuaW1wb3J0IHsgRGVsZXRlIH0gZnJvbSBcIi4uL0RlbGV0ZVwiO1xuaW1wb3J0IHsgVklFV19NT0RFTCB9IGZyb20gXCIuLi8uLi8uLi9WaWV3TW9kZWxcIjtcbmltcG9ydCB7IElDaGF0Vmlld01vZGVsIH0gZnJvbSBcIi4uLy4uLy4uL1ZpZXdNb2RlbC9DaGF0Vmlld01vZGVsXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUNoYXREVE8ge1xuICB0aXRsZTogc3RyaW5nO1xuICBhdmF0YXI6IHN0cmluZyB8IG51bGw7XG4gIGNyZWF0ZWRfYnk6IG51bWJlcjtcbiAgaWQ6IG51bWJlcjtcbn1cblxuaW50ZXJmYWNlIElQcm9wcyBleHRlbmRzIElDaGF0RFRPIHtcbiAgY2xhc3NOYW1lPzogc3RyaW5nO1xufVxuXG5leHBvcnQgY29uc3QgQ2hhdEl0ZW0gPSAocHJvcHM6IElDaGF0RFRPKSA9PiB7XG4gIHJldHVybiBuZXcgSFlQTyh7XG4gICAgdGVtcGxhdGVQYXRoOiBcImNoYXRJdGVtLnRlbXBsYXRlLmh0bWxcIixcbiAgICBkYXRhOiB7XG4gICAgICBDaGF0TmFtZTogcHJvcHMudGl0bGUsXG4gICAgICBsYXN0VGltZTogcHJvcHMuY3JlYXRlZF9ieSB8fCBcIjEwOjIyXCIsXG4gICAgICBsYXN0TWVzc2FnZTogcHJvcHMuaWQgfHwgXCJIaSwgaG93IGFyZSB5b3U/XCIsXG4gICAgICBub3RpZmljYXRpb25Db3VudDogcHJvcHMuYXZhdGFyIHx8IDMsXG4gICAgfSxcbiAgICBjaGlsZHJlbjoge1xuICAgICAgZGVsZXRlOiBEZWxldGUoe1xuICAgICAgICBpZDogYGRlbGV0ZUl0ZW0ke3Byb3BzLmlkfWAsXG4gICAgICAgIG9uQ2xpY2s6ICgpID0+IHtcbiAgICAgICAgICBjb25zdCBjaGF0Vmlld01vZGVsID0gY29udGFpbmVyLmdldDxJQ2hhdFZpZXdNb2RlbD4oVklFV19NT0RFTC5DSEFUKTtcbiAgICAgICAgICBjaGF0Vmlld01vZGVsLmRlbGV0ZUNoYXQoU3RyaW5nKHByb3BzLmlkKSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBDaGF0TGF5b3V0KGNoYXRWaWV3TW9kZWwuY2hhdHMpLnJlbmRlcigpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgfSxcbiAgfSk7XG59O1xuIiwiaW1wb3J0IHsgY29udGFpbmVyIH0gZnJvbSBcIi4uLy4uLy4uXCI7XG5pbXBvcnQgeyBIWVBPIH0gZnJvbSBcIi4uLy4uLy4uL2xpYnMvSFlQTy9IWVBPXCI7XG5pbXBvcnQgeyBSZXF1aXJlZCB9IGZyb20gXCIuLi8uLi8uLi9saWJzL1ZhbGlkYXRvcnMvUmVxdWlyZWRcIjtcbmltcG9ydCB7IEF0dGVudGlvbk1lc3NhZ2UgfSBmcm9tIFwiLi4vQXR0ZW50aW9uTWVzc2FnZVwiO1xuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSBcIi4uL0J1dHRvblwiO1xuaW1wb3J0IHsgSW5wdXQgfSBmcm9tIFwiLi4vSW5wdXRcIjtcbmltcG9ydCB7IElDaGF0Vmlld01vZGVsIH0gZnJvbSBcIi4uLy4uLy4uL1ZpZXdNb2RlbC9DaGF0Vmlld01vZGVsXCI7XG5pbXBvcnQgeyBDaGF0TGF5b3V0IH0gZnJvbSBcIi4uLy4uL0xheW91dHMvQ2hhdFwiO1xuaW1wb3J0IHsgVklFV19NT0RFTCB9IGZyb20gXCIuLi8uLi8uLi9WaWV3TW9kZWxcIjtcblxuZXhwb3J0IGNvbnN0IENyZWF0ZUNoYXRNb2RhbCA9ICgpID0+IHtcbiAgY29uc3QgYXR0ZW50aW9uTWVzc2FnZSA9IEF0dGVudGlvbk1lc3NhZ2UoKTtcbiAgY29uc3Qgc3RhdGUgPSBhdHRlbnRpb25NZXNzYWdlLmdldFN0YXRlKCk7XG5cbiAgbGV0IENoYXROYW1lID0gXCJcIjtcblxuICByZXR1cm4gbmV3IEhZUE8oe1xuICAgIHRlbXBsYXRlUGF0aDogXCJjcmVhdGVjaGF0bW9kYWwudGVtcGxhdGUuaHRtbFwiLFxuICAgIGRhdGE6IHt9LFxuICAgIGNoaWxkcmVuOiB7XG4gICAgICBpbnB1dDogSW5wdXQoe1xuICAgICAgICBsYWJlbDogXCJDaGF0IG5hbWVcIixcbiAgICAgICAgdHlwZTogXCJ0ZXh0XCIsXG4gICAgICAgIG5hbWU6IFwiY2hhdG5hbWVcIixcbiAgICAgICAgaWQ6IFwiY2hhdG5hbWVcIixcbiAgICAgICAgY2xhc3NOYW1lOiBcImMtYy1tb2RhbF9faW5wdXRcIixcbiAgICAgICAgQ2hpbGRBdHRlbnRpb246IGF0dGVudGlvbk1lc3NhZ2UsXG4gICAgICAgIG9uQmx1cjogKGU6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgY29uc3QgaW5wdXQgPSBlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgICAgICAgIGlmIChSZXF1aXJlZC5jaGVja0Z1bmMoaW5wdXQudmFsdWUpKSB7XG4gICAgICAgICAgICBzdGF0ZS5tZXNzYWdlID0gXCJcIjtcbiAgICAgICAgICAgIENoYXROYW1lID0gaW5wdXQudmFsdWU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0YXRlLm1lc3NhZ2UgPSBcIuKblCDQvtCx0Y/Qt9Cw0YLQtdC70YzQvdC+0LUg0L/QvtC70LVcIjtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICAgIGNyZWF0ZTogQnV0dG9uKHtcbiAgICAgICAgdGl0bGU6IFwi0KHQvtC30LTQsNGC0YxcIixcbiAgICAgICAgY2xhc3NOYW1lOiBcImNyZWF0ZS1idXR0b25cIixcbiAgICAgICAgb25DbGljazogKGU6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgaWYgKCFDaGF0TmFtZSkge1xuICAgICAgICAgICAgc3RhdGUubWVzc2FnZSA9IFwi4puUINC+0LHRj9C30LDRgtC10LvRjNC90L7QtSDQv9C+0LvQtVwiO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBjaGF0Vmlld01vZGVsID0gY29udGFpbmVyLmdldDxJQ2hhdFZpZXdNb2RlbD4oXG4gICAgICAgICAgICAgIFZJRVdfTU9ERUwuQ0hBVFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGNoYXRWaWV3TW9kZWwuc2F2ZUNoYXQoeyB0aXRsZTogQ2hhdE5hbWUgfSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgIGRvY3VtZW50XG4gICAgICAgICAgICAgICAgLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJjLWMtbW9kYWxcIilbMF1cbiAgICAgICAgICAgICAgICAuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbiAgICAgICAgICAgICAgQ2hhdExheW91dChjaGF0Vmlld01vZGVsLmNoYXRzKS5yZW5kZXIoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgY2FuY2VsOiBCdXR0b24oe1xuICAgICAgICB0aXRsZTogXCLQntGC0LzQtdC90LBcIixcbiAgICAgICAgY2xhc3NOYW1lOiBcImNhbmNlbC1idXR0b25cIixcbiAgICAgICAgb25DbGljazogKGU6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgZG9jdW1lbnRcbiAgICAgICAgICAgIC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiYy1jLW1vZGFsXCIpWzBdXG4gICAgICAgICAgICAuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgIH0sXG4gIH0pO1xufTtcbiIsImltcG9ydCB7IEhZUE8gfSBmcm9tIFwiLi4vLi4vLi4vbGlicy9IWVBPL0hZUE9cIjtcblxuaW50ZXJmYWNlIElQcm9wcyB7XG4gIGlkOiBzdHJpbmc7XG4gIG9uQ2xpY2s6ICgpID0+IHZvaWQ7XG59XG5leHBvcnQgY29uc3QgRGVsZXRlID0gKHByb3BzOiBJUHJvcHMpID0+IHtcbiAgcmV0dXJuIG5ldyBIWVBPKHtcbiAgICB0ZW1wbGF0ZVBhdGg6IFwiZGVsZXRlLnRlbXBsYXRlLmh0bWxcIixcbiAgICBkYXRhOiB7XG4gICAgICBwYXRoOiBcIi9tZWRpYS9WZWN0b3Iuc3ZnXCIsXG4gICAgICBpZDogcHJvcHMuaWQsXG4gICAgfSxcbiAgICBjaGlsZHJlbjoge30sXG4gIH0pLmFmdGVyUmVuZGVyKCgpID0+IHtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChwcm9wcy5pZCk/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICBwcm9wcy5vbkNsaWNrKCk7XG4gICAgfSk7XG4gIH0pO1xufTtcbiIsImltcG9ydCB7IEhZUE8gfSBmcm9tIFwiLi4vLi4vLi4vbGlicy9IWVBPL0hZUE9cIjtcblxuZXhwb3J0IGNvbnN0IEVtcHR5ID0gKCkgPT4ge1xuICByZXR1cm4gbmV3IEhZUE8oe1xuICAgIHRlbXBsYXRlUGF0aDogXCJlbXB0eS50ZW1wbGF0ZS5odG1sXCIsXG4gICAgZGF0YToge30sXG4gIH0pO1xufTtcbiIsImltcG9ydCB7IEhZUE8gfSBmcm9tIFwiLi4vLi4vLi4vbGlicy9IWVBPL0hZUE9cIjtcbmltcG9ydCB7IEVtcHR5IH0gZnJvbSBcIi4uL0VtcHR5XCI7XG5cbmludGVyZmFjZSBJUHJvcHMge1xuICBsYWJlbDogc3RyaW5nO1xuICB0eXBlOiBzdHJpbmc7XG4gIG5hbWU6IHN0cmluZztcbiAgaWQ6IHN0cmluZztcbiAgY2xhc3NOYW1lOiBzdHJpbmc7XG4gIENoaWxkQXR0ZW50aW9uPzogSFlQTztcbiAgb25Gb2N1cz86IChlOiBFdmVudCkgPT4gdm9pZDtcbiAgb25CbHVyPzogKGU6IEV2ZW50KSA9PiB2b2lkO1xufVxuXG4vL0B0b2RvOiDQv9GA0LjQutGA0YPRgtC40YLRjCDRg9C90LjQutCw0LvRjNC90L7RgdGC0Ywg0LrQsNC20LTQvtCz0L4g0Y3Qu9C10LzQtdC90YLQsFxuXG5leHBvcnQgY29uc3QgSW5wdXQgPSAocHJvcHM6IElQcm9wcykgPT4ge1xuICByZXR1cm4gbmV3IEhZUE8oe1xuICAgIHRlbXBsYXRlUGF0aDogXCJpbnB1dC50ZW1wbGF0ZS5odG1sXCIsXG4gICAgZGF0YToge1xuICAgICAgbGFiZWw6IHtcbiAgICAgICAgbmFtZTogcHJvcHMubGFiZWwsXG4gICAgICB9LFxuICAgICAgYXRyaWJ1dGU6IHtcbiAgICAgICAgdHlwZTogcHJvcHMudHlwZSxcbiAgICAgICAgbmFtZTogcHJvcHMubmFtZSxcbiAgICAgICAgaWQ6IHByb3BzLmlkLFxuICAgICAgICBjbGFzc05hbWU6IHByb3BzLmNsYXNzTmFtZSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBjaGlsZHJlbjoge1xuICAgICAgQXR0ZW50aW9uOiBwcm9wcy5DaGlsZEF0dGVudGlvbiB8fCBFbXB0eSgpLFxuICAgIH0sXG4gIH0pLmFmdGVyUmVuZGVyKCgpID0+IHtcbiAgICBkb2N1bWVudFxuICAgICAgLmdldEVsZW1lbnRCeUlkKHByb3BzLmlkKVxuICAgICAgPy5hZGRFdmVudExpc3RlbmVyKFwiZm9jdXNcIiwgKGU6IEZvY3VzRXZlbnQpID0+IHtcbiAgICAgICAgY29uc3QgaW5wdXQgPSBlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgICAgICBjb25zdCBpbnB1dExhYmVsID0gaW5wdXQucGFyZW50RWxlbWVudD8ucGFyZW50RWxlbWVudD8ucXVlcnlTZWxlY3RvcihcbiAgICAgICAgICBcIi5mb3JtLWlucHV0X19sYWJlbFwiXG4gICAgICAgICk7XG4gICAgICAgIGlucHV0TGFiZWw/LmNsYXNzTGlzdC5hZGQoXCJmb3JtLWlucHV0X19sYWJlbF9zZWxlY3RcIik7XG4gICAgICAgIHByb3BzLm9uRm9jdXM/LihlKTtcbiAgICAgIH0pO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHByb3BzLmlkKT8uYWRkRXZlbnRMaXN0ZW5lcihcImJsdXJcIiwgKGU6IEV2ZW50KSA9PiB7XG4gICAgICBjb25zdCBpbnB1dCA9IGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgICBjb25zdCBpbnB1dExhYmVsID0gaW5wdXQucGFyZW50RWxlbWVudD8ucGFyZW50RWxlbWVudD8ucXVlcnlTZWxlY3RvcihcbiAgICAgICAgXCIuZm9ybS1pbnB1dF9fbGFiZWxcIlxuICAgICAgKTtcbiAgICAgIGlmICghaW5wdXQudmFsdWUpIHtcbiAgICAgICAgaW5wdXRMYWJlbD8uY2xhc3NMaXN0LnJlbW92ZShcImZvcm0taW5wdXRfX2xhYmVsX3NlbGVjdFwiKTtcbiAgICAgIH1cbiAgICAgIHByb3BzLm9uQmx1cj8uKGUpO1xuICAgIH0pO1xuICB9KTtcbn07XG4iLCJpbXBvcnQgeyBIWVBPIH0gZnJvbSBcIi4uLy4uLy4uL2xpYnMvSFlQTy9IWVBPXCI7XG5cbmludGVyZmFjZSBJUHJvcHMge1xuICBsYWJlbDogc3RyaW5nO1xuICB2YWx1ZTogc3RyaW5nO1xuICBpZDogc3RyaW5nO1xuICBvbkNoYWdlOiAoZTogeyB2YWx1ZTogc3RyaW5nIH0pID0+IHZvaWQ7XG59XG5leHBvcnQgY29uc3QgUHJvZmlsZUlucHV0ID0gKHsgbGFiZWwsIHZhbHVlLCBpZCwgb25DaGFnZSB9OiBJUHJvcHMpID0+IHtcbiAgcmV0dXJuIG5ldyBIWVBPKHtcbiAgICB0ZW1wbGF0ZVBhdGg6IFwicHJvZmlsZUlucHV0LnRlbXBsYXRlLmh0bWxcIixcbiAgICBkYXRhOiB7XG4gICAgICBsYWJlbDogbGFiZWwsXG4gICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICBpZDogaWQsXG4gICAgfSxcbiAgfSkuYWZ0ZXJSZW5kZXIoKCkgPT4ge1xuICAgIGNvbnN0IGlucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgaW5wdXQ/LmFkZEV2ZW50TGlzdGVuZXIoXCJibHVyXCIsICgpID0+IHtcbiAgICAgIG9uQ2hhZ2UoeyB2YWx1ZTogaW5wdXQudmFsdWUgfSk7XG4gICAgfSk7XG4gIH0pO1xufTtcbiIsImltcG9ydCB7IEhZUE8gfSBmcm9tIFwiLi4vLi4vLi4vbGlicy9IWVBPL0hZUE9cIjtcbmltcG9ydCB7IHJvdXRlciB9IGZyb20gXCIuLi8uLi8uLlwiO1xuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSBcIi4uLy4uL0NvbXBvbmVudHMvQnV0dG9uXCI7XG5pbXBvcnQgeyBtZW1vaXplIH0gZnJvbSBcIi4uLy4uLy4uL2xpYnMvbW9taXplXCI7XG5cbmV4cG9ydCBjb25zdCBDaGFuZ2VQYXNzd29yZCA9IG1lbW9pemUoKCkgPT4ge1xuICByZXR1cm4gbmV3IEhZUE8oe1xuICAgIHJlbmRlclRvOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIiNyb290XCIpIHx8IGRvY3VtZW50LmJvZHksXG4gICAgdGVtcGxhdGVQYXRoOiBcImNoYW5nZVBhc3N3b3JkLnRlbXBsYXRlLmh0bWxcIixcbiAgICBkYXRhOiB7fSxcbiAgICBjaGlsZHJlbjoge1xuICAgICAgc2F2ZTogQnV0dG9uKHtcbiAgICAgICAgdGl0bGU6IFwi0KHQvtGF0YDQsNC90LjRgtGMXCIsXG4gICAgICAgIGNsYXNzTmFtZTogXCJwYXNzd29yZF9lZGl0X19hY3Rpb25fX3NhdmVcIixcbiAgICAgICAgb25DbGljazogKGU6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgcm91dGVyLmdvKFwiL3Byb2ZpbGVcIik7XG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICB9LFxuICB9KTtcbn0pO1xuIiwiaW1wb3J0IHsgSFlQTyB9IGZyb20gXCIuLi8uLi8uLi9saWJzL0hZUE8vSFlQT1wiO1xuaW1wb3J0IHsgY29udGFpbmVyLCByb3V0ZXIgfSBmcm9tIFwiLi4vLi4vLi5cIjtcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gXCIuLi8uLi9Db21wb25lbnRzL0J1dHRvblwiO1xuaW1wb3J0IHsgSVByb2ZpbGVEVE8gfSBmcm9tIFwiLi4vUHJvZmlsZVwiO1xuaW1wb3J0IHsgSVVzZXJWaWV3TW9kZWwgfSBmcm9tIFwiLi4vLi4vLi4vVmlld01vZGVsL1VzZXJWaWV3TW9kZWxcIjtcbmltcG9ydCB7IFZJRVdfTU9ERUwgfSBmcm9tIFwiLi4vLi4vLi4vVmlld01vZGVsXCI7XG5pbXBvcnQgeyBQcm9maWxlSW5wdXQgfSBmcm9tIFwiLi4vLi4vQ29tcG9uZW50cy9Qcm9maWxlSW5wdXRcIjtcblxuY29uc3QgQ29uZmlnOiB7IFtrZXkgaW4ga2V5b2YgSVByb2ZpbGVEVE9dPzogeyBsYWJlbDogc3RyaW5nIH0gfSA9IHtcbiAgZW1haWw6IHtcbiAgICBsYWJlbDogXCLQn9C+0YfRgtCwXCIsXG4gIH0sXG4gIGxvZ2luOiB7XG4gICAgbGFiZWw6IFwi0JvQvtCz0LjQvVwiLFxuICB9LFxuICBmaXJzdF9uYW1lOiB7XG4gICAgbGFiZWw6IFwi0JjQvNGPXCIsXG4gIH0sXG4gIHNlY29uZF9uYW1lOiB7XG4gICAgbGFiZWw6IFwi0KTQsNC80LjQu9C40Y9cIixcbiAgfSxcbiAgZGlzcGxheV9uYW1lOiB7XG4gICAgbGFiZWw6IFwi0JjQvNGPINCyINGH0LDRgtCw0YVcIixcbiAgfSxcbiAgcGhvbmU6IHtcbiAgICBsYWJlbDogXCLQotC10LvQtdGE0L7QvVwiLFxuICB9LFxufTtcblxuZXhwb3J0IGNvbnN0IENoYW5nZVByb2ZpbGUgPSAoZGF0YTogSVByb2ZpbGVEVE8pID0+IHtcbiAgY29uc3QgdXNlclZpZXdNb2RlbCA9IGNvbnRhaW5lci5nZXQ8SVVzZXJWaWV3TW9kZWw+KFZJRVdfTU9ERUwuVVNFUik7XG4gIHJldHVybiBuZXcgSFlQTyh7XG4gICAgcmVuZGVyVG86IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm9vdFwiKSB8fCBkb2N1bWVudC5ib2R5LFxuICAgIHRlbXBsYXRlUGF0aDogXCJjaGFuZ2VQcm9maWxlLnRlbXBsYXRlLmh0bWxcIixcbiAgICBkYXRhOiB7XG4gICAgICBlbWFpbDogZGF0YT8uZW1haWwsXG4gICAgICBsb2dpbjogZGF0YT8ubG9naW4sXG4gICAgICBmaXJzdE5hbWU6IGRhdGE/LmZpcnN0X25hbWUsXG4gICAgICBzZWNvbmROYW1lOiBkYXRhPy5zZWNvbmRfbmFtZSxcbiAgICAgIGRpc3BsYXlOYW1lOiBkYXRhPy5kaXNwbGF5X25hbWUgfHwgXCJcIixcbiAgICAgIHBob25lOiBkYXRhPy5waG9uZSxcbiAgICB9LFxuICAgIGNoaWxkcmVuOiB7XG4gICAgICBzYXZlOiBCdXR0b24oe1xuICAgICAgICB0aXRsZTogXCLQodC+0YXRgNCw0L3QuNGC0YxcIixcbiAgICAgICAgY2xhc3NOYW1lOiBcInByb2ZpbGVfZWRpdF9fYWN0aW9uX19zYXZlXCIsXG4gICAgICAgIG9uQ2xpY2s6IChlOiBFdmVudCkgPT4ge1xuICAgICAgICAgIGlmICh1c2VyVmlld01vZGVsLnVzZXIpIHtcbiAgICAgICAgICAgIGNvbnN0IGZvcm0gPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFxuICAgICAgICAgICAgICBcInByb2ZpbGVfZWRpdFwiXG4gICAgICAgICAgICApWzBdIGFzIEhUTUxGb3JtRWxlbWVudDtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHVzZXJWaWV3TW9kZWwudXNlcik7XG4gICAgICAgICAgICB1c2VyVmlld01vZGVsLnNhdmVVc2VyKHVzZXJWaWV3TW9kZWwudXNlcikuZmluYWxseSgoKSA9PiB7XG4gICAgICAgICAgICAgIHJvdXRlci5nbyhcIi9wcm9maWxlXCIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICBpbnB1dHM6IE9iamVjdC5rZXlzKENvbmZpZylcbiAgICAgICAgLnJldmVyc2UoKVxuICAgICAgICAubWFwKChpdGVtKSA9PiB7XG4gICAgICAgICAgY29uc3Qga2V5ID0gaXRlbSBhcyBrZXlvZiB0eXBlb2YgZGF0YTtcbiAgICAgICAgICBjb25zdCBsYWJlbCA9IENvbmZpZ1tpdGVtIGFzIGtleW9mIHR5cGVvZiBDb25maWddPy5sYWJlbCBhcyBzdHJpbmc7XG4gICAgICAgICAgY29uc3QgdmFsdWUgPSBkYXRhID8gKGRhdGFba2V5XSBhcyBzdHJpbmcpIDogXCJcIjtcbiAgICAgICAgICByZXR1cm4gUHJvZmlsZUlucHV0KHtcbiAgICAgICAgICAgIGxhYmVsOiBsYWJlbCxcbiAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgIGlkOiBrZXksXG4gICAgICAgICAgICBvbkNoYWdlOiAoeyB2YWx1ZSB9KSA9PiB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKHZhbHVlKTtcbiAgICAgICAgICAgICAgdXNlclZpZXdNb2RlbC51c2VyID0ge1xuICAgICAgICAgICAgICAgIC4uLnVzZXJWaWV3TW9kZWwudXNlcixcbiAgICAgICAgICAgICAgICBbaXRlbV06IHZhbHVlLFxuICAgICAgICAgICAgICB9IGFzIElQcm9maWxlRFRPO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSksXG4gICAgfSxcbiAgfSk7XG59O1xuIiwiaW1wb3J0IHsgSFlQTyB9IGZyb20gXCIuLi8uLi8uLi9saWJzL0hZUE8vSFlQT1wiO1xuaW1wb3J0IHsgQ2hhdEl0ZW0sIElDaGF0RFRPIH0gZnJvbSBcIi4uLy4uL0NvbXBvbmVudHMvQ2hhdEl0ZW1cIjtcbmltcG9ydCB7IGNvbnRhaW5lciwgcm91dGVyIH0gZnJvbSBcIi4uLy4uLy4uXCI7XG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tIFwiLi4vLi4vQ29tcG9uZW50cy9CdXR0b25cIjtcbmltcG9ydCB7IEVtcHR5IH0gZnJvbSBcIi4uLy4uL0NvbXBvbmVudHMvRW1wdHlcIjtcbmltcG9ydCB7IENyZWF0ZUNoYXRNb2RhbCB9IGZyb20gXCIuLi8uLi9Db21wb25lbnRzL0NyZWF0ZUNoYXRNb2RhbFwiO1xuaW1wb3J0IHsgSVVzZXJWaWV3TW9kZWwgfSBmcm9tIFwiLi4vLi4vLi4vVmlld01vZGVsL1VzZXJWaWV3TW9kZWxcIjtcbmltcG9ydCB7IFZJRVdfTU9ERUwgfSBmcm9tIFwiLi4vLi4vLi4vVmlld01vZGVsXCI7XG5cbmV4cG9ydCBjb25zdCBDaGF0TGF5b3V0ID0gKHJlc3VsdDogSUNoYXREVE9bXSkgPT4ge1xuICBjb25zdCBDaGF0SXRlbUxpc3Q6IEhZUE9bXSA9IFtdO1xuICBpZiAoQXJyYXkuaXNBcnJheShyZXN1bHQpKSB7XG4gICAgcmVzdWx0LmZvckVhY2goKGl0ZW06IGFueSkgPT4ge1xuICAgICAgQ2hhdEl0ZW1MaXN0LnB1c2goQ2hhdEl0ZW0oeyAuLi5pdGVtIH0pKTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBDaGF0SXRlbUxpc3QucHVzaChFbXB0eSgpKTtcbiAgfVxuXG4gIHJldHVybiBuZXcgSFlQTyh7XG4gICAgcmVuZGVyVG86IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm9vdFwiKSB8fCBkb2N1bWVudC5ib2R5LFxuICAgIHRlbXBsYXRlUGF0aDogXCJjaGF0LnRlbXBsYXRlLmh0bWxcIixcbiAgICBkYXRhOiB7fSxcbiAgICBjaGlsZHJlbjoge1xuICAgICAgUHJvZmlsZUxpbms6IEJ1dHRvbih7XG4gICAgICAgIHRpdGxlOiBcIlByb2ZpbGVcIixcbiAgICAgICAgY2xhc3NOYW1lOiBcInByb2ZpbGUtbGlua19fYnV0dG9uXCIsXG4gICAgICAgIG9uQ2xpY2s6IChlOiBFdmVudCkgPT4ge1xuICAgICAgICAgIHJvdXRlci5nbyhcIi9wcm9maWxlXCIpO1xuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICBjaGF0SXRlbTogQ2hhdEl0ZW1MaXN0LFxuICAgICAgY3JlYXRlQ2hhdE1vZGFsOiBDcmVhdGVDaGF0TW9kYWwoKSxcbiAgICAgIGNyZWF0ZUNoYXRCdXR0b246IEJ1dHRvbih7XG4gICAgICAgIHRpdGxlOiBcIitcIixcbiAgICAgICAgY2xhc3NOYW1lOiBcIm5hdmlnYXRpb25fX2NyZWF0ZUNoYXRCdXR0b25cIixcbiAgICAgICAgb25DbGljazogKCkgPT4ge1xuICAgICAgICAgIGRvY3VtZW50XG4gICAgICAgICAgICAuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImMtYy1tb2RhbFwiKVswXVxuICAgICAgICAgICAgLmNsYXNzTGlzdC5yZW1vdmUoXCJoaWRkZW5cIik7XG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICB9LFxuICB9KTtcbn07XG4iLCJpbXBvcnQgeyBJbnB1dCB9IGZyb20gXCIuLi8uLi9Db21wb25lbnRzL0lucHV0XCI7XG5pbXBvcnQgeyBSZXF1aXJlZCB9IGZyb20gXCIuLi8uLi8uLi9saWJzL1ZhbGlkYXRvcnMvUmVxdWlyZWRcIjtcbmltcG9ydCB7IEF0dGVudGlvbk1lc3NhZ2UgfSBmcm9tIFwiLi4vLi4vQ29tcG9uZW50cy9BdHRlbnRpb25NZXNzYWdlXCI7XG5pbXBvcnQgeyByb3V0ZXIgfSBmcm9tIFwiLi4vLi4vLi4vaW5kZXhcIjtcbmltcG9ydCB7IEhUVFBUcmFuc3BvcnQgfSBmcm9tIFwiLi4vLi4vLi4vbGlicy9UcmFuc3BvcnRcIjtcbmltcG9ydCB7IEhZUE8gfSBmcm9tIFwiLi4vLi4vLi4vbGlicy9IWVBPL0hZUE9cIjtcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gXCIuLi8uLi9Db21wb25lbnRzL0J1dHRvblwiO1xuaW1wb3J0IHsgSVByb2ZpbGVEVE8gfSBmcm9tIFwiLi4vUHJvZmlsZVwiO1xuXG4vKipcbiAqIG5ubnJycjExMU5OXG4gKi9cblxuZXhwb3J0IGNvbnN0IExvZ2luTGF5b3V0ID0gKHVzZXI6IElQcm9maWxlRFRPKTogSFlQTyA9PiB7XG4gIGlmICh1c2VyICYmIHVzZXIuaWQpIHtcbiAgICByb3V0ZXIuZ28oXCIvY2hhdFwiKTtcbiAgfVxuXG4gIGNvbnN0IGF0dGVudGlvbkxvZ2luID0gQXR0ZW50aW9uTWVzc2FnZSgpO1xuICBjb25zdCBhdHRlbnRpb25Mb2dpblN0b3JlID0gYXR0ZW50aW9uTG9naW4uZ2V0U3RhdGUoKTtcbiAgY29uc3QgYXR0ZW50aW9uUGFzcyA9IEF0dGVudGlvbk1lc3NhZ2UoKTtcbiAgY29uc3QgYXR0ZW50aW9uUGFzc1N0b3JlID0gYXR0ZW50aW9uUGFzcy5nZXRTdGF0ZSgpO1xuXG4gIGNvbnN0IEZvcm1EYXRhOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG4gIHJldHVybiBuZXcgSFlQTyh7XG4gICAgcmVuZGVyVG86IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm9vdFwiKSB8fCBkb2N1bWVudC5ib2R5LFxuICAgIHRlbXBsYXRlUGF0aDogXCJsb2dpbi50ZW1wbGF0ZS5odG1sXCIsXG4gICAgZGF0YToge1xuICAgICAgRm9ybU5hbWU6IFwi0JLRhdC+0LRcIixcbiAgICB9LFxuICAgIGNoaWxkcmVuOiB7XG4gICAgICBJbnB1dExvZ2luOiBJbnB1dCh7XG4gICAgICAgIGxhYmVsOiBcItCb0L7Qs9C40L1cIixcbiAgICAgICAgdHlwZTogXCJ0ZXh0XCIsXG4gICAgICAgIG5hbWU6IFwibG9naW5cIixcbiAgICAgICAgaWQ6IFwiZm9ybS1pbnB1dC1sb2dpblwiLFxuICAgICAgICBjbGFzc05hbWU6IFwiZm9ybS1sb2dpbl9fZm9ybS1pbnB1dFwiLFxuICAgICAgICBvbkJsdXI6IChlOiBFdmVudCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGlucHV0ID0gZS50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICAgICAgICBjb25zdCBjaGVjayA9IFJlcXVpcmVkLmNoZWNrRnVuYyhpbnB1dD8udmFsdWUpO1xuICAgICAgICAgIGlmICghY2hlY2spIHtcbiAgICAgICAgICAgIGF0dGVudGlvbkxvZ2luU3RvcmUubWVzc2FnZSA9IFwi4puUINC+0LHRj9C30LDRgtC10LvRjNC90L7QtSDQv9C+0LvQtVwiO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhdHRlbnRpb25Mb2dpblN0b3JlLm1lc3NhZ2UgPSBcIlwiO1xuICAgICAgICAgICAgRm9ybURhdGFbXCJsb2dpblwiXSA9IGlucHV0LnZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgQ2hpbGRBdHRlbnRpb246IGF0dGVudGlvbkxvZ2luLFxuICAgICAgfSksXG4gICAgICBJbnB1dFBhc3N3b3JkOiBJbnB1dCh7XG4gICAgICAgIGxhYmVsOiBcItCf0LDRgNC+0LvRjFwiLFxuICAgICAgICB0eXBlOiBcInBhc3N3b3JkXCIsXG4gICAgICAgIG5hbWU6IFwicGFzc3dvcmRcIixcbiAgICAgICAgaWQ6IFwiZm9ybS1pbnB1dC1wYXNzd29yZFwiLFxuICAgICAgICBjbGFzc05hbWU6IFwiZm9ybS1sb2dpbl9fZm9ybS1pbnB1dFwiLFxuICAgICAgICBvbkJsdXI6IChlOiBFdmVudCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGlucHV0ID0gZS50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICAgICAgICBpZiAoIVJlcXVpcmVkLmNoZWNrRnVuYyhpbnB1dC52YWx1ZSkpIHtcbiAgICAgICAgICAgIGF0dGVudGlvblBhc3NTdG9yZS5tZXNzYWdlID0gXCLim5Qg0L7QsdGP0LfQsNGC0LXQu9GM0L3QvtC1INC/0L7Qu9C1XCI7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGF0dGVudGlvblBhc3NTdG9yZS5tZXNzYWdlID0gXCJcIjtcbiAgICAgICAgICAgIEZvcm1EYXRhW1wicGFzc3dvcmRcIl0gPSBpbnB1dC52YWx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIENoaWxkQXR0ZW50aW9uOiBhdHRlbnRpb25QYXNzLFxuICAgICAgfSksXG4gICAgICBCdXR0b246IEJ1dHRvbih7XG4gICAgICAgIHRpdGxlOiBcItCQ0LLRgtC+0YDQuNC30L7QstCw0YLRjNGB0Y9cIixcbiAgICAgICAgY2xhc3NOYW1lOiBcImZvcm0tYnV0dG9uXCIsXG4gICAgICAgIG9uQ2xpY2s6IChlOiBFdmVudCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGRhdGE6IHsgW2tleTogc3RyaW5nXTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiB9ID0ge1xuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICBsb2dpbjogRm9ybURhdGEubG9naW4sXG4gICAgICAgICAgICAgIHBhc3N3b3JkOiBGb3JtRGF0YS5wYXNzd29yZCxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgIFwiQ29udGVudC10eXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9O1xuICAgICAgICAgIEhUVFBUcmFuc3BvcnQuZ2V0SW5zdGFuY2UoKVxuICAgICAgICAgICAgLlBPU1QoXCIvYXV0aC9zaWduaW5cIiwgZGF0YSlcbiAgICAgICAgICAgIC50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgICAgICAgaWYgKHJlc3VsdC5zdGF0dXMgPCAzMDApIHtcbiAgICAgICAgICAgICAgICByb3V0ZXIuZ28oXCIvY2hhdFwiKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICAgIExpbmtUb1JlZ2lzdHJhdGlvbjogQnV0dG9uKHtcbiAgICAgICAgdGl0bGU6IFwi0JfQsNGA0LXQs9C40YHRgtGA0LjRgNC+0LLQsNGC0YzRgdGPXCIsXG4gICAgICAgIGNsYXNzTmFtZTogXCJmb3JtLWxpbmtcIixcbiAgICAgICAgb25DbGljazogKGU6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgcm91dGVyLmdvKFwiL3JlZ2lzdHJhdGlvblwiKTtcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgIH0sXG4gIH0pO1xufTtcbiIsImltcG9ydCB7IEhZUE8gfSBmcm9tIFwiLi4vLi4vLi4vbGlicy9IWVBPL0hZUE9cIjtcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gXCIuLi8uLi9Db21wb25lbnRzL0J1dHRvblwiO1xuaW1wb3J0IHsgcm91dGVyIH0gZnJvbSBcIi4uLy4uLy4uXCI7XG5pbXBvcnQgeyBIVFRQVHJhbnNwb3J0IH0gZnJvbSBcIi4uLy4uLy4uL2xpYnMvVHJhbnNwb3J0XCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVByb2ZpbGVEVE8ge1xuICBpZDogbnVtYmVyO1xuICBkaXNwbGF5X25hbWU6IHN0cmluZztcbiAgZW1haWw6IHN0cmluZztcbiAgZmlyc3RfbmFtZTogc3RyaW5nO1xuICBzZWNvbmRfbmFtZTogc3RyaW5nO1xuICBsb2dpbjogc3RyaW5nO1xuICBwaG9uZTogc3RyaW5nO1xufVxuXG5leHBvcnQgY29uc3QgUHJvZmlsZUxheW91dCA9IChkYXRhOiBJUHJvZmlsZURUTykgPT4ge1xuICByZXR1cm4gbmV3IEhZUE8oe1xuICAgIHJlbmRlclRvOiA8SFRNTEVsZW1lbnQ+ZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNyb290XCIpLFxuICAgIHRlbXBsYXRlUGF0aDogXCJwcm9maWxlLnRlbXBsYXRlLmh0bWxcIixcbiAgICBkYXRhOiB7XG4gICAgICAuLi5kYXRhLFxuICAgIH0sXG4gICAgY2hpbGRyZW46IHtcbiAgICAgIEVkaXRQcm9maWxlTGluazogQnV0dG9uKHtcbiAgICAgICAgdGl0bGU6IFwi0JjQt9C80LXQvdC40YLRjCDQtNCw0L3QvdGL0LVcIixcbiAgICAgICAgY2xhc3NOYW1lOiBcImFjdGlvbl9fY2hhbmdlLXByb2ZpbGVcIixcbiAgICAgICAgb25DbGljazogKCkgPT4ge1xuICAgICAgICAgIHJvdXRlci5nbyhcIi9lZGl0cHJvZmlsZVwiKTtcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgRWRpdFBhc3N3b3JkTGluazogQnV0dG9uKHtcbiAgICAgICAgdGl0bGU6IFwi0JjQt9C80LXQvdC40YLRjCDQv9Cw0YDQvtC70YxcIixcbiAgICAgICAgY2xhc3NOYW1lOiBcImFjdGlvbl9fY2hhbmdlLXBhc3N3b3JkXCIsXG4gICAgICAgIG9uQ2xpY2s6ICgpID0+IHtcbiAgICAgICAgICByb3V0ZXIuZ28oXCIvZWRpdHBhc3N3b3JkXCIpO1xuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICBCYWNrTGluazogQnV0dG9uKHtcbiAgICAgICAgdGl0bGU6IFwi0J3QsNC30LDQtFwiLFxuICAgICAgICBjbGFzc05hbWU6IFwiYWN0aW9uX19iYWNrXCIsXG4gICAgICAgIG9uQ2xpY2s6ICgpID0+IHtcbiAgICAgICAgICByb3V0ZXIuZ28oXCIvY2hhdFwiKTtcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgRXhpdExpbms6IEJ1dHRvbih7XG4gICAgICAgIHRpdGxlOiBcItCS0YvQudGC0LhcIixcbiAgICAgICAgY2xhc3NOYW1lOiBcImFjdGlvbl9fZXhpdFwiLFxuICAgICAgICBvbkNsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgSFRUUFRyYW5zcG9ydC5nZXRJbnN0YW5jZSgpXG4gICAgICAgICAgICAuUE9TVChcIi9hdXRoL2xvZ291dFwiKVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICByb3V0ZXIuZ28oXCIvXCIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICB9LFxuICB9KTtcbn07XG4iLCJpbXBvcnQgeyBIWVBPIH0gZnJvbSBcIi4uLy4uLy4uL2xpYnMvSFlQTy9IWVBPXCI7XG5pbXBvcnQgeyBJbnB1dCB9IGZyb20gXCIuLi8uLi9Db21wb25lbnRzL0lucHV0XCI7XG4vLyBpbXBvcnQgeyBWYWxpZGF0b3IsIFJ1bGUgfSBmcm9tIFwiLi4vLi4vbGlicy9WYWxpZGF0b3JcIjtcbmltcG9ydCB7IEVtYWlsVmFsaWRhdG9yIH0gZnJvbSBcIi4uLy4uLy4uL2xpYnMvVmFsaWRhdG9ycy9FbWFpbFwiO1xuaW1wb3J0IHsgUmVxdWlyZWQgfSBmcm9tIFwiLi4vLi4vLi4vbGlicy9WYWxpZGF0b3JzL1JlcXVpcmVkXCI7XG5pbXBvcnQgeyBBdHRlbnRpb25NZXNzYWdlIH0gZnJvbSBcIi4uLy4uL0NvbXBvbmVudHMvQXR0ZW50aW9uTWVzc2FnZVwiO1xuaW1wb3J0IHsgcm91dGVyIH0gZnJvbSBcIi4uLy4uLy4uXCI7XG5pbXBvcnQgeyBIVFRQVHJhbnNwb3J0IH0gZnJvbSBcIi4uLy4uLy4uL2xpYnMvVHJhbnNwb3J0XCI7XG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tIFwiLi4vLi4vQ29tcG9uZW50cy9CdXR0b25cIjtcblxuZXhwb3J0IGNvbnN0IFJlZ2lzdHJhdGlvbkxheW91dCA9ICgpID0+IHtcbiAgY29uc3QgQXR0ZW50aW9uRW1haWwgPSBBdHRlbnRpb25NZXNzYWdlKCk7XG4gIGNvbnN0IEF0dGVudGlvbkxvZ2luID0gQXR0ZW50aW9uTWVzc2FnZSgpO1xuICBjb25zdCBBdHRlbnRpb25QYXNzd29yZCA9IEF0dGVudGlvbk1lc3NhZ2UoKTtcbiAgY29uc3QgQXR0ZW50aW9uUGFzc3dvcmREb3VibGUgPSBBdHRlbnRpb25NZXNzYWdlKCk7XG4gIGNvbnN0IEF0dGVudGlvbkZpcnN0TmFtZSA9IEF0dGVudGlvbk1lc3NhZ2UoKTtcbiAgY29uc3QgQXR0ZW50aW9uU2Vjb25kTmFtZSA9IEF0dGVudGlvbk1lc3NhZ2UoKTtcbiAgY29uc3QgQXR0ZW50aW9uUGhvbmUgPSBBdHRlbnRpb25NZXNzYWdlKCk7XG5cbiAgY29uc3QgRm9ybURhdGE6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcblxuICByZXR1cm4gbmV3IEhZUE8oe1xuICAgIHJlbmRlclRvOiA8SFRNTEVsZW1lbnQ+ZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNyb290XCIpLFxuICAgIHRlbXBsYXRlUGF0aDogXCJyZWdpc3RyYXRpb24udGVtcGxhdGUuaHRtbFwiLFxuICAgIGRhdGE6IHtcbiAgICAgIGZvcm1UaXRsZTogXCLQoNC10LPQuNGB0YLRgNCw0YbQuNGPXCIsXG4gICAgfSxcbiAgICBjaGlsZHJlbjoge1xuICAgICAgSW5wdXRFbWFpbDogSW5wdXQoe1xuICAgICAgICBsYWJlbDogXCLQn9C+0YfRgtCwXCIsXG4gICAgICAgIHR5cGU6IFwidGV4dFwiLFxuICAgICAgICBuYW1lOiBcImVtYWlsXCIsXG4gICAgICAgIGlkOiBcImZvcm1fX2VtYWlsX19pbnB1dFwiLFxuICAgICAgICBjbGFzc05hbWU6IFwiZm9ybS1yZWdfX2Zvcm0taW5wdXRcIixcbiAgICAgICAgQ2hpbGRBdHRlbnRpb246IEF0dGVudGlvbkVtYWlsLFxuICAgICAgICBvbkJsdXI6IChlOiBFdmVudCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHN0YXRlID0gQXR0ZW50aW9uRW1haWwuZ2V0U3RhdGUoKTtcbiAgICAgICAgICBjb25zdCBpbnB1dCA9IGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgICAgICAgaWYgKEVtYWlsVmFsaWRhdG9yLmNoZWNrRnVuYyhpbnB1dC52YWx1ZSkpIHtcbiAgICAgICAgICAgIEZvcm1EYXRhW1wiZW1haWxcIl0gPSBpbnB1dC52YWx1ZTtcbiAgICAgICAgICAgIHN0YXRlLm1lc3NhZ2UgPSBcIlwiO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdGF0ZS5tZXNzYWdlID0gXCLim5Qg0Y3RgtC+INC90LUg0L/QvtGF0L7QttC1INC90LAg0LDQtNGA0LXRgSDRjdC70LXQutGC0YDQvtC90L3QvtC5INC/0L7Rh9GC0YtcIjtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICAgIElucHV0TG9naW46IElucHV0KHtcbiAgICAgICAgbGFiZWw6IFwi0JvQvtCz0LjQvVwiLFxuICAgICAgICB0eXBlOiBcInRleHRcIixcbiAgICAgICAgbmFtZTogXCJsb2dpblwiLFxuICAgICAgICBpZDogXCJmb3JtX19sb2dpbl9faW5wdXRcIixcbiAgICAgICAgY2xhc3NOYW1lOiBcImZvcm0tcmVnX19mb3JtLWlucHV0XCIsXG4gICAgICAgIENoaWxkQXR0ZW50aW9uOiBBdHRlbnRpb25Mb2dpbixcbiAgICAgICAgb25CbHVyOiAoZTogRXZlbnQpID0+IHtcbiAgICAgICAgICBjb25zdCBzdGF0ZSA9IEF0dGVudGlvbkxvZ2luLmdldFN0YXRlKCk7XG4gICAgICAgICAgY29uc3QgaW5wdXQgPSBlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgICAgICAgIGlmIChSZXF1aXJlZC5jaGVja0Z1bmMoaW5wdXQudmFsdWUpKSB7XG4gICAgICAgICAgICBGb3JtRGF0YVtcImxvZ2luXCJdID0gaW5wdXQudmFsdWU7XG4gICAgICAgICAgICBzdGF0ZS5tZXNzYWdlID0gXCJcIjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RhdGUubWVzc2FnZSA9IFwi4puUINC+0LHRj9C30LDRgtC10LvRjNC90L7QtSDQv9C+0LvQtVwiO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgRmlyc3ROYW1lOiBJbnB1dCh7XG4gICAgICAgIGxhYmVsOiBcItCY0LzRj1wiLFxuICAgICAgICB0eXBlOiBcInRleHRcIixcbiAgICAgICAgbmFtZTogXCJmaXJzdF9uYW1lXCIsXG4gICAgICAgIGlkOiBcImZvcm1fX2ZpcnN0X25hbWVfX2lucHV0XCIsXG4gICAgICAgIGNsYXNzTmFtZTogXCJmb3JtLXJlZ19fZm9ybS1pbnB1dFwiLFxuICAgICAgICBDaGlsZEF0dGVudGlvbjogQXR0ZW50aW9uRmlyc3ROYW1lLFxuICAgICAgICBvbkJsdXI6IChlOiBFdmVudCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHN0YXRlID0gQXR0ZW50aW9uRmlyc3ROYW1lLmdldFN0YXRlKCk7XG4gICAgICAgICAgY29uc3QgaW5wdXQgPSBlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgICAgICAgIGlmIChSZXF1aXJlZC5jaGVja0Z1bmMoaW5wdXQudmFsdWUpKSB7XG4gICAgICAgICAgICBGb3JtRGF0YVtcImZpcnN0X25hbWVcIl0gPSBpbnB1dC52YWx1ZTtcbiAgICAgICAgICAgIHN0YXRlLm1lc3NhZ2UgPSBcIlwiO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdGF0ZS5tZXNzYWdlID0gXCLim5Qg0L7QsdGP0LfQsNGC0LXQu9GM0L3QvtC1INC/0L7Qu9C1XCI7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICBTZWNvbmROYW1lOiBJbnB1dCh7XG4gICAgICAgIGxhYmVsOiBcItCk0LDQvNC40LvQuNGPXCIsXG4gICAgICAgIHR5cGU6IFwidGV4dFwiLFxuICAgICAgICBuYW1lOiBcInNlY29uZF9uYW1lXCIsXG4gICAgICAgIGlkOiBcImZvcm1fX3NlY29uZF9uYW1lX19pbnB1dFwiLFxuICAgICAgICBjbGFzc05hbWU6IFwiZm9ybS1yZWdfX2Zvcm0taW5wdXRcIixcbiAgICAgICAgQ2hpbGRBdHRlbnRpb246IEF0dGVudGlvblNlY29uZE5hbWUsXG4gICAgICAgIG9uQmx1cjogKGU6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgY29uc3Qgc3RhdGUgPSBBdHRlbnRpb25TZWNvbmROYW1lLmdldFN0YXRlKCk7XG4gICAgICAgICAgY29uc3QgaW5wdXQgPSBlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgICAgICAgIGlmIChSZXF1aXJlZC5jaGVja0Z1bmMoaW5wdXQudmFsdWUpKSB7XG4gICAgICAgICAgICBGb3JtRGF0YVtcInNlY29uZF9uYW1lXCJdID0gaW5wdXQudmFsdWU7XG4gICAgICAgICAgICBzdGF0ZS5tZXNzYWdlID0gXCJcIjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RhdGUubWVzc2FnZSA9IFwi4puUINC+0LHRj9C30LDRgtC10LvRjNC90L7QtSDQv9C+0LvQtVwiO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgUGhvbmU6IElucHV0KHtcbiAgICAgICAgbGFiZWw6IFwi0KLQtdC70LXRhNC+0L1cIixcbiAgICAgICAgdHlwZTogXCJ0ZXh0XCIsXG4gICAgICAgIG5hbWU6IFwicGhvbmVcIixcbiAgICAgICAgaWQ6IFwiZm9ybV9fcGhvbmVfX2lucHV0XCIsXG4gICAgICAgIGNsYXNzTmFtZTogXCJmb3JtLXJlZ19fZm9ybS1pbnB1dFwiLFxuICAgICAgICBDaGlsZEF0dGVudGlvbjogQXR0ZW50aW9uUGhvbmUsXG4gICAgICAgIG9uQmx1cjogKGU6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgY29uc3Qgc3RhdGUgPSBBdHRlbnRpb25QaG9uZS5nZXRTdGF0ZSgpO1xuICAgICAgICAgIGNvbnN0IGlucHV0ID0gZS50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICAgICAgICBpZiAoUmVxdWlyZWQuY2hlY2tGdW5jKGlucHV0LnZhbHVlKSkge1xuICAgICAgICAgICAgRm9ybURhdGFbXCJwaG9uZVwiXSA9IGlucHV0LnZhbHVlO1xuICAgICAgICAgICAgc3RhdGUubWVzc2FnZSA9IFwiXCI7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0YXRlLm1lc3NhZ2UgPSBcIuKblCDQvtCx0Y/Qt9Cw0YLQtdC70YzQvdC+0LUg0L/QvtC70LVcIjtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICAgIFBhc3N3b3JkOiBJbnB1dCh7XG4gICAgICAgIGxhYmVsOiBcItCf0LDRgNC+0LvRjFwiLFxuICAgICAgICB0eXBlOiBcInBhc3N3b3JkXCIsXG4gICAgICAgIG5hbWU6IFwicGFzc3dvcmRcIixcbiAgICAgICAgaWQ6IFwiZm9ybV9fcGFzc3dvcmRfX2lucHV0XCIsXG4gICAgICAgIGNsYXNzTmFtZTogXCJmb3JtLXJlZ19fZm9ybS1pbnB1dFwiLFxuICAgICAgICBDaGlsZEF0dGVudGlvbjogQXR0ZW50aW9uUGFzc3dvcmQsXG4gICAgICAgIG9uQmx1cjogKGU6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgY29uc3QgaW5wdXQgPSBlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgICAgICAgIGNvbnN0IHN0YXRlID0gQXR0ZW50aW9uUGFzc3dvcmQuZ2V0U3RhdGUoKTtcbiAgICAgICAgICBjb25zdCBzdGF0ZUQgPSBBdHRlbnRpb25QYXNzd29yZERvdWJsZS5nZXRTdGF0ZSgpO1xuICAgICAgICAgIGlmIChSZXF1aXJlZC5jaGVja0Z1bmMoaW5wdXQudmFsdWUpKSB7XG4gICAgICAgICAgICBGb3JtRGF0YVtcInBhc3N3b3JkXCJdID0gaW5wdXQudmFsdWU7XG4gICAgICAgICAgICBzdGF0ZS5tZXNzYWdlID0gXCJcIjtcbiAgICAgICAgICAgIGlmIChGb3JtRGF0YVtcInBhc3N3b3JkXCJdICE9PSBGb3JtRGF0YVtcImRvdWJsZXBhc3N3b3JkXCJdKSB7XG4gICAgICAgICAgICAgIHN0YXRlRC5tZXNzYWdlID0gXCLwn5Sl0L/QsNGA0L7Qu9C4INC90LUg0YHQvtCy0L/QsNC00LDRjtGCXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0YXRlLm1lc3NhZ2UgPSBcIuKblCDQvtCx0Y/Qt9Cw0YLQtdC70YzQvdC+0LUg0L/QvtC70LVcIjtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICAgIFBhc3N3b3JkRG91YmxlOiBJbnB1dCh7XG4gICAgICAgIGxhYmVsOiBcItCf0LDRgNC+0LvRjFwiLFxuICAgICAgICB0eXBlOiBcInBhc3N3b3JkXCIsXG4gICAgICAgIG5hbWU6IFwiZG91YmxlcGFzc3dvcmRcIixcbiAgICAgICAgaWQ6IFwiZm9ybV9fZG91YmxlcGFzc3dvcmRfX2lucHV0XCIsXG4gICAgICAgIGNsYXNzTmFtZTogXCJmb3JtLXJlZ19fZm9ybS1pbnB1dFwiLFxuICAgICAgICBDaGlsZEF0dGVudGlvbjogQXR0ZW50aW9uUGFzc3dvcmREb3VibGUsXG4gICAgICAgIG9uQmx1cjogKGU6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgY29uc3QgaW5wdXQgPSBlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgICAgICAgIGNvbnN0IHN0YXRlID0gQXR0ZW50aW9uUGFzc3dvcmREb3VibGUuZ2V0U3RhdGUoKTtcbiAgICAgICAgICBpZiAoUmVxdWlyZWQuY2hlY2tGdW5jKGlucHV0LnZhbHVlKSkge1xuICAgICAgICAgICAgRm9ybURhdGFbXCJkb3VibGVwYXNzd29yZFwiXSA9IGlucHV0LnZhbHVlO1xuICAgICAgICAgICAgc3RhdGUubWVzc2FnZSA9IFwiXCI7XG4gICAgICAgICAgICBpZiAoRm9ybURhdGFbXCJwYXNzd29yZFwiXSAhPT0gRm9ybURhdGFbXCJkb3VibGVwYXNzd29yZFwiXSkge1xuICAgICAgICAgICAgICBzdGF0ZS5tZXNzYWdlID0gXCLwn5Sl0L/QsNGA0L7Qu9C4INC90LUg0YHQvtCy0L/QsNC00LDRjtGCXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0YXRlLm1lc3NhZ2UgPSBcIuKblCDQvtCx0Y/Qt9Cw0YLQtdC70YzQvdC+0LUg0L/QvtC70LVcIjtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICAgIFJlZ0J1dHRvbjogQnV0dG9uKHtcbiAgICAgICAgdGl0bGU6IFwi0JfQsNGA0LXQs9C40YHRgtGA0LjRgNC+0LLQsNGC0YzRgdGPXCIsXG4gICAgICAgIGNsYXNzTmFtZTogXCJmb3JtLWJ1dHRvblwiLFxuICAgICAgICBvbkNsaWNrOiAoZTogRXZlbnQpID0+IHtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICBPYmplY3Qua2V5cyhGb3JtRGF0YSkubGVuZ3RoID09IDAgfHxcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKEZvcm1EYXRhKS5maW5kKChpdGVtKSA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiBGb3JtRGF0YVtpdGVtXSA9PT0gXCJcIjtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnN0IGRhdGE6IHsgW2tleTogc3RyaW5nXTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiB9ID0ge1xuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICBmaXJzdF9uYW1lOiBGb3JtRGF0YS5maXJzdF9uYW1lLFxuICAgICAgICAgICAgICBzZWNvbmRfbmFtZTogRm9ybURhdGEuc2Vjb25kX25hbWUsXG4gICAgICAgICAgICAgIGxvZ2luOiBGb3JtRGF0YS5sb2dpbixcbiAgICAgICAgICAgICAgZW1haWw6IEZvcm1EYXRhLmVtYWlsLFxuICAgICAgICAgICAgICBwYXNzd29yZDogRm9ybURhdGEucGFzc3dvcmQsXG4gICAgICAgICAgICAgIHBob25lOiBGb3JtRGF0YS5waG9uZSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgICAgIFwiQ29udGVudC10eXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9O1xuICAgICAgICAgIEhUVFBUcmFuc3BvcnQuZ2V0SW5zdGFuY2UoKVxuICAgICAgICAgICAgLlBPU1QoXCIvYXV0aC9zaWdudXBcIiwgZGF0YSlcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgcm91dGVyLmdvKFwiL2NoYXRcIik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgTG9naW5MaW5rOiBCdXR0b24oe1xuICAgICAgICB0aXRsZTogXCLQktC+0LnRgtC4XCIsXG4gICAgICAgIGNsYXNzTmFtZTogXCJmb3JtLWxpbmtcIixcbiAgICAgICAgb25DbGljazogKGU6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgcm91dGVyLmdvKFwiL1wiKTtcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgIH0sXG4gIH0pO1xufTtcbiIsImltcG9ydCB7IElDaGF0U2VydmljZSB9IGZyb20gXCIuLi8uLi9CdXNzaW5lc0xheWVyL0NoYXRTZXJ2aWNlXCI7XG5pbXBvcnQgeyBJQ2hhdERUTyB9IGZyb20gXCIuLi8uLi9VSS9Db21wb25lbnRzL0NoYXRJdGVtXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUNoYXRWaWV3TW9kZWwge1xuICBjaGF0czogQXJyYXk8SUNoYXREVE8+O1xuICBnZXRDaGF0czogKCkgPT4gUHJvbWlzZTxJQ2hhdERUT1tdPjtcbiAgc2F2ZUNoYXQ6IChkYXRhOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+KSA9PiBQcm9taXNlPHZvaWQ+O1xuICBkZWxldGVDaGF0OiAoY2hhdElkOiBzdHJpbmcpID0+IFByb21pc2U8dm9pZD47XG59XG5leHBvcnQgY2xhc3MgQ2hhdFZpZXdNb2RlbCBpbXBsZW1lbnRzIElDaGF0Vmlld01vZGVsIHtcbiAgY2hhdHM6IEFycmF5PElDaGF0RFRPPiA9IFtdO1xuICB4OiBudW1iZXIgPSAxMjtcbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIHNlcnZpY2U6IElDaGF0U2VydmljZSkge31cblxuICBnZXRDaGF0cyA9IGFzeW5jICgpID0+IHtcbiAgICB0aGlzLmNoYXRzID0gYXdhaXQgdGhpcy5zZXJ2aWNlLmdldENoYXRzKCk7XG4gICAgcmV0dXJuIHRoaXMuY2hhdHM7XG4gIH07XG5cbiAgc2F2ZUNoYXQgPSBhc3luYyAoZGF0YTogUmVjb3JkPHN0cmluZywgc3RyaW5nPikgPT4ge1xuICAgIGF3YWl0IHRoaXMuc2VydmljZS5zYXZlQ2hhdChkYXRhKTtcbiAgICBhd2FpdCB0aGlzLmdldENoYXRzKCk7XG4gIH07XG5cbiAgZGVsZXRlQ2hhdCA9IGFzeW5jIChjaGF0SWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGF3YWl0IHRoaXMuc2VydmljZS5kZWxldGVDaGF0KGNoYXRJZCk7XG4gICAgYXdhaXQgdGhpcy5nZXRDaGF0cygpO1xuICB9O1xufVxuIiwiaW1wb3J0IHsgSVVzZXJTZXJ2aWNlIH0gZnJvbSBcIi4uLy4uL0J1c3NpbmVzTGF5ZXIvVXNlclNlcnZpY2VcIjtcbmltcG9ydCB7IElQcm9maWxlRFRPIH0gZnJvbSBcIi4uLy4uL1VJL0xheW91dHMvUHJvZmlsZVwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIElVc2VyVmlld01vZGVsIHtcbiAgdXNlcj86IElQcm9maWxlRFRPO1xuICBnZXRVc2VyOiAoKSA9PiBQcm9taXNlPHZvaWQ+O1xuICBzYXZlVXNlcjogKHVzZXI6IElQcm9maWxlRFRPKSA9PiBQcm9taXNlPElQcm9maWxlRFRPPjtcbiAgc2V0VXNlckZpZWxkOiAobmFtZToga2V5b2YgSVByb2ZpbGVEVE8sIHZhbHVlOiBhbnkpID0+IHZvaWQ7XG59XG5cbmV4cG9ydCBjbGFzcyBVc2VyVmlld01vZGVsIGltcGxlbWVudHMgSVVzZXJWaWV3TW9kZWwge1xuICB1c2VyPzogSVByb2ZpbGVEVE87XG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBzZXJ2aWNlOiBJVXNlclNlcnZpY2UpIHt9XG5cbiAgZ2V0VXNlciA9IGFzeW5jICgpID0+IHtcbiAgICB0aGlzLnVzZXIgPSBhd2FpdCB0aGlzLnNlcnZpY2UuZ2V0VXNlcigpO1xuICB9O1xuXG4gIHNhdmVVc2VyID0gYXN5bmMgKHVzZXI6IElQcm9maWxlRFRPKSA9PiB7XG4gICAgcmV0dXJuIHRoaXMuc2VydmljZS5zYXZlVXNlcih1c2VyKTtcbiAgfTtcblxuICBzZXRVc2VyRmllbGQobmFtZToga2V5b2YgSVByb2ZpbGVEVE8sIHZhbHVlOiBhbnkpIHtcbiAgICBpZiAodGhpcy51c2VyKSB7XG4gICAgICB0aGlzLnVzZXJbbmFtZV0gPSB2YWx1ZSBhcyBuZXZlcjtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy51c2VyID0ge30gYXMgSVByb2ZpbGVEVE87XG4gICAgICB0aGlzLnVzZXJbbmFtZV0gPSB2YWx1ZSBhcyBuZXZlcjtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7IFNFUlZJQ0UgfSBmcm9tIFwiLi4vQnVzc2luZXNMYXllclwiO1xuaW1wb3J0IHsgSUNoYXRTZXJ2aWNlIH0gZnJvbSBcIi4uL0J1c3NpbmVzTGF5ZXIvQ2hhdFNlcnZpY2VcIjtcbmltcG9ydCB7IElVc2VyU2VydmljZSB9IGZyb20gXCIuLi9CdXNzaW5lc0xheWVyL1VzZXJTZXJ2aWNlXCI7XG5pbXBvcnQgeyBDb250YWluZXIgfSBmcm9tIFwiLi4vbGlicy9Db250YWluZXJcIjtcbmltcG9ydCB7IENoYXRWaWV3TW9kZWwgfSBmcm9tIFwiLi9DaGF0Vmlld01vZGVsXCI7XG5pbXBvcnQgeyBVc2VyVmlld01vZGVsIH0gZnJvbSBcIi4vVXNlclZpZXdNb2RlbFwiO1xuXG5leHBvcnQgY29uc3QgVklFV19NT0RFTCA9IHtcbiAgQ0hBVDogU3ltYm9sLmZvcihcIkNoYXRWaWV3TW9kZWxcIiksXG4gIFVTRVI6IFN5bWJvbC5mb3IoXCJVc2VyVmlld01vZGVsXCIpLFxufTtcblxuZXhwb3J0IGNvbnN0IFZpZXdNb2RlbENvbnRhaW5lciA9IG5ldyBDb250YWluZXIoKTtcblxuVmlld01vZGVsQ29udGFpbmVyLmJpbmQoVklFV19NT0RFTC5DSEFUKS50b0R5bmFtaWNWYWx1ZSgoY29udGFpbmVyKSA9PiB7XG4gIGNvbnN0IHNlcnZpY2UgPSBjb250YWluZXIuZ2V0PElDaGF0U2VydmljZT4oU0VSVklDRS5DSEFUKTtcbiAgcmV0dXJuIG5ldyBDaGF0Vmlld01vZGVsKHNlcnZpY2UpO1xufSk7XG5cblZpZXdNb2RlbENvbnRhaW5lci5iaW5kKFZJRVdfTU9ERUwuVVNFUilcbiAgLnRvRHluYW1pY1ZhbHVlKChjb250YWluZXIpID0+IHtcbiAgICBjb25zdCBzZXJ2aWNlID0gY29udGFpbmVyLmdldDxJVXNlclNlcnZpY2U+KFNFUlZJQ0UuVVNFUik7XG4gICAgcmV0dXJuIG5ldyBVc2VyVmlld01vZGVsKHNlcnZpY2UpO1xuICB9KVxuICAuaW5TaW5nbGV0b25lU2NvcGUoKTtcbiIsImltcG9ydCB7IEJvb3RTdHJhcCB9IGZyb20gXCIuL0Jvb3RzdHJhcFwiO1xuaW1wb3J0IHsgUm91dGVySW5pdCB9IGZyb20gXCIuL3JvdXRlclwiO1xuXG5jb25zdCBJbml0QXBwID0gKCkgPT4ge1xuICBjb25zdCB7IGNvbnRhaW5lciB9ID0gbmV3IEJvb3RTdHJhcCgpO1xuICBjb25zdCByb3V0ZXIgPSBSb3V0ZXJJbml0KGNvbnRhaW5lcik7XG4gIHJldHVybiB7IHJvdXRlciwgY29udGFpbmVyIH07XG59O1xuXG5leHBvcnQgY29uc3QgeyByb3V0ZXIsIGNvbnRhaW5lciB9ID0gSW5pdEFwcCgpO1xuIiwiY2xhc3MgU2luZ2xldG9uU2NvcGUge1xuICBJbnN0YW5jZU1ha2VyczogTWFwPHN5bWJvbCwgYW55PiA9IG5ldyBNYXA8XG4gICAgc3ltYm9sLFxuICAgIHsgZm46IChjb250YWluZXI6IENvbnRhaW5lcikgPT4gYW55OyBpZDogc3ltYm9sIH1cbiAgPigpO1xuICBJbnN0YW5jZXM6IE1hcDxzeW1ib2wsIGFueT4gPSBuZXcgTWFwPHN5bWJvbCwgYW55PigpO1xufVxuXG5leHBvcnQgY2xhc3MgQ29udGFpbmVyIHtcbiAgY29udGFpbmVyczogTWFwPHN5bWJvbCwgYW55PiA9IG5ldyBNYXAoKTtcbiAgbGFzdElkPzogc3ltYm9sO1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgc2luZ2xldG9uZVNjb3BlOiBTaW5nbGV0b25TY29wZSA9IG5ldyBTaW5nbGV0b25TY29wZSgpXG4gICkge31cbiAgYmluZChpZDogc3ltYm9sKTogQ29udGFpbmVyIHtcbiAgICB0aGlzLmxhc3RJZCA9IGlkO1xuICAgIHRoaXMuY29udGFpbmVycy5zZXQoaWQsIG51bGwpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIGdldCA9IDxUPihpZDogc3ltYm9sKTogVCA9PiB7XG4gICAgY29uc3Qgc2luZ2xlVG9uZUNvbnRhaW5lciA9IHRoaXMuc2luZ2xldG9uZVNjb3BlLkluc3RhbmNlTWFrZXJzLmdldChpZCk7XG4gICAgaWYgKHNpbmdsZVRvbmVDb250YWluZXIpIHtcbiAgICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5zaW5nbGV0b25lU2NvcGUuSW5zdGFuY2VzLmdldChpZCk7XG4gICAgICBpZiAoaW5zdGFuY2UpIHtcbiAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zaW5nbGV0b25lU2NvcGUuSW5zdGFuY2VzLnNldChpZCwgc2luZ2xlVG9uZUNvbnRhaW5lci5mbih0aGlzKSk7XG4gICAgICAgIHJldHVybiB0aGlzLnNpbmdsZXRvbmVTY29wZS5JbnN0YW5jZXMuZ2V0KGlkKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgY3JlYXRlQ29udGFpbmVyRm4gPSB0aGlzLmNvbnRhaW5lcnMuZ2V0KGlkKTtcbiAgICAgIHJldHVybiBjcmVhdGVDb250YWluZXJGbi5mbih0aGlzKTtcbiAgICB9XG4gIH07XG5cbiAgdG9EeW5hbWljVmFsdWUoZm46IChjb250YWluZXI6IENvbnRhaW5lcikgPT4gdW5rbm93bikge1xuICAgIGlmICh0aGlzLmxhc3RJZCkge1xuICAgICAgdGhpcy5jb250YWluZXJzLnNldCh0aGlzLmxhc3RJZCwgeyBmbjogZm4sIGlkOiB0aGlzLmxhc3RJZCB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHBhcmVudChjb250YWluZXI6IENvbnRhaW5lcik6IENvbnRhaW5lciB7XG4gICAgZm9yIChsZXQgY29udCBvZiBjb250YWluZXIuY29udGFpbmVycykge1xuICAgICAgdGhpcy5jb250YWluZXJzLnNldChjb250WzBdLCBjb250WzFdKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBpblNpbmdsZXRvbmVTY29wZSgpIHtcbiAgICBpZiAodGhpcy5sYXN0SWQpIHtcbiAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMuY29udGFpbmVycy5nZXQodGhpcy5sYXN0SWQpO1xuICAgICAgdGhpcy5zaW5nbGV0b25lU2NvcGUuSW5zdGFuY2VNYWtlcnMuc2V0KHRoaXMubGFzdElkLCBjb250YWluZXIpO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHsgdXVpZHY0IH0gZnJvbSBcIi4uL3V0aWxzXCI7XG5pbnRlcmZhY2UgSUhZUE9Qcm9wcyB7XG4gIHJlbmRlclRvPzogSFRNTEVsZW1lbnQ7XG4gIHRlbXBsYXRlUGF0aDogc3RyaW5nO1xuICBjaGlsZHJlbj86IFJlY29yZDxzdHJpbmcsIEhZUE8gfCBIWVBPW10+O1xuICBkYXRhOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPjtcbn1cblxuaW50ZXJmYWNlIElUZW1wYXRlUHJvcCB7XG4gIGh0bWw6IHN0cmluZztcbiAgdGVtcGxhdGVLZXk6IHN0cmluZztcbiAgbWFnaWNLZXk6IHN0cmluZztcbiAgaXNBcnJheTogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGNsYXNzIEhZUE8ge1xuICBwcml2YXRlIHJlbmRlclRvPzogSFRNTEVsZW1lbnQ7XG4gIHByaXZhdGUgY2hpbGRyZW4/OiBSZWNvcmQ8c3RyaW5nLCBIWVBPIHwgSFlQT1tdPjtcbiAgcHJpdmF0ZSB0ZW1wbGF0ZVBhdGg6IHN0cmluZztcbiAgcHJpdmF0ZSBkYXRhOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPjtcbiAgcHJpdmF0ZSB0ZW1wbGF0ZXNQcm9taXNlczogUHJvbWlzZTxJVGVtcGF0ZVByb3A+W107XG4gIHByaXZhdGUgc3RvcmU6IFJlY29yZDxzdHJpbmcsIHVua25vd24+O1xuICBwcml2YXRlIG1hZ2ljS2V5OiBzdHJpbmc7XG4gIHByaXZhdGUgYWZ0ZXJSZW5kZXJDYWxsYmFjazogKCkgPT4gdm9pZDtcbiAgcHJpdmF0ZSBhZnRlclJlbmRlckNhbGxiYWNrQXJyOiBTZXQ8KCkgPT4gdm9pZD47XG5cbiAgY29uc3RydWN0b3IocGFyYW1zOiBJSFlQT1Byb3BzKSB7XG4gICAgdGhpcy5yZW5kZXJUbyA9IHBhcmFtcy5yZW5kZXJUbztcbiAgICB0aGlzLmRhdGEgPSBwYXJhbXMuZGF0YTtcbiAgICB0aGlzLnRlbXBsYXRlUGF0aCA9IGAuL3RlbXBsYXRlcy8ke3BhcmFtcy50ZW1wbGF0ZVBhdGh9YDtcbiAgICB0aGlzLmNoaWxkcmVuID0gcGFyYW1zLmNoaWxkcmVuO1xuICAgIHRoaXMudGVtcGxhdGVzUHJvbWlzZXMgPSBbXTtcbiAgICB0aGlzLnN0b3JlID0ge307XG4gICAgdGhpcy5tYWdpY0tleSA9IHV1aWR2NCgpO1xuICAgIHRoaXMuYWZ0ZXJSZW5kZXJDYWxsYmFjayA9ICgpID0+IHt9O1xuICAgIHRoaXMuYWZ0ZXJSZW5kZXJDYWxsYmFja0FyciA9IG5ldyBTZXQoKTtcbiAgfVxuXG4gIC8vQHRvZG86INC/0YDQuNC60YDRg9GC0LjRgtGMINC80LXQvNC+0LjQt9Cw0YbQuNGOXG5cbiAgcHVibGljIGdldFRlbXBsYXRlSFRNTChcbiAgICBrZXk6IHN0cmluZyxcbiAgICBoeXBvOiBIWVBPLFxuICAgIGlzQXJyYXk6IGJvb2xlYW5cbiAgKTogUHJvbWlzZTxJVGVtcGF0ZVByb3A+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2U8SVRlbXBhdGVQcm9wPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBmZXRjaChoeXBvLnRlbXBsYXRlUGF0aClcbiAgICAgICAgLnRoZW4oKGh0bWwpID0+IHtcbiAgICAgICAgICBpZiAoaHRtbC5zdGF0dXMgIT09IDIwMCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiZmlsZSBkbyBub3QgZG93bmxvYWRcIik7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBodG1sLmJsb2IoKTtcbiAgICAgICAgfSlcbiAgICAgICAgLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICAgIHJldHVybiByZXN1bHQudGV4dCgpO1xuICAgICAgICB9KVxuICAgICAgICAudGhlbigodGV4dCkgPT4ge1xuICAgICAgICAgIHRleHQgPSB0aGlzLmluc2VydERhdGFJbnRvSFRNTCh0ZXh0LCBoeXBvLmRhdGEpO1xuICAgICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgaHRtbDogdGV4dCxcbiAgICAgICAgICAgIHRlbXBsYXRlS2V5OiBrZXksXG4gICAgICAgICAgICBtYWdpY0tleTogaHlwby5tYWdpY0tleSxcbiAgICAgICAgICAgIGlzQXJyYXk6IGlzQXJyYXksXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBjb2xsZWN0VGVtcGxhdGVzKFxuICAgIGh5cG86IEhZUE8gfCBIWVBPW10sXG4gICAgbmFtZTogc3RyaW5nLFxuICAgIGlzQXJyYXk6IGJvb2xlYW5cbiAgKTogSFlQTyB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoaHlwbykpIHtcbiAgICAgIHRoaXMuaGFuZGxlQXJyYXlIWVBPKGh5cG8sIG5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmhhbmRsZVNpbXBsZUhZUE8oaHlwbywgbmFtZSk7XG4gICAgICB0aGlzLnRlbXBsYXRlc1Byb21pc2VzLnB1c2godGhpcy5nZXRUZW1wbGF0ZUhUTUwobmFtZSwgaHlwbywgaXNBcnJheSkpO1xuICAgICAgdGhpcy5hZnRlclJlbmRlckNhbGxiYWNrQXJyLmFkZChoeXBvLmFmdGVyUmVuZGVyQ2FsbGJhY2spO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHByaXZhdGUgaGFuZGxlQXJyYXlIWVBPKGh5cG9zOiBIWVBPW10sIG5hbWU6IHN0cmluZyk6IHZvaWQge1xuICAgIGh5cG9zLmZvckVhY2goKGh5cG8pID0+IHtcbiAgICAgIHRoaXMuY29sbGVjdFRlbXBsYXRlcyhoeXBvLCBgJHtuYW1lfWAsIHRydWUpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBoYW5kbGVTaW1wbGVIWVBPKGh5cG86IEhZUE8sIG5hbWU6IHN0cmluZyk6IHZvaWQge1xuICAgIGlmIChoeXBvLmNoaWxkcmVuKSB7XG4gICAgICBPYmplY3Qua2V5cyhoeXBvLmNoaWxkcmVuKS5mb3JFYWNoKChjaGlsZE5hbWUpID0+IHtcbiAgICAgICAgaWYgKGh5cG8uY2hpbGRyZW4pIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5jb2xsZWN0VGVtcGxhdGVzKFxuICAgICAgICAgICAgaHlwby5jaGlsZHJlbltjaGlsZE5hbWVdLFxuICAgICAgICAgICAgY2hpbGROYW1lLFxuICAgICAgICAgICAgZmFsc2VcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGluc2VydERhdGFJbnRvSFRNTChcbiAgICBodG1sVGVtcGxhdGU6IHN0cmluZyxcbiAgICBkYXRhOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPlxuICApOiBzdHJpbmcge1xuICAgIGRhdGEgPSB0aGlzLmdldERhdGFXaXRob3V0SWVyYXJoeShkYXRhKTtcbiAgICBmb3IgKGxldCBrZXkgaW4gZGF0YSkge1xuICAgICAgaWYgKHR5cGVvZiBkYXRhW2tleV0gIT09IFwib2JqZWN0XCIgfHwgZGF0YVtrZXldID09PSBudWxsKSB7XG4gICAgICAgIGNvbnN0IG1hc2sgPSBuZXcgUmVnRXhwKFwie3tcIiArIGtleSArIFwifX1cIiwgXCJnXCIpO1xuICAgICAgICBodG1sVGVtcGxhdGUgPSBodG1sVGVtcGxhdGUucmVwbGFjZShtYXNrLCBTdHJpbmcoZGF0YVtrZXldKSk7XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IG1hc2sgPSBuZXcgUmVnRXhwKC97e1thLXouX10rfX0vZyk7XG4gICAgaHRtbFRlbXBsYXRlID0gaHRtbFRlbXBsYXRlLnJlcGxhY2UobWFzaywgXCJcIik7XG4gICAgcmV0dXJuIGh0bWxUZW1wbGF0ZTtcbiAgfVxuXG4gIHByaXZhdGUgY29udmVydEFyclRlbXBsYXRlVG9NYXAoXG4gICAgdGVtcGxhdGVBcnI6IHtcbiAgICAgIGh0bWw6IHN0cmluZztcbiAgICAgIHRlbXBsYXRlS2V5OiBzdHJpbmc7XG4gICAgICBtYWdpY0tleTogc3RyaW5nO1xuICAgICAgaXNBcnJheTogYm9vbGVhbiB8IHVuZGVmaW5lZDtcbiAgICB9W11cbiAgKTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiB7XG4gICAgY29uc3QgcmVzdWx0OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG4gICAgdGVtcGxhdGVBcnIuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgaWYgKHJlc3VsdFtpdGVtLnRlbXBsYXRlS2V5XSkge1xuICAgICAgICByZXN1bHRbXG4gICAgICAgICAgaXRlbS50ZW1wbGF0ZUtleVxuICAgICAgICBdICs9IGA8c3BhbiBoeXBvPVwiJHtpdGVtLm1hZ2ljS2V5fVwiPiR7aXRlbS5odG1sfTwvc3Bhbj5gO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0W2Ake2l0ZW0udGVtcGxhdGVLZXl9LSR7aXRlbS5tYWdpY0tleX1gXSA9IGl0ZW0uaHRtbDtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwcml2YXRlIGluc2VydFRlbXBsYXRlSW50b1RlbXBsYXRlKFxuICAgIHJvb3RUZW1wbGF0ZUhUTUw6IHN0cmluZyxcbiAgICB0ZW1wbGF0ZUtleTogc3RyaW5nLFxuICAgIGNoaWxkVGVtcGxhdGVIVE1MOiBzdHJpbmcsXG4gICAgbWFnaWNLZXk6IHN0cmluZyxcbiAgICBpc0FycmF5OiBib29sZWFuXG4gICk6IHN0cmluZyB7XG4gICAgcm9vdFRlbXBsYXRlSFRNTCA9IHRoaXMuY3JlYXRlRWxlbVdyYXBwZXIoXG4gICAgICByb290VGVtcGxhdGVIVE1MLFxuICAgICAgdGVtcGxhdGVLZXksXG4gICAgICBtYWdpY0tleSxcbiAgICAgIGlzQXJyYXlcbiAgICApO1xuICAgIGNvbnN0IG1hc2sgPSBuZXcgUmVnRXhwKGAtPSR7dGVtcGxhdGVLZXl9LSR7bWFnaWNLZXl9PS1gLCBcImdcIik7XG4gICAgcm9vdFRlbXBsYXRlSFRNTCA9IHJvb3RUZW1wbGF0ZUhUTUwucmVwbGFjZShtYXNrLCBjaGlsZFRlbXBsYXRlSFRNTCk7XG4gICAgcmV0dXJuIHJvb3RUZW1wbGF0ZUhUTUw7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZUVsZW1XcmFwcGVyKFxuICAgIGh0bWxUZW1wbGF0ZTogc3RyaW5nLFxuICAgIHRlbXBsYXRlS2V5OiBzdHJpbmcsXG4gICAgbWFnaWNLZXk6IHN0cmluZyxcbiAgICBpc0FycmF5OiBib29sZWFuXG4gICkge1xuICAgIGNvbnN0IG1hc2sgPSBuZXcgUmVnRXhwKGAtPSR7dGVtcGxhdGVLZXl9PS1gLCBcImdcIik7XG4gICAgaWYgKGlzQXJyYXkpIHtcbiAgICAgIGh0bWxUZW1wbGF0ZSA9IGh0bWxUZW1wbGF0ZS5yZXBsYWNlKFxuICAgICAgICBtYXNrLFxuICAgICAgICBgPHNwYW4gaHlwbz1cIiR7bWFnaWNLZXl9XCI+LT0ke3RlbXBsYXRlS2V5fS0ke21hZ2ljS2V5fT0tLT0ke3RlbXBsYXRlS2V5fT0tPC9zcGFuPmBcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGh0bWxUZW1wbGF0ZSA9IGh0bWxUZW1wbGF0ZS5yZXBsYWNlKFxuICAgICAgICBtYXNrLFxuICAgICAgICBgPHNwYW4gaHlwbz1cIiR7bWFnaWNLZXl9XCI+LT0ke3RlbXBsYXRlS2V5fS0ke21hZ2ljS2V5fT0tPC9zcGFuPmBcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGh0bWxUZW1wbGF0ZTtcbiAgfVxuXG4gIHByaXZhdGUgY2xlYXJFbXRweUNvbXBvbmVudChodG1sOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGNvbnN0IHJlZ2V4ID0gLy09W2EteixBLVosMC05XSs9LS9nO1xuICAgIHJldHVybiBodG1sLnJlcGxhY2UocmVnZXgsIFwiXCIpO1xuICB9XG5cbiAgcHVibGljIHJlbmRlciA9IGFzeW5jICgpOiBQcm9taXNlPEhZUE8+ID0+IHtcbiAgICBjb25zdCB0aGF0ID0gdGhpcztcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwoXG4gICAgICB0aGlzLmNvbGxlY3RUZW1wbGF0ZXModGhpcywgXCJyb290XCIsIGZhbHNlKS50ZW1wbGF0ZXNQcm9taXNlc1xuICAgICkudGhlbigoYXJyYXlUZW1wbGF0ZXMpID0+IHtcbiAgICAgIGNvbnN0IG1hcFRlbXBsYXRlcyA9IHRoaXMuY29udmVydEFyclRlbXBsYXRlVG9NYXAoYXJyYXlUZW1wbGF0ZXMpO1xuICAgICAgbGV0IHJvb3RUZW1wbGF0ZUhUTUw6IHN0cmluZyA9XG4gICAgICAgIGFycmF5VGVtcGxhdGVzW2FycmF5VGVtcGxhdGVzLmxlbmd0aCAtIDFdLmh0bWw7XG4gICAgICBmb3IgKGxldCBpID0gYXJyYXlUZW1wbGF0ZXMubGVuZ3RoIC0gMjsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgbGV0IHRlbXBsYXRlID1cbiAgICAgICAgICBtYXBUZW1wbGF0ZXNbXG4gICAgICAgICAgICBgJHthcnJheVRlbXBsYXRlc1tpXS50ZW1wbGF0ZUtleX0tJHthcnJheVRlbXBsYXRlc1tpXS5tYWdpY0tleX1gXG4gICAgICAgICAgXTtcbiAgICAgICAgcm9vdFRlbXBsYXRlSFRNTCA9IHRoaXMuaW5zZXJ0VGVtcGxhdGVJbnRvVGVtcGxhdGUoXG4gICAgICAgICAgcm9vdFRlbXBsYXRlSFRNTCxcbiAgICAgICAgICBhcnJheVRlbXBsYXRlc1tpXS50ZW1wbGF0ZUtleSxcbiAgICAgICAgICB0ZW1wbGF0ZSxcbiAgICAgICAgICBhcnJheVRlbXBsYXRlc1tpXS5tYWdpY0tleSxcbiAgICAgICAgICBhcnJheVRlbXBsYXRlc1tpXS5pc0FycmF5XG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIHJvb3RUZW1wbGF0ZUhUTUwgPSB0aGlzLmNsZWFyRW10cHlDb21wb25lbnQocm9vdFRlbXBsYXRlSFRNTCk7XG5cbiAgICAgIGlmICh0aGlzLnJlbmRlclRvKSB7XG4gICAgICAgIHRoaXMucmVuZGVyVG8uaW5uZXJIVE1MID0gcm9vdFRlbXBsYXRlSFRNTDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGVsZW0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbaHlwbz1cIiR7dGhpcy5tYWdpY0tleX1cIl1gKTtcbiAgICAgICAgaWYgKGVsZW0pIHtcbiAgICAgICAgICB0aGlzLnJlbmRlclRvID0gZWxlbSBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgICBlbGVtLmlubmVySFRNTCA9IHJvb3RUZW1wbGF0ZUhUTUw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMuYWZ0ZXJSZW5kZXJDYWxsYmFja0Fyci5mb3JFYWNoKChjYWxsYmFjaykgPT4ge1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLnRlbXBsYXRlc1Byb21pc2VzID0gW107XG4gICAgICByZXR1cm4gdGhhdDtcbiAgICB9KTtcbiAgfTtcblxuICBwcml2YXRlIHJlcmVuZGVyKCkge1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBwdWJsaWMgZ2V0U3RhdGUoKTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4ge1xuICAgIHRoaXMuc3RvcmUgPSB0aGlzLmNyZWF0ZVN0b3JlKHRoaXMuZGF0YSk7XG4gICAgcmV0dXJuIHRoaXMuc3RvcmU7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZVN0b3JlKHN0b3JlOiBhbnkpIHtcbiAgICBjb25zdCB0aGF0ID0gdGhpcztcbiAgICBjb25zdCBoYW5kbGVyOiBQcm94eUhhbmRsZXI8UmVjb3JkPHN0cmluZywgdW5rbm93bj4+ID0ge1xuICAgICAgZ2V0KHRhcmdldCwgcHJvcGVydHkpIHtcbiAgICAgICAgcmV0dXJuIHRhcmdldFs8c3RyaW5nPnByb3BlcnR5XTtcbiAgICAgIH0sXG4gICAgICBzZXQodGFyZ2V0LCBwcm9wZXJ0eSwgdmFsdWUpIHtcbiAgICAgICAgdGFyZ2V0WzxzdHJpbmc+cHJvcGVydHldID0gdmFsdWU7XG4gICAgICAgIHRoYXQucmVyZW5kZXIoKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9LFxuICAgIH07XG4gICAgc3RvcmUgPSBuZXcgUHJveHkoc3RvcmUsIGhhbmRsZXIpO1xuXG4gICAgT2JqZWN0LmtleXMoc3RvcmUpLmZvckVhY2goKGZpZWxkKSA9PiB7XG4gICAgICBpZiAodHlwZW9mIHN0b3JlW2ZpZWxkXSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICBzdG9yZVtmaWVsZF0gPSBuZXcgUHJveHkoc3RvcmVbZmllbGRdLCBoYW5kbGVyKTtcbiAgICAgICAgdGhpcy5jcmVhdGVTdG9yZShzdG9yZVtmaWVsZF0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHN0b3JlO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXREYXRhV2l0aG91dEllcmFyaHkoZGF0YTogYW55KSB7XG4gICAgbGV0IHBhdGhBcnI6IHN0cmluZ1tdID0gW107XG4gICAgbGV0IHJlc3VsdE9iamVjdDogYW55ID0ge307XG4gICAgZnVuY3Rpb24gZm56KG9iajogYW55KSB7XG4gICAgICBmb3IgKGxldCBrZXkgaW4gb2JqKSB7XG4gICAgICAgIHBhdGhBcnIucHVzaChrZXkpO1xuICAgICAgICBpZiAodHlwZW9mIG9ialtrZXldID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgZm56KG9ialtrZXldKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXN1bHRPYmplY3RbcGF0aEFyci5qb2luKFwiLlwiKV0gPSBvYmpba2V5XTtcbiAgICAgICAgICBwYXRoQXJyLnBvcCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBwYXRoQXJyLnBvcCgpO1xuICAgIH1cbiAgICBmbnooZGF0YSk7XG5cbiAgICByZXR1cm4gcmVzdWx0T2JqZWN0O1xuICB9XG5cbiAgcHVibGljIGFmdGVyUmVuZGVyKGNhbGxiYWNrOiAoKSA9PiB2b2lkKTogSFlQTyB7XG4gICAgdGhpcy5hZnRlclJlbmRlckNhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBwdWJsaWMgaGlkZSgpIHtcbiAgICBpZiAodGhpcy5yZW5kZXJUbykge1xuICAgICAgbGV0IGNoaWxkcmVuO1xuXG4gICAgICBjaGlsZHJlbiA9IHRoaXMucmVuZGVyVG8uY2hpbGRyZW47XG4gICAgICBpZiAoY2hpbGRyZW4pIHtcbiAgICAgICAgZm9yIChsZXQgY2hpbGQgb2YgY2hpbGRyZW4pIHtcbiAgICAgICAgICBjaGlsZC5yZW1vdmUoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHsgSFlQTyB9IGZyb20gXCIuLi9IWVBPL0hZUE9cIjtcblxuY2xhc3MgUm91dGUge1xuICBwcml2YXRlIF9wYXRobmFtZTogc3RyaW5nID0gXCJcIjtcbiAgcHJpdmF0ZSBfYmxvY2s/OiAocmVzdWx0PzogYW55KSA9PiBIWVBPO1xuICBwcml2YXRlIF9wcm9wczogUmVjb3JkPHN0cmluZywgdW5rbm93bj47XG4gIGFzeW5jRk4/OiAoKSA9PiBQcm9taXNlPGFueT47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcGF0aG5hbWU6IHN0cmluZyxcbiAgICB2aWV3OiAoKSA9PiBIWVBPLFxuICAgIHByb3BzOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPixcbiAgICBhc3luY0ZOPzogKCkgPT4gUHJvbWlzZTxhbnk+XG4gICkge1xuICAgIHRoaXMuX3BhdGhuYW1lID0gcGF0aG5hbWU7XG4gICAgdGhpcy5fcHJvcHMgPSBwcm9wcztcbiAgICB0aGlzLl9ibG9jayA9IHZpZXc7XG4gICAgdGhpcy5hc3luY0ZOID0gYXN5bmNGTjtcbiAgfVxuXG4gIG5hdmlnYXRlKHBhdGhuYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5tYXRjaChwYXRobmFtZSkpIHtcbiAgICAgIHRoaXMuX3BhdGhuYW1lID0gcGF0aG5hbWU7XG4gICAgICB0aGlzLnJlbmRlcigpO1xuICAgIH1cbiAgfVxuXG4gIGxlYXZlKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9ibG9jaykge1xuICAgICAgdGhpcy5fYmxvY2soKS5oaWRlKCk7XG4gICAgfVxuICB9XG5cbiAgbWF0Y2gocGF0aG5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBpc0VxdWFsKHBhdGhuYW1lLCB0aGlzLl9wYXRobmFtZSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgaWYgKCF0aGlzLl9ibG9jaykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy5hc3luY0ZOKSB7XG4gICAgICB0aGlzLmFzeW5jRk4oKS50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgdGhpcy5fYmxvY2s/LihyZXN1bHQpLnJlbmRlcigpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2Jsb2NrKCkucmVuZGVyKCk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBSb3V0ZXIge1xuICBwcml2YXRlIF9faW5zdGFuY2U6IFJvdXRlciA9IHRoaXM7XG4gIHJvdXRlczogUm91dGVbXSA9IFtdO1xuICBwcml2YXRlIGhpc3Rvcnk6IEhpc3RvcnkgPSB3aW5kb3cuaGlzdG9yeTtcbiAgcHJpdmF0ZSBfY3VycmVudFJvdXRlOiBSb3V0ZSB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIF9yb290UXVlcnk6IHN0cmluZyA9IFwiXCI7XG4gIHByaXZhdGUgYXN5bmNGTj86ICgpID0+IFByb21pc2U8YW55PjtcblxuICBjb25zdHJ1Y3Rvcihyb290UXVlcnk6IHN0cmluZykge1xuICAgIGlmICh0aGlzLl9faW5zdGFuY2UpIHtcbiAgICAgIHJldHVybiB0aGlzLl9faW5zdGFuY2U7XG4gICAgfVxuICAgIHRoaXMuX3Jvb3RRdWVyeSA9IHJvb3RRdWVyeTtcbiAgfVxuXG4gIHVzZShcbiAgICBwYXRobmFtZTogc3RyaW5nLFxuICAgIGJsb2NrOiAocmVzdWx0PzogYW55KSA9PiBIWVBPLFxuICAgIGFzeW5jRk4/OiAoKSA9PiBQcm9taXNlPGFueT5cbiAgKTogUm91dGVyIHtcbiAgICBjb25zdCByb3V0ZSA9IG5ldyBSb3V0ZShcbiAgICAgIHBhdGhuYW1lLFxuICAgICAgYmxvY2ssXG4gICAgICB7IHJvb3RRdWVyeTogdGhpcy5fcm9vdFF1ZXJ5IH0sXG4gICAgICBhc3luY0ZOXG4gICAgKTtcbiAgICB0aGlzLnJvdXRlcy5wdXNoKHJvdXRlKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHN0YXJ0KCk6IFJvdXRlciB7XG4gICAgd2luZG93Lm9ucG9wc3RhdGUgPSAoXzogUG9wU3RhdGVFdmVudCkgPT4ge1xuICAgICAgbGV0IG1hc2sgPSBuZXcgUmVnRXhwKFwiI1wiLCBcImdcIik7XG4gICAgICBjb25zdCB1cmwgPSB3aW5kb3cubG9jYXRpb24uaGFzaC5yZXBsYWNlKG1hc2ssIFwiXCIpO1xuICAgICAgdGhpcy5fb25Sb3V0ZSh1cmwpO1xuICAgIH07XG4gICAgbGV0IG1hc2sgPSBuZXcgUmVnRXhwKFwiI1wiLCBcImdcIik7XG4gICAgY29uc3QgdXJsID0gd2luZG93LmxvY2F0aW9uLmhhc2gucmVwbGFjZShtYXNrLCBcIlwiKSB8fCBcIi9cIjtcbiAgICB0aGlzLl9vblJvdXRlKHVybCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBfb25Sb3V0ZShwYXRobmFtZTogc3RyaW5nKTogdm9pZCB7XG4gICAgY29uc3Qgcm91dGUgPSB0aGlzLmdldFJvdXRlKHBhdGhuYW1lKTtcbiAgICBpZiAoIXJvdXRlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0aGlzLl9jdXJyZW50Um91dGUpIHtcbiAgICAgIHRoaXMuX2N1cnJlbnRSb3V0ZS5sZWF2ZSgpO1xuICAgIH1cbiAgICB0aGlzLl9jdXJyZW50Um91dGUgPSByb3V0ZTtcbiAgICB0aGlzLl9jdXJyZW50Um91dGUucmVuZGVyKCk7XG4gIH1cblxuICBnbyhwYXRobmFtZTogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5oaXN0b3J5LnB1c2hTdGF0ZSh7fSwgXCJcIiwgYCMke3BhdGhuYW1lfWApO1xuICAgIHRoaXMuX29uUm91dGUocGF0aG5hbWUpO1xuICB9XG5cbiAgYmFjaygpOiB2b2lkIHtcbiAgICB0aGlzLmhpc3RvcnkuYmFjaygpO1xuICB9XG5cbiAgZm9yd2FyZCgpOiB2b2lkIHtcbiAgICB0aGlzLmhpc3RvcnkuZm9yd2FyZCgpO1xuICB9XG5cbiAgZ2V0Um91dGUocGF0aG5hbWU6IHN0cmluZyk6IFJvdXRlIHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gdGhpcy5yb3V0ZXMuZmluZCgocm91dGUpID0+IHJvdXRlLm1hdGNoKHBhdGhuYW1lKSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaXNFcXVhbChsaHM6IHVua25vd24sIHJoczogdW5rbm93bikge1xuICByZXR1cm4gbGhzID09PSByaHM7XG59XG4iLCJjb25zdCBNRVRIT0RTID0ge1xuICBHRVQ6IFwiR0VUXCIsXG4gIFBVVDogXCJQVVRcIixcbiAgUE9TVDogXCJQT1NUXCIsXG4gIERFTEVURTogXCJERUxFVEVcIixcbn07XG5cbmNvbnN0IERPTUVOID0gXCJodHRwczovL3lhLXByYWt0aWt1bS50ZWNoL2FwaS92MlwiO1xuXG5jbGFzcyBIVFRQVHJhbnNwb3J0Q2xhc3Mge1xuICBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgICBoZWFkZXJzOiB7fSxcbiAgICBkYXRhOiB7fSxcbiAgfTtcblxuICBHRVQgPSAoXG4gICAgdXJsOiBzdHJpbmcsXG4gICAgb3B0aW9uczogeyBba2V5OiBzdHJpbmddOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IH0gPSB0aGlzLmRlZmF1bHRPcHRpb25zXG4gICkgPT4ge1xuICAgIGNvbnN0IHJlcXVlc3RQYXJhbXMgPSBxdWVyeVN0cmluZ2lmeShvcHRpb25zLmRhdGEpO1xuICAgIHVybCArPSByZXF1ZXN0UGFyYW1zO1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QoXG4gICAgICB1cmwsXG4gICAgICB7IC4uLm9wdGlvbnMsIG1ldGhvZDogTUVUSE9EUy5HRVQgfSxcbiAgICAgIE51bWJlcihvcHRpb25zLnRpbWVvdXQpIHx8IDUwMDBcbiAgICApO1xuICB9O1xuXG4gIFBVVCA9IChcbiAgICB1cmw6IHN0cmluZyxcbiAgICBvcHRpb25zOiB7IFtrZXk6IHN0cmluZ106IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gfSA9IHRoaXMuZGVmYXVsdE9wdGlvbnNcbiAgKSA9PiB7XG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdChcbiAgICAgIHVybCxcbiAgICAgIHsgLi4ub3B0aW9ucywgbWV0aG9kOiBNRVRIT0RTLlBVVCB9LFxuICAgICAgTnVtYmVyKG9wdGlvbnMudGltZW91dCkgfHwgNTAwMFxuICAgICk7XG4gIH07XG5cbiAgUE9TVCA9IChcbiAgICB1cmw6IHN0cmluZyxcbiAgICBvcHRpb25zOiB7IFtrZXk6IHN0cmluZ106IFJlY29yZDxzdHJpbmcsIHN0cmluZyB8IG51bWJlcj4gfSA9IHRoaXNcbiAgICAgIC5kZWZhdWx0T3B0aW9uc1xuICApID0+IHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KFxuICAgICAgdXJsLFxuICAgICAgeyAuLi5vcHRpb25zLCBtZXRob2Q6IE1FVEhPRFMuUE9TVCB9LFxuICAgICAgTnVtYmVyKG9wdGlvbnMudGltZW91dCkgfHwgNTAwMFxuICAgICk7XG4gIH07XG5cbiAgREVMRVRFID0gKFxuICAgIHVybDogc3RyaW5nLFxuICAgIG9wdGlvbnM6IHsgW2tleTogc3RyaW5nXTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiB9ID0gdGhpcy5kZWZhdWx0T3B0aW9uc1xuICApID0+IHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KFxuICAgICAgdXJsLFxuICAgICAgeyAuLi5vcHRpb25zLCBtZXRob2Q6IE1FVEhPRFMuREVMRVRFIH0sXG4gICAgICBOdW1iZXIob3B0aW9ucy50aW1lb3V0KSB8fCA1MDAwXG4gICAgKTtcbiAgfTtcblxuICBzb2NrZXQgPSAodXJsOiBzdHJpbmcpID0+IHtcbiAgICByZXR1cm4gbmV3IFdlYlNvY2tldCh1cmwpO1xuICB9O1xuXG4gIHJlcXVlc3QgPSAoXG4gICAgdXJsOiBzdHJpbmcsXG4gICAgb3B0aW9uczogeyBba2V5OiBzdHJpbmddOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IH0gfCBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+LFxuICAgIHRpbWVvdXQ6IG51bWJlciA9IDUwMDBcbiAgKSA9PiB7XG4gICAgdXJsID0gRE9NRU4gKyB1cmw7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPGFueT4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICB4aHIud2l0aENyZWRlbnRpYWxzID0gdHJ1ZTtcbiAgICAgIHhoci5vcGVuKDxzdHJpbmc+b3B0aW9ucy5tZXRob2QsIHVybCk7XG4gICAgICBjb25zdCBoZWFkZXJzID0gb3B0aW9ucy5oZWFkZXJzO1xuICAgICAgZm9yIChsZXQgaGVhZGVyIGluIGhlYWRlcnMgYXMgUmVjb3JkPHN0cmluZywgc3RyaW5nPikge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGhlYWRlcnNbaGVhZGVyIGFzIGtleW9mIHR5cGVvZiBoZWFkZXJzXSBhcyBzdHJpbmc7XG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKGhlYWRlciwgdmFsdWUpO1xuICAgICAgfVxuICAgICAgeGhyLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgcmVzb2x2ZSh4aHIpO1xuICAgICAgfTtcbiAgICAgIHhoci5vbmVycm9yID0gKGUpID0+IHtcbiAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgfTtcbiAgICAgIHhoci5vbmFib3J0ID0gKGUpID0+IHtcbiAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgfTtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB4aHIuYWJvcnQoKTtcbiAgICAgIH0sIHRpbWVvdXQpO1xuXG4gICAgICB4aHIuc2VuZChKU09OLnN0cmluZ2lmeShvcHRpb25zLmRhdGEpKTtcbiAgICB9KTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gcXVlcnlTdHJpbmdpZnkoZGF0YTogUmVjb3JkPHN0cmluZywgc3RyaW5nPikge1xuICBsZXQgcmVxdWVzdFBhcmFtcyA9IFwiP1wiO1xuICBmb3IgKGxldCBrZXkgaW4gZGF0YSkge1xuICAgIHJlcXVlc3RQYXJhbXMgKz0gYCR7a2V5fT0ke2RhdGFba2V5XX0mYDtcbiAgfVxuICByZXF1ZXN0UGFyYW1zID0gcmVxdWVzdFBhcmFtcy5zdWJzdHJpbmcoMCwgcmVxdWVzdFBhcmFtcy5sZW5ndGggLSAxKTtcbiAgcmV0dXJuIHJlcXVlc3RQYXJhbXM7XG59XG5cbmV4cG9ydCBjb25zdCBIVFRQVHJhbnNwb3J0ID0gKCgpOiB7IGdldEluc3RhbmNlOiAoKSA9PiBIVFRQVHJhbnNwb3J0Q2xhc3MgfSA9PiB7XG4gIGxldCBpbnN0YW5jZTogSFRUUFRyYW5zcG9ydENsYXNzO1xuICByZXR1cm4ge1xuICAgIGdldEluc3RhbmNlOiAoKSA9PiBpbnN0YW5jZSB8fCAoaW5zdGFuY2UgPSBuZXcgSFRUUFRyYW5zcG9ydENsYXNzKCkpLFxuICB9O1xufSkoKTtcbiIsImltcG9ydCB7IEhZUE8gfSBmcm9tIFwiLi4vLi4vSFlQT1wiO1xuXG5leHBvcnQgY29uc3QgRW1haWxWYWxpZGF0b3IgPSB7XG4gIHZhbHVlOiBcIlwiLFxuICBjaGVja0Z1bmM6IGZ1bmN0aW9uICh2YWx1ZTogc3RyaW5nKSB7XG4gICAgdmFyIHJlZyA9IC9eKFtBLVphLXowLTlfXFwtXFwuXSkrXFxAKFtBLVphLXowLTlfXFwtXFwuXSkrXFwuKFtBLVphLXpdezIsNH0pJC87XG4gICAgaWYgKCFyZWcudGVzdCh2YWx1ZSkpIHtcbiAgICAgIHRoaXMudmFsdWUgPSBcIlwiO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0sXG4gIGNhbGxiYWNrOiAoZWxlbTogSFlQTywgY2hlY2tSZXN1bHQ6IGJvb2xlYW4pID0+IHtcbiAgICBsZXQgc3RhdGUgPSBlbGVtLmdldFN0YXRlKCk7XG4gICAgaWYgKCFjaGVja1Jlc3VsdCkge1xuICAgICAgc3RhdGUubWVzc2FnZSA9IFwi4puUINGN0YLQviDQvdC1INC/0L7RhdC+0LbQtSDQvdCwINCw0LTRgNC10YEg0Y3Qu9C10LrRgtGA0L7QvdC90L7QuSDQv9C+0YfRgtGLXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0YXRlLm1lc3NhZ2UgPSBcIlwiO1xuICAgIH1cbiAgfSxcbn07XG4iLCJpbXBvcnQgeyBIWVBPIH0gZnJvbSBcIi4uLy4uL0hZUE9cIjtcblxuZXhwb3J0IGNvbnN0IFJlcXVpcmVkID0ge1xuICB2YWx1ZTogXCJcIixcbiAgY2hlY2tGdW5jOiBmdW5jdGlvbiAodmFsdWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIGlmICh2YWx1ZSA9PT0gXCJcIikge1xuICAgICAgdGhpcy52YWx1ZSA9IFwiXCI7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSxcbiAgY2FsbGJhY2s6IChlbGVtOiBIWVBPLCBjaGVja1Jlc3VsdDogYm9vbGVhbikgPT4ge1xuICAgIGxldCBzdGF0ZSA9IGVsZW0uZ2V0U3RhdGUoKTtcbiAgICBpZiAoIWNoZWNrUmVzdWx0KSB7XG4gICAgICBzdGF0ZS5tZXNzYWdlID0gXCLim5Qg0L7QsdGP0LfQsNGC0LXQu9GM0L3QvtC1INC/0L7Qu9C1XCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0YXRlLm1lc3NhZ2UgPSBcIlwiO1xuICAgIH1cbiAgfSxcbn07IiwiZXhwb3J0IGZ1bmN0aW9uIHV1aWR2NCgpIHtcbiAgcmV0dXJuIFwieHh4eHh4eHgteHh4eC00eHh4LXl4eHgteHh4eHh4eHh4eHh4XCIucmVwbGFjZSgvW3h5XS9nLCBmdW5jdGlvbiAoYykge1xuICAgIHZhciByID0gKE1hdGgucmFuZG9tKCkgKiAxNikgfCAwLFxuICAgICAgdiA9IGMgPT0gXCJ4XCIgPyByIDogKHIgJiAweDMpIHwgMHg4O1xuICAgIHJldHVybiBgJHt2LnRvU3RyaW5nKDE2KX1gO1xuICB9KTtcbn0iLCJpbXBvcnQgeyBMb2dpbkxheW91dCB9IGZyb20gXCIuLi9VSS9MYXlvdXRzL0xvZ2luXCI7XG5pbXBvcnQgeyBDaGF0TGF5b3V0IH0gZnJvbSBcIi4uL1VJL0xheW91dHMvQ2hhdFwiO1xuaW1wb3J0IHsgUmVnaXN0cmF0aW9uTGF5b3V0IH0gZnJvbSBcIi4uL1VJL0xheW91dHMvUmVnaXN0cmF0aW9uXCI7XG5pbXBvcnQgeyBQcm9maWxlTGF5b3V0IH0gZnJvbSBcIi4uL1VJL0xheW91dHMvUHJvZmlsZVwiO1xuaW1wb3J0IHsgQ2hhbmdlUHJvZmlsZSB9IGZyb20gXCIuLi9VSS9MYXlvdXRzL0NoYW5nZVByb2ZpbGVcIjtcbmltcG9ydCB7IENoYW5nZVBhc3N3b3JkIH0gZnJvbSBcIi4uL1VJL0xheW91dHMvQ2hhbmdlUGFzc3dvcmRcIjtcbmltcG9ydCB7IFJvdXRlciB9IGZyb20gXCIuLi9saWJzL1JvdXRlclwiO1xuaW1wb3J0IHsgSFRUUFRyYW5zcG9ydCB9IGZyb20gXCIuLi9saWJzL1RyYW5zcG9ydFwiO1xuaW1wb3J0IHsgSUNoYXRWaWV3TW9kZWwgfSBmcm9tIFwiLi4vVmlld01vZGVsL0NoYXRWaWV3TW9kZWxcIjtcbmltcG9ydCB7IFZJRVdfTU9ERUwgfSBmcm9tIFwiLi4vVmlld01vZGVsXCI7XG5pbXBvcnQgeyBDb250YWluZXIgfSBmcm9tIFwiLi4vbGlicy9Db250YWluZXJcIjtcbmltcG9ydCB7IElVc2VyVmlld01vZGVsIH0gZnJvbSBcIi4uL1ZpZXdNb2RlbC9Vc2VyVmlld01vZGVsXCI7XG5cbmV4cG9ydCBjb25zdCBSb3V0ZXJJbml0ID0gKGNvbnRhaW5lcjogQ29udGFpbmVyKTogUm91dGVyID0+IHtcbiAgcmV0dXJuIG5ldyBSb3V0ZXIoXCIjcm9vdFwiKVxuICAgIC51c2UoXCIvXCIsIExvZ2luTGF5b3V0LCAoKSA9PiB7XG4gICAgICByZXR1cm4gSFRUUFRyYW5zcG9ydC5nZXRJbnN0YW5jZSgpXG4gICAgICAgIC5HRVQoXCIvYXV0aC91c2VyXCIpXG4gICAgICAgIC50aGVuKCh1c2VyKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UodXNlci5yZXNwb25zZSk7XG4gICAgICAgIH0pO1xuICAgIH0pXG4gICAgLnVzZShcIi9yZWdpc3RyYXRpb25cIiwgUmVnaXN0cmF0aW9uTGF5b3V0KVxuICAgIC51c2UoXCIvY2hhdFwiLCBDaGF0TGF5b3V0LCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBjaGF0Vmlld01vZGVsID0gY29udGFpbmVyLmdldDxJQ2hhdFZpZXdNb2RlbD4oVklFV19NT0RFTC5DSEFUKTtcbiAgICAgIGF3YWl0IGNoYXRWaWV3TW9kZWwuZ2V0Q2hhdHMoKTtcbiAgICAgIHJldHVybiBjaGF0Vmlld01vZGVsLmNoYXRzO1xuICAgICAgcmV0dXJuIEhUVFBUcmFuc3BvcnQuZ2V0SW5zdGFuY2UoKVxuICAgICAgICAuR0VUKFwiL2NoYXRzXCIpXG4gICAgICAgIC50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgICBjb25zdCByZXNwID0gSlNPTi5wYXJzZShyZXN1bHQucmVzcG9uc2UpO1xuICAgICAgICAgIHJldHVybiByZXNwO1xuICAgICAgICB9KTtcbiAgICB9KVxuICAgIC51c2UoXCIvcHJvZmlsZVwiLCBQcm9maWxlTGF5b3V0LCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyByZXR1cm4gSFRUUFRyYW5zcG9ydC5nZXRJbnN0YW5jZSgpXG4gICAgICAvLyAgIC5HRVQoXCIvYXV0aC91c2VyXCIpXG4gICAgICAvLyAgIC50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgIC8vICAgICBjb25zdCByZXNwID0gSlNPTi5wYXJzZShyZXN1bHQucmVzcG9uc2UpO1xuICAgICAgLy8gICAgIHJldHVybiByZXNwO1xuICAgICAgLy8gICB9KTtcbiAgICAgIGNvbnN0IHVzZXJWaWV3TW9kZWwgPSBjb250YWluZXIuZ2V0PElVc2VyVmlld01vZGVsPihWSUVXX01PREVMLlVTRVIpO1xuICAgICAgYXdhaXQgdXNlclZpZXdNb2RlbC5nZXRVc2VyKCk7XG4gICAgICByZXR1cm4gdXNlclZpZXdNb2RlbC51c2VyO1xuICAgIH0pXG4gICAgLnVzZShcIi9lZGl0cHJvZmlsZVwiLCBDaGFuZ2VQcm9maWxlLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCB1c2VyVmlld01vZGVsID0gY29udGFpbmVyLmdldDxJVXNlclZpZXdNb2RlbD4oVklFV19NT0RFTC5VU0VSKTtcbiAgICAgIGF3YWl0IHVzZXJWaWV3TW9kZWwuZ2V0VXNlcigpO1xuICAgICAgcmV0dXJuIHVzZXJWaWV3TW9kZWwudXNlcjtcbiAgICB9KVxuICAgIC51c2UoXCIvZWRpdHBhc3N3b3JkXCIsIENoYW5nZVBhc3N3b3JkKVxuICAgIC5zdGFydCgpO1xufTtcbiIsImV4cG9ydCBmdW5jdGlvbiBtZW1vaXplKGZ1bmMsIHJlc29sdmVyKSB7XG4gIGlmIChcbiAgICB0eXBlb2YgZnVuYyAhPSBcImZ1bmN0aW9uXCIgfHxcbiAgICAocmVzb2x2ZXIgIT0gbnVsbCAmJiB0eXBlb2YgcmVzb2x2ZXIgIT0gXCJmdW5jdGlvblwiKVxuICApIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEZVTkNfRVJST1JfVEVYVCk7XG4gIH1cbiAgdmFyIG1lbW9pemVkID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBhcmdzID0gYXJndW1lbnRzLFxuICAgICAga2V5ID0gcmVzb2x2ZXIgPyByZXNvbHZlci5hcHBseSh0aGlzLCBhcmdzKSA6IGFyZ3NbMF0sXG4gICAgICBjYWNoZSA9IG1lbW9pemVkLmNhY2hlO1xuXG4gICAgaWYgKGNhY2hlLmhhcyhrZXkpKSB7XG4gICAgICByZXR1cm4gY2FjaGUuZ2V0KGtleSk7XG4gICAgfVxuICAgIHZhciByZXN1bHQgPSBmdW5jLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIG1lbW9pemVkLmNhY2hlID0gY2FjaGUuc2V0KGtleSwgcmVzdWx0KSB8fCBjYWNoZTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuICBtZW1vaXplZC5jYWNoZSA9IG5ldyAobWVtb2l6ZS5DYWNoZSB8fCBNYXBDYWNoZSkoKTtcbiAgcmV0dXJuIG1lbW9pemVkO1xufVxuXG5tZW1vaXplLkNhY2hlID0gTWFwO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0aWYoX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSkge1xuXHRcdHJldHVybiBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxuX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2luZGV4LnRzXCIpO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==