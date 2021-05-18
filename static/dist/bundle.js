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
const ChangeProfile = (data) => {
    return new HYPO_1.HYPO({
        renderTo: document.getElementById("root") || document.body,
        templatePath: "changeProfile.template.html",
        data: {
            email: data === null || data === void 0 ? void 0 : data.email,
            login: data === null || data === void 0 ? void 0 : data.login,
            firstName: data === null || data === void 0 ? void 0 : data.first_name,
            secondName: data === null || data === void 0 ? void 0 : data.second_name,
            displayName: data === null || data === void 0 ? void 0 : data.display_name,
            phone: data === null || data === void 0 ? void 0 : data.phone,
        },
        children: {
            save: Button_1.Button({
                title: "Сохранить",
                className: "profile_edit__action__save",
                onClick: (e) => {
                    const userViewModel = __1.container.get(ViewModel_1.VIEW_MODEL.USER);
                    if (userViewModel.user) {
                        userViewModel.user.display_name = 'ivan';
                        userViewModel.saveUser(userViewModel.user);
                    }
                },
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
                    Transport_1.HTTPTransport.getInstance().POST("/auth/signup", data);
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
exports.ViewModelContainer.bind(exports.VIEW_MODEL.USER).toDynamicValue((container) => {
    const service = container.get(BussinesLayer_1.SERVICE.USER);
    return new UserViewModel_1.UserViewModel(service);
}).isSingletone();


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
const SingleToneContainers = new Map();
const SingleTonesInstances = new Map();
class Container {
    constructor() {
        this.containers = new Map();
        this.get = (id) => {
            const singleToneContainer = SingleToneContainers.get(id);
            if (singleToneContainer) {
                const instance = SingleTonesInstances.get(id);
                if (instance) {
                    return instance;
                }
                else {
                    SingleTonesInstances.set(id, singleToneContainer.fn(this));
                    return SingleTonesInstances.get(id);
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
        if (this.lastId)
            this.containers.set(this.lastId, { fn: fn, id: this.lastId });
        return this;
    }
    parent(container) {
        for (let cont of container.containers) {
            this.containers.set(cont[0], cont[1]);
        }
        return this;
    }
    isSingletone() {
        if (this.lastId) {
            const container = this.containers.get(this.lastId);
            SingleToneContainers.set(this.lastId, container);
        }
    }
}
exports.Container = Container;
// const VIEW_MODEL = {
//   Chat: Symbol.for("ChatViewModel"),
// };
// const SERVICE = {
//   CHAT: Symbol.for("ChatService"),
// };
// const ViewModelContainer = new Container();
// const ServiceContainer = new Container();
// class S {
//   constructor(public v: V) {}
//   x: number = 1;
// }
// class V {
//   y: number = 2;
// }
// ViewModelContainer.bind(VIEW_MODEL.Chat).toDynamicValue((container) => {
//   return new V();
// });
// ServiceContainer.bind(SERVICE.CHAT).toDynamicValue((container) => {
//   const viewModelContainer = container.get<V>(VIEW_MODEL.Chat);
//   return new S(viewModelContainer);
// });
// ServiceContainer.parent(ViewModelContainer);
// const service = ServiceContainer.get<S>(SERVICE.CHAT);
// console.log(service);
// const viewModel = ServiceContainer.get<V>(VIEW_MODEL.Chat);
// console.log(viewModel);


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
        .use("/profile", Profile_1.ProfileLayout, () => {
        return Transport_1.HTTPTransport.getInstance()
            .GET("/auth/user")
            .then((result) => {
            const resp = JSON.parse(result.response);
            return resp;
        });
    })
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9Cb290c3RyYXAvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvQnVzc2luZXNMYXllci9DaGF0U2VydmljZS50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9CdXNzaW5lc0xheWVyL1VzZXJTZXJ2aWNlLnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL0J1c3NpbmVzTGF5ZXIvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvSW5mcmFzdHNydWN0dXJlTGF5ZXIvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvSW5mcmFzdHNydWN0dXJlTGF5ZXIvaW50ZXJmYWNlcy50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9JbnRlZ3JhdGlvbmFsTGF5ZXIvQ2hhdEFQSS50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9JbnRlZ3JhdGlvbmFsTGF5ZXIvVXNlckFQSS50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9JbnRlZ3JhdGlvbmFsTGF5ZXIvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvVUkvQ29tcG9uZW50cy9BdHRlbnRpb25NZXNzYWdlL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL1VJL0NvbXBvbmVudHMvQnV0dG9uL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL1VJL0NvbXBvbmVudHMvQ2hhdEl0ZW0vaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvVUkvQ29tcG9uZW50cy9DcmVhdGVDaGF0TW9kYWwvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvVUkvQ29tcG9uZW50cy9EZWxldGUvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvVUkvQ29tcG9uZW50cy9FbXB0eS9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9VSS9Db21wb25lbnRzL0lucHV0L2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL1VJL0xheW91dHMvQ2hhbmdlUGFzc3dvcmQvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvVUkvTGF5b3V0cy9DaGFuZ2VQcm9maWxlL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL1VJL0xheW91dHMvQ2hhdC9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9VSS9MYXlvdXRzL0xvZ2luL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL1VJL0xheW91dHMvUHJvZmlsZS9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9VSS9MYXlvdXRzL1JlZ2lzdHJhdGlvbi9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9WaWV3TW9kZWwvQ2hhdFZpZXdNb2RlbC9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9WaWV3TW9kZWwvVXNlclZpZXdNb2RlbC9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9WaWV3TW9kZWwvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvbGlicy9Db250YWluZXIvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvbGlicy9IWVBPL0hZUE8udHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvbGlicy9Sb3V0ZXIvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvbGlicy9UcmFuc3BvcnQvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvbGlicy9WYWxpZGF0b3JzL0VtYWlsL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL2xpYnMvVmFsaWRhdG9ycy9SZXF1aXJlZC9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9saWJzL3V0aWxzL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL3JvdXRlci9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9saWJzL21vbWl6ZS9pbmRleC5qcyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4L3dlYnBhY2svc3RhcnR1cCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQ0EseUhBQWtFO0FBQ2xFLG1IQUEyRDtBQUMzRCxvR0FBb0Q7QUFDcEQsd0ZBQWtEO0FBRWxELE1BQU0saUJBQWlCLEdBQUcsQ0FDeEIsdUJBQWtDLEVBQ2xDLHFCQUFnQyxFQUNoQyxnQkFBMkIsRUFDM0Isa0JBQTZCLEVBQzdCLEVBQUU7SUFDRixPQUFPLGtCQUFrQjtTQUN0QixNQUFNLENBQUMsZ0JBQWdCLENBQUM7U0FDeEIsTUFBTSxDQUFDLHFCQUFxQixDQUFDO1NBQzdCLE1BQU0sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBQ3JDLENBQUMsQ0FBQztBQUVGLE1BQWEsU0FBUztJQUVwQjtRQUNFLElBQUksQ0FBQyxTQUFTLEdBQUcsaUJBQWlCLENBQ2hDLDhDQUF1QixFQUN2Qix1Q0FBa0IsRUFDbEIsZ0NBQWdCLEVBQ2hCLDhCQUFrQixDQUNuQixDQUFDO0lBQ0osQ0FBQztDQUNGO0FBVkQsOEJBVUM7Ozs7Ozs7Ozs7Ozs7O0FDbkJELE1BQWEsV0FBVztJQUN0QixZQUFzQixTQUF5QjtRQUF6QixjQUFTLEdBQVQsU0FBUyxDQUFnQjtRQUUvQyxhQUFRLEdBQUcsR0FBNkIsRUFBRTtZQUN4QyxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDbkMsQ0FBQyxDQUFDO1FBRUYsYUFBUSxHQUFHLENBQUMsSUFBNEIsRUFBRSxFQUFFO1lBQzFDLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdkMsQ0FBQyxDQUFDO0lBUmdELENBQUM7SUFVbkQsVUFBVSxDQUFDLE1BQWM7UUFDdkIsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMzQyxDQUFDO0NBQ0Y7QUFkRCxrQ0FjQzs7Ozs7Ozs7Ozs7Ozs7QUNmRCxNQUFhLFdBQVc7SUFDdEIsWUFBc0IsU0FBeUI7UUFBekIsY0FBUyxHQUFULFNBQVMsQ0FBZ0I7SUFBRyxDQUFDO0lBQ25ELFFBQVEsQ0FBQyxJQUFnQjtRQUN2QixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztJQUN0QyxDQUFDO0lBQ0QsT0FBTztRQUNMLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUNsQyxDQUFDO0NBQ0Y7QUFSRCxrQ0FRQzs7Ozs7Ozs7Ozs7Ozs7QUNoQkQsbUhBQW1EO0FBR25ELGtHQUE4QztBQUM5QyxxR0FBNEM7QUFDNUMscUdBQTRDO0FBRS9CLGVBQU8sR0FBRztJQUNyQixJQUFJLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUM7SUFDL0IsSUFBSSxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDO0NBQ2hDLENBQUM7QUFFVyx3QkFBZ0IsR0FBRyxJQUFJLHFCQUFTLEVBQUUsQ0FBQztBQUVoRCx3QkFBZ0IsQ0FBQyxJQUFJLENBQUMsZUFBTyxDQUFDLElBQUksQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxFQUFFO0lBQy9ELE1BQU0sU0FBUyxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQWlCLCtCQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDakUsT0FBTyxJQUFJLHlCQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDcEMsQ0FBQyxDQUFDLENBQUM7QUFFSCx3QkFBZ0IsQ0FBQyxJQUFJLENBQUMsZUFBTyxDQUFDLElBQUksQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxFQUFFO0lBQy9ELE1BQU0sU0FBUyxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQWlCLCtCQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDakUsT0FBTyxJQUFJLHlCQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDcEMsQ0FBQyxDQUFDLENBQUM7Ozs7Ozs7Ozs7Ozs7O0FDdEJILGtHQUE4QztBQUM5Qyx5R0FBeUM7QUFFNUIsMEJBQWtCLEdBQUc7SUFDaEMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDO0NBQzdCLENBQUM7QUFFVywrQkFBdUIsR0FBRyxJQUFJLHFCQUFTLEVBQUUsQ0FBQztBQUV2RCwrQkFBdUI7S0FDcEIsSUFBSSxDQUFDLDBCQUFrQixDQUFDLFNBQVMsQ0FBQztLQUNsQyxjQUFjLENBQUMsQ0FBQyxTQUFTLEVBQUUsRUFBRTtJQUM1QixPQUFPLElBQUksc0JBQVMsRUFBRSxDQUFDO0FBQ3pCLENBQUMsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2JMLGtHQUFrRDtBQVlsRCxNQUFhLFNBQVM7SUFDcEI7UUFDQSxZQUFPLEdBQUcsQ0FBSSxHQUFXLEVBQUUsSUFBNEIsRUFBYyxFQUFFO1lBQ3JFLE9BQU8seUJBQWEsQ0FBQyxXQUFXLEVBQUU7aUJBQy9CLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDN0IsSUFBSSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUU7Z0JBQ2YsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNyQyxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQztRQUVGLGFBQVEsR0FBRyxDQUNULEdBQVcsRUFDWCxJQUFPLEVBQ0ssRUFBRTtZQUNkLE9BQU8seUJBQWEsQ0FBQyxXQUFXLEVBQUU7aUJBQy9CLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDOUIsSUFBSSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUU7Z0JBQ2YsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNyQyxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsRUFBQztRQUVGLGVBQVUsR0FBRyxDQUFDLEdBQVcsRUFBRSxJQUE0QixFQUFpQixFQUFFO1lBQ3hFLE9BQU8seUJBQWEsQ0FBQyxXQUFXLEVBQUU7aUJBQy9CLE1BQU0sQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDaEMsSUFBSSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUU7Z0JBQ2YsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNyQyxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQztRQUVGLFlBQU8sR0FBRyxDQUFJLEdBQVcsRUFBRSxJQUE0QixFQUFjLEVBQUU7WUFDckUsT0FBTyx5QkFBYSxDQUFDLFdBQVcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ25FLENBQUMsQ0FBQztJQTlCYSxDQUFDO0lBZ0NSLFFBQVEsQ0FDZCxJQUFPO1FBRVAsT0FBTztZQUNMLE9BQU8sRUFBRTtnQkFDUCxjQUFjLEVBQUUsa0JBQWtCO2FBQ25DO1lBQ0QsSUFBSSxvQkFDQyxJQUFJLENBQ1I7U0FDRixDQUFDO0lBQ0osQ0FBQztDQUNGO0FBN0NELDhCQTZDQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNoREQsTUFBYSxhQUFhO0lBQ3hCLFlBQXNCLFNBQXFCO1FBQXJCLGNBQVMsR0FBVCxTQUFTLENBQVk7UUFFM0MsYUFBUSxHQUFHLEdBQW1DLEVBQUU7WUFDOUMsT0FBTyxNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFhLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQ2hFLENBQUMsTUFBTSxFQUFFLEVBQUU7Z0JBQ1QsT0FBTyxNQUFNLENBQUM7WUFDaEIsQ0FBQyxDQUNGLENBQUM7UUFDSixDQUFDLEVBQUM7UUFFRixhQUFRLEdBQUcsQ0FBTyxJQUE0QixFQUFpQixFQUFFO1lBQy9ELE1BQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2hELENBQUMsRUFBQztJQVo0QyxDQUFDO0lBYy9DLFVBQVUsQ0FBQyxFQUFVO1FBQ25CLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDN0QsQ0FBQztDQUNGO0FBbEJELHNDQWtCQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNuQkQsTUFBYSxhQUFhO0lBQ3hCLFlBQXNCLFNBQXFCO1FBQXJCLGNBQVMsR0FBVCxTQUFTLENBQVk7UUFFM0MsWUFBTyxHQUFHLEdBQVMsRUFBRTtZQUNuQixNQUFNLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFjLFlBQVksRUFBRSxFQUFFLENBQUMsQ0FBQztZQUN6RSxPQUFPLElBQUksQ0FBQztRQUNkLENBQUMsRUFBQztRQUVGLGFBQVEsR0FBRyxDQUFDLElBQWlCLEVBQUUsRUFBRTtZQUMvQixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFjLGVBQWUsRUFBRSxJQUFJLENBQUM7UUFDbkUsQ0FBQztJQVQ4QyxDQUFDO0NBVWpEO0FBWEQsc0NBV0M7Ozs7Ozs7Ozs7Ozs7O0FDbkJELGtHQUE4QztBQUM5Qyx5SEFBNkQ7QUFDN0QsOEZBQTBDO0FBRzFDLDhGQUEwQztBQUU3QixrQkFBVSxHQUFHO0lBQ3hCLElBQUksRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQztJQUNqQyxJQUFJLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUM7Q0FDbEMsQ0FBQztBQUVXLDBCQUFrQixHQUFHLElBQUkscUJBQVMsRUFBRSxDQUFDO0FBRWxELDBCQUFrQixDQUFDLElBQUksQ0FBQyxrQkFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxFQUFFO0lBQ3BFLE1BQU0sU0FBUyxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQWEseUNBQWtCLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDMUUsT0FBTyxJQUFJLHVCQUFhLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDdEMsQ0FBQyxDQUFDLENBQUM7QUFFSCwwQkFBa0IsQ0FBQyxJQUFJLENBQUMsa0JBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxTQUFTLEVBQUUsRUFBRTtJQUNwRSxNQUFNLFNBQVMsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFhLHlDQUFrQixDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzFFLE9BQU8sSUFBSSx1QkFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3RDLENBQUMsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7OztBQ3RCSCw2RkFBK0M7QUFFeEMsTUFBTSxnQkFBZ0IsR0FBRyxHQUFTLEVBQUU7SUFDekMsT0FBTyxJQUFJLFdBQUksQ0FBQztRQUNkLFlBQVksRUFBRSx5QkFBeUI7UUFDdkMsSUFBSSxFQUFFO1lBQ0osT0FBTyxFQUFFLEVBQUU7U0FDWjtRQUNELFFBQVEsRUFBRSxFQUFFO0tBQ2IsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDO0FBUlcsd0JBQWdCLG9CQVEzQjs7Ozs7Ozs7Ozs7Ozs7QUNWRiw2RkFBK0M7QUFDL0MsNEZBQTZDO0FBU3RDLE1BQU0sTUFBTSxHQUFHLENBQUMsS0FBYSxFQUFFLEVBQUU7SUFDdEMsTUFBTSxFQUFFLEdBQUcsS0FBSyxDQUFDLEVBQUUsSUFBSSxjQUFNLEVBQUUsQ0FBQztJQUNoQyxPQUFPLElBQUksV0FBSSxDQUFDO1FBQ2QsWUFBWSxFQUFFLHNCQUFzQjtRQUNwQyxJQUFJLEVBQUU7WUFDSixFQUFFLEVBQUUsRUFBRTtZQUNOLEtBQUssRUFBRSxLQUFLLENBQUMsS0FBSztZQUNsQixTQUFTLEVBQUUsS0FBSyxDQUFDLFNBQVM7U0FDM0I7S0FDRixDQUFDLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRTs7UUFDbEIsY0FBUSxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsMENBQUUsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUU7WUFDM0QsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuQixDQUFDLEVBQUU7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQztBQWRXLGNBQU0sVUFjakI7Ozs7Ozs7Ozs7Ozs7O0FDeEJGLGtFQUE2QztBQUM3QywrRkFBZ0Q7QUFDaEQsNkZBQStDO0FBRS9DLDZGQUFtQztBQUNuQyw4RkFBZ0Q7QUFjekMsTUFBTSxRQUFRLEdBQUcsQ0FBQyxLQUFlLEVBQUUsRUFBRTtJQUMxQyxPQUFPLElBQUksV0FBSSxDQUFDO1FBQ2QsWUFBWSxFQUFFLHdCQUF3QjtRQUN0QyxJQUFJLEVBQUU7WUFDSixRQUFRLEVBQUUsS0FBSyxDQUFDLEtBQUs7WUFDckIsUUFBUSxFQUFFLEtBQUssQ0FBQyxVQUFVLElBQUksT0FBTztZQUNyQyxXQUFXLEVBQUUsS0FBSyxDQUFDLEVBQUUsSUFBSSxrQkFBa0I7WUFDM0MsaUJBQWlCLEVBQUUsS0FBSyxDQUFDLE1BQU0sSUFBSSxDQUFDO1NBQ3JDO1FBQ0QsUUFBUSxFQUFFO1lBQ1IsTUFBTSxFQUFFLGVBQU0sQ0FBQztnQkFDYixFQUFFLEVBQUUsYUFBYSxLQUFLLENBQUMsRUFBRSxFQUFFO2dCQUMzQixPQUFPLEVBQUUsR0FBRyxFQUFFO29CQUNaLE1BQU0sYUFBYSxHQUFHLGFBQVMsQ0FBQyxHQUFHLENBQWlCLHNCQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ3JFLGFBQWEsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUU7d0JBQ25ELGlCQUFVLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO29CQUMzQyxDQUFDLENBQUMsQ0FBQztnQkFDTCxDQUFDO2FBQ0YsQ0FBQztTQUNIO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDO0FBckJXLGdCQUFRLFlBcUJuQjs7Ozs7Ozs7Ozs7Ozs7QUN4Q0Ysa0VBQXFDO0FBQ3JDLDZGQUErQztBQUMvQywySEFBNkQ7QUFDN0QsMkhBQXVEO0FBQ3ZELDZGQUFtQztBQUNuQywwRkFBaUM7QUFFakMsK0ZBQWdEO0FBQ2hELDhGQUFnRDtBQUV6QyxNQUFNLGVBQWUsR0FBRyxHQUFHLEVBQUU7SUFDbEMsTUFBTSxnQkFBZ0IsR0FBRyxtQ0FBZ0IsRUFBRSxDQUFDO0lBQzVDLE1BQU0sS0FBSyxHQUFHLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxDQUFDO0lBRTFDLElBQUksUUFBUSxHQUFHLEVBQUUsQ0FBQztJQUVsQixPQUFPLElBQUksV0FBSSxDQUFDO1FBQ2QsWUFBWSxFQUFFLCtCQUErQjtRQUM3QyxJQUFJLEVBQUUsRUFBRTtRQUNSLFFBQVEsRUFBRTtZQUNSLEtBQUssRUFBRSxhQUFLLENBQUM7Z0JBQ1gsS0FBSyxFQUFFLFdBQVc7Z0JBQ2xCLElBQUksRUFBRSxNQUFNO2dCQUNaLElBQUksRUFBRSxVQUFVO2dCQUNoQixFQUFFLEVBQUUsVUFBVTtnQkFDZCxTQUFTLEVBQUUsa0JBQWtCO2dCQUM3QixjQUFjLEVBQUUsZ0JBQWdCO2dCQUNoQyxNQUFNLEVBQUUsQ0FBQyxDQUFRLEVBQUUsRUFBRTtvQkFDbkIsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLE1BQTBCLENBQUM7b0JBQzNDLElBQUksbUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFO3dCQUNuQyxLQUFLLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQzt3QkFDbkIsUUFBUSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7cUJBQ3hCO3lCQUFNO3dCQUNMLEtBQUssQ0FBQyxPQUFPLEdBQUcscUJBQXFCLENBQUM7cUJBQ3ZDO2dCQUNILENBQUM7YUFDRixDQUFDO1lBQ0YsTUFBTSxFQUFFLGVBQU0sQ0FBQztnQkFDYixLQUFLLEVBQUUsU0FBUztnQkFDaEIsU0FBUyxFQUFFLGVBQWU7Z0JBQzFCLE9BQU8sRUFBRSxDQUFDLENBQVEsRUFBRSxFQUFFO29CQUNwQixJQUFJLENBQUMsUUFBUSxFQUFFO3dCQUNiLEtBQUssQ0FBQyxPQUFPLEdBQUcscUJBQXFCLENBQUM7cUJBQ3ZDO3lCQUFNO3dCQUNMLE1BQU0sYUFBYSxHQUFHLGFBQVMsQ0FBQyxHQUFHLENBQ2pDLHNCQUFVLENBQUMsSUFBSSxDQUNoQixDQUFDO3dCQUNGLGFBQWEsQ0FBQyxRQUFRLENBQUMsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFOzRCQUNwRCxRQUFRO2lDQUNMLHNCQUFzQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQ0FDdEMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQzs0QkFDM0IsaUJBQVUsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7d0JBQzNDLENBQUMsQ0FBQyxDQUFDO3FCQUNKO2dCQUNILENBQUM7YUFDRixDQUFDO1lBQ0YsTUFBTSxFQUFFLGVBQU0sQ0FBQztnQkFDYixLQUFLLEVBQUUsUUFBUTtnQkFDZixTQUFTLEVBQUUsZUFBZTtnQkFDMUIsT0FBTyxFQUFFLENBQUMsQ0FBUSxFQUFFLEVBQUU7b0JBQ3BCLFFBQVE7eUJBQ0wsc0JBQXNCLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO3lCQUN0QyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUM3QixDQUFDO2FBQ0YsQ0FBQztTQUNIO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDO0FBekRXLHVCQUFlLG1CQXlEMUI7Ozs7Ozs7Ozs7Ozs7O0FDbkVGLDZGQUErQztBQU14QyxNQUFNLE1BQU0sR0FBRyxDQUFDLEtBQWEsRUFBRSxFQUFFO0lBQ3RDLE9BQU8sSUFBSSxXQUFJLENBQUM7UUFDZCxZQUFZLEVBQUUsc0JBQXNCO1FBQ3BDLElBQUksRUFBRTtZQUNKLElBQUksRUFBRSxtQkFBbUI7WUFDekIsRUFBRSxFQUFFLEtBQUssQ0FBQyxFQUFFO1NBQ2I7UUFDRCxRQUFRLEVBQUUsRUFBRTtLQUNiLENBQUMsQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFOztRQUNsQixjQUFRLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsMENBQUUsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtZQUNoRSxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDbEIsQ0FBQyxFQUFFO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUM7QUFiVyxjQUFNLFVBYWpCOzs7Ozs7Ozs7Ozs7OztBQ25CRiw2RkFBK0M7QUFFeEMsTUFBTSxLQUFLLEdBQUcsR0FBRyxFQUFFO0lBQ3hCLE9BQU8sSUFBSSxXQUFJLENBQUM7UUFDZCxZQUFZLEVBQUUscUJBQXFCO1FBQ25DLElBQUksRUFBRSxFQUFFO0tBQ1QsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDO0FBTFcsYUFBSyxTQUtoQjs7Ozs7Ozs7Ozs7Ozs7QUNQRiw2RkFBK0M7QUFDL0MsMEZBQWlDO0FBYWpDLGlEQUFpRDtBQUUxQyxNQUFNLEtBQUssR0FBRyxDQUFDLEtBQWEsRUFBRSxFQUFFO0lBQ3JDLE9BQU8sSUFBSSxXQUFJLENBQUM7UUFDZCxZQUFZLEVBQUUscUJBQXFCO1FBQ25DLElBQUksRUFBRTtZQUNKLEtBQUssRUFBRTtnQkFDTCxJQUFJLEVBQUUsS0FBSyxDQUFDLEtBQUs7YUFDbEI7WUFDRCxRQUFRLEVBQUU7Z0JBQ1IsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJO2dCQUNoQixJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUk7Z0JBQ2hCLEVBQUUsRUFBRSxLQUFLLENBQUMsRUFBRTtnQkFDWixTQUFTLEVBQUUsS0FBSyxDQUFDLFNBQVM7YUFDM0I7U0FDRjtRQUNELFFBQVEsRUFBRTtZQUNSLFNBQVMsRUFBRSxLQUFLLENBQUMsY0FBYyxJQUFJLGFBQUssRUFBRTtTQUMzQztLQUNGLENBQUMsQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFOztRQUNsQixjQUFRO2FBQ0wsY0FBYyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsMENBQ3ZCLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxDQUFDLENBQWEsRUFBRSxFQUFFOztZQUM1QyxNQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsTUFBMEIsQ0FBQztZQUMzQyxNQUFNLFVBQVUsZUFBRyxLQUFLLENBQUMsYUFBYSwwQ0FBRSxhQUFhLDBDQUFFLGFBQWEsQ0FDbEUsb0JBQW9CLENBQ3JCLENBQUM7WUFDRixVQUFVLGFBQVYsVUFBVSx1QkFBVixVQUFVLENBQUUsU0FBUyxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsRUFBRTtZQUN0RCxXQUFLLENBQUMsT0FBTywrQ0FBYixLQUFLLEVBQVcsQ0FBQyxFQUFFO1FBQ3JCLENBQUMsRUFBRTtRQUNMLGNBQVEsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQywwQ0FBRSxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFRLEVBQUUsRUFBRTs7WUFDdkUsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLE1BQTBCLENBQUM7WUFDM0MsTUFBTSxVQUFVLGVBQUcsS0FBSyxDQUFDLGFBQWEsMENBQUUsYUFBYSwwQ0FBRSxhQUFhLENBQ2xFLG9CQUFvQixDQUNyQixDQUFDO1lBQ0YsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUU7Z0JBQ2hCLFVBQVUsYUFBVixVQUFVLHVCQUFWLFVBQVUsQ0FBRSxTQUFTLENBQUMsTUFBTSxDQUFDLDBCQUEwQixFQUFFO2FBQzFEO1lBQ0QsV0FBSyxDQUFDLE1BQU0sK0NBQVosS0FBSyxFQUFVLENBQUMsRUFBRTtRQUNwQixDQUFDLEVBQUU7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQztBQXZDVyxhQUFLLFNBdUNoQjs7Ozs7Ozs7Ozs7Ozs7QUN2REYsNkZBQStDO0FBQy9DLGtFQUFrQztBQUNsQywyR0FBaUQ7QUFDakQsK0ZBQStDO0FBRWxDLHNCQUFjLEdBQUcsZ0JBQU8sQ0FBQyxHQUFHLEVBQUU7SUFDekMsT0FBTyxJQUFJLFdBQUksQ0FBQztRQUNkLFFBQVEsRUFBRSxRQUFRLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxJQUFJLFFBQVEsQ0FBQyxJQUFJO1FBQzNELFlBQVksRUFBRSw4QkFBOEI7UUFDNUMsSUFBSSxFQUFFLEVBQUU7UUFDUixRQUFRLEVBQUU7WUFDUixJQUFJLEVBQUUsZUFBTSxDQUFDO2dCQUNYLEtBQUssRUFBRSxXQUFXO2dCQUNsQixTQUFTLEVBQUUsNkJBQTZCO2dCQUN4QyxPQUFPLEVBQUUsQ0FBQyxDQUFRLEVBQUUsRUFBRTtvQkFDcEIsVUFBTSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDeEIsQ0FBQzthQUNGLENBQUM7U0FDSDtLQUNGLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7OztBQ3BCSCw2RkFBK0M7QUFDL0Msa0VBQTZDO0FBQzdDLDJHQUFpRDtBQUdqRCw4RkFBZ0Q7QUFFekMsTUFBTSxhQUFhLEdBQUcsQ0FBQyxJQUFpQixFQUFFLEVBQUU7SUFDakQsT0FBTyxJQUFJLFdBQUksQ0FBQztRQUNkLFFBQVEsRUFBRSxRQUFRLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxJQUFJLFFBQVEsQ0FBQyxJQUFJO1FBQzFELFlBQVksRUFBRSw2QkFBNkI7UUFDM0MsSUFBSSxFQUFFO1lBQ0osS0FBSyxFQUFFLElBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxLQUFLO1lBQ2xCLEtBQUssRUFBRSxJQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsS0FBSztZQUNsQixTQUFTLEVBQUUsSUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLFVBQVU7WUFDM0IsVUFBVSxFQUFFLElBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxXQUFXO1lBQzdCLFdBQVcsRUFBRSxJQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsWUFBWTtZQUMvQixLQUFLLEVBQUUsSUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLEtBQUs7U0FDbkI7UUFDRCxRQUFRLEVBQUU7WUFDUixJQUFJLEVBQUUsZUFBTSxDQUFDO2dCQUNYLEtBQUssRUFBRSxXQUFXO2dCQUNsQixTQUFTLEVBQUUsNEJBQTRCO2dCQUN2QyxPQUFPLEVBQUUsQ0FBQyxDQUFRLEVBQUUsRUFBRTtvQkFDcEIsTUFBTSxhQUFhLEdBQUcsYUFBUyxDQUFDLEdBQUcsQ0FBaUIsc0JBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDckUsSUFBSSxhQUFhLENBQUMsSUFBSSxFQUFFO3dCQUN0QixhQUFhLENBQUMsSUFBSSxDQUFDLFlBQVksR0FBRyxNQUFNO3dCQUN4QyxhQUFhLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUM7cUJBQzNDO2dCQUNILENBQUM7YUFDRixDQUFDO1NBQ0g7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDLENBQUM7QUExQlcscUJBQWEsaUJBMEJ4Qjs7Ozs7Ozs7Ozs7Ozs7QUNqQ0YsNkZBQStDO0FBQy9DLGlIQUErRDtBQUMvRCxrRUFBa0M7QUFDbEMsMkdBQWlEO0FBQ2pELHdHQUErQztBQUMvQyxzSUFBbUU7QUFFNUQsTUFBTSxVQUFVLEdBQUcsQ0FBQyxNQUFrQixFQUFFLEVBQUU7SUFDL0MsTUFBTSxZQUFZLEdBQVcsRUFBRSxDQUFDO0lBQ2hDLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRTtRQUN6QixNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBUyxFQUFFLEVBQUU7WUFDM0IsWUFBWSxDQUFDLElBQUksQ0FBQyxtQkFBUSxtQkFBTSxJQUFJLEVBQUcsQ0FBQyxDQUFDO1FBQzNDLENBQUMsQ0FBQyxDQUFDO0tBQ0o7U0FBTTtRQUNMLFlBQVksQ0FBQyxJQUFJLENBQUMsYUFBSyxFQUFFLENBQUMsQ0FBQztLQUM1QjtJQUVELE9BQU8sSUFBSSxXQUFJLENBQUM7UUFDZCxRQUFRLEVBQUUsUUFBUSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsSUFBSSxRQUFRLENBQUMsSUFBSTtRQUMxRCxZQUFZLEVBQUUsb0JBQW9CO1FBQ2xDLElBQUksRUFBRSxFQUFFO1FBQ1IsUUFBUSxFQUFFO1lBQ1IsV0FBVyxFQUFFLGVBQU0sQ0FBQztnQkFDbEIsS0FBSyxFQUFFLFNBQVM7Z0JBQ2hCLFNBQVMsRUFBRSxzQkFBc0I7Z0JBQ2pDLE9BQU8sRUFBRSxDQUFDLENBQVEsRUFBRSxFQUFFO29CQUNwQixVQUFNLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUN4QixDQUFDO2FBQ0YsQ0FBQztZQUNGLFFBQVEsRUFBRSxZQUFZO1lBQ3RCLGVBQWUsRUFBRSxpQ0FBZSxFQUFFO1lBQ2xDLGdCQUFnQixFQUFFLGVBQU0sQ0FBQztnQkFDdkIsS0FBSyxFQUFFLEdBQUc7Z0JBQ1YsU0FBUyxFQUFFLDhCQUE4QjtnQkFDekMsT0FBTyxFQUFFLEdBQUcsRUFBRTtvQkFDWixRQUFRO3lCQUNMLHNCQUFzQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQzt5QkFDdEMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDaEMsQ0FBQzthQUNGLENBQUM7U0FDSDtLQUNGLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQztBQW5DVyxrQkFBVSxjQW1DckI7Ozs7Ozs7Ozs7Ozs7O0FDMUNGLHdHQUErQztBQUMvQywySEFBNkQ7QUFDN0QseUlBQXFFO0FBQ3JFLDRFQUF3QztBQUN4Qyx3R0FBd0Q7QUFDeEQsNkZBQStDO0FBQy9DLDJHQUFpRDtBQUdqRDs7R0FFRztBQUVJLE1BQU0sV0FBVyxHQUFHLENBQUMsSUFBaUIsRUFBUSxFQUFFO0lBQ3JELElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxFQUFFLEVBQUU7UUFDbkIsY0FBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUNwQjtJQUVELE1BQU0sY0FBYyxHQUFHLG1DQUFnQixFQUFFLENBQUM7SUFDMUMsTUFBTSxtQkFBbUIsR0FBRyxjQUFjLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDdEQsTUFBTSxhQUFhLEdBQUcsbUNBQWdCLEVBQUUsQ0FBQztJQUN6QyxNQUFNLGtCQUFrQixHQUFHLGFBQWEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUVwRCxNQUFNLFFBQVEsR0FBMkIsRUFBRSxDQUFDO0lBQzVDLE9BQU8sSUFBSSxXQUFJLENBQUM7UUFDZCxRQUFRLEVBQUUsUUFBUSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsSUFBSSxRQUFRLENBQUMsSUFBSTtRQUMxRCxZQUFZLEVBQUUscUJBQXFCO1FBQ25DLElBQUksRUFBRTtZQUNKLFFBQVEsRUFBRSxNQUFNO1NBQ2pCO1FBQ0QsUUFBUSxFQUFFO1lBQ1IsVUFBVSxFQUFFLGFBQUssQ0FBQztnQkFDaEIsS0FBSyxFQUFFLE9BQU87Z0JBQ2QsSUFBSSxFQUFFLE1BQU07Z0JBQ1osSUFBSSxFQUFFLE9BQU87Z0JBQ2IsRUFBRSxFQUFFLGtCQUFrQjtnQkFDdEIsU0FBUyxFQUFFLHdCQUF3QjtnQkFDbkMsTUFBTSxFQUFFLENBQUMsQ0FBUSxFQUFFLEVBQUU7b0JBQ25CLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQyxNQUEwQixDQUFDO29CQUMzQyxNQUFNLEtBQUssR0FBRyxtQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLGFBQUwsS0FBSyx1QkFBTCxLQUFLLENBQUUsS0FBSyxDQUFDLENBQUM7b0JBQy9DLElBQUksQ0FBQyxLQUFLLEVBQUU7d0JBQ1YsbUJBQW1CLENBQUMsT0FBTyxHQUFHLHFCQUFxQixDQUFDO3FCQUNyRDt5QkFBTTt3QkFDTCxtQkFBbUIsQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO3dCQUNqQyxRQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQztxQkFDakM7Z0JBQ0gsQ0FBQztnQkFDRCxjQUFjLEVBQUUsY0FBYzthQUMvQixDQUFDO1lBQ0YsYUFBYSxFQUFFLGFBQUssQ0FBQztnQkFDbkIsS0FBSyxFQUFFLFFBQVE7Z0JBQ2YsSUFBSSxFQUFFLFVBQVU7Z0JBQ2hCLElBQUksRUFBRSxVQUFVO2dCQUNoQixFQUFFLEVBQUUscUJBQXFCO2dCQUN6QixTQUFTLEVBQUUsd0JBQXdCO2dCQUNuQyxNQUFNLEVBQUUsQ0FBQyxDQUFRLEVBQUUsRUFBRTtvQkFDbkIsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLE1BQTBCLENBQUM7b0JBQzNDLElBQUksQ0FBQyxtQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUU7d0JBQ3BDLGtCQUFrQixDQUFDLE9BQU8sR0FBRyxxQkFBcUIsQ0FBQztxQkFDcEQ7eUJBQU07d0JBQ0wsa0JBQWtCLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQzt3QkFDaEMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7cUJBQ3BDO2dCQUNILENBQUM7Z0JBQ0QsY0FBYyxFQUFFLGFBQWE7YUFDOUIsQ0FBQztZQUNGLE1BQU0sRUFBRSxlQUFNLENBQUM7Z0JBQ2IsS0FBSyxFQUFFLGdCQUFnQjtnQkFDdkIsU0FBUyxFQUFFLGFBQWE7Z0JBQ3hCLE9BQU8sRUFBRSxDQUFDLENBQVEsRUFBRSxFQUFFO29CQUNwQixNQUFNLElBQUksR0FBOEM7d0JBQ3RELElBQUksRUFBRTs0QkFDSixLQUFLLEVBQUUsUUFBUSxDQUFDLEtBQUs7NEJBQ3JCLFFBQVEsRUFBRSxRQUFRLENBQUMsUUFBUTt5QkFDNUI7d0JBQ0QsT0FBTyxFQUFFOzRCQUNQLGNBQWMsRUFBRSxrQkFBa0I7eUJBQ25DO3FCQUNGLENBQUM7b0JBQ0YseUJBQWEsQ0FBQyxXQUFXLEVBQUU7eUJBQ3hCLElBQUksQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDO3lCQUMxQixJQUFJLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRTt3QkFDZixJQUFJLE1BQU0sQ0FBQyxNQUFNLEdBQUcsR0FBRyxFQUFFOzRCQUN2QixjQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDO3lCQUNwQjtvQkFDSCxDQUFDLENBQUMsQ0FBQztnQkFDUCxDQUFDO2FBQ0YsQ0FBQztZQUNGLGtCQUFrQixFQUFFLGVBQU0sQ0FBQztnQkFDekIsS0FBSyxFQUFFLG9CQUFvQjtnQkFDM0IsU0FBUyxFQUFFLFdBQVc7Z0JBQ3RCLE9BQU8sRUFBRSxDQUFDLENBQVEsRUFBRSxFQUFFO29CQUNwQixjQUFNLENBQUMsRUFBRSxDQUFDLGVBQWUsQ0FBQyxDQUFDO2dCQUM3QixDQUFDO2FBQ0YsQ0FBQztTQUNIO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDO0FBcEZXLG1CQUFXLGVBb0Z0Qjs7Ozs7Ozs7Ozs7Ozs7QUNqR0YsNkZBQStDO0FBQy9DLDJHQUFpRDtBQUNqRCxrRUFBa0M7QUFDbEMsd0dBQXdEO0FBWWpELE1BQU0sYUFBYSxHQUFHLENBQUMsSUFBaUIsRUFBRSxFQUFFO0lBQ2pELE9BQU8sSUFBSSxXQUFJLENBQUM7UUFDZCxRQUFRLEVBQWUsUUFBUSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUM7UUFDdEQsWUFBWSxFQUFFLHVCQUF1QjtRQUNyQyxJQUFJLG9CQUNDLElBQUksQ0FDUjtRQUNELFFBQVEsRUFBRTtZQUNSLGVBQWUsRUFBRSxlQUFNLENBQUM7Z0JBQ3RCLEtBQUssRUFBRSxpQkFBaUI7Z0JBQ3hCLFNBQVMsRUFBRSx3QkFBd0I7Z0JBQ25DLE9BQU8sRUFBRSxHQUFHLEVBQUU7b0JBQ1osVUFBTSxDQUFDLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQztnQkFDNUIsQ0FBQzthQUNGLENBQUM7WUFDRixnQkFBZ0IsRUFBRSxlQUFNLENBQUM7Z0JBQ3ZCLEtBQUssRUFBRSxpQkFBaUI7Z0JBQ3hCLFNBQVMsRUFBRSx5QkFBeUI7Z0JBQ3BDLE9BQU8sRUFBRSxHQUFHLEVBQUU7b0JBQ1osVUFBTSxDQUFDLEVBQUUsQ0FBQyxlQUFlLENBQUMsQ0FBQztnQkFDN0IsQ0FBQzthQUNGLENBQUM7WUFDRixRQUFRLEVBQUUsZUFBTSxDQUFDO2dCQUNmLEtBQUssRUFBRSxPQUFPO2dCQUNkLFNBQVMsRUFBRSxjQUFjO2dCQUN6QixPQUFPLEVBQUUsR0FBRyxFQUFFO29CQUNaLFVBQU0sQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ3JCLENBQUM7YUFDRixDQUFDO1lBQ0YsUUFBUSxFQUFFLGVBQU0sQ0FBQztnQkFDZixLQUFLLEVBQUUsT0FBTztnQkFDZCxTQUFTLEVBQUUsY0FBYztnQkFDekIsT0FBTyxFQUFFLEdBQUcsRUFBRTtvQkFDWix5QkFBYSxDQUFDLFdBQVcsRUFBRTt5QkFDeEIsSUFBSSxDQUFDLGNBQWMsQ0FBQzt5QkFDcEIsSUFBSSxDQUFDLEdBQUcsRUFBRTt3QkFDVCxVQUFNLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUNqQixDQUFDLENBQUMsQ0FBQztnQkFDUCxDQUFDO2FBQ0YsQ0FBQztTQUNIO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDO0FBMUNXLHFCQUFhLGlCQTBDeEI7Ozs7Ozs7Ozs7Ozs7O0FDekRGLDZGQUErQztBQUMvQyx3R0FBK0M7QUFDL0MsMERBQTBEO0FBQzFELGtIQUFnRTtBQUNoRSwySEFBNkQ7QUFDN0QseUlBQXFFO0FBQ3JFLGtFQUFrQztBQUNsQyx3R0FBd0Q7QUFDeEQsMkdBQWlEO0FBRTFDLE1BQU0sa0JBQWtCLEdBQUcsR0FBRyxFQUFFO0lBQ3JDLE1BQU0sY0FBYyxHQUFHLG1DQUFnQixFQUFFLENBQUM7SUFDMUMsTUFBTSxjQUFjLEdBQUcsbUNBQWdCLEVBQUUsQ0FBQztJQUMxQyxNQUFNLGlCQUFpQixHQUFHLG1DQUFnQixFQUFFLENBQUM7SUFDN0MsTUFBTSx1QkFBdUIsR0FBRyxtQ0FBZ0IsRUFBRSxDQUFDO0lBQ25ELE1BQU0sa0JBQWtCLEdBQUcsbUNBQWdCLEVBQUUsQ0FBQztJQUM5QyxNQUFNLG1CQUFtQixHQUFHLG1DQUFnQixFQUFFLENBQUM7SUFDL0MsTUFBTSxjQUFjLEdBQUcsbUNBQWdCLEVBQUUsQ0FBQztJQUUxQyxNQUFNLFFBQVEsR0FBMkIsRUFBRSxDQUFDO0lBRTVDLE9BQU8sSUFBSSxXQUFJLENBQUM7UUFDZCxRQUFRLEVBQWUsUUFBUSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUM7UUFDdEQsWUFBWSxFQUFFLDRCQUE0QjtRQUMxQyxJQUFJLEVBQUU7WUFDSixTQUFTLEVBQUUsYUFBYTtTQUN6QjtRQUNELFFBQVEsRUFBRTtZQUNSLFVBQVUsRUFBRSxhQUFLLENBQUM7Z0JBQ2hCLEtBQUssRUFBRSxPQUFPO2dCQUNkLElBQUksRUFBRSxNQUFNO2dCQUNaLElBQUksRUFBRSxPQUFPO2dCQUNiLEVBQUUsRUFBRSxvQkFBb0I7Z0JBQ3hCLFNBQVMsRUFBRSxzQkFBc0I7Z0JBQ2pDLGNBQWMsRUFBRSxjQUFjO2dCQUM5QixNQUFNLEVBQUUsQ0FBQyxDQUFRLEVBQUUsRUFBRTtvQkFDbkIsTUFBTSxLQUFLLEdBQUcsY0FBYyxDQUFDLFFBQVEsRUFBRSxDQUFDO29CQUN4QyxNQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsTUFBMEIsQ0FBQztvQkFDM0MsSUFBSSxzQkFBYyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUU7d0JBQ3pDLFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO3dCQUNoQyxLQUFLLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztxQkFDcEI7eUJBQU07d0JBQ0wsS0FBSyxDQUFDLE9BQU8sR0FBRyw0Q0FBNEMsQ0FBQztxQkFDOUQ7Z0JBQ0gsQ0FBQzthQUNGLENBQUM7WUFDRixVQUFVLEVBQUUsYUFBSyxDQUFDO2dCQUNoQixLQUFLLEVBQUUsT0FBTztnQkFDZCxJQUFJLEVBQUUsTUFBTTtnQkFDWixJQUFJLEVBQUUsT0FBTztnQkFDYixFQUFFLEVBQUUsb0JBQW9CO2dCQUN4QixTQUFTLEVBQUUsc0JBQXNCO2dCQUNqQyxjQUFjLEVBQUUsY0FBYztnQkFDOUIsTUFBTSxFQUFFLENBQUMsQ0FBUSxFQUFFLEVBQUU7b0JBQ25CLE1BQU0sS0FBSyxHQUFHLGNBQWMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztvQkFDeEMsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLE1BQTBCLENBQUM7b0JBQzNDLElBQUksbUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFO3dCQUNuQyxRQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQzt3QkFDaEMsS0FBSyxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7cUJBQ3BCO3lCQUFNO3dCQUNMLEtBQUssQ0FBQyxPQUFPLEdBQUcscUJBQXFCLENBQUM7cUJBQ3ZDO2dCQUNILENBQUM7YUFDRixDQUFDO1lBQ0YsU0FBUyxFQUFFLGFBQUssQ0FBQztnQkFDZixLQUFLLEVBQUUsS0FBSztnQkFDWixJQUFJLEVBQUUsTUFBTTtnQkFDWixJQUFJLEVBQUUsWUFBWTtnQkFDbEIsRUFBRSxFQUFFLHlCQUF5QjtnQkFDN0IsU0FBUyxFQUFFLHNCQUFzQjtnQkFDakMsY0FBYyxFQUFFLGtCQUFrQjtnQkFDbEMsTUFBTSxFQUFFLENBQUMsQ0FBUSxFQUFFLEVBQUU7b0JBQ25CLE1BQU0sS0FBSyxHQUFHLGtCQUFrQixDQUFDLFFBQVEsRUFBRSxDQUFDO29CQUM1QyxNQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsTUFBMEIsQ0FBQztvQkFDM0MsSUFBSSxtQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUU7d0JBQ25DLFFBQVEsQ0FBQyxZQUFZLENBQUMsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO3dCQUNyQyxLQUFLLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztxQkFDcEI7eUJBQU07d0JBQ0wsS0FBSyxDQUFDLE9BQU8sR0FBRyxxQkFBcUIsQ0FBQztxQkFDdkM7Z0JBQ0gsQ0FBQzthQUNGLENBQUM7WUFDRixVQUFVLEVBQUUsYUFBSyxDQUFDO2dCQUNoQixLQUFLLEVBQUUsU0FBUztnQkFDaEIsSUFBSSxFQUFFLE1BQU07Z0JBQ1osSUFBSSxFQUFFLGFBQWE7Z0JBQ25CLEVBQUUsRUFBRSwwQkFBMEI7Z0JBQzlCLFNBQVMsRUFBRSxzQkFBc0I7Z0JBQ2pDLGNBQWMsRUFBRSxtQkFBbUI7Z0JBQ25DLE1BQU0sRUFBRSxDQUFDLENBQVEsRUFBRSxFQUFFO29CQUNuQixNQUFNLEtBQUssR0FBRyxtQkFBbUIsQ0FBQyxRQUFRLEVBQUUsQ0FBQztvQkFDN0MsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLE1BQTBCLENBQUM7b0JBQzNDLElBQUksbUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFO3dCQUNuQyxRQUFRLENBQUMsYUFBYSxDQUFDLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQzt3QkFDdEMsS0FBSyxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7cUJBQ3BCO3lCQUFNO3dCQUNMLEtBQUssQ0FBQyxPQUFPLEdBQUcscUJBQXFCLENBQUM7cUJBQ3ZDO2dCQUNILENBQUM7YUFDRixDQUFDO1lBQ0YsS0FBSyxFQUFFLGFBQUssQ0FBQztnQkFDWCxLQUFLLEVBQUUsU0FBUztnQkFDaEIsSUFBSSxFQUFFLE1BQU07Z0JBQ1osSUFBSSxFQUFFLE9BQU87Z0JBQ2IsRUFBRSxFQUFFLG9CQUFvQjtnQkFDeEIsU0FBUyxFQUFFLHNCQUFzQjtnQkFDakMsY0FBYyxFQUFFLGNBQWM7Z0JBQzlCLE1BQU0sRUFBRSxDQUFDLENBQVEsRUFBRSxFQUFFO29CQUNuQixNQUFNLEtBQUssR0FBRyxjQUFjLENBQUMsUUFBUSxFQUFFLENBQUM7b0JBQ3hDLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQyxNQUEwQixDQUFDO29CQUMzQyxJQUFJLG1CQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRTt3QkFDbkMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7d0JBQ2hDLEtBQUssQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO3FCQUNwQjt5QkFBTTt3QkFDTCxLQUFLLENBQUMsT0FBTyxHQUFHLHFCQUFxQixDQUFDO3FCQUN2QztnQkFDSCxDQUFDO2FBQ0YsQ0FBQztZQUNGLFFBQVEsRUFBRSxhQUFLLENBQUM7Z0JBQ2QsS0FBSyxFQUFFLFFBQVE7Z0JBQ2YsSUFBSSxFQUFFLFVBQVU7Z0JBQ2hCLElBQUksRUFBRSxVQUFVO2dCQUNoQixFQUFFLEVBQUUsdUJBQXVCO2dCQUMzQixTQUFTLEVBQUUsc0JBQXNCO2dCQUNqQyxjQUFjLEVBQUUsaUJBQWlCO2dCQUNqQyxNQUFNLEVBQUUsQ0FBQyxDQUFRLEVBQUUsRUFBRTtvQkFDbkIsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLE1BQTBCLENBQUM7b0JBQzNDLE1BQU0sS0FBSyxHQUFHLGlCQUFpQixDQUFDLFFBQVEsRUFBRSxDQUFDO29CQUMzQyxNQUFNLE1BQU0sR0FBRyx1QkFBdUIsQ0FBQyxRQUFRLEVBQUUsQ0FBQztvQkFDbEQsSUFBSSxtQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUU7d0JBQ25DLFFBQVEsQ0FBQyxVQUFVLENBQUMsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO3dCQUNuQyxLQUFLLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQzt3QkFDbkIsSUFBSSxRQUFRLENBQUMsVUFBVSxDQUFDLEtBQUssUUFBUSxDQUFDLGdCQUFnQixDQUFDLEVBQUU7NEJBQ3ZELE1BQU0sQ0FBQyxPQUFPLEdBQUcsdUJBQXVCLENBQUM7eUJBQzFDO3FCQUNGO3lCQUFNO3dCQUNMLEtBQUssQ0FBQyxPQUFPLEdBQUcscUJBQXFCLENBQUM7cUJBQ3ZDO2dCQUNILENBQUM7YUFDRixDQUFDO1lBQ0YsY0FBYyxFQUFFLGFBQUssQ0FBQztnQkFDcEIsS0FBSyxFQUFFLFFBQVE7Z0JBQ2YsSUFBSSxFQUFFLFVBQVU7Z0JBQ2hCLElBQUksRUFBRSxnQkFBZ0I7Z0JBQ3RCLEVBQUUsRUFBRSw2QkFBNkI7Z0JBQ2pDLFNBQVMsRUFBRSxzQkFBc0I7Z0JBQ2pDLGNBQWMsRUFBRSx1QkFBdUI7Z0JBQ3ZDLE1BQU0sRUFBRSxDQUFDLENBQVEsRUFBRSxFQUFFO29CQUNuQixNQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsTUFBMEIsQ0FBQztvQkFDM0MsTUFBTSxLQUFLLEdBQUcsdUJBQXVCLENBQUMsUUFBUSxFQUFFLENBQUM7b0JBQ2pELElBQUksbUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFO3dCQUNuQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO3dCQUN6QyxLQUFLLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQzt3QkFDbkIsSUFBSSxRQUFRLENBQUMsVUFBVSxDQUFDLEtBQUssUUFBUSxDQUFDLGdCQUFnQixDQUFDLEVBQUU7NEJBQ3ZELEtBQUssQ0FBQyxPQUFPLEdBQUcsdUJBQXVCLENBQUM7eUJBQ3pDO3FCQUNGO3lCQUFNO3dCQUNMLEtBQUssQ0FBQyxPQUFPLEdBQUcscUJBQXFCLENBQUM7cUJBQ3ZDO2dCQUNILENBQUM7YUFDRixDQUFDO1lBQ0YsU0FBUyxFQUFFLGVBQU0sQ0FBQztnQkFDaEIsS0FBSyxFQUFFLG9CQUFvQjtnQkFDM0IsU0FBUyxFQUFFLGFBQWE7Z0JBQ3hCLE9BQU8sRUFBRSxDQUFDLENBQVEsRUFBRSxFQUFFO29CQUNwQixJQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxJQUFJLENBQUM7d0JBQ2pDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7NEJBQ2xDLE9BQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQzt3QkFDL0IsQ0FBQyxDQUFDLEVBQ0Y7d0JBQ0EsT0FBTztxQkFDUjtvQkFDRCxNQUFNLElBQUksR0FBOEM7d0JBQ3RELElBQUksRUFBRTs0QkFDSixVQUFVLEVBQUUsUUFBUSxDQUFDLFVBQVU7NEJBQy9CLFdBQVcsRUFBRSxRQUFRLENBQUMsV0FBVzs0QkFDakMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxLQUFLOzRCQUNyQixLQUFLLEVBQUUsUUFBUSxDQUFDLEtBQUs7NEJBQ3JCLFFBQVEsRUFBRSxRQUFRLENBQUMsUUFBUTs0QkFDM0IsS0FBSyxFQUFFLFFBQVEsQ0FBQyxLQUFLO3lCQUN0Qjt3QkFDRCxPQUFPLEVBQUU7NEJBQ1AsY0FBYyxFQUFFLGtCQUFrQjt5QkFDbkM7cUJBQ0YsQ0FBQztvQkFDRix5QkFBYSxDQUFDLFdBQVcsRUFBRSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ3pELENBQUM7YUFDRixDQUFDO1lBQ0YsU0FBUyxFQUFFLGVBQU0sQ0FBQztnQkFDaEIsS0FBSyxFQUFFLE9BQU87Z0JBQ2QsU0FBUyxFQUFFLFdBQVc7Z0JBQ3RCLE9BQU8sRUFBRSxDQUFDLENBQVEsRUFBRSxFQUFFO29CQUNwQixVQUFNLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNqQixDQUFDO2FBQ0YsQ0FBQztTQUNIO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDO0FBNUxXLDBCQUFrQixzQkE0TDdCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzdMRixNQUFhLGFBQWE7SUFHeEIsWUFBc0IsT0FBcUI7UUFBckIsWUFBTyxHQUFQLE9BQU8sQ0FBYztRQUYzQyxVQUFLLEdBQW9CLEVBQUUsQ0FBQztRQUM1QixNQUFDLEdBQVcsRUFBRSxDQUFDO1FBR2YsYUFBUSxHQUFHLEdBQVMsRUFBRTtZQUNwQixJQUFJLENBQUMsS0FBSyxHQUFHLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUMzQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7UUFDcEIsQ0FBQyxFQUFDO1FBRUYsYUFBUSxHQUFHLENBQU8sSUFBNEIsRUFBRSxFQUFFO1lBQ2hELE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbEMsTUFBTSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDeEIsQ0FBQyxFQUFDO1FBRUYsZUFBVSxHQUFHLENBQU8sTUFBYyxFQUFpQixFQUFFO1lBQ25ELE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDdEMsTUFBTSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDeEIsQ0FBQyxFQUFDO0lBZjRDLENBQUM7Q0FnQmhEO0FBbkJELHNDQW1CQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNuQkQsTUFBYSxhQUFhO0lBRXhCLFlBQXNCLE9BQXFCO1FBQXJCLFlBQU8sR0FBUCxPQUFPLENBQWM7UUFFM0MsWUFBTyxHQUFHLEdBQVMsRUFBRTtZQUNuQixJQUFJLENBQUMsSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUMzQyxDQUFDLEVBQUM7UUFFRixhQUFRLEdBQUcsQ0FBTyxJQUFpQixFQUFFLEVBQUU7WUFDckMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7UUFDcEMsQ0FBQztJQVI4QyxDQUFDO0lBVWhELFlBQVksQ0FBQyxJQUF1QixFQUFFLEtBQVU7UUFDOUMsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ2IsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFjLENBQUM7U0FDbEM7YUFBTTtZQUNMLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBaUIsQ0FBQztZQUM5QixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQWMsQ0FBQztTQUNsQztJQUNILENBQUM7Q0FDRjtBQXBCRCxzQ0FvQkM7Ozs7Ozs7Ozs7Ozs7O0FDN0JELG9HQUEyQztBQUczQyxrR0FBOEM7QUFDOUMsNkdBQWdEO0FBQ2hELDZHQUFnRDtBQUVuQyxrQkFBVSxHQUFHO0lBQ3hCLElBQUksRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQztJQUNqQyxJQUFJLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUM7Q0FDbEMsQ0FBQztBQUVXLDBCQUFrQixHQUFHLElBQUkscUJBQVMsRUFBRSxDQUFDO0FBRWxELDBCQUFrQixDQUFDLElBQUksQ0FBQyxrQkFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxFQUFFO0lBQ3BFLE1BQU0sT0FBTyxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQWUsdUJBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMxRCxPQUFPLElBQUksNkJBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNwQyxDQUFDLENBQUMsQ0FBQztBQUVILDBCQUFrQixDQUFDLElBQUksQ0FBQyxrQkFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxFQUFFO0lBQ3BFLE1BQU0sT0FBTyxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQWUsdUJBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMxRCxPQUFPLElBQUksNkJBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNwQyxDQUFDLENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7O0FDdEJsQix1RkFBd0M7QUFDeEMsOEVBQXNDO0FBRXRDLE1BQU0sT0FBTyxHQUFHLEdBQUcsRUFBRTtJQUNuQixNQUFNLEVBQUUsU0FBUyxFQUFFLEdBQUcsSUFBSSxxQkFBUyxFQUFFLENBQUM7SUFDdEMsTUFBTSxNQUFNLEdBQUcsbUJBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNyQyxPQUFPLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxDQUFDO0FBQy9CLENBQUMsQ0FBQztBQUVXLEtBQXdCLE9BQU8sRUFBRSxFQUEvQixjQUFNLGNBQUUsaUJBQVMsZ0JBQWU7Ozs7Ozs7Ozs7Ozs7O0FDVC9DLE1BQU0sb0JBQW9CLEdBQUcsSUFBSSxHQUFHLEVBQWU7QUFDbkQsTUFBTSxvQkFBb0IsR0FBRyxJQUFJLEdBQUcsRUFBZSxDQUFDO0FBQ3BELE1BQWEsU0FBUztJQUdwQjtRQUZBLGVBQVUsR0FBcUIsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQVF6QyxRQUFHLEdBQUcsQ0FBSSxFQUFVLEVBQUssRUFBRTtZQUN6QixNQUFNLG1CQUFtQixHQUFHLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUN6RCxJQUFJLG1CQUFtQixFQUFFO2dCQUN2QixNQUFNLFFBQVEsR0FBRyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO2dCQUM3QyxJQUFHLFFBQVEsRUFBRTtvQkFDWCxPQUFPLFFBQVE7aUJBQ2hCO3FCQUFNO29CQUNMLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsbUJBQW1CLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUMxRCxPQUFPLG9CQUFvQixDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7aUJBQ3BDO2FBQ0Y7aUJBQU07Z0JBQ0wsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDbEQsT0FBTyxpQkFBaUIsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDO2FBQ2xDO1FBQ0gsQ0FBQyxDQUFDO0lBcEJjLENBQUM7SUFDakIsSUFBSSxDQUFDLEVBQVU7UUFDYixJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUNqQixJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDOUIsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBaUJELGNBQWMsQ0FBQyxFQUFxQztRQUNsRCxJQUFJLElBQUksQ0FBQyxNQUFNO1lBQ2IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO1FBRWhFLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELE1BQU0sQ0FBQyxTQUFvQjtRQUN6QixLQUFLLElBQUksSUFBSSxJQUFJLFNBQVMsQ0FBQyxVQUFVLEVBQUU7WUFDckMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3ZDO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQsWUFBWTtRQUNWLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNmLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7WUFDbEQsb0JBQW9CLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDO1NBQ2pEO0lBRUgsQ0FBQztDQUNGO0FBOUNELDhCQThDQztBQUVELHVCQUF1QjtBQUN2Qix1Q0FBdUM7QUFDdkMsS0FBSztBQUVMLG9CQUFvQjtBQUNwQixxQ0FBcUM7QUFDckMsS0FBSztBQUVMLDhDQUE4QztBQUM5Qyw0Q0FBNEM7QUFFNUMsWUFBWTtBQUNaLGdDQUFnQztBQUNoQyxtQkFBbUI7QUFDbkIsSUFBSTtBQUVKLFlBQVk7QUFDWixtQkFBbUI7QUFDbkIsSUFBSTtBQUVKLDJFQUEyRTtBQUMzRSxvQkFBb0I7QUFDcEIsTUFBTTtBQUVOLHNFQUFzRTtBQUN0RSxrRUFBa0U7QUFDbEUsc0NBQXNDO0FBQ3RDLE1BQU07QUFFTiwrQ0FBK0M7QUFFL0MseURBQXlEO0FBQ3pELHdCQUF3QjtBQUV4Qiw4REFBOEQ7QUFDOUQsMEJBQTBCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3JGMUIsaUZBQWtDO0FBZWxDLE1BQWEsSUFBSTtJQVdmLFlBQVksTUFBa0I7UUFtS3ZCLFdBQU0sR0FBRyxHQUF3QixFQUFFO1lBQ3hDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQztZQUNsQixPQUFPLE9BQU8sQ0FBQyxHQUFHLENBQ2hCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDLGlCQUFpQixDQUM3RCxDQUFDLElBQUksQ0FBQyxDQUFDLGNBQWMsRUFBRSxFQUFFO2dCQUN4QixNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsdUJBQXVCLENBQUMsY0FBYyxDQUFDLENBQUM7Z0JBQ2xFLElBQUksZ0JBQWdCLEdBQ2xCLGNBQWMsQ0FBQyxjQUFjLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztnQkFDakQsS0FBSyxJQUFJLENBQUMsR0FBRyxjQUFjLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUNuRCxJQUFJLFFBQVEsR0FDVixZQUFZLENBQ1YsR0FBRyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxJQUFJLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FDakUsQ0FBQztvQkFDSixnQkFBZ0IsR0FBRyxJQUFJLENBQUMsMEJBQTBCLENBQ2hELGdCQUFnQixFQUNoQixjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUM3QixRQUFRLEVBQ1IsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFDMUIsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FDMUIsQ0FBQztpQkFDSDtnQkFFRCxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztnQkFFOUQsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO29CQUNqQixJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsR0FBRyxnQkFBZ0IsQ0FBQztpQkFDNUM7cUJBQU07b0JBQ0wsTUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxVQUFVLElBQUksQ0FBQyxRQUFRLElBQUksQ0FBQyxDQUFDO29CQUNqRSxJQUFJLElBQUksRUFBRTt3QkFDUixJQUFJLENBQUMsUUFBUSxHQUFHLElBQW1CLENBQUM7d0JBQ3BDLElBQUksQ0FBQyxTQUFTLEdBQUcsZ0JBQWdCLENBQUM7cUJBQ25DO2lCQUNGO2dCQUNELElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRTtvQkFDL0MsUUFBUSxFQUFFLENBQUM7Z0JBQ2IsQ0FBQyxDQUFDLENBQUM7Z0JBQ0gsSUFBSSxDQUFDLGlCQUFpQixHQUFHLEVBQUUsQ0FBQztnQkFDNUIsT0FBTyxJQUFJLENBQUM7WUFDZCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsRUFBQztRQXpNQSxJQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFDaEMsSUFBSSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxZQUFZLEdBQUcsZUFBZSxNQUFNLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDekQsSUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxFQUFFLENBQUM7UUFDNUIsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDaEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxjQUFNLEVBQUUsQ0FBQztRQUN6QixJQUFJLENBQUMsbUJBQW1CLEdBQUcsR0FBRyxFQUFFLEdBQUUsQ0FBQyxDQUFDO1FBQ3BDLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO0lBQzFDLENBQUM7SUFFRCw4QkFBOEI7SUFFdkIsZUFBZSxDQUNwQixHQUFXLEVBQ1gsSUFBVSxFQUNWLE9BQWdCO1FBRWhCLE9BQU8sSUFBSSxPQUFPLENBQWUsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDbkQsS0FBSyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUM7aUJBQ3JCLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO2dCQUNiLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxHQUFHLEVBQUU7b0JBQ3ZCLE1BQU0sSUFBSSxLQUFLLENBQUMsc0JBQXNCLENBQUMsQ0FBQztpQkFDekM7Z0JBQ0QsT0FBTyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDckIsQ0FBQyxDQUFDO2lCQUNELElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFO2dCQUNmLE9BQU8sTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ3ZCLENBQUMsQ0FBQztpQkFDRCxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtnQkFDYixJQUFJLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2hELE9BQU8sQ0FBQztvQkFDTixJQUFJLEVBQUUsSUFBSTtvQkFDVixXQUFXLEVBQUUsR0FBRztvQkFDaEIsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO29CQUN2QixPQUFPLEVBQUUsT0FBTztpQkFDakIsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDO2lCQUNELEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO2dCQUNiLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNkLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU8sZ0JBQWdCLENBQ3RCLElBQW1CLEVBQ25CLElBQVksRUFDWixPQUFnQjtRQUVoQixJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDdkIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDbEM7YUFBTTtZQUNMLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDbEMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUN2RSxJQUFJLENBQUMsc0JBQXNCLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1NBQzNEO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRU8sZUFBZSxDQUFDLEtBQWEsRUFBRSxJQUFZO1FBQ2pELEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUNyQixJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLEdBQUcsSUFBSSxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDL0MsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU8sZ0JBQWdCLENBQUMsSUFBVSxFQUFFLElBQVk7UUFDL0MsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2pCLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsRUFBRSxFQUFFO2dCQUMvQyxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7b0JBQ2pCLE9BQU8sSUFBSSxDQUFDLGdCQUFnQixDQUMxQixJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxFQUN4QixTQUFTLEVBQ1QsS0FBSyxDQUNOLENBQUM7aUJBQ0g7WUFDSCxDQUFDLENBQUMsQ0FBQztTQUNKO0lBQ0gsQ0FBQztJQUVPLGtCQUFrQixDQUN4QixZQUFvQixFQUNwQixJQUE2QjtRQUU3QixJQUFJLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3hDLEtBQUssSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFO1lBQ3BCLElBQUksT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssUUFBUSxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxJQUFJLEVBQUU7Z0JBQ3ZELE1BQU0sSUFBSSxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksR0FBRyxHQUFHLEdBQUcsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUNoRCxZQUFZLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDOUQ7U0FDRjtRQUNELE1BQU0sSUFBSSxHQUFHLElBQUksTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ3pDLFlBQVksR0FBRyxZQUFZLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztRQUM5QyxPQUFPLFlBQVksQ0FBQztJQUN0QixDQUFDO0lBRU8sdUJBQXVCLENBQzdCLFdBS0c7UUFFSCxNQUFNLE1BQU0sR0FBMkIsRUFBRSxDQUFDO1FBQzFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUMzQixJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUU7Z0JBQzVCLE1BQU0sQ0FDSixJQUFJLENBQUMsV0FBVyxDQUNqQixJQUFJLGVBQWUsSUFBSSxDQUFDLFFBQVEsS0FBSyxJQUFJLENBQUMsSUFBSSxTQUFTLENBQUM7YUFDMUQ7aUJBQU07Z0JBQ0wsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO2FBQzVEO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBRU8sMEJBQTBCLENBQ2hDLGdCQUF3QixFQUN4QixXQUFtQixFQUNuQixpQkFBeUIsRUFDekIsUUFBZ0IsRUFDaEIsT0FBZ0I7UUFFaEIsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUN2QyxnQkFBZ0IsRUFDaEIsV0FBVyxFQUNYLFFBQVEsRUFDUixPQUFPLENBQ1IsQ0FBQztRQUNGLE1BQU0sSUFBSSxHQUFHLElBQUksTUFBTSxDQUFDLEtBQUssV0FBVyxJQUFJLFFBQVEsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQy9ELGdCQUFnQixHQUFHLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztRQUNyRSxPQUFPLGdCQUFnQixDQUFDO0lBQzFCLENBQUM7SUFFTyxpQkFBaUIsQ0FDdkIsWUFBb0IsRUFDcEIsV0FBbUIsRUFDbkIsUUFBZ0IsRUFDaEIsT0FBZ0I7UUFFaEIsTUFBTSxJQUFJLEdBQUcsSUFBSSxNQUFNLENBQUMsS0FBSyxXQUFXLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNuRCxJQUFJLE9BQU8sRUFBRTtZQUNYLFlBQVksR0FBRyxZQUFZLENBQUMsT0FBTyxDQUNqQyxJQUFJLEVBQ0osZUFBZSxRQUFRLE9BQU8sV0FBVyxJQUFJLFFBQVEsT0FBTyxXQUFXLFdBQVcsQ0FDbkYsQ0FBQztTQUNIO2FBQU07WUFDTCxZQUFZLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FDakMsSUFBSSxFQUNKLGVBQWUsUUFBUSxPQUFPLFdBQVcsSUFBSSxRQUFRLFdBQVcsQ0FDakUsQ0FBQztTQUNIO1FBRUQsT0FBTyxZQUFZLENBQUM7SUFDdEIsQ0FBQztJQUVPLG1CQUFtQixDQUFDLElBQVk7UUFDdEMsTUFBTSxLQUFLLEdBQUcscUJBQXFCLENBQUM7UUFDcEMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBMkNPLFFBQVE7UUFDZCxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDaEIsQ0FBQztJQUVNLFFBQVE7UUFDYixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3pDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztJQUNwQixDQUFDO0lBRU8sV0FBVyxDQUFDLEtBQVU7UUFDNUIsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLE1BQU0sT0FBTyxHQUEwQztZQUNyRCxHQUFHLENBQUMsTUFBTSxFQUFFLFFBQVE7Z0JBQ2xCLE9BQU8sTUFBTSxDQUFTLFFBQVEsQ0FBQyxDQUFDO1lBQ2xDLENBQUM7WUFDRCxHQUFHLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxLQUFLO2dCQUN6QixNQUFNLENBQVMsUUFBUSxDQUFDLEdBQUcsS0FBSyxDQUFDO2dCQUNqQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQ2hCLE9BQU8sSUFBSSxDQUFDO1lBQ2QsQ0FBQztTQUNGLENBQUM7UUFDRixLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRWxDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUU7WUFDbkMsSUFBSSxPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxRQUFRLEVBQUU7Z0JBQ3BDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7Z0JBQ2hELElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7YUFDaEM7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUVILE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUVPLHFCQUFxQixDQUFDLElBQVM7UUFDckMsSUFBSSxPQUFPLEdBQWEsRUFBRSxDQUFDO1FBQzNCLElBQUksWUFBWSxHQUFRLEVBQUUsQ0FBQztRQUMzQixTQUFTLEdBQUcsQ0FBQyxHQUFRO1lBQ25CLEtBQUssSUFBSSxHQUFHLElBQUksR0FBRyxFQUFFO2dCQUNuQixPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNsQixJQUFJLE9BQU8sR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLFFBQVEsRUFBRTtvQkFDaEMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2lCQUNmO3FCQUFNO29CQUNMLFlBQVksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUMzQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7aUJBQ2Y7YUFDRjtZQUNELE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUNoQixDQUFDO1FBQ0QsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRVYsT0FBTyxZQUFZLENBQUM7SUFDdEIsQ0FBQztJQUVNLFdBQVcsQ0FBQyxRQUFvQjtRQUNyQyxJQUFJLENBQUMsbUJBQW1CLEdBQUcsUUFBUSxDQUFDO1FBQ3BDLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVNLElBQUk7UUFDVCxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDakIsSUFBSSxRQUFRLENBQUM7WUFFYixRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUM7WUFDbEMsSUFBSSxRQUFRLEVBQUU7Z0JBQ1osS0FBSyxJQUFJLEtBQUssSUFBSSxRQUFRLEVBQUU7b0JBQzFCLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztpQkFDaEI7YUFDRjtTQUNGO0lBQ0gsQ0FBQztDQUNGO0FBN1JELG9CQTZSQzs7Ozs7Ozs7Ozs7Ozs7QUMxU0QsTUFBTSxLQUFLO0lBTVQsWUFDRSxRQUFnQixFQUNoQixJQUFnQixFQUNoQixLQUE4QixFQUM5QixPQUE0QjtRQVR0QixjQUFTLEdBQVcsRUFBRSxDQUFDO1FBVzdCLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO1FBQzFCLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ3BCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ25CLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0lBQ3pCLENBQUM7SUFFRCxRQUFRLENBQUMsUUFBZ0I7UUFDdkIsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFO1lBQ3hCLElBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO1lBQzFCLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUNmO0lBQ0gsQ0FBQztJQUVELEtBQUs7UUFDSCxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDZixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDdEI7SUFDSCxDQUFDO0lBRUQsS0FBSyxDQUFDLFFBQWdCO1FBQ3BCLE9BQU8sT0FBTyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUVELE1BQU07UUFDSixJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNoQixPQUFPO1NBQ1I7UUFDRCxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDaEIsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFOztnQkFDN0IsVUFBSSxDQUFDLE1BQU0sK0NBQVgsSUFBSSxFQUFVLE1BQU0sRUFBRSxNQUFNLEdBQUc7WUFDakMsQ0FBQyxDQUFDLENBQUM7U0FDSjthQUFNO1lBQ0wsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDO1NBQ3hCO0lBQ0gsQ0FBQztDQUNGO0FBRUQsTUFBYSxNQUFNO0lBUWpCLFlBQVksU0FBaUI7UUFQckIsZUFBVSxHQUFXLElBQUksQ0FBQztRQUNsQyxXQUFNLEdBQVksRUFBRSxDQUFDO1FBQ2IsWUFBTyxHQUFZLE1BQU0sQ0FBQyxPQUFPLENBQUM7UUFDbEMsa0JBQWEsR0FBaUIsSUFBSSxDQUFDO1FBQ25DLGVBQVUsR0FBVyxFQUFFLENBQUM7UUFJOUIsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ25CLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztTQUN4QjtRQUNELElBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDO0lBQzlCLENBQUM7SUFFRCxHQUFHLENBQ0QsUUFBZ0IsRUFDaEIsS0FBNkIsRUFDN0IsT0FBNEI7UUFFNUIsTUFBTSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQ3JCLFFBQVEsRUFDUixLQUFLLEVBQ0wsRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxFQUM5QixPQUFPLENBQ1IsQ0FBQztRQUNGLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3hCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELEtBQUs7UUFDSCxNQUFNLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBZ0IsRUFBRSxFQUFFO1lBQ3ZDLElBQUksSUFBSSxHQUFHLElBQUksTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUNoQyxNQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ25ELElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDckIsQ0FBQyxDQUFDO1FBQ0YsSUFBSSxJQUFJLEdBQUcsSUFBSSxNQUFNLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ2hDLE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUksR0FBRyxDQUFDO1FBQzFELElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbkIsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQsUUFBUSxDQUFDLFFBQWdCO1FBQ3ZCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDdEMsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNWLE9BQU87U0FDUjtRQUNELElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUN0QixJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxDQUFDO1NBQzVCO1FBQ0QsSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUM7UUFDM0IsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUM5QixDQUFDO0lBRUQsRUFBRSxDQUFDLFFBQWdCO1FBQ2pCLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsSUFBSSxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBQy9DLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDMUIsQ0FBQztJQUVELElBQUk7UUFDRixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3RCLENBQUM7SUFFRCxPQUFPO1FBQ0wsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUN6QixDQUFDO0lBRUQsUUFBUSxDQUFDLFFBQWdCO1FBQ3ZCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUM1RCxDQUFDO0NBQ0Y7QUF0RUQsd0JBc0VDO0FBRUQsU0FBUyxPQUFPLENBQUMsR0FBWSxFQUFFLEdBQVk7SUFDekMsT0FBTyxHQUFHLEtBQUssR0FBRyxDQUFDO0FBQ3JCLENBQUM7Ozs7Ozs7Ozs7Ozs7O0FDN0hELE1BQU0sT0FBTyxHQUFHO0lBQ2QsR0FBRyxFQUFFLEtBQUs7SUFDVixHQUFHLEVBQUUsS0FBSztJQUNWLElBQUksRUFBRSxNQUFNO0lBQ1osTUFBTSxFQUFFLFFBQVE7Q0FDakIsQ0FBQztBQUVGLE1BQU0sS0FBSyxHQUFHLGtDQUFrQyxDQUFDO0FBRWpELE1BQU0sa0JBQWtCO0lBQXhCO1FBQ0UsbUJBQWMsR0FBRztZQUNmLE9BQU8sRUFBRSxFQUFFO1lBQ1gsSUFBSSxFQUFFLEVBQUU7U0FDVCxDQUFDO1FBRUYsUUFBRyxHQUFHLENBQ0osR0FBVyxFQUNYLFVBQXFELElBQUksQ0FBQyxjQUFjLEVBQ3hFLEVBQUU7WUFDRixNQUFNLGFBQWEsR0FBRyxjQUFjLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ25ELEdBQUcsSUFBSSxhQUFhLENBQUM7WUFDckIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUNqQixHQUFHLGtDQUNFLE9BQU8sS0FBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLEdBQUcsS0FDakMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxJQUFJLENBQ2hDLENBQUM7UUFDSixDQUFDLENBQUM7UUFFRixRQUFHLEdBQUcsQ0FDSixHQUFXLEVBQ1gsVUFBcUQsSUFBSSxDQUFDLGNBQWMsRUFDeEUsRUFBRTtZQUNGLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FDakIsR0FBRyxrQ0FDRSxPQUFPLEtBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxHQUFHLEtBQ2pDLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxDQUNoQyxDQUFDO1FBQ0osQ0FBQyxDQUFDO1FBRUYsU0FBSSxHQUFHLENBQ0wsR0FBVyxFQUNYLFVBQThELElBQUk7YUFDL0QsY0FBYyxFQUNqQixFQUFFO1lBQ0YsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUNqQixHQUFHLGtDQUNFLE9BQU8sS0FBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLElBQUksS0FDbEMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxJQUFJLENBQ2hDLENBQUM7UUFDSixDQUFDLENBQUM7UUFFRixXQUFNLEdBQUcsQ0FDUCxHQUFXLEVBQ1gsVUFBcUQsSUFBSSxDQUFDLGNBQWMsRUFDeEUsRUFBRTtZQUNGLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FDakIsR0FBRyxrQ0FDRSxPQUFPLEtBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNLEtBQ3BDLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxDQUNoQyxDQUFDO1FBQ0osQ0FBQyxDQUFDO1FBRUYsV0FBTSxHQUFHLENBQUMsR0FBVyxFQUFFLEVBQUU7WUFDdkIsT0FBTyxJQUFJLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM1QixDQUFDLENBQUM7UUFFRixZQUFPLEdBQUcsQ0FDUixHQUFXLEVBQ1gsT0FBMkUsRUFDM0UsVUFBa0IsSUFBSSxFQUN0QixFQUFFO1lBQ0YsR0FBRyxHQUFHLEtBQUssR0FBRyxHQUFHLENBQUM7WUFDbEIsT0FBTyxJQUFJLE9BQU8sQ0FBTSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtnQkFDMUMsTUFBTSxHQUFHLEdBQUcsSUFBSSxjQUFjLEVBQUUsQ0FBQztnQkFDakMsR0FBRyxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7Z0JBQzNCLEdBQUcsQ0FBQyxJQUFJLENBQVMsT0FBTyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDdEMsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQztnQkFDaEMsS0FBSyxJQUFJLE1BQU0sSUFBSSxPQUFpQyxFQUFFO29CQUNwRCxNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsTUFBOEIsQ0FBVyxDQUFDO29CQUNoRSxHQUFHLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO2lCQUNyQztnQkFDRCxHQUFHLENBQUMsTUFBTSxHQUFHLEdBQUcsRUFBRTtvQkFDaEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNmLENBQUMsQ0FBQztnQkFDRixHQUFHLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUU7b0JBQ2xCLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDWixDQUFDLENBQUM7Z0JBQ0YsR0FBRyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFO29CQUNsQixNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ1osQ0FBQyxDQUFDO2dCQUNGLFVBQVUsQ0FBQyxHQUFHLEVBQUU7b0JBQ2QsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUNkLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFFWixHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDekMsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUM7SUFDSixDQUFDO0NBQUE7QUFFRCxTQUFTLGNBQWMsQ0FBQyxJQUE0QjtJQUNsRCxJQUFJLGFBQWEsR0FBRyxHQUFHLENBQUM7SUFDeEIsS0FBSyxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUU7UUFDcEIsYUFBYSxJQUFJLEdBQUcsR0FBRyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDO0tBQ3pDO0lBQ0QsYUFBYSxHQUFHLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLGFBQWEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDckUsT0FBTyxhQUFhLENBQUM7QUFDdkIsQ0FBQztBQUVZLHFCQUFhLEdBQUcsQ0FBQyxHQUE4QyxFQUFFO0lBQzVFLElBQUksUUFBNEIsQ0FBQztJQUNqQyxPQUFPO1FBQ0wsV0FBVyxFQUFFLEdBQUcsRUFBRSxDQUFDLFFBQVEsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLGtCQUFrQixFQUFFLENBQUM7S0FDckUsQ0FBQztBQUNKLENBQUMsQ0FBQyxFQUFFLENBQUM7Ozs7Ozs7Ozs7Ozs7O0FDL0dRLHNCQUFjLEdBQUc7SUFDNUIsS0FBSyxFQUFFLEVBQUU7SUFDVCxTQUFTLEVBQUUsVUFBVSxLQUFhO1FBQ2hDLElBQUksR0FBRyxHQUFHLDZEQUE2RCxDQUFDO1FBQ3hFLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ3BCLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO1lBQ2hCLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFDRCxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFDRCxRQUFRLEVBQUUsQ0FBQyxJQUFVLEVBQUUsV0FBb0IsRUFBRSxFQUFFO1FBQzdDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUM1QixJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ2hCLEtBQUssQ0FBQyxPQUFPLEdBQUcsNENBQTRDLENBQUM7U0FDOUQ7YUFBTTtZQUNMLEtBQUssQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO1NBQ3BCO0lBQ0gsQ0FBQztDQUNGLENBQUM7Ozs7Ozs7Ozs7Ozs7O0FDbkJXLGdCQUFRLEdBQUc7SUFDdEIsS0FBSyxFQUFFLEVBQUU7SUFDVCxTQUFTLEVBQUUsVUFBVSxLQUFhO1FBQ2hDLElBQUksS0FBSyxLQUFLLEVBQUUsRUFBRTtZQUNoQixJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztZQUNoQixPQUFPLEtBQUssQ0FBQztTQUNkO1FBQ0QsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBQ0QsUUFBUSxFQUFFLENBQUMsSUFBVSxFQUFFLFdBQW9CLEVBQUUsRUFBRTtRQUM3QyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDNUIsSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUNoQixLQUFLLENBQUMsT0FBTyxHQUFHLHFCQUFxQixDQUFDO1NBQ3ZDO2FBQU07WUFDTCxLQUFLLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztTQUNwQjtJQUNILENBQUM7Q0FDRixDQUFDOzs7Ozs7Ozs7Ozs7OztBQ3BCRixTQUFnQixNQUFNO0lBQ3BCLE9BQU8sc0NBQXNDLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUM7UUFDeEUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUM5QixDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUM7UUFDckMsT0FBTyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztJQUM3QixDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFORCx3QkFNQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNORCxrR0FBa0Q7QUFDbEQsK0ZBQWdEO0FBQ2hELHVIQUFnRTtBQUNoRSx3R0FBc0Q7QUFDdEQsMEhBQTREO0FBQzVELDZIQUE4RDtBQUM5RCx5RkFBd0M7QUFDeEMsa0dBQWtEO0FBRWxELHdGQUEwQztBQUluQyxNQUFNLFVBQVUsR0FBRyxDQUFDLFNBQW9CLEVBQVUsRUFBRTtJQUN6RCxPQUFPLElBQUksZUFBTSxDQUFDLE9BQU8sQ0FBQztTQUN2QixHQUFHLENBQUMsR0FBRyxFQUFFLG1CQUFXLEVBQUUsR0FBRyxFQUFFO1FBQzFCLE9BQU8seUJBQWEsQ0FBQyxXQUFXLEVBQUU7YUFDL0IsR0FBRyxDQUFDLFlBQVksQ0FBQzthQUNqQixJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUNiLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDbkMsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUM7U0FDRCxHQUFHLENBQUMsZUFBZSxFQUFFLGlDQUFrQixDQUFDO1NBQ3hDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsaUJBQVUsRUFBRSxHQUFTLEVBQUU7UUFDbkMsTUFBTSxhQUFhLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBaUIsc0JBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNyRSxNQUFNLGFBQWEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUMvQixPQUFPLGFBQWEsQ0FBQyxLQUFLLENBQUM7UUFDM0IsT0FBTyx5QkFBYSxDQUFDLFdBQVcsRUFBRTthQUMvQixHQUFHLENBQUMsUUFBUSxDQUFDO2FBQ2IsSUFBSSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUU7WUFDZixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN6QyxPQUFPLElBQUksQ0FBQztRQUNkLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxFQUFDO1NBQ0QsR0FBRyxDQUFDLFVBQVUsRUFBRSx1QkFBYSxFQUFFLEdBQUcsRUFBRTtRQUNuQyxPQUFPLHlCQUFhLENBQUMsV0FBVyxFQUFFO2FBQy9CLEdBQUcsQ0FBQyxZQUFZLENBQUM7YUFDakIsSUFBSSxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUU7WUFDZixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN6QyxPQUFPLElBQUksQ0FBQztRQUNkLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDO1NBQ0QsR0FBRyxDQUFDLGNBQWMsRUFBRSw2QkFBYSxFQUFFLEdBQVMsRUFBRTtRQUM3QyxNQUFNLGFBQWEsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFpQixzQkFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3JFLE1BQU0sYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQzlCLE9BQU8sYUFBYSxDQUFDLElBQUksQ0FBQztJQUM1QixDQUFDLEVBQUM7U0FDRCxHQUFHLENBQUMsZUFBZSxFQUFFLCtCQUFjLENBQUM7U0FDcEMsS0FBSyxFQUFFLENBQUM7QUFDYixDQUFDLENBQUM7QUFwQ1csa0JBQVUsY0FvQ3JCOzs7Ozs7Ozs7Ozs7Ozs7QUNqREs7QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OztVQ3ZCQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0NyQkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx3Q0FBd0MseUNBQXlDO1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBLHNGOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHNEQUFzRCxrQkFBa0I7V0FDeEU7V0FDQSwrQ0FBK0MsY0FBYztXQUM3RCxFOzs7O1VDTkE7VUFDQTtVQUNBO1VBQ0EiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29udGFpbmVyIH0gZnJvbSBcIi4uL2xpYnMvQ29udGFpbmVyXCI7XHJcbmltcG9ydCB7IGluZnJhc3RydWN0dXJlQ29udGFpbmVyIH0gZnJvbSBcIi4uL0luZnJhc3RzcnVjdHVyZUxheWVyXCI7XHJcbmltcG9ydCB7IEFwaUNsaWVudENvbnRhaW5lciB9IGZyb20gXCIuLi9JbnRlZ3JhdGlvbmFsTGF5ZXJcIjtcclxuaW1wb3J0IHsgU2VydmljZUNvbnRhaW5lciB9IGZyb20gXCIuLi9CdXNzaW5lc0xheWVyXCI7XHJcbmltcG9ydCB7IFZpZXdNb2RlbENvbnRhaW5lciB9IGZyb20gXCIuLi9WaWV3TW9kZWxcIjtcclxuXHJcbmNvbnN0IENyZWF0ZURJQ29udGFpbmVyID0gKFxyXG4gIGluZnJhc3RydWN0dXJlQ29udGFpbmVyOiBDb250YWluZXIsXHJcbiAgaW50ZWdyZWF0aW9uQ29udGFpbmVyOiBDb250YWluZXIsXHJcbiAgc2VydmljZUNvbnRhaW5lcjogQ29udGFpbmVyLFxyXG4gIHZpZXdNb2RlbENvbnRhaW5lcjogQ29udGFpbmVyXHJcbikgPT4ge1xyXG4gIHJldHVybiB2aWV3TW9kZWxDb250YWluZXJcclxuICAgIC5wYXJlbnQoc2VydmljZUNvbnRhaW5lcilcclxuICAgIC5wYXJlbnQoaW50ZWdyZWF0aW9uQ29udGFpbmVyKVxyXG4gICAgLnBhcmVudChpbmZyYXN0cnVjdHVyZUNvbnRhaW5lcik7XHJcbn07XHJcblxyXG5leHBvcnQgY2xhc3MgQm9vdFN0cmFwIHtcclxuICBjb250YWluZXI6IENvbnRhaW5lcjtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuY29udGFpbmVyID0gQ3JlYXRlRElDb250YWluZXIoXHJcbiAgICAgIGluZnJhc3RydWN0dXJlQ29udGFpbmVyLFxyXG4gICAgICBBcGlDbGllbnRDb250YWluZXIsXHJcbiAgICAgIFNlcnZpY2VDb250YWluZXIsXHJcbiAgICAgIFZpZXdNb2RlbENvbnRhaW5lclxyXG4gICAgKTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgSUNoYXREVE8gfSBmcm9tIFwiLi4vVUkvQ29tcG9uZW50cy9DaGF0SXRlbVwiO1xyXG5pbXBvcnQgeyBJQ2hhdEFQSUNsaWVudCB9IGZyb20gXCIuLi9JbnRlZ3JhdGlvbmFsTGF5ZXIvQ2hhdEFQSVwiO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJQ2hhdFNlcnZpY2Uge1xyXG4gIGdldENoYXRzOiAoKSA9PiBQcm9taXNlPEFycmF5PElDaGF0RFRPPj47XHJcbiAgc2F2ZUNoYXQ6IChkYXRhOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+KSA9PiBQcm9taXNlPHZvaWQ+O1xyXG4gIGRlbGV0ZUNoYXQ6IChjaGF0SWQ6IHN0cmluZykgPT4gUHJvbWlzZTx2b2lkPjtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIENoYXRTZXJ2aWNlIGltcGxlbWVudHMgSUNoYXRTZXJ2aWNlIHtcclxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgQXBpQ2xpZW50OiBJQ2hhdEFQSUNsaWVudCkge31cclxuXHJcbiAgZ2V0Q2hhdHMgPSAoKTogUHJvbWlzZTxBcnJheTxJQ2hhdERUTz4+ID0+IHtcclxuICAgIHJldHVybiB0aGlzLkFwaUNsaWVudC5nZXRDaGF0cygpO1xyXG4gIH07XHJcblxyXG4gIHNhdmVDaGF0ID0gKGRhdGE6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4pID0+IHtcclxuICAgIHJldHVybiB0aGlzLkFwaUNsaWVudC5zYXZlQ2hhdChkYXRhKTtcclxuICB9O1xyXG5cclxuICBkZWxldGVDaGF0KGNoYXRJZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICByZXR1cm4gdGhpcy5BcGlDbGllbnQuZGVsZXRlQ2hhdChjaGF0SWQpO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBJVXNlckFQSUNsaWVudCB9IGZyb20gXCIuLi9JbnRlZ3JhdGlvbmFsTGF5ZXIvVXNlckFQSVwiO1xyXG5pbXBvcnQgeyBJUHJvZmlsZURUTyB9IGZyb20gXCIuLi9VSS9MYXlvdXRzL1Byb2ZpbGVcIjtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSVVzZXJTZXJ2aWNlIHtcclxuICBnZXRVc2VyKCk6IFByb21pc2U8SVByb2ZpbGVEVE8+O1xyXG4gIHNhdmVVc2VyKHVzZXI6SVByb2ZpbGVEVE8pOlByb21pc2U8SVByb2ZpbGVEVE8+O1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgVXNlclNlcnZpY2UgaW1wbGVtZW50cyBJVXNlclNlcnZpY2Uge1xyXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBBcGlDbGllbnQ6IElVc2VyQVBJQ2xpZW50KSB7fVxyXG4gIHNhdmVVc2VyKHVzZXI6SVByb2ZpbGVEVE8pOlByb21pc2U8SVByb2ZpbGVEVE8+e1xyXG4gICAgcmV0dXJuIHRoaXMuQXBpQ2xpZW50LnNhdmVVc2VyKHVzZXIpXHJcbiAgfVxyXG4gIGdldFVzZXIoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5BcGlDbGllbnQuZ2V0VXNlcigpO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBBUElfQ0xJRU5UIH0gZnJvbSBcIi4uL0ludGVncmF0aW9uYWxMYXllclwiO1xyXG5pbXBvcnQgeyBJQ2hhdEFQSUNsaWVudCB9IGZyb20gXCIuLi9JbnRlZ3JhdGlvbmFsTGF5ZXIvQ2hhdEFQSVwiO1xyXG5pbXBvcnQgeyBJVXNlckFQSUNsaWVudCB9IGZyb20gXCIuLi9JbnRlZ3JhdGlvbmFsTGF5ZXIvVXNlckFQSVwiO1xyXG5pbXBvcnQgeyBDb250YWluZXIgfSBmcm9tIFwiLi4vbGlicy9Db250YWluZXJcIjtcclxuaW1wb3J0IHsgQ2hhdFNlcnZpY2UgfSBmcm9tIFwiLi9DaGF0U2VydmljZVwiO1xyXG5pbXBvcnQgeyBVc2VyU2VydmljZSB9IGZyb20gXCIuL1VzZXJTZXJ2aWNlXCI7XHJcblxyXG5leHBvcnQgY29uc3QgU0VSVklDRSA9IHtcclxuICBDSEFUOiBTeW1ib2wuZm9yKFwiQ2hhdFNlcnZpY2VcIiksXHJcbiAgVVNFUjogU3ltYm9sLmZvcihcIlVzZXJTZXJ2Y2llXCIpLFxyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IFNlcnZpY2VDb250YWluZXIgPSBuZXcgQ29udGFpbmVyKCk7XHJcblxyXG5TZXJ2aWNlQ29udGFpbmVyLmJpbmQoU0VSVklDRS5DSEFUKS50b0R5bmFtaWNWYWx1ZSgoY29udGFpbmVyKSA9PiB7XHJcbiAgY29uc3QgQVBJQ2xpZW50ID0gY29udGFpbmVyLmdldDxJQ2hhdEFQSUNsaWVudD4oQVBJX0NMSUVOVC5DSEFUKTtcclxuICByZXR1cm4gbmV3IENoYXRTZXJ2aWNlKEFQSUNsaWVudCk7XHJcbn0pO1xyXG5cclxuU2VydmljZUNvbnRhaW5lci5iaW5kKFNFUlZJQ0UuVVNFUikudG9EeW5hbWljVmFsdWUoKGNvbnRhaW5lcikgPT4ge1xyXG4gIGNvbnN0IEFQSUNsaWVudCA9IGNvbnRhaW5lci5nZXQ8SVVzZXJBUElDbGllbnQ+KEFQSV9DTElFTlQuVVNFUik7XHJcbiAgcmV0dXJuIG5ldyBVc2VyU2VydmljZShBUElDbGllbnQpO1xyXG59KTtcclxuIiwiaW1wb3J0IHsgQ29udGFpbmVyIH0gZnJvbSBcIi4uL2xpYnMvQ29udGFpbmVyXCI7XHJcbmltcG9ydCB7IEFQSU1vZHVsZSB9IGZyb20gXCIuL2ludGVyZmFjZXNcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBJTlRFR1JBVElPTl9NT0RVTEUgPSB7XHJcbiAgQVBJTW9kdWxlOiBTeW1ib2wuZm9yKFwiQVBJXCIpLFxyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGluZnJhc3RydWN0dXJlQ29udGFpbmVyID0gbmV3IENvbnRhaW5lcigpO1xyXG5cclxuaW5mcmFzdHJ1Y3R1cmVDb250YWluZXJcclxuICAuYmluZChJTlRFR1JBVElPTl9NT0RVTEUuQVBJTW9kdWxlKVxyXG4gIC50b0R5bmFtaWNWYWx1ZSgoY29udGFpbmVyKSA9PiB7XHJcbiAgICByZXR1cm4gbmV3IEFQSU1vZHVsZSgpO1xyXG4gIH0pO1xyXG4iLCJpbXBvcnQgeyBIVFRQVHJhbnNwb3J0IH0gZnJvbSBcIi4uL2xpYnMvVHJhbnNwb3J0XCI7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElBUElNb2R1bGUge1xyXG4gIGdldERhdGE6IDxQPih1cmw6IHN0cmluZywgcGFyYW1zOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+KSA9PiBQcm9taXNlPFA+O1xyXG4gIHBvc3REYXRhOiA8UCBleHRlbmRzIFJlY29yZDxzdHJpbmcsIHN0cmluZz4+KFxyXG4gICAgdXJsOiBzdHJpbmcsXHJcbiAgICBwYXJhbXM6IFBcclxuICApID0+IFByb21pc2U8UD47XHJcbiAgcHV0RGF0YTogPFA+KHVybDogc3RyaW5nLCBwYXJhbXM6IFJlY29yZDxzdHJpbmcsIGFueT4pID0+IFByb21pc2U8UD47XHJcbiAgZGVsZXRlRGF0YTogKHVybDogc3RyaW5nLCBwYXJhbXM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4pID0+IFByb21pc2U8dm9pZD47XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBBUElNb2R1bGUgaW1wbGVtZW50cyBJQVBJTW9kdWxlIHtcclxuICBjb25zdHJ1Y3RvcigpIHt9XHJcbiAgZ2V0RGF0YSA9IDxQPih1cmw6IHN0cmluZywgZGF0YTogUmVjb3JkPHN0cmluZywgc3RyaW5nPik6IFByb21pc2U8UD4gPT4ge1xyXG4gICAgcmV0dXJuIEhUVFBUcmFuc3BvcnQuZ2V0SW5zdGFuY2UoKVxyXG4gICAgICAuR0VUKHVybCwgdGhpcy5nZXRQYXJtcyhkYXRhKSlcclxuICAgICAgLnRoZW4oKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIHJldHVybiBKU09OLnBhcnNlKHJlc3VsdC5yZXNwb25zZSk7XHJcbiAgICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIHBvc3REYXRhID0gYXN5bmMgPFAgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+PihcclxuICAgIHVybDogc3RyaW5nLFxyXG4gICAgZGF0YTogUFxyXG4gICk6IFByb21pc2U8UD4gPT4ge1xyXG4gICAgcmV0dXJuIEhUVFBUcmFuc3BvcnQuZ2V0SW5zdGFuY2UoKVxyXG4gICAgICAuUE9TVCh1cmwsIHRoaXMuZ2V0UGFybXMoZGF0YSkpXHJcbiAgICAgIC50aGVuKChyZXN1bHQpID0+IHtcclxuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShyZXN1bHQucmVzcG9uc2UpO1xyXG4gICAgICB9KTtcclxuICB9O1xyXG5cclxuICBkZWxldGVEYXRhID0gKHVybDogc3RyaW5nLCBkYXRhOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+KTogUHJvbWlzZTx2b2lkPiA9PiB7XHJcbiAgICByZXR1cm4gSFRUUFRyYW5zcG9ydC5nZXRJbnN0YW5jZSgpXHJcbiAgICAgIC5ERUxFVEUodXJsLCB0aGlzLmdldFBhcm1zKGRhdGEpKVxyXG4gICAgICAudGhlbigocmVzdWx0KSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UocmVzdWx0LnJlc3BvbnNlKTtcclxuICAgICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgcHV0RGF0YSA9IDxQPih1cmw6IHN0cmluZywgZGF0YTogUmVjb3JkPHN0cmluZywgc3RyaW5nPik6IFByb21pc2U8UD4gPT4ge1xyXG4gICAgcmV0dXJuIEhUVFBUcmFuc3BvcnQuZ2V0SW5zdGFuY2UoKS5QVVQodXJsLCB0aGlzLmdldFBhcm1zKGRhdGEpKTtcclxuICB9O1xyXG5cclxuICBwcml2YXRlIGdldFBhcm1zPFQgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+PihcclxuICAgIGRhdGE6IFRcclxuICApOiB7IFtrZXk6IHN0cmluZ106IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gfSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgXCJDb250ZW50LXR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXHJcbiAgICAgIH0sXHJcbiAgICAgIGRhdGE6IHtcclxuICAgICAgICAuLi5kYXRhLFxyXG4gICAgICB9LFxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgSUFQSU1vZHVsZSB9IGZyb20gXCIuLi9JbmZyYXN0c3J1Y3R1cmVMYXllci9pbnRlcmZhY2VzXCI7XHJcbmltcG9ydCB7IElDaGF0RFRPIH0gZnJvbSBcIi4uL1VJL0NvbXBvbmVudHMvQ2hhdEl0ZW1cIjtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUNoYXRBUElDbGllbnQge1xyXG4gIGdldENoYXRzKCk6IFByb21pc2U8QXJyYXk8SUNoYXREVE8+PjtcclxuICBzYXZlQ2hhdChkYXRhOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+KTogUHJvbWlzZTx2b2lkPjtcclxuICBkZWxldGVDaGF0KGlkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+O1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQ2hhdEFQSUNsaWVudCBpbXBsZW1lbnRzIElDaGF0QVBJQ2xpZW50IHtcclxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgQVBJTW9kdWxlOiBJQVBJTW9kdWxlKSB7fVxyXG5cclxuICBnZXRDaGF0cyA9IGFzeW5jICgpOiBQcm9taXNlPEFycmF5PElDaGF0RFRPPj4gPT4ge1xyXG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuQVBJTW9kdWxlLmdldERhdGE8SUNoYXREVE9bXT4oXCIvY2hhdHNcIiwge30pLnRoZW4oXHJcbiAgICAgIChyZXN1bHQpID0+IHtcclxuICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICB9XHJcbiAgICApO1xyXG4gIH07XHJcblxyXG4gIHNhdmVDaGF0ID0gYXN5bmMgKGRhdGE6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4pOiBQcm9taXNlPHZvaWQ+ID0+IHtcclxuICAgIGF3YWl0IHRoaXMuQVBJTW9kdWxlLnBvc3REYXRhKFwiL2NoYXRzXCIsIGRhdGEpO1xyXG4gIH07XHJcblxyXG4gIGRlbGV0ZUNoYXQoaWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgcmV0dXJuIHRoaXMuQVBJTW9kdWxlLmRlbGV0ZURhdGEoXCIvY2hhdHNcIiwgeyBjaGF0SWQ6IGlkIH0pO1xyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBJQVBJTW9kdWxlIH0gZnJvbSBcIi4uL0luZnJhc3RzcnVjdHVyZUxheWVyL2ludGVyZmFjZXNcIjtcclxuaW1wb3J0IHsgSVByb2ZpbGVEVE8gfSBmcm9tIFwiLi4vVUkvTGF5b3V0cy9Qcm9maWxlXCI7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElVc2VyQVBJQ2xpZW50IHtcclxuICBnZXRVc2VyKCk6IFByb21pc2U8SVByb2ZpbGVEVE8+O1xyXG4gIHNhdmVVc2VyKHVzZXI6IElQcm9maWxlRFRPKTogUHJvbWlzZTxJUHJvZmlsZURUTz5cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFVzZXJBUElDbGllbnQgaW1wbGVtZW50cyBJVXNlckFQSUNsaWVudCB7XHJcbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIEFQSU1vZHVsZTogSUFQSU1vZHVsZSkgeyB9XHJcblxyXG4gIGdldFVzZXIgPSBhc3luYyAoKSA9PiB7XHJcbiAgICBjb25zdCB1c2VyID0gYXdhaXQgdGhpcy5BUElNb2R1bGUuZ2V0RGF0YTxJUHJvZmlsZURUTz4oXCIvYXV0aC91c2VyXCIsIHt9KTtcclxuICAgIHJldHVybiB1c2VyO1xyXG4gIH07XHJcblxyXG4gIHNhdmVVc2VyID0gKHVzZXI6IElQcm9maWxlRFRPKSA9PiB7XHJcbiAgICByZXR1cm4gdGhpcy5BUElNb2R1bGUucHV0RGF0YTxJUHJvZmlsZURUTz4oJy91c2VyL3Byb2ZpbGUnLCB1c2VyKVxyXG4gIH1cclxufVxyXG4iLCJpbXBvcnQgeyBDb250YWluZXIgfSBmcm9tIFwiLi4vbGlicy9Db250YWluZXJcIjtcclxuaW1wb3J0IHsgSU5URUdSQVRJT05fTU9EVUxFIH0gZnJvbSBcIi4uL0luZnJhc3RzcnVjdHVyZUxheWVyXCI7XHJcbmltcG9ydCB7IENoYXRBUElDbGllbnQgfSBmcm9tIFwiLi9DaGF0QVBJXCI7XHJcbmltcG9ydCB7IElBUElNb2R1bGUgfSBmcm9tIFwiLi4vSW5mcmFzdHNydWN0dXJlTGF5ZXIvaW50ZXJmYWNlc1wiO1xyXG5pbXBvcnQgeyBjb250YWluZXIgfSBmcm9tIFwiLi5cIjtcclxuaW1wb3J0IHsgVXNlckFQSUNsaWVudCB9IGZyb20gXCIuL1VzZXJBUElcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBBUElfQ0xJRU5UID0ge1xyXG4gIENIQVQ6IFN5bWJvbC5mb3IoXCJDaGF0QVBJQ2xpZW50XCIpLFxyXG4gIFVTRVI6IFN5bWJvbC5mb3IoXCJVc2VyQVBJQ2xpZW50XCIpLFxyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IEFwaUNsaWVudENvbnRhaW5lciA9IG5ldyBDb250YWluZXIoKTtcclxuXHJcbkFwaUNsaWVudENvbnRhaW5lci5iaW5kKEFQSV9DTElFTlQuQ0hBVCkudG9EeW5hbWljVmFsdWUoKGNvbnRhaW5lcikgPT4ge1xyXG4gIGNvbnN0IEFQSU1vZHVsZSA9IGNvbnRhaW5lci5nZXQ8SUFQSU1vZHVsZT4oSU5URUdSQVRJT05fTU9EVUxFLkFQSU1vZHVsZSk7XHJcbiAgcmV0dXJuIG5ldyBDaGF0QVBJQ2xpZW50KEFQSU1vZHVsZSk7XHJcbn0pO1xyXG5cclxuQXBpQ2xpZW50Q29udGFpbmVyLmJpbmQoQVBJX0NMSUVOVC5VU0VSKS50b0R5bmFtaWNWYWx1ZSgoY29udGFpbmVyKSA9PiB7XHJcbiAgY29uc3QgQVBJTW9kdWxlID0gY29udGFpbmVyLmdldDxJQVBJTW9kdWxlPihJTlRFR1JBVElPTl9NT0RVTEUuQVBJTW9kdWxlKTtcclxuICByZXR1cm4gbmV3IFVzZXJBUElDbGllbnQoQVBJTW9kdWxlKTtcclxufSk7XHJcbiIsImltcG9ydCB7IEhZUE8gfSBmcm9tIFwiLi4vLi4vLi4vbGlicy9IWVBPL0hZUE9cIjtcclxuXHJcbmV4cG9ydCBjb25zdCBBdHRlbnRpb25NZXNzYWdlID0gKCk6IEhZUE8gPT4ge1xyXG4gIHJldHVybiBuZXcgSFlQTyh7XHJcbiAgICB0ZW1wbGF0ZVBhdGg6IFwiYXR0ZW50aW9uLnRlbXBsYXRlLmh0bWxcIixcclxuICAgIGRhdGE6IHtcclxuICAgICAgbWVzc2FnZTogXCJcIixcclxuICAgIH0sXHJcbiAgICBjaGlsZHJlbjoge30sXHJcbiAgfSk7XHJcbn07XHJcbiIsImltcG9ydCB7IEhZUE8gfSBmcm9tIFwiLi4vLi4vLi4vbGlicy9IWVBPL0hZUE9cIjtcclxuaW1wb3J0IHsgdXVpZHY0IH0gZnJvbSBcIi4uLy4uLy4uL2xpYnMvdXRpbHNcIjtcclxuXHJcbmludGVyZmFjZSBJUHJvcHMge1xyXG4gIGlkPzogc3RyaW5nO1xyXG4gIHRpdGxlOiBzdHJpbmc7XHJcbiAgY2xhc3NOYW1lOiBzdHJpbmc7XHJcbiAgb25DbGljazogKGU6IEV2ZW50KSA9PiB2b2lkO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgQnV0dG9uID0gKHByb3BzOiBJUHJvcHMpID0+IHtcclxuICBjb25zdCBpZCA9IHByb3BzLmlkIHx8IHV1aWR2NCgpO1xyXG4gIHJldHVybiBuZXcgSFlQTyh7XHJcbiAgICB0ZW1wbGF0ZVBhdGg6IFwiYnV0dG9uLnRlbXBsYXRlLmh0bWxcIixcclxuICAgIGRhdGE6IHtcclxuICAgICAgaWQ6IGlkLFxyXG4gICAgICB0aXRsZTogcHJvcHMudGl0bGUsXHJcbiAgICAgIGNsYXNzTmFtZTogcHJvcHMuY2xhc3NOYW1lLFxyXG4gICAgfSxcclxuICB9KS5hZnRlclJlbmRlcigoKSA9PiB7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4ge1xyXG4gICAgICBwcm9wcy5vbkNsaWNrKGUpO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcbn07XHJcbiIsImltcG9ydCB7IGNvbnRhaW5lciwgcm91dGVyIH0gZnJvbSBcIi4uLy4uLy4uXCI7XHJcbmltcG9ydCB7IENoYXRMYXlvdXQgfSBmcm9tIFwiLi4vLi4vTGF5b3V0cy9DaGF0XCI7XHJcbmltcG9ydCB7IEhZUE8gfSBmcm9tIFwiLi4vLi4vLi4vbGlicy9IWVBPL0hZUE9cIjtcclxuaW1wb3J0IHsgSFRUUFRyYW5zcG9ydCB9IGZyb20gXCIuLi8uLi8uLi9saWJzL1RyYW5zcG9ydFwiO1xyXG5pbXBvcnQgeyBEZWxldGUgfSBmcm9tIFwiLi4vRGVsZXRlXCI7XHJcbmltcG9ydCB7IFZJRVdfTU9ERUwgfSBmcm9tIFwiLi4vLi4vLi4vVmlld01vZGVsXCI7XHJcbmltcG9ydCB7IElDaGF0Vmlld01vZGVsIH0gZnJvbSBcIi4uLy4uLy4uL1ZpZXdNb2RlbC9DaGF0Vmlld01vZGVsXCI7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElDaGF0RFRPIHtcclxuICB0aXRsZTogc3RyaW5nO1xyXG4gIGF2YXRhcjogc3RyaW5nIHwgbnVsbDtcclxuICBjcmVhdGVkX2J5OiBudW1iZXI7XHJcbiAgaWQ6IG51bWJlcjtcclxufVxyXG5cclxuaW50ZXJmYWNlIElQcm9wcyBleHRlbmRzIElDaGF0RFRPIHtcclxuICBjbGFzc05hbWU/OiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBDaGF0SXRlbSA9IChwcm9wczogSUNoYXREVE8pID0+IHtcclxuICByZXR1cm4gbmV3IEhZUE8oe1xyXG4gICAgdGVtcGxhdGVQYXRoOiBcImNoYXRJdGVtLnRlbXBsYXRlLmh0bWxcIixcclxuICAgIGRhdGE6IHtcclxuICAgICAgQ2hhdE5hbWU6IHByb3BzLnRpdGxlLFxyXG4gICAgICBsYXN0VGltZTogcHJvcHMuY3JlYXRlZF9ieSB8fCBcIjEwOjIyXCIsXHJcbiAgICAgIGxhc3RNZXNzYWdlOiBwcm9wcy5pZCB8fCBcIkhpLCBob3cgYXJlIHlvdT9cIixcclxuICAgICAgbm90aWZpY2F0aW9uQ291bnQ6IHByb3BzLmF2YXRhciB8fCAzLFxyXG4gICAgfSxcclxuICAgIGNoaWxkcmVuOiB7XHJcbiAgICAgIGRlbGV0ZTogRGVsZXRlKHtcclxuICAgICAgICBpZDogYGRlbGV0ZUl0ZW0ke3Byb3BzLmlkfWAsXHJcbiAgICAgICAgb25DbGljazogKCkgPT4ge1xyXG4gICAgICAgICAgY29uc3QgY2hhdFZpZXdNb2RlbCA9IGNvbnRhaW5lci5nZXQ8SUNoYXRWaWV3TW9kZWw+KFZJRVdfTU9ERUwuQ0hBVCk7XHJcbiAgICAgICAgICBjaGF0Vmlld01vZGVsLmRlbGV0ZUNoYXQoU3RyaW5nKHByb3BzLmlkKSkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgIENoYXRMYXlvdXQoY2hhdFZpZXdNb2RlbC5jaGF0cykucmVuZGVyKCk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG4gICAgICB9KSxcclxuICAgIH0sXHJcbiAgfSk7XHJcbn07XHJcbiIsImltcG9ydCB7IGNvbnRhaW5lciB9IGZyb20gXCIuLi8uLi8uLlwiO1xyXG5pbXBvcnQgeyBIWVBPIH0gZnJvbSBcIi4uLy4uLy4uL2xpYnMvSFlQTy9IWVBPXCI7XHJcbmltcG9ydCB7IFJlcXVpcmVkIH0gZnJvbSBcIi4uLy4uLy4uL2xpYnMvVmFsaWRhdG9ycy9SZXF1aXJlZFwiO1xyXG5pbXBvcnQgeyBBdHRlbnRpb25NZXNzYWdlIH0gZnJvbSBcIi4uL0F0dGVudGlvbk1lc3NhZ2VcIjtcclxuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSBcIi4uL0J1dHRvblwiO1xyXG5pbXBvcnQgeyBJbnB1dCB9IGZyb20gXCIuLi9JbnB1dFwiO1xyXG5pbXBvcnQgeyBJQ2hhdFZpZXdNb2RlbCB9IGZyb20gXCIuLi8uLi8uLi9WaWV3TW9kZWwvQ2hhdFZpZXdNb2RlbFwiO1xyXG5pbXBvcnQgeyBDaGF0TGF5b3V0IH0gZnJvbSBcIi4uLy4uL0xheW91dHMvQ2hhdFwiO1xyXG5pbXBvcnQgeyBWSUVXX01PREVMIH0gZnJvbSBcIi4uLy4uLy4uL1ZpZXdNb2RlbFwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IENyZWF0ZUNoYXRNb2RhbCA9ICgpID0+IHtcclxuICBjb25zdCBhdHRlbnRpb25NZXNzYWdlID0gQXR0ZW50aW9uTWVzc2FnZSgpO1xyXG4gIGNvbnN0IHN0YXRlID0gYXR0ZW50aW9uTWVzc2FnZS5nZXRTdGF0ZSgpO1xyXG5cclxuICBsZXQgQ2hhdE5hbWUgPSBcIlwiO1xyXG5cclxuICByZXR1cm4gbmV3IEhZUE8oe1xyXG4gICAgdGVtcGxhdGVQYXRoOiBcImNyZWF0ZWNoYXRtb2RhbC50ZW1wbGF0ZS5odG1sXCIsXHJcbiAgICBkYXRhOiB7fSxcclxuICAgIGNoaWxkcmVuOiB7XHJcbiAgICAgIGlucHV0OiBJbnB1dCh7XHJcbiAgICAgICAgbGFiZWw6IFwiQ2hhdCBuYW1lXCIsXHJcbiAgICAgICAgdHlwZTogXCJ0ZXh0XCIsXHJcbiAgICAgICAgbmFtZTogXCJjaGF0bmFtZVwiLFxyXG4gICAgICAgIGlkOiBcImNoYXRuYW1lXCIsXHJcbiAgICAgICAgY2xhc3NOYW1lOiBcImMtYy1tb2RhbF9faW5wdXRcIixcclxuICAgICAgICBDaGlsZEF0dGVudGlvbjogYXR0ZW50aW9uTWVzc2FnZSxcclxuICAgICAgICBvbkJsdXI6IChlOiBFdmVudCkgPT4ge1xyXG4gICAgICAgICAgY29uc3QgaW5wdXQgPSBlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgICAgICAgaWYgKFJlcXVpcmVkLmNoZWNrRnVuYyhpbnB1dC52YWx1ZSkpIHtcclxuICAgICAgICAgICAgc3RhdGUubWVzc2FnZSA9IFwiXCI7XHJcbiAgICAgICAgICAgIENoYXROYW1lID0gaW5wdXQudmFsdWU7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBzdGF0ZS5tZXNzYWdlID0gXCLim5Qg0L7QsdGP0LfQsNGC0LXQu9GM0L3QvtC1INC/0L7Qu9C1XCI7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgfSksXHJcbiAgICAgIGNyZWF0ZTogQnV0dG9uKHtcclxuICAgICAgICB0aXRsZTogXCLQodC+0LfQtNCw0YLRjFwiLFxyXG4gICAgICAgIGNsYXNzTmFtZTogXCJjcmVhdGUtYnV0dG9uXCIsXHJcbiAgICAgICAgb25DbGljazogKGU6IEV2ZW50KSA9PiB7XHJcbiAgICAgICAgICBpZiAoIUNoYXROYW1lKSB7XHJcbiAgICAgICAgICAgIHN0YXRlLm1lc3NhZ2UgPSBcIuKblCDQvtCx0Y/Qt9Cw0YLQtdC70YzQvdC+0LUg0L/QvtC70LVcIjtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNoYXRWaWV3TW9kZWwgPSBjb250YWluZXIuZ2V0PElDaGF0Vmlld01vZGVsPihcclxuICAgICAgICAgICAgICBWSUVXX01PREVMLkNIQVRcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgY2hhdFZpZXdNb2RlbC5zYXZlQ2hhdCh7IHRpdGxlOiBDaGF0TmFtZSB9KS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICBkb2N1bWVudFxyXG4gICAgICAgICAgICAgICAgLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJjLWMtbW9kYWxcIilbMF1cclxuICAgICAgICAgICAgICAgIC5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xyXG4gICAgICAgICAgICAgIENoYXRMYXlvdXQoY2hhdFZpZXdNb2RlbC5jaGF0cykucmVuZGVyKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0pLFxyXG4gICAgICBjYW5jZWw6IEJ1dHRvbih7XHJcbiAgICAgICAgdGl0bGU6IFwi0J7RgtC80LXQvdCwXCIsXHJcbiAgICAgICAgY2xhc3NOYW1lOiBcImNhbmNlbC1idXR0b25cIixcclxuICAgICAgICBvbkNsaWNrOiAoZTogRXZlbnQpID0+IHtcclxuICAgICAgICAgIGRvY3VtZW50XHJcbiAgICAgICAgICAgIC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiYy1jLW1vZGFsXCIpWzBdXHJcbiAgICAgICAgICAgIC5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgIH0pLFxyXG4gICAgfSxcclxuICB9KTtcclxufTtcclxuIiwiaW1wb3J0IHsgSFlQTyB9IGZyb20gXCIuLi8uLi8uLi9saWJzL0hZUE8vSFlQT1wiO1xyXG5cclxuaW50ZXJmYWNlIElQcm9wcyB7XHJcbiAgaWQ6IHN0cmluZztcclxuICBvbkNsaWNrOiAoKSA9PiB2b2lkO1xyXG59XHJcbmV4cG9ydCBjb25zdCBEZWxldGUgPSAocHJvcHM6IElQcm9wcykgPT4ge1xyXG4gIHJldHVybiBuZXcgSFlQTyh7XHJcbiAgICB0ZW1wbGF0ZVBhdGg6IFwiZGVsZXRlLnRlbXBsYXRlLmh0bWxcIixcclxuICAgIGRhdGE6IHtcclxuICAgICAgcGF0aDogXCIvbWVkaWEvVmVjdG9yLnN2Z1wiLFxyXG4gICAgICBpZDogcHJvcHMuaWQsXHJcbiAgICB9LFxyXG4gICAgY2hpbGRyZW46IHt9LFxyXG4gIH0pLmFmdGVyUmVuZGVyKCgpID0+IHtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHByb3BzLmlkKT8uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcclxuICAgICAgcHJvcHMub25DbGljaygpO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcbn07XHJcbiIsImltcG9ydCB7IEhZUE8gfSBmcm9tIFwiLi4vLi4vLi4vbGlicy9IWVBPL0hZUE9cIjtcclxuXHJcbmV4cG9ydCBjb25zdCBFbXB0eSA9ICgpID0+IHtcclxuICByZXR1cm4gbmV3IEhZUE8oe1xyXG4gICAgdGVtcGxhdGVQYXRoOiBcImVtcHR5LnRlbXBsYXRlLmh0bWxcIixcclxuICAgIGRhdGE6IHt9LFxyXG4gIH0pO1xyXG59O1xyXG4iLCJpbXBvcnQgeyBIWVBPIH0gZnJvbSBcIi4uLy4uLy4uL2xpYnMvSFlQTy9IWVBPXCI7XHJcbmltcG9ydCB7IEVtcHR5IH0gZnJvbSBcIi4uL0VtcHR5XCI7XHJcblxyXG5pbnRlcmZhY2UgSVByb3BzIHtcclxuICBsYWJlbDogc3RyaW5nO1xyXG4gIHR5cGU6IHN0cmluZztcclxuICBuYW1lOiBzdHJpbmc7XHJcbiAgaWQ6IHN0cmluZztcclxuICBjbGFzc05hbWU6IHN0cmluZztcclxuICBDaGlsZEF0dGVudGlvbj86IEhZUE87XHJcbiAgb25Gb2N1cz86IChlOiBFdmVudCkgPT4gdm9pZDtcclxuICBvbkJsdXI/OiAoZTogRXZlbnQpID0+IHZvaWQ7XHJcbn1cclxuXHJcbi8vQHRvZG86INC/0YDQuNC60YDRg9GC0LjRgtGMINGD0L3QuNC60LDQu9GM0L3QvtGB0YLRjCDQutCw0LbQtNC+0LPQviDRjdC70LXQvNC10L3RgtCwXHJcblxyXG5leHBvcnQgY29uc3QgSW5wdXQgPSAocHJvcHM6IElQcm9wcykgPT4ge1xyXG4gIHJldHVybiBuZXcgSFlQTyh7XHJcbiAgICB0ZW1wbGF0ZVBhdGg6IFwiaW5wdXQudGVtcGxhdGUuaHRtbFwiLFxyXG4gICAgZGF0YToge1xyXG4gICAgICBsYWJlbDoge1xyXG4gICAgICAgIG5hbWU6IHByb3BzLmxhYmVsLFxyXG4gICAgICB9LFxyXG4gICAgICBhdHJpYnV0ZToge1xyXG4gICAgICAgIHR5cGU6IHByb3BzLnR5cGUsXHJcbiAgICAgICAgbmFtZTogcHJvcHMubmFtZSxcclxuICAgICAgICBpZDogcHJvcHMuaWQsXHJcbiAgICAgICAgY2xhc3NOYW1lOiBwcm9wcy5jbGFzc05hbWUsXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgY2hpbGRyZW46IHtcclxuICAgICAgQXR0ZW50aW9uOiBwcm9wcy5DaGlsZEF0dGVudGlvbiB8fCBFbXB0eSgpLFxyXG4gICAgfSxcclxuICB9KS5hZnRlclJlbmRlcigoKSA9PiB7XHJcbiAgICBkb2N1bWVudFxyXG4gICAgICAuZ2V0RWxlbWVudEJ5SWQocHJvcHMuaWQpXHJcbiAgICAgID8uYWRkRXZlbnRMaXN0ZW5lcihcImZvY3VzXCIsIChlOiBGb2N1c0V2ZW50KSA9PiB7XHJcbiAgICAgICAgY29uc3QgaW5wdXQgPSBlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgICAgIGNvbnN0IGlucHV0TGFiZWwgPSBpbnB1dC5wYXJlbnRFbGVtZW50Py5wYXJlbnRFbGVtZW50Py5xdWVyeVNlbGVjdG9yKFxyXG4gICAgICAgICAgXCIuZm9ybS1pbnB1dF9fbGFiZWxcIlxyXG4gICAgICAgICk7XHJcbiAgICAgICAgaW5wdXRMYWJlbD8uY2xhc3NMaXN0LmFkZChcImZvcm0taW5wdXRfX2xhYmVsX3NlbGVjdFwiKTtcclxuICAgICAgICBwcm9wcy5vbkZvY3VzPy4oZSk7XHJcbiAgICAgIH0pO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocHJvcHMuaWQpPy5hZGRFdmVudExpc3RlbmVyKFwiYmx1clwiLCAoZTogRXZlbnQpID0+IHtcclxuICAgICAgY29uc3QgaW5wdXQgPSBlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgICBjb25zdCBpbnB1dExhYmVsID0gaW5wdXQucGFyZW50RWxlbWVudD8ucGFyZW50RWxlbWVudD8ucXVlcnlTZWxlY3RvcihcclxuICAgICAgICBcIi5mb3JtLWlucHV0X19sYWJlbFwiXHJcbiAgICAgICk7XHJcbiAgICAgIGlmICghaW5wdXQudmFsdWUpIHtcclxuICAgICAgICBpbnB1dExhYmVsPy5jbGFzc0xpc3QucmVtb3ZlKFwiZm9ybS1pbnB1dF9fbGFiZWxfc2VsZWN0XCIpO1xyXG4gICAgICB9XHJcbiAgICAgIHByb3BzLm9uQmx1cj8uKGUpO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcbn07XHJcbiIsImltcG9ydCB7IEhZUE8gfSBmcm9tIFwiLi4vLi4vLi4vbGlicy9IWVBPL0hZUE9cIjtcclxuaW1wb3J0IHsgcm91dGVyIH0gZnJvbSBcIi4uLy4uLy4uXCI7XHJcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gXCIuLi8uLi9Db21wb25lbnRzL0J1dHRvblwiO1xyXG5pbXBvcnQgeyBtZW1vaXplIH0gZnJvbSBcIi4uLy4uLy4uL2xpYnMvbW9taXplXCI7XHJcblxyXG5leHBvcnQgY29uc3QgQ2hhbmdlUGFzc3dvcmQgPSBtZW1vaXplKCgpID0+IHtcclxuICByZXR1cm4gbmV3IEhZUE8oe1xyXG4gICAgcmVuZGVyVG86IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiI3Jvb3RcIikgfHwgZG9jdW1lbnQuYm9keSxcclxuICAgIHRlbXBsYXRlUGF0aDogXCJjaGFuZ2VQYXNzd29yZC50ZW1wbGF0ZS5odG1sXCIsXHJcbiAgICBkYXRhOiB7fSxcclxuICAgIGNoaWxkcmVuOiB7XHJcbiAgICAgIHNhdmU6IEJ1dHRvbih7XHJcbiAgICAgICAgdGl0bGU6IFwi0KHQvtGF0YDQsNC90LjRgtGMXCIsXHJcbiAgICAgICAgY2xhc3NOYW1lOiBcInBhc3N3b3JkX2VkaXRfX2FjdGlvbl9fc2F2ZVwiLFxyXG4gICAgICAgIG9uQ2xpY2s6IChlOiBFdmVudCkgPT4ge1xyXG4gICAgICAgICAgcm91dGVyLmdvKFwiL3Byb2ZpbGVcIik7XHJcbiAgICAgICAgfSxcclxuICAgICAgfSksXHJcbiAgICB9LFxyXG4gIH0pO1xyXG59KTtcclxuIiwiaW1wb3J0IHsgSFlQTyB9IGZyb20gXCIuLi8uLi8uLi9saWJzL0hZUE8vSFlQT1wiO1xyXG5pbXBvcnQgeyBjb250YWluZXIsIHJvdXRlciB9IGZyb20gXCIuLi8uLi8uLlwiO1xyXG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tIFwiLi4vLi4vQ29tcG9uZW50cy9CdXR0b25cIjtcclxuaW1wb3J0IHsgSVByb2ZpbGVEVE8gfSBmcm9tIFwiLi4vUHJvZmlsZVwiO1xyXG5pbXBvcnQgeyBJVXNlclZpZXdNb2RlbCB9IGZyb20gXCIuLi8uLi8uLi9WaWV3TW9kZWwvVXNlclZpZXdNb2RlbFwiO1xyXG5pbXBvcnQgeyBWSUVXX01PREVMIH0gZnJvbSBcIi4uLy4uLy4uL1ZpZXdNb2RlbFwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IENoYW5nZVByb2ZpbGUgPSAoZGF0YTogSVByb2ZpbGVEVE8pID0+IHtcclxuICByZXR1cm4gbmV3IEhZUE8oe1xyXG4gICAgcmVuZGVyVG86IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm9vdFwiKSB8fCBkb2N1bWVudC5ib2R5LFxyXG4gICAgdGVtcGxhdGVQYXRoOiBcImNoYW5nZVByb2ZpbGUudGVtcGxhdGUuaHRtbFwiLFxyXG4gICAgZGF0YToge1xyXG4gICAgICBlbWFpbDogZGF0YT8uZW1haWwsXHJcbiAgICAgIGxvZ2luOiBkYXRhPy5sb2dpbixcclxuICAgICAgZmlyc3ROYW1lOiBkYXRhPy5maXJzdF9uYW1lLFxyXG4gICAgICBzZWNvbmROYW1lOiBkYXRhPy5zZWNvbmRfbmFtZSxcclxuICAgICAgZGlzcGxheU5hbWU6IGRhdGE/LmRpc3BsYXlfbmFtZSxcclxuICAgICAgcGhvbmU6IGRhdGE/LnBob25lLFxyXG4gICAgfSxcclxuICAgIGNoaWxkcmVuOiB7XHJcbiAgICAgIHNhdmU6IEJ1dHRvbih7XHJcbiAgICAgICAgdGl0bGU6IFwi0KHQvtGF0YDQsNC90LjRgtGMXCIsXHJcbiAgICAgICAgY2xhc3NOYW1lOiBcInByb2ZpbGVfZWRpdF9fYWN0aW9uX19zYXZlXCIsXHJcbiAgICAgICAgb25DbGljazogKGU6IEV2ZW50KSA9PiB7XHJcbiAgICAgICAgICBjb25zdCB1c2VyVmlld01vZGVsID0gY29udGFpbmVyLmdldDxJVXNlclZpZXdNb2RlbD4oVklFV19NT0RFTC5VU0VSKTtcclxuICAgICAgICAgIGlmICh1c2VyVmlld01vZGVsLnVzZXIpIHtcclxuICAgICAgICAgICAgdXNlclZpZXdNb2RlbC51c2VyLmRpc3BsYXlfbmFtZSA9ICdpdmFuJ1xyXG4gICAgICAgICAgICB1c2VyVmlld01vZGVsLnNhdmVVc2VyKHVzZXJWaWV3TW9kZWwudXNlcilcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICB9KSxcclxuICAgIH0sXHJcbiAgfSk7XHJcbn07XHJcbiIsImltcG9ydCB7IEhZUE8gfSBmcm9tIFwiLi4vLi4vLi4vbGlicy9IWVBPL0hZUE9cIjtcclxuaW1wb3J0IHsgQ2hhdEl0ZW0sIElDaGF0RFRPIH0gZnJvbSBcIi4uLy4uL0NvbXBvbmVudHMvQ2hhdEl0ZW1cIjtcclxuaW1wb3J0IHsgcm91dGVyIH0gZnJvbSBcIi4uLy4uLy4uXCI7XHJcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gXCIuLi8uLi9Db21wb25lbnRzL0J1dHRvblwiO1xyXG5pbXBvcnQgeyBFbXB0eSB9IGZyb20gXCIuLi8uLi9Db21wb25lbnRzL0VtcHR5XCI7XHJcbmltcG9ydCB7IENyZWF0ZUNoYXRNb2RhbCB9IGZyb20gXCIuLi8uLi9Db21wb25lbnRzL0NyZWF0ZUNoYXRNb2RhbFwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IENoYXRMYXlvdXQgPSAocmVzdWx0OiBJQ2hhdERUT1tdKSA9PiB7XHJcbiAgY29uc3QgQ2hhdEl0ZW1MaXN0OiBIWVBPW10gPSBbXTtcclxuICBpZiAoQXJyYXkuaXNBcnJheShyZXN1bHQpKSB7XHJcbiAgICByZXN1bHQuZm9yRWFjaCgoaXRlbTogYW55KSA9PiB7XHJcbiAgICAgIENoYXRJdGVtTGlzdC5wdXNoKENoYXRJdGVtKHsgLi4uaXRlbSB9KSk7XHJcbiAgICB9KTtcclxuICB9IGVsc2Uge1xyXG4gICAgQ2hhdEl0ZW1MaXN0LnB1c2goRW1wdHkoKSk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gbmV3IEhZUE8oe1xyXG4gICAgcmVuZGVyVG86IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicm9vdFwiKSB8fCBkb2N1bWVudC5ib2R5LFxyXG4gICAgdGVtcGxhdGVQYXRoOiBcImNoYXQudGVtcGxhdGUuaHRtbFwiLFxyXG4gICAgZGF0YToge30sXHJcbiAgICBjaGlsZHJlbjoge1xyXG4gICAgICBQcm9maWxlTGluazogQnV0dG9uKHtcclxuICAgICAgICB0aXRsZTogXCJQcm9maWxlXCIsXHJcbiAgICAgICAgY2xhc3NOYW1lOiBcInByb2ZpbGUtbGlua19fYnV0dG9uXCIsXHJcbiAgICAgICAgb25DbGljazogKGU6IEV2ZW50KSA9PiB7XHJcbiAgICAgICAgICByb3V0ZXIuZ28oXCIvcHJvZmlsZVwiKTtcclxuICAgICAgICB9LFxyXG4gICAgICB9KSxcclxuICAgICAgY2hhdEl0ZW06IENoYXRJdGVtTGlzdCxcclxuICAgICAgY3JlYXRlQ2hhdE1vZGFsOiBDcmVhdGVDaGF0TW9kYWwoKSxcclxuICAgICAgY3JlYXRlQ2hhdEJ1dHRvbjogQnV0dG9uKHtcclxuICAgICAgICB0aXRsZTogXCIrXCIsXHJcbiAgICAgICAgY2xhc3NOYW1lOiBcIm5hdmlnYXRpb25fX2NyZWF0ZUNoYXRCdXR0b25cIixcclxuICAgICAgICBvbkNsaWNrOiAoKSA9PiB7XHJcbiAgICAgICAgICBkb2N1bWVudFxyXG4gICAgICAgICAgICAuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImMtYy1tb2RhbFwiKVswXVxyXG4gICAgICAgICAgICAuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcclxuICAgICAgICB9LFxyXG4gICAgICB9KSxcclxuICAgIH0sXHJcbiAgfSk7XHJcbn07XHJcbiIsImltcG9ydCB7IElucHV0IH0gZnJvbSBcIi4uLy4uL0NvbXBvbmVudHMvSW5wdXRcIjtcclxuaW1wb3J0IHsgUmVxdWlyZWQgfSBmcm9tIFwiLi4vLi4vLi4vbGlicy9WYWxpZGF0b3JzL1JlcXVpcmVkXCI7XHJcbmltcG9ydCB7IEF0dGVudGlvbk1lc3NhZ2UgfSBmcm9tIFwiLi4vLi4vQ29tcG9uZW50cy9BdHRlbnRpb25NZXNzYWdlXCI7XHJcbmltcG9ydCB7IHJvdXRlciB9IGZyb20gXCIuLi8uLi8uLi9pbmRleFwiO1xyXG5pbXBvcnQgeyBIVFRQVHJhbnNwb3J0IH0gZnJvbSBcIi4uLy4uLy4uL2xpYnMvVHJhbnNwb3J0XCI7XHJcbmltcG9ydCB7IEhZUE8gfSBmcm9tIFwiLi4vLi4vLi4vbGlicy9IWVBPL0hZUE9cIjtcclxuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSBcIi4uLy4uL0NvbXBvbmVudHMvQnV0dG9uXCI7XHJcbmltcG9ydCB7IElQcm9maWxlRFRPIH0gZnJvbSBcIi4uL1Byb2ZpbGVcIjtcclxuXHJcbi8qKlxyXG4gKiBubm5ycnIxMTFOTlxyXG4gKi9cclxuXHJcbmV4cG9ydCBjb25zdCBMb2dpbkxheW91dCA9ICh1c2VyOiBJUHJvZmlsZURUTyk6IEhZUE8gPT4ge1xyXG4gIGlmICh1c2VyICYmIHVzZXIuaWQpIHtcclxuICAgIHJvdXRlci5nbyhcIi9jaGF0XCIpO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgYXR0ZW50aW9uTG9naW4gPSBBdHRlbnRpb25NZXNzYWdlKCk7XHJcbiAgY29uc3QgYXR0ZW50aW9uTG9naW5TdG9yZSA9IGF0dGVudGlvbkxvZ2luLmdldFN0YXRlKCk7XHJcbiAgY29uc3QgYXR0ZW50aW9uUGFzcyA9IEF0dGVudGlvbk1lc3NhZ2UoKTtcclxuICBjb25zdCBhdHRlbnRpb25QYXNzU3RvcmUgPSBhdHRlbnRpb25QYXNzLmdldFN0YXRlKCk7XHJcblxyXG4gIGNvbnN0IEZvcm1EYXRhOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XHJcbiAgcmV0dXJuIG5ldyBIWVBPKHtcclxuICAgIHJlbmRlclRvOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvb3RcIikgfHwgZG9jdW1lbnQuYm9keSxcclxuICAgIHRlbXBsYXRlUGF0aDogXCJsb2dpbi50ZW1wbGF0ZS5odG1sXCIsXHJcbiAgICBkYXRhOiB7XHJcbiAgICAgIEZvcm1OYW1lOiBcItCS0YXQvtC0XCIsXHJcbiAgICB9LFxyXG4gICAgY2hpbGRyZW46IHtcclxuICAgICAgSW5wdXRMb2dpbjogSW5wdXQoe1xyXG4gICAgICAgIGxhYmVsOiBcItCb0L7Qs9C40L1cIixcclxuICAgICAgICB0eXBlOiBcInRleHRcIixcclxuICAgICAgICBuYW1lOiBcImxvZ2luXCIsXHJcbiAgICAgICAgaWQ6IFwiZm9ybS1pbnB1dC1sb2dpblwiLFxyXG4gICAgICAgIGNsYXNzTmFtZTogXCJmb3JtLWxvZ2luX19mb3JtLWlucHV0XCIsXHJcbiAgICAgICAgb25CbHVyOiAoZTogRXZlbnQpID0+IHtcclxuICAgICAgICAgIGNvbnN0IGlucHV0ID0gZS50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICAgICAgICAgIGNvbnN0IGNoZWNrID0gUmVxdWlyZWQuY2hlY2tGdW5jKGlucHV0Py52YWx1ZSk7XHJcbiAgICAgICAgICBpZiAoIWNoZWNrKSB7XHJcbiAgICAgICAgICAgIGF0dGVudGlvbkxvZ2luU3RvcmUubWVzc2FnZSA9IFwi4puUINC+0LHRj9C30LDRgtC10LvRjNC90L7QtSDQv9C+0LvQtVwiO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgYXR0ZW50aW9uTG9naW5TdG9yZS5tZXNzYWdlID0gXCJcIjtcclxuICAgICAgICAgICAgRm9ybURhdGFbXCJsb2dpblwiXSA9IGlucHV0LnZhbHVlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgQ2hpbGRBdHRlbnRpb246IGF0dGVudGlvbkxvZ2luLFxyXG4gICAgICB9KSxcclxuICAgICAgSW5wdXRQYXNzd29yZDogSW5wdXQoe1xyXG4gICAgICAgIGxhYmVsOiBcItCf0LDRgNC+0LvRjFwiLFxyXG4gICAgICAgIHR5cGU6IFwicGFzc3dvcmRcIixcclxuICAgICAgICBuYW1lOiBcInBhc3N3b3JkXCIsXHJcbiAgICAgICAgaWQ6IFwiZm9ybS1pbnB1dC1wYXNzd29yZFwiLFxyXG4gICAgICAgIGNsYXNzTmFtZTogXCJmb3JtLWxvZ2luX19mb3JtLWlucHV0XCIsXHJcbiAgICAgICAgb25CbHVyOiAoZTogRXZlbnQpID0+IHtcclxuICAgICAgICAgIGNvbnN0IGlucHV0ID0gZS50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICAgICAgICAgIGlmICghUmVxdWlyZWQuY2hlY2tGdW5jKGlucHV0LnZhbHVlKSkge1xyXG4gICAgICAgICAgICBhdHRlbnRpb25QYXNzU3RvcmUubWVzc2FnZSA9IFwi4puUINC+0LHRj9C30LDRgtC10LvRjNC90L7QtSDQv9C+0LvQtVwiO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgYXR0ZW50aW9uUGFzc1N0b3JlLm1lc3NhZ2UgPSBcIlwiO1xyXG4gICAgICAgICAgICBGb3JtRGF0YVtcInBhc3N3b3JkXCJdID0gaW5wdXQudmFsdWU7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBDaGlsZEF0dGVudGlvbjogYXR0ZW50aW9uUGFzcyxcclxuICAgICAgfSksXHJcbiAgICAgIEJ1dHRvbjogQnV0dG9uKHtcclxuICAgICAgICB0aXRsZTogXCLQkNCy0YLQvtGA0LjQt9C+0LLQsNGC0YzRgdGPXCIsXHJcbiAgICAgICAgY2xhc3NOYW1lOiBcImZvcm0tYnV0dG9uXCIsXHJcbiAgICAgICAgb25DbGljazogKGU6IEV2ZW50KSA9PiB7XHJcbiAgICAgICAgICBjb25zdCBkYXRhOiB7IFtrZXk6IHN0cmluZ106IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gfSA9IHtcclxuICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgIGxvZ2luOiBGb3JtRGF0YS5sb2dpbixcclxuICAgICAgICAgICAgICBwYXNzd29yZDogRm9ybURhdGEucGFzc3dvcmQsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICBcIkNvbnRlbnQtdHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIH07XHJcbiAgICAgICAgICBIVFRQVHJhbnNwb3J0LmdldEluc3RhbmNlKClcclxuICAgICAgICAgICAgLlBPU1QoXCIvYXV0aC9zaWduaW5cIiwgZGF0YSlcclxuICAgICAgICAgICAgLnRoZW4oKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICAgIGlmIChyZXN1bHQuc3RhdHVzIDwgMzAwKSB7XHJcbiAgICAgICAgICAgICAgICByb3V0ZXIuZ28oXCIvY2hhdFwiKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcbiAgICAgIH0pLFxyXG4gICAgICBMaW5rVG9SZWdpc3RyYXRpb246IEJ1dHRvbih7XHJcbiAgICAgICAgdGl0bGU6IFwi0JfQsNGA0LXQs9C40YHRgtGA0LjRgNC+0LLQsNGC0YzRgdGPXCIsXHJcbiAgICAgICAgY2xhc3NOYW1lOiBcImZvcm0tbGlua1wiLFxyXG4gICAgICAgIG9uQ2xpY2s6IChlOiBFdmVudCkgPT4ge1xyXG4gICAgICAgICAgcm91dGVyLmdvKFwiL3JlZ2lzdHJhdGlvblwiKTtcclxuICAgICAgICB9LFxyXG4gICAgICB9KSxcclxuICAgIH0sXHJcbiAgfSk7XHJcbn07XHJcbiIsImltcG9ydCB7IEhZUE8gfSBmcm9tIFwiLi4vLi4vLi4vbGlicy9IWVBPL0hZUE9cIjtcclxuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSBcIi4uLy4uL0NvbXBvbmVudHMvQnV0dG9uXCI7XHJcbmltcG9ydCB7IHJvdXRlciB9IGZyb20gXCIuLi8uLi8uLlwiO1xyXG5pbXBvcnQgeyBIVFRQVHJhbnNwb3J0IH0gZnJvbSBcIi4uLy4uLy4uL2xpYnMvVHJhbnNwb3J0XCI7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElQcm9maWxlRFRPIHtcclxuICBpZDogbnVtYmVyO1xyXG4gIGRpc3BsYXlfbmFtZTogc3RyaW5nO1xyXG4gIGVtYWlsOiBzdHJpbmc7XHJcbiAgZmlyc3RfbmFtZTogc3RyaW5nO1xyXG4gIHNlY29uZF9uYW1lOiBzdHJpbmc7XHJcbiAgbG9naW46IHN0cmluZztcclxuICBwaG9uZTogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgUHJvZmlsZUxheW91dCA9IChkYXRhOiBJUHJvZmlsZURUTykgPT4ge1xyXG4gIHJldHVybiBuZXcgSFlQTyh7XHJcbiAgICByZW5kZXJUbzogPEhUTUxFbGVtZW50PmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcm9vdFwiKSxcclxuICAgIHRlbXBsYXRlUGF0aDogXCJwcm9maWxlLnRlbXBsYXRlLmh0bWxcIixcclxuICAgIGRhdGE6IHtcclxuICAgICAgLi4uZGF0YSxcclxuICAgIH0sXHJcbiAgICBjaGlsZHJlbjoge1xyXG4gICAgICBFZGl0UHJvZmlsZUxpbms6IEJ1dHRvbih7XHJcbiAgICAgICAgdGl0bGU6IFwi0JjQt9C80LXQvdC40YLRjCDQtNCw0L3QvdGL0LVcIixcclxuICAgICAgICBjbGFzc05hbWU6IFwiYWN0aW9uX19jaGFuZ2UtcHJvZmlsZVwiLFxyXG4gICAgICAgIG9uQ2xpY2s6ICgpID0+IHtcclxuICAgICAgICAgIHJvdXRlci5nbyhcIi9lZGl0cHJvZmlsZVwiKTtcclxuICAgICAgICB9LFxyXG4gICAgICB9KSxcclxuICAgICAgRWRpdFBhc3N3b3JkTGluazogQnV0dG9uKHtcclxuICAgICAgICB0aXRsZTogXCLQmNC30LzQtdC90LjRgtGMINC/0LDRgNC+0LvRjFwiLFxyXG4gICAgICAgIGNsYXNzTmFtZTogXCJhY3Rpb25fX2NoYW5nZS1wYXNzd29yZFwiLFxyXG4gICAgICAgIG9uQ2xpY2s6ICgpID0+IHtcclxuICAgICAgICAgIHJvdXRlci5nbyhcIi9lZGl0cGFzc3dvcmRcIik7XHJcbiAgICAgICAgfSxcclxuICAgICAgfSksXHJcbiAgICAgIEJhY2tMaW5rOiBCdXR0b24oe1xyXG4gICAgICAgIHRpdGxlOiBcItCd0LDQt9Cw0LRcIixcclxuICAgICAgICBjbGFzc05hbWU6IFwiYWN0aW9uX19iYWNrXCIsXHJcbiAgICAgICAgb25DbGljazogKCkgPT4ge1xyXG4gICAgICAgICAgcm91dGVyLmdvKFwiL2NoYXRcIik7XHJcbiAgICAgICAgfSxcclxuICAgICAgfSksXHJcbiAgICAgIEV4aXRMaW5rOiBCdXR0b24oe1xyXG4gICAgICAgIHRpdGxlOiBcItCS0YvQudGC0LhcIixcclxuICAgICAgICBjbGFzc05hbWU6IFwiYWN0aW9uX19leGl0XCIsXHJcbiAgICAgICAgb25DbGljazogKCkgPT4ge1xyXG4gICAgICAgICAgSFRUUFRyYW5zcG9ydC5nZXRJbnN0YW5jZSgpXHJcbiAgICAgICAgICAgIC5QT1NUKFwiL2F1dGgvbG9nb3V0XCIpXHJcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICByb3V0ZXIuZ28oXCIvXCIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG4gICAgICB9KSxcclxuICAgIH0sXHJcbiAgfSk7XHJcbn07XHJcbiIsImltcG9ydCB7IEhZUE8gfSBmcm9tIFwiLi4vLi4vLi4vbGlicy9IWVBPL0hZUE9cIjtcclxuaW1wb3J0IHsgSW5wdXQgfSBmcm9tIFwiLi4vLi4vQ29tcG9uZW50cy9JbnB1dFwiO1xyXG4vLyBpbXBvcnQgeyBWYWxpZGF0b3IsIFJ1bGUgfSBmcm9tIFwiLi4vLi4vbGlicy9WYWxpZGF0b3JcIjtcclxuaW1wb3J0IHsgRW1haWxWYWxpZGF0b3IgfSBmcm9tIFwiLi4vLi4vLi4vbGlicy9WYWxpZGF0b3JzL0VtYWlsXCI7XHJcbmltcG9ydCB7IFJlcXVpcmVkIH0gZnJvbSBcIi4uLy4uLy4uL2xpYnMvVmFsaWRhdG9ycy9SZXF1aXJlZFwiO1xyXG5pbXBvcnQgeyBBdHRlbnRpb25NZXNzYWdlIH0gZnJvbSBcIi4uLy4uL0NvbXBvbmVudHMvQXR0ZW50aW9uTWVzc2FnZVwiO1xyXG5pbXBvcnQgeyByb3V0ZXIgfSBmcm9tIFwiLi4vLi4vLi5cIjtcclxuaW1wb3J0IHsgSFRUUFRyYW5zcG9ydCB9IGZyb20gXCIuLi8uLi8uLi9saWJzL1RyYW5zcG9ydFwiO1xyXG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tIFwiLi4vLi4vQ29tcG9uZW50cy9CdXR0b25cIjtcclxuXHJcbmV4cG9ydCBjb25zdCBSZWdpc3RyYXRpb25MYXlvdXQgPSAoKSA9PiB7XHJcbiAgY29uc3QgQXR0ZW50aW9uRW1haWwgPSBBdHRlbnRpb25NZXNzYWdlKCk7XHJcbiAgY29uc3QgQXR0ZW50aW9uTG9naW4gPSBBdHRlbnRpb25NZXNzYWdlKCk7XHJcbiAgY29uc3QgQXR0ZW50aW9uUGFzc3dvcmQgPSBBdHRlbnRpb25NZXNzYWdlKCk7XHJcbiAgY29uc3QgQXR0ZW50aW9uUGFzc3dvcmREb3VibGUgPSBBdHRlbnRpb25NZXNzYWdlKCk7XHJcbiAgY29uc3QgQXR0ZW50aW9uRmlyc3ROYW1lID0gQXR0ZW50aW9uTWVzc2FnZSgpO1xyXG4gIGNvbnN0IEF0dGVudGlvblNlY29uZE5hbWUgPSBBdHRlbnRpb25NZXNzYWdlKCk7XHJcbiAgY29uc3QgQXR0ZW50aW9uUGhvbmUgPSBBdHRlbnRpb25NZXNzYWdlKCk7XHJcblxyXG4gIGNvbnN0IEZvcm1EYXRhOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XHJcblxyXG4gIHJldHVybiBuZXcgSFlQTyh7XHJcbiAgICByZW5kZXJUbzogPEhUTUxFbGVtZW50PmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcm9vdFwiKSxcclxuICAgIHRlbXBsYXRlUGF0aDogXCJyZWdpc3RyYXRpb24udGVtcGxhdGUuaHRtbFwiLFxyXG4gICAgZGF0YToge1xyXG4gICAgICBmb3JtVGl0bGU6IFwi0KDQtdCz0LjRgdGC0YDQsNGG0LjRj1wiLFxyXG4gICAgfSxcclxuICAgIGNoaWxkcmVuOiB7XHJcbiAgICAgIElucHV0RW1haWw6IElucHV0KHtcclxuICAgICAgICBsYWJlbDogXCLQn9C+0YfRgtCwXCIsXHJcbiAgICAgICAgdHlwZTogXCJ0ZXh0XCIsXHJcbiAgICAgICAgbmFtZTogXCJlbWFpbFwiLFxyXG4gICAgICAgIGlkOiBcImZvcm1fX2VtYWlsX19pbnB1dFwiLFxyXG4gICAgICAgIGNsYXNzTmFtZTogXCJmb3JtLXJlZ19fZm9ybS1pbnB1dFwiLFxyXG4gICAgICAgIENoaWxkQXR0ZW50aW9uOiBBdHRlbnRpb25FbWFpbCxcclxuICAgICAgICBvbkJsdXI6IChlOiBFdmVudCkgPT4ge1xyXG4gICAgICAgICAgY29uc3Qgc3RhdGUgPSBBdHRlbnRpb25FbWFpbC5nZXRTdGF0ZSgpO1xyXG4gICAgICAgICAgY29uc3QgaW5wdXQgPSBlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgICAgICAgaWYgKEVtYWlsVmFsaWRhdG9yLmNoZWNrRnVuYyhpbnB1dC52YWx1ZSkpIHtcclxuICAgICAgICAgICAgRm9ybURhdGFbXCJlbWFpbFwiXSA9IGlucHV0LnZhbHVlO1xyXG4gICAgICAgICAgICBzdGF0ZS5tZXNzYWdlID0gXCJcIjtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHN0YXRlLm1lc3NhZ2UgPSBcIuKblCDRjdGC0L4g0L3QtSDQv9C+0YXQvtC20LUg0L3QsCDQsNC00YDQtdGBINGN0LvQtdC60YLRgNC+0L3QvdC+0Lkg0L/QvtGH0YLRi1wiO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0pLFxyXG4gICAgICBJbnB1dExvZ2luOiBJbnB1dCh7XHJcbiAgICAgICAgbGFiZWw6IFwi0JvQvtCz0LjQvVwiLFxyXG4gICAgICAgIHR5cGU6IFwidGV4dFwiLFxyXG4gICAgICAgIG5hbWU6IFwibG9naW5cIixcclxuICAgICAgICBpZDogXCJmb3JtX19sb2dpbl9faW5wdXRcIixcclxuICAgICAgICBjbGFzc05hbWU6IFwiZm9ybS1yZWdfX2Zvcm0taW5wdXRcIixcclxuICAgICAgICBDaGlsZEF0dGVudGlvbjogQXR0ZW50aW9uTG9naW4sXHJcbiAgICAgICAgb25CbHVyOiAoZTogRXZlbnQpID0+IHtcclxuICAgICAgICAgIGNvbnN0IHN0YXRlID0gQXR0ZW50aW9uTG9naW4uZ2V0U3RhdGUoKTtcclxuICAgICAgICAgIGNvbnN0IGlucHV0ID0gZS50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICAgICAgICAgIGlmIChSZXF1aXJlZC5jaGVja0Z1bmMoaW5wdXQudmFsdWUpKSB7XHJcbiAgICAgICAgICAgIEZvcm1EYXRhW1wibG9naW5cIl0gPSBpbnB1dC52YWx1ZTtcclxuICAgICAgICAgICAgc3RhdGUubWVzc2FnZSA9IFwiXCI7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBzdGF0ZS5tZXNzYWdlID0gXCLim5Qg0L7QsdGP0LfQsNGC0LXQu9GM0L3QvtC1INC/0L7Qu9C1XCI7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgfSksXHJcbiAgICAgIEZpcnN0TmFtZTogSW5wdXQoe1xyXG4gICAgICAgIGxhYmVsOiBcItCY0LzRj1wiLFxyXG4gICAgICAgIHR5cGU6IFwidGV4dFwiLFxyXG4gICAgICAgIG5hbWU6IFwiZmlyc3RfbmFtZVwiLFxyXG4gICAgICAgIGlkOiBcImZvcm1fX2ZpcnN0X25hbWVfX2lucHV0XCIsXHJcbiAgICAgICAgY2xhc3NOYW1lOiBcImZvcm0tcmVnX19mb3JtLWlucHV0XCIsXHJcbiAgICAgICAgQ2hpbGRBdHRlbnRpb246IEF0dGVudGlvbkZpcnN0TmFtZSxcclxuICAgICAgICBvbkJsdXI6IChlOiBFdmVudCkgPT4ge1xyXG4gICAgICAgICAgY29uc3Qgc3RhdGUgPSBBdHRlbnRpb25GaXJzdE5hbWUuZ2V0U3RhdGUoKTtcclxuICAgICAgICAgIGNvbnN0IGlucHV0ID0gZS50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICAgICAgICAgIGlmIChSZXF1aXJlZC5jaGVja0Z1bmMoaW5wdXQudmFsdWUpKSB7XHJcbiAgICAgICAgICAgIEZvcm1EYXRhW1wiZmlyc3RfbmFtZVwiXSA9IGlucHV0LnZhbHVlO1xyXG4gICAgICAgICAgICBzdGF0ZS5tZXNzYWdlID0gXCJcIjtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHN0YXRlLm1lc3NhZ2UgPSBcIuKblCDQvtCx0Y/Qt9Cw0YLQtdC70YzQvdC+0LUg0L/QvtC70LVcIjtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICB9KSxcclxuICAgICAgU2Vjb25kTmFtZTogSW5wdXQoe1xyXG4gICAgICAgIGxhYmVsOiBcItCk0LDQvNC40LvQuNGPXCIsXHJcbiAgICAgICAgdHlwZTogXCJ0ZXh0XCIsXHJcbiAgICAgICAgbmFtZTogXCJzZWNvbmRfbmFtZVwiLFxyXG4gICAgICAgIGlkOiBcImZvcm1fX3NlY29uZF9uYW1lX19pbnB1dFwiLFxyXG4gICAgICAgIGNsYXNzTmFtZTogXCJmb3JtLXJlZ19fZm9ybS1pbnB1dFwiLFxyXG4gICAgICAgIENoaWxkQXR0ZW50aW9uOiBBdHRlbnRpb25TZWNvbmROYW1lLFxyXG4gICAgICAgIG9uQmx1cjogKGU6IEV2ZW50KSA9PiB7XHJcbiAgICAgICAgICBjb25zdCBzdGF0ZSA9IEF0dGVudGlvblNlY29uZE5hbWUuZ2V0U3RhdGUoKTtcclxuICAgICAgICAgIGNvbnN0IGlucHV0ID0gZS50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICAgICAgICAgIGlmIChSZXF1aXJlZC5jaGVja0Z1bmMoaW5wdXQudmFsdWUpKSB7XHJcbiAgICAgICAgICAgIEZvcm1EYXRhW1wic2Vjb25kX25hbWVcIl0gPSBpbnB1dC52YWx1ZTtcclxuICAgICAgICAgICAgc3RhdGUubWVzc2FnZSA9IFwiXCI7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBzdGF0ZS5tZXNzYWdlID0gXCLim5Qg0L7QsdGP0LfQsNGC0LXQu9GM0L3QvtC1INC/0L7Qu9C1XCI7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgfSksXHJcbiAgICAgIFBob25lOiBJbnB1dCh7XHJcbiAgICAgICAgbGFiZWw6IFwi0KLQtdC70LXRhNC+0L1cIixcclxuICAgICAgICB0eXBlOiBcInRleHRcIixcclxuICAgICAgICBuYW1lOiBcInBob25lXCIsXHJcbiAgICAgICAgaWQ6IFwiZm9ybV9fcGhvbmVfX2lucHV0XCIsXHJcbiAgICAgICAgY2xhc3NOYW1lOiBcImZvcm0tcmVnX19mb3JtLWlucHV0XCIsXHJcbiAgICAgICAgQ2hpbGRBdHRlbnRpb246IEF0dGVudGlvblBob25lLFxyXG4gICAgICAgIG9uQmx1cjogKGU6IEV2ZW50KSA9PiB7XHJcbiAgICAgICAgICBjb25zdCBzdGF0ZSA9IEF0dGVudGlvblBob25lLmdldFN0YXRlKCk7XHJcbiAgICAgICAgICBjb25zdCBpbnB1dCA9IGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICAgICAgICBpZiAoUmVxdWlyZWQuY2hlY2tGdW5jKGlucHV0LnZhbHVlKSkge1xyXG4gICAgICAgICAgICBGb3JtRGF0YVtcInBob25lXCJdID0gaW5wdXQudmFsdWU7XHJcbiAgICAgICAgICAgIHN0YXRlLm1lc3NhZ2UgPSBcIlwiO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgc3RhdGUubWVzc2FnZSA9IFwi4puUINC+0LHRj9C30LDRgtC10LvRjNC90L7QtSDQv9C+0LvQtVwiO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0pLFxyXG4gICAgICBQYXNzd29yZDogSW5wdXQoe1xyXG4gICAgICAgIGxhYmVsOiBcItCf0LDRgNC+0LvRjFwiLFxyXG4gICAgICAgIHR5cGU6IFwicGFzc3dvcmRcIixcclxuICAgICAgICBuYW1lOiBcInBhc3N3b3JkXCIsXHJcbiAgICAgICAgaWQ6IFwiZm9ybV9fcGFzc3dvcmRfX2lucHV0XCIsXHJcbiAgICAgICAgY2xhc3NOYW1lOiBcImZvcm0tcmVnX19mb3JtLWlucHV0XCIsXHJcbiAgICAgICAgQ2hpbGRBdHRlbnRpb246IEF0dGVudGlvblBhc3N3b3JkLFxyXG4gICAgICAgIG9uQmx1cjogKGU6IEV2ZW50KSA9PiB7XHJcbiAgICAgICAgICBjb25zdCBpbnB1dCA9IGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICAgICAgICBjb25zdCBzdGF0ZSA9IEF0dGVudGlvblBhc3N3b3JkLmdldFN0YXRlKCk7XHJcbiAgICAgICAgICBjb25zdCBzdGF0ZUQgPSBBdHRlbnRpb25QYXNzd29yZERvdWJsZS5nZXRTdGF0ZSgpO1xyXG4gICAgICAgICAgaWYgKFJlcXVpcmVkLmNoZWNrRnVuYyhpbnB1dC52YWx1ZSkpIHtcclxuICAgICAgICAgICAgRm9ybURhdGFbXCJwYXNzd29yZFwiXSA9IGlucHV0LnZhbHVlO1xyXG4gICAgICAgICAgICBzdGF0ZS5tZXNzYWdlID0gXCJcIjtcclxuICAgICAgICAgICAgaWYgKEZvcm1EYXRhW1wicGFzc3dvcmRcIl0gIT09IEZvcm1EYXRhW1wiZG91YmxlcGFzc3dvcmRcIl0pIHtcclxuICAgICAgICAgICAgICBzdGF0ZUQubWVzc2FnZSA9IFwi8J+UpdC/0LDRgNC+0LvQuCDQvdC1INGB0L7QstC/0LDQtNCw0Y7RglwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBzdGF0ZS5tZXNzYWdlID0gXCLim5Qg0L7QsdGP0LfQsNGC0LXQu9GM0L3QvtC1INC/0L7Qu9C1XCI7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgfSksXHJcbiAgICAgIFBhc3N3b3JkRG91YmxlOiBJbnB1dCh7XHJcbiAgICAgICAgbGFiZWw6IFwi0J/QsNGA0L7Qu9GMXCIsXHJcbiAgICAgICAgdHlwZTogXCJwYXNzd29yZFwiLFxyXG4gICAgICAgIG5hbWU6IFwiZG91YmxlcGFzc3dvcmRcIixcclxuICAgICAgICBpZDogXCJmb3JtX19kb3VibGVwYXNzd29yZF9faW5wdXRcIixcclxuICAgICAgICBjbGFzc05hbWU6IFwiZm9ybS1yZWdfX2Zvcm0taW5wdXRcIixcclxuICAgICAgICBDaGlsZEF0dGVudGlvbjogQXR0ZW50aW9uUGFzc3dvcmREb3VibGUsXHJcbiAgICAgICAgb25CbHVyOiAoZTogRXZlbnQpID0+IHtcclxuICAgICAgICAgIGNvbnN0IGlucHV0ID0gZS50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICAgICAgICAgIGNvbnN0IHN0YXRlID0gQXR0ZW50aW9uUGFzc3dvcmREb3VibGUuZ2V0U3RhdGUoKTtcclxuICAgICAgICAgIGlmIChSZXF1aXJlZC5jaGVja0Z1bmMoaW5wdXQudmFsdWUpKSB7XHJcbiAgICAgICAgICAgIEZvcm1EYXRhW1wiZG91YmxlcGFzc3dvcmRcIl0gPSBpbnB1dC52YWx1ZTtcclxuICAgICAgICAgICAgc3RhdGUubWVzc2FnZSA9IFwiXCI7XHJcbiAgICAgICAgICAgIGlmIChGb3JtRGF0YVtcInBhc3N3b3JkXCJdICE9PSBGb3JtRGF0YVtcImRvdWJsZXBhc3N3b3JkXCJdKSB7XHJcbiAgICAgICAgICAgICAgc3RhdGUubWVzc2FnZSA9IFwi8J+UpdC/0LDRgNC+0LvQuCDQvdC1INGB0L7QstC/0LDQtNCw0Y7RglwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBzdGF0ZS5tZXNzYWdlID0gXCLim5Qg0L7QsdGP0LfQsNGC0LXQu9GM0L3QvtC1INC/0L7Qu9C1XCI7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgfSksXHJcbiAgICAgIFJlZ0J1dHRvbjogQnV0dG9uKHtcclxuICAgICAgICB0aXRsZTogXCLQl9Cw0YDQtdCz0LjRgdGC0YDQuNGA0L7QstCw0YLRjNGB0Y9cIixcclxuICAgICAgICBjbGFzc05hbWU6IFwiZm9ybS1idXR0b25cIixcclxuICAgICAgICBvbkNsaWNrOiAoZTogRXZlbnQpID0+IHtcclxuICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgT2JqZWN0LmtleXMoRm9ybURhdGEpLmxlbmd0aCA9PSAwIHx8XHJcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKEZvcm1EYXRhKS5maW5kKChpdGVtKSA9PiB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuIEZvcm1EYXRhW2l0ZW1dID09PSBcIlwiO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGNvbnN0IGRhdGE6IHsgW2tleTogc3RyaW5nXTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiB9ID0ge1xyXG4gICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgZmlyc3RfbmFtZTogRm9ybURhdGEuZmlyc3RfbmFtZSxcclxuICAgICAgICAgICAgICBzZWNvbmRfbmFtZTogRm9ybURhdGEuc2Vjb25kX25hbWUsXHJcbiAgICAgICAgICAgICAgbG9naW46IEZvcm1EYXRhLmxvZ2luLFxyXG4gICAgICAgICAgICAgIGVtYWlsOiBGb3JtRGF0YS5lbWFpbCxcclxuICAgICAgICAgICAgICBwYXNzd29yZDogRm9ybURhdGEucGFzc3dvcmQsXHJcbiAgICAgICAgICAgICAgcGhvbmU6IEZvcm1EYXRhLnBob25lLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgXCJDb250ZW50LXR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgICAgSFRUUFRyYW5zcG9ydC5nZXRJbnN0YW5jZSgpLlBPU1QoXCIvYXV0aC9zaWdudXBcIiwgZGF0YSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgfSksXHJcbiAgICAgIExvZ2luTGluazogQnV0dG9uKHtcclxuICAgICAgICB0aXRsZTogXCLQktC+0LnRgtC4XCIsXHJcbiAgICAgICAgY2xhc3NOYW1lOiBcImZvcm0tbGlua1wiLFxyXG4gICAgICAgIG9uQ2xpY2s6IChlOiBFdmVudCkgPT4ge1xyXG4gICAgICAgICAgcm91dGVyLmdvKFwiL1wiKTtcclxuICAgICAgICB9LFxyXG4gICAgICB9KSxcclxuICAgIH0sXHJcbiAgfSk7XHJcbn07XHJcbiIsImltcG9ydCB7IElDaGF0U2VydmljZSB9IGZyb20gXCIuLi8uLi9CdXNzaW5lc0xheWVyL0NoYXRTZXJ2aWNlXCI7XHJcbmltcG9ydCB7IElDaGF0RFRPIH0gZnJvbSBcIi4uLy4uL1VJL0NvbXBvbmVudHMvQ2hhdEl0ZW1cIjtcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUNoYXRWaWV3TW9kZWwge1xyXG4gIGNoYXRzOiBBcnJheTxJQ2hhdERUTz47XHJcbiAgZ2V0Q2hhdHM6ICgpID0+IFByb21pc2U8SUNoYXREVE9bXT47XHJcbiAgc2F2ZUNoYXQ6IChkYXRhOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+KSA9PiBQcm9taXNlPHZvaWQ+O1xyXG4gIGRlbGV0ZUNoYXQ6IChjaGF0SWQ6IHN0cmluZykgPT4gUHJvbWlzZTx2b2lkPjtcclxufVxyXG5leHBvcnQgY2xhc3MgQ2hhdFZpZXdNb2RlbCBpbXBsZW1lbnRzIElDaGF0Vmlld01vZGVsIHtcclxuICBjaGF0czogQXJyYXk8SUNoYXREVE8+ID0gW107XHJcbiAgeDogbnVtYmVyID0gMTI7XHJcbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIHNlcnZpY2U6IElDaGF0U2VydmljZSkge31cclxuXHJcbiAgZ2V0Q2hhdHMgPSBhc3luYyAoKSA9PiB7XHJcbiAgICB0aGlzLmNoYXRzID0gYXdhaXQgdGhpcy5zZXJ2aWNlLmdldENoYXRzKCk7XHJcbiAgICByZXR1cm4gdGhpcy5jaGF0cztcclxuICB9O1xyXG5cclxuICBzYXZlQ2hhdCA9IGFzeW5jIChkYXRhOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+KSA9PiB7XHJcbiAgICBhd2FpdCB0aGlzLnNlcnZpY2Uuc2F2ZUNoYXQoZGF0YSk7XHJcbiAgICBhd2FpdCB0aGlzLmdldENoYXRzKCk7XHJcbiAgfTtcclxuXHJcbiAgZGVsZXRlQ2hhdCA9IGFzeW5jIChjaGF0SWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4gPT4ge1xyXG4gICAgYXdhaXQgdGhpcy5zZXJ2aWNlLmRlbGV0ZUNoYXQoY2hhdElkKTtcclxuICAgIGF3YWl0IHRoaXMuZ2V0Q2hhdHMoKTtcclxuICB9O1xyXG59XHJcbiIsImltcG9ydCB7IElVc2VyU2VydmljZSB9IGZyb20gXCIuLi8uLi9CdXNzaW5lc0xheWVyL1VzZXJTZXJ2aWNlXCI7XHJcbmltcG9ydCB7IElQcm9maWxlRFRPIH0gZnJvbSBcIi4uLy4uL1VJL0xheW91dHMvUHJvZmlsZVwiO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJVXNlclZpZXdNb2RlbCB7XHJcbiAgdXNlcj86IElQcm9maWxlRFRPO1xyXG4gIGdldFVzZXI6ICgpID0+IFByb21pc2U8dm9pZD47XHJcbiAgc2F2ZVVzZXI6ICh1c2VyOiBJUHJvZmlsZURUTykgPT4gUHJvbWlzZTxJUHJvZmlsZURUTz47XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBVc2VyVmlld01vZGVsIGltcGxlbWVudHMgSVVzZXJWaWV3TW9kZWwge1xyXG4gIHVzZXI/OiBJUHJvZmlsZURUTztcclxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgc2VydmljZTogSVVzZXJTZXJ2aWNlKSB7IH1cclxuXHJcbiAgZ2V0VXNlciA9IGFzeW5jICgpID0+IHtcclxuICAgIHRoaXMudXNlciA9IGF3YWl0IHRoaXMuc2VydmljZS5nZXRVc2VyKCk7XHJcbiAgfTtcclxuXHJcbiAgc2F2ZVVzZXIgPSBhc3luYyAodXNlcjogSVByb2ZpbGVEVE8pID0+IHtcclxuICAgIHJldHVybiB0aGlzLnNlcnZpY2Uuc2F2ZVVzZXIodXNlcilcclxuICB9XHJcblxyXG4gIHNldFVzZXJGaWVsZChuYW1lOiBrZXlvZiBJUHJvZmlsZURUTywgdmFsdWU6IGFueSkge1xyXG4gICAgaWYgKHRoaXMudXNlcikge1xyXG4gICAgICB0aGlzLnVzZXJbbmFtZV0gPSB2YWx1ZSBhcyBuZXZlcjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMudXNlciA9IHt9IGFzIElQcm9maWxlRFRPO1xyXG4gICAgICB0aGlzLnVzZXJbbmFtZV0gPSB2YWx1ZSBhcyBuZXZlcjtcclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgU0VSVklDRSB9IGZyb20gXCIuLi9CdXNzaW5lc0xheWVyXCI7XHJcbmltcG9ydCB7IElDaGF0U2VydmljZSB9IGZyb20gXCIuLi9CdXNzaW5lc0xheWVyL0NoYXRTZXJ2aWNlXCI7XHJcbmltcG9ydCB7IElVc2VyU2VydmljZSB9IGZyb20gXCIuLi9CdXNzaW5lc0xheWVyL1VzZXJTZXJ2aWNlXCI7XHJcbmltcG9ydCB7IENvbnRhaW5lciB9IGZyb20gXCIuLi9saWJzL0NvbnRhaW5lclwiO1xyXG5pbXBvcnQgeyBDaGF0Vmlld01vZGVsIH0gZnJvbSBcIi4vQ2hhdFZpZXdNb2RlbFwiO1xyXG5pbXBvcnQgeyBVc2VyVmlld01vZGVsIH0gZnJvbSBcIi4vVXNlclZpZXdNb2RlbFwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IFZJRVdfTU9ERUwgPSB7XHJcbiAgQ0hBVDogU3ltYm9sLmZvcihcIkNoYXRWaWV3TW9kZWxcIiksXHJcbiAgVVNFUjogU3ltYm9sLmZvcihcIlVzZXJWaWV3TW9kZWxcIiksXHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgVmlld01vZGVsQ29udGFpbmVyID0gbmV3IENvbnRhaW5lcigpO1xyXG5cclxuVmlld01vZGVsQ29udGFpbmVyLmJpbmQoVklFV19NT0RFTC5DSEFUKS50b0R5bmFtaWNWYWx1ZSgoY29udGFpbmVyKSA9PiB7XHJcbiAgY29uc3Qgc2VydmljZSA9IGNvbnRhaW5lci5nZXQ8SUNoYXRTZXJ2aWNlPihTRVJWSUNFLkNIQVQpO1xyXG4gIHJldHVybiBuZXcgQ2hhdFZpZXdNb2RlbChzZXJ2aWNlKTtcclxufSk7XHJcblxyXG5WaWV3TW9kZWxDb250YWluZXIuYmluZChWSUVXX01PREVMLlVTRVIpLnRvRHluYW1pY1ZhbHVlKChjb250YWluZXIpID0+IHtcclxuICBjb25zdCBzZXJ2aWNlID0gY29udGFpbmVyLmdldDxJVXNlclNlcnZpY2U+KFNFUlZJQ0UuVVNFUik7XHJcbiAgcmV0dXJuIG5ldyBVc2VyVmlld01vZGVsKHNlcnZpY2UpO1xyXG59KS5pc1NpbmdsZXRvbmUoKTtcclxuIiwiaW1wb3J0IHsgQm9vdFN0cmFwIH0gZnJvbSBcIi4vQm9vdHN0cmFwXCI7XHJcbmltcG9ydCB7IFJvdXRlckluaXQgfSBmcm9tIFwiLi9yb3V0ZXJcIjtcclxuXHJcbmNvbnN0IEluaXRBcHAgPSAoKSA9PiB7XHJcbiAgY29uc3QgeyBjb250YWluZXIgfSA9IG5ldyBCb290U3RyYXAoKTtcclxuICBjb25zdCByb3V0ZXIgPSBSb3V0ZXJJbml0KGNvbnRhaW5lcik7XHJcbiAgcmV0dXJuIHsgcm91dGVyLCBjb250YWluZXIgfTtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCB7IHJvdXRlciwgY29udGFpbmVyIH0gPSBJbml0QXBwKCk7XHJcbiIsImNvbnN0IFNpbmdsZVRvbmVDb250YWluZXJzID0gbmV3IE1hcDxzeW1ib2wsIGFueT4oKVxyXG5jb25zdCBTaW5nbGVUb25lc0luc3RhbmNlcyA9IG5ldyBNYXA8c3ltYm9sLCBhbnk+KCk7XHJcbmV4cG9ydCBjbGFzcyBDb250YWluZXIge1xyXG4gIGNvbnRhaW5lcnM6IE1hcDxzeW1ib2wsIGFueT4gPSBuZXcgTWFwKCk7XHJcbiAgbGFzdElkPzogc3ltYm9sO1xyXG4gIGNvbnN0cnVjdG9yKCkgeyB9XHJcbiAgYmluZChpZDogc3ltYm9sKTogQ29udGFpbmVyIHtcclxuICAgIHRoaXMubGFzdElkID0gaWQ7XHJcbiAgICB0aGlzLmNvbnRhaW5lcnMuc2V0KGlkLCBudWxsKTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuICBnZXQgPSA8VD4oaWQ6IHN5bWJvbCk6IFQgPT4ge1xyXG4gICAgY29uc3Qgc2luZ2xlVG9uZUNvbnRhaW5lciA9IFNpbmdsZVRvbmVDb250YWluZXJzLmdldChpZCk7XHJcbiAgICBpZiAoc2luZ2xlVG9uZUNvbnRhaW5lcikge1xyXG4gICAgICBjb25zdCBpbnN0YW5jZSA9IFNpbmdsZVRvbmVzSW5zdGFuY2VzLmdldChpZClcclxuICAgICAgaWYoaW5zdGFuY2UpIHtcclxuICAgICAgICByZXR1cm4gaW5zdGFuY2VcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBTaW5nbGVUb25lc0luc3RhbmNlcy5zZXQoaWQsIHNpbmdsZVRvbmVDb250YWluZXIuZm4odGhpcykpXHJcbiAgICAgICAgcmV0dXJuIFNpbmdsZVRvbmVzSW5zdGFuY2VzLmdldChpZClcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uc3QgY3JlYXRlQ29udGFpbmVyRm4gPSB0aGlzLmNvbnRhaW5lcnMuZ2V0KGlkKTtcclxuICAgICAgcmV0dXJuIGNyZWF0ZUNvbnRhaW5lckZuLmZuKHRoaXMpXHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgdG9EeW5hbWljVmFsdWUoZm46IChjb250YWluZXI6IENvbnRhaW5lcikgPT4gdW5rbm93bikge1xyXG4gICAgaWYgKHRoaXMubGFzdElkKVxyXG4gICAgICB0aGlzLmNvbnRhaW5lcnMuc2V0KHRoaXMubGFzdElkLCB7IGZuOiBmbiwgaWQ6IHRoaXMubGFzdElkIH0pO1xyXG5cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgcGFyZW50KGNvbnRhaW5lcjogQ29udGFpbmVyKTogQ29udGFpbmVyIHtcclxuICAgIGZvciAobGV0IGNvbnQgb2YgY29udGFpbmVyLmNvbnRhaW5lcnMpIHtcclxuICAgICAgdGhpcy5jb250YWluZXJzLnNldChjb250WzBdLCBjb250WzFdKTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgaXNTaW5nbGV0b25lKCkge1xyXG4gICAgaWYgKHRoaXMubGFzdElkKSB7XHJcbiAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMuY29udGFpbmVycy5nZXQodGhpcy5sYXN0SWQpXHJcbiAgICAgIFNpbmdsZVRvbmVDb250YWluZXJzLnNldCh0aGlzLmxhc3RJZCwgY29udGFpbmVyKVxyXG4gICAgfVxyXG5cclxuICB9XHJcbn1cclxuXHJcbi8vIGNvbnN0IFZJRVdfTU9ERUwgPSB7XHJcbi8vICAgQ2hhdDogU3ltYm9sLmZvcihcIkNoYXRWaWV3TW9kZWxcIiksXHJcbi8vIH07XHJcblxyXG4vLyBjb25zdCBTRVJWSUNFID0ge1xyXG4vLyAgIENIQVQ6IFN5bWJvbC5mb3IoXCJDaGF0U2VydmljZVwiKSxcclxuLy8gfTtcclxuXHJcbi8vIGNvbnN0IFZpZXdNb2RlbENvbnRhaW5lciA9IG5ldyBDb250YWluZXIoKTtcclxuLy8gY29uc3QgU2VydmljZUNvbnRhaW5lciA9IG5ldyBDb250YWluZXIoKTtcclxuXHJcbi8vIGNsYXNzIFMge1xyXG4vLyAgIGNvbnN0cnVjdG9yKHB1YmxpYyB2OiBWKSB7fVxyXG4vLyAgIHg6IG51bWJlciA9IDE7XHJcbi8vIH1cclxuXHJcbi8vIGNsYXNzIFYge1xyXG4vLyAgIHk6IG51bWJlciA9IDI7XHJcbi8vIH1cclxuXHJcbi8vIFZpZXdNb2RlbENvbnRhaW5lci5iaW5kKFZJRVdfTU9ERUwuQ2hhdCkudG9EeW5hbWljVmFsdWUoKGNvbnRhaW5lcikgPT4ge1xyXG4vLyAgIHJldHVybiBuZXcgVigpO1xyXG4vLyB9KTtcclxuXHJcbi8vIFNlcnZpY2VDb250YWluZXIuYmluZChTRVJWSUNFLkNIQVQpLnRvRHluYW1pY1ZhbHVlKChjb250YWluZXIpID0+IHtcclxuLy8gICBjb25zdCB2aWV3TW9kZWxDb250YWluZXIgPSBjb250YWluZXIuZ2V0PFY+KFZJRVdfTU9ERUwuQ2hhdCk7XHJcbi8vICAgcmV0dXJuIG5ldyBTKHZpZXdNb2RlbENvbnRhaW5lcik7XHJcbi8vIH0pO1xyXG5cclxuLy8gU2VydmljZUNvbnRhaW5lci5wYXJlbnQoVmlld01vZGVsQ29udGFpbmVyKTtcclxuXHJcbi8vIGNvbnN0IHNlcnZpY2UgPSBTZXJ2aWNlQ29udGFpbmVyLmdldDxTPihTRVJWSUNFLkNIQVQpO1xyXG4vLyBjb25zb2xlLmxvZyhzZXJ2aWNlKTtcclxuXHJcbi8vIGNvbnN0IHZpZXdNb2RlbCA9IFNlcnZpY2VDb250YWluZXIuZ2V0PFY+KFZJRVdfTU9ERUwuQ2hhdCk7XHJcbi8vIGNvbnNvbGUubG9nKHZpZXdNb2RlbCk7XHJcbiIsImltcG9ydCB7IHV1aWR2NCB9IGZyb20gXCIuLi91dGlsc1wiO1xyXG5pbnRlcmZhY2UgSUhZUE9Qcm9wcyB7XHJcbiAgcmVuZGVyVG8/OiBIVE1MRWxlbWVudDtcclxuICB0ZW1wbGF0ZVBhdGg6IHN0cmluZztcclxuICBjaGlsZHJlbj86IFJlY29yZDxzdHJpbmcsIEhZUE8gfCBIWVBPW10+O1xyXG4gIGRhdGE6IFJlY29yZDxzdHJpbmcsIHVua25vd24+O1xyXG59XHJcblxyXG5pbnRlcmZhY2UgSVRlbXBhdGVQcm9wIHtcclxuICBodG1sOiBzdHJpbmc7XHJcbiAgdGVtcGxhdGVLZXk6IHN0cmluZztcclxuICBtYWdpY0tleTogc3RyaW5nO1xyXG4gIGlzQXJyYXk6IGJvb2xlYW47XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBIWVBPIHtcclxuICBwcml2YXRlIHJlbmRlclRvPzogSFRNTEVsZW1lbnQ7XHJcbiAgcHJpdmF0ZSBjaGlsZHJlbj86IFJlY29yZDxzdHJpbmcsIEhZUE8gfCBIWVBPW10+O1xyXG4gIHByaXZhdGUgdGVtcGxhdGVQYXRoOiBzdHJpbmc7XHJcbiAgcHJpdmF0ZSBkYXRhOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPjtcclxuICBwcml2YXRlIHRlbXBsYXRlc1Byb21pc2VzOiBQcm9taXNlPElUZW1wYXRlUHJvcD5bXTtcclxuICBwcml2YXRlIHN0b3JlOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPjtcclxuICBwcml2YXRlIG1hZ2ljS2V5OiBzdHJpbmc7XHJcbiAgcHJpdmF0ZSBhZnRlclJlbmRlckNhbGxiYWNrOiAoKSA9PiB2b2lkO1xyXG4gIHByaXZhdGUgYWZ0ZXJSZW5kZXJDYWxsYmFja0FycjogU2V0PCgpID0+IHZvaWQ+O1xyXG5cclxuICBjb25zdHJ1Y3RvcihwYXJhbXM6IElIWVBPUHJvcHMpIHtcclxuICAgIHRoaXMucmVuZGVyVG8gPSBwYXJhbXMucmVuZGVyVG87XHJcbiAgICB0aGlzLmRhdGEgPSBwYXJhbXMuZGF0YTtcclxuICAgIHRoaXMudGVtcGxhdGVQYXRoID0gYC4vdGVtcGxhdGVzLyR7cGFyYW1zLnRlbXBsYXRlUGF0aH1gO1xyXG4gICAgdGhpcy5jaGlsZHJlbiA9IHBhcmFtcy5jaGlsZHJlbjtcclxuICAgIHRoaXMudGVtcGxhdGVzUHJvbWlzZXMgPSBbXTtcclxuICAgIHRoaXMuc3RvcmUgPSB7fTtcclxuICAgIHRoaXMubWFnaWNLZXkgPSB1dWlkdjQoKTtcclxuICAgIHRoaXMuYWZ0ZXJSZW5kZXJDYWxsYmFjayA9ICgpID0+IHt9O1xyXG4gICAgdGhpcy5hZnRlclJlbmRlckNhbGxiYWNrQXJyID0gbmV3IFNldCgpO1xyXG4gIH1cclxuXHJcbiAgLy9AdG9kbzog0L/RgNC40LrRgNGD0YLQuNGC0Ywg0LzQtdC80L7QuNC30LDRhtC40Y5cclxuXHJcbiAgcHVibGljIGdldFRlbXBsYXRlSFRNTChcclxuICAgIGtleTogc3RyaW5nLFxyXG4gICAgaHlwbzogSFlQTyxcclxuICAgIGlzQXJyYXk6IGJvb2xlYW5cclxuICApOiBQcm9taXNlPElUZW1wYXRlUHJvcD4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPElUZW1wYXRlUHJvcD4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICBmZXRjaChoeXBvLnRlbXBsYXRlUGF0aClcclxuICAgICAgICAudGhlbigoaHRtbCkgPT4ge1xyXG4gICAgICAgICAgaWYgKGh0bWwuc3RhdHVzICE9PSAyMDApIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiZmlsZSBkbyBub3QgZG93bmxvYWRcIik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByZXR1cm4gaHRtbC5ibG9iKCk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAudGhlbigocmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICByZXR1cm4gcmVzdWx0LnRleHQoKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC50aGVuKCh0ZXh0KSA9PiB7XHJcbiAgICAgICAgICB0ZXh0ID0gdGhpcy5pbnNlcnREYXRhSW50b0hUTUwodGV4dCwgaHlwby5kYXRhKTtcclxuICAgICAgICAgIHJlc29sdmUoe1xyXG4gICAgICAgICAgICBodG1sOiB0ZXh0LFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZUtleToga2V5LFxyXG4gICAgICAgICAgICBtYWdpY0tleTogaHlwby5tYWdpY0tleSxcclxuICAgICAgICAgICAgaXNBcnJheTogaXNBcnJheSxcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcclxuICAgICAgICAgIHJlamVjdChlcnIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNvbGxlY3RUZW1wbGF0ZXMoXHJcbiAgICBoeXBvOiBIWVBPIHwgSFlQT1tdLFxyXG4gICAgbmFtZTogc3RyaW5nLFxyXG4gICAgaXNBcnJheTogYm9vbGVhblxyXG4gICk6IEhZUE8ge1xyXG4gICAgaWYgKEFycmF5LmlzQXJyYXkoaHlwbykpIHtcclxuICAgICAgdGhpcy5oYW5kbGVBcnJheUhZUE8oaHlwbywgbmFtZSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmhhbmRsZVNpbXBsZUhZUE8oaHlwbywgbmFtZSk7XHJcbiAgICAgIHRoaXMudGVtcGxhdGVzUHJvbWlzZXMucHVzaCh0aGlzLmdldFRlbXBsYXRlSFRNTChuYW1lLCBoeXBvLCBpc0FycmF5KSk7XHJcbiAgICAgIHRoaXMuYWZ0ZXJSZW5kZXJDYWxsYmFja0Fyci5hZGQoaHlwby5hZnRlclJlbmRlckNhbGxiYWNrKTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBoYW5kbGVBcnJheUhZUE8oaHlwb3M6IEhZUE9bXSwgbmFtZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICBoeXBvcy5mb3JFYWNoKChoeXBvKSA9PiB7XHJcbiAgICAgIHRoaXMuY29sbGVjdFRlbXBsYXRlcyhoeXBvLCBgJHtuYW1lfWAsIHRydWUpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGhhbmRsZVNpbXBsZUhZUE8oaHlwbzogSFlQTywgbmFtZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICBpZiAoaHlwby5jaGlsZHJlbikge1xyXG4gICAgICBPYmplY3Qua2V5cyhoeXBvLmNoaWxkcmVuKS5mb3JFYWNoKChjaGlsZE5hbWUpID0+IHtcclxuICAgICAgICBpZiAoaHlwby5jaGlsZHJlbikge1xyXG4gICAgICAgICAgcmV0dXJuIHRoaXMuY29sbGVjdFRlbXBsYXRlcyhcclxuICAgICAgICAgICAgaHlwby5jaGlsZHJlbltjaGlsZE5hbWVdLFxyXG4gICAgICAgICAgICBjaGlsZE5hbWUsXHJcbiAgICAgICAgICAgIGZhbHNlXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGluc2VydERhdGFJbnRvSFRNTChcclxuICAgIGh0bWxUZW1wbGF0ZTogc3RyaW5nLFxyXG4gICAgZGF0YTogUmVjb3JkPHN0cmluZywgdW5rbm93bj5cclxuICApOiBzdHJpbmcge1xyXG4gICAgZGF0YSA9IHRoaXMuZ2V0RGF0YVdpdGhvdXRJZXJhcmh5KGRhdGEpO1xyXG4gICAgZm9yIChsZXQga2V5IGluIGRhdGEpIHtcclxuICAgICAgaWYgKHR5cGVvZiBkYXRhW2tleV0gIT09IFwib2JqZWN0XCIgfHwgZGF0YVtrZXldID09PSBudWxsKSB7XHJcbiAgICAgICAgY29uc3QgbWFzayA9IG5ldyBSZWdFeHAoXCJ7e1wiICsga2V5ICsgXCJ9fVwiLCBcImdcIik7XHJcbiAgICAgICAgaHRtbFRlbXBsYXRlID0gaHRtbFRlbXBsYXRlLnJlcGxhY2UobWFzaywgU3RyaW5nKGRhdGFba2V5XSkpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBjb25zdCBtYXNrID0gbmV3IFJlZ0V4cCgve3tbYS16Ll9dK319L2cpO1xyXG4gICAgaHRtbFRlbXBsYXRlID0gaHRtbFRlbXBsYXRlLnJlcGxhY2UobWFzaywgXCJcIik7XHJcbiAgICByZXR1cm4gaHRtbFRlbXBsYXRlO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjb252ZXJ0QXJyVGVtcGxhdGVUb01hcChcclxuICAgIHRlbXBsYXRlQXJyOiB7XHJcbiAgICAgIGh0bWw6IHN0cmluZztcclxuICAgICAgdGVtcGxhdGVLZXk6IHN0cmluZztcclxuICAgICAgbWFnaWNLZXk6IHN0cmluZztcclxuICAgICAgaXNBcnJheTogYm9vbGVhbiB8IHVuZGVmaW5lZDtcclxuICAgIH1bXVxyXG4gICk6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4ge1xyXG4gICAgY29uc3QgcmVzdWx0OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XHJcbiAgICB0ZW1wbGF0ZUFyci5mb3JFYWNoKChpdGVtKSA9PiB7XHJcbiAgICAgIGlmIChyZXN1bHRbaXRlbS50ZW1wbGF0ZUtleV0pIHtcclxuICAgICAgICByZXN1bHRbXHJcbiAgICAgICAgICBpdGVtLnRlbXBsYXRlS2V5XHJcbiAgICAgICAgXSArPSBgPHNwYW4gaHlwbz1cIiR7aXRlbS5tYWdpY0tleX1cIj4ke2l0ZW0uaHRtbH08L3NwYW4+YDtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXN1bHRbYCR7aXRlbS50ZW1wbGF0ZUtleX0tJHtpdGVtLm1hZ2ljS2V5fWBdID0gaXRlbS5odG1sO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBpbnNlcnRUZW1wbGF0ZUludG9UZW1wbGF0ZShcclxuICAgIHJvb3RUZW1wbGF0ZUhUTUw6IHN0cmluZyxcclxuICAgIHRlbXBsYXRlS2V5OiBzdHJpbmcsXHJcbiAgICBjaGlsZFRlbXBsYXRlSFRNTDogc3RyaW5nLFxyXG4gICAgbWFnaWNLZXk6IHN0cmluZyxcclxuICAgIGlzQXJyYXk6IGJvb2xlYW5cclxuICApOiBzdHJpbmcge1xyXG4gICAgcm9vdFRlbXBsYXRlSFRNTCA9IHRoaXMuY3JlYXRlRWxlbVdyYXBwZXIoXHJcbiAgICAgIHJvb3RUZW1wbGF0ZUhUTUwsXHJcbiAgICAgIHRlbXBsYXRlS2V5LFxyXG4gICAgICBtYWdpY0tleSxcclxuICAgICAgaXNBcnJheVxyXG4gICAgKTtcclxuICAgIGNvbnN0IG1hc2sgPSBuZXcgUmVnRXhwKGAtPSR7dGVtcGxhdGVLZXl9LSR7bWFnaWNLZXl9PS1gLCBcImdcIik7XHJcbiAgICByb290VGVtcGxhdGVIVE1MID0gcm9vdFRlbXBsYXRlSFRNTC5yZXBsYWNlKG1hc2ssIGNoaWxkVGVtcGxhdGVIVE1MKTtcclxuICAgIHJldHVybiByb290VGVtcGxhdGVIVE1MO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjcmVhdGVFbGVtV3JhcHBlcihcclxuICAgIGh0bWxUZW1wbGF0ZTogc3RyaW5nLFxyXG4gICAgdGVtcGxhdGVLZXk6IHN0cmluZyxcclxuICAgIG1hZ2ljS2V5OiBzdHJpbmcsXHJcbiAgICBpc0FycmF5OiBib29sZWFuXHJcbiAgKSB7XHJcbiAgICBjb25zdCBtYXNrID0gbmV3IFJlZ0V4cChgLT0ke3RlbXBsYXRlS2V5fT0tYCwgXCJnXCIpO1xyXG4gICAgaWYgKGlzQXJyYXkpIHtcclxuICAgICAgaHRtbFRlbXBsYXRlID0gaHRtbFRlbXBsYXRlLnJlcGxhY2UoXHJcbiAgICAgICAgbWFzayxcclxuICAgICAgICBgPHNwYW4gaHlwbz1cIiR7bWFnaWNLZXl9XCI+LT0ke3RlbXBsYXRlS2V5fS0ke21hZ2ljS2V5fT0tLT0ke3RlbXBsYXRlS2V5fT0tPC9zcGFuPmBcclxuICAgICAgKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGh0bWxUZW1wbGF0ZSA9IGh0bWxUZW1wbGF0ZS5yZXBsYWNlKFxyXG4gICAgICAgIG1hc2ssXHJcbiAgICAgICAgYDxzcGFuIGh5cG89XCIke21hZ2ljS2V5fVwiPi09JHt0ZW1wbGF0ZUtleX0tJHttYWdpY0tleX09LTwvc3Bhbj5gXHJcbiAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGh0bWxUZW1wbGF0ZTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgY2xlYXJFbXRweUNvbXBvbmVudChodG1sOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgY29uc3QgcmVnZXggPSAvLT1bYS16LEEtWiwwLTldKz0tL2c7XHJcbiAgICByZXR1cm4gaHRtbC5yZXBsYWNlKHJlZ2V4LCBcIlwiKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyByZW5kZXIgPSBhc3luYyAoKTogUHJvbWlzZTxIWVBPPiA9PiB7XHJcbiAgICBjb25zdCB0aGF0ID0gdGhpcztcclxuICAgIHJldHVybiBQcm9taXNlLmFsbChcclxuICAgICAgdGhpcy5jb2xsZWN0VGVtcGxhdGVzKHRoaXMsIFwicm9vdFwiLCBmYWxzZSkudGVtcGxhdGVzUHJvbWlzZXNcclxuICAgICkudGhlbigoYXJyYXlUZW1wbGF0ZXMpID0+IHtcclxuICAgICAgY29uc3QgbWFwVGVtcGxhdGVzID0gdGhpcy5jb252ZXJ0QXJyVGVtcGxhdGVUb01hcChhcnJheVRlbXBsYXRlcyk7XHJcbiAgICAgIGxldCByb290VGVtcGxhdGVIVE1MOiBzdHJpbmcgPVxyXG4gICAgICAgIGFycmF5VGVtcGxhdGVzW2FycmF5VGVtcGxhdGVzLmxlbmd0aCAtIDFdLmh0bWw7XHJcbiAgICAgIGZvciAobGV0IGkgPSBhcnJheVRlbXBsYXRlcy5sZW5ndGggLSAyOyBpID49IDA7IGktLSkge1xyXG4gICAgICAgIGxldCB0ZW1wbGF0ZSA9XHJcbiAgICAgICAgICBtYXBUZW1wbGF0ZXNbXHJcbiAgICAgICAgICAgIGAke2FycmF5VGVtcGxhdGVzW2ldLnRlbXBsYXRlS2V5fS0ke2FycmF5VGVtcGxhdGVzW2ldLm1hZ2ljS2V5fWBcclxuICAgICAgICAgIF07XHJcbiAgICAgICAgcm9vdFRlbXBsYXRlSFRNTCA9IHRoaXMuaW5zZXJ0VGVtcGxhdGVJbnRvVGVtcGxhdGUoXHJcbiAgICAgICAgICByb290VGVtcGxhdGVIVE1MLFxyXG4gICAgICAgICAgYXJyYXlUZW1wbGF0ZXNbaV0udGVtcGxhdGVLZXksXHJcbiAgICAgICAgICB0ZW1wbGF0ZSxcclxuICAgICAgICAgIGFycmF5VGVtcGxhdGVzW2ldLm1hZ2ljS2V5LFxyXG4gICAgICAgICAgYXJyYXlUZW1wbGF0ZXNbaV0uaXNBcnJheVxyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJvb3RUZW1wbGF0ZUhUTUwgPSB0aGlzLmNsZWFyRW10cHlDb21wb25lbnQocm9vdFRlbXBsYXRlSFRNTCk7XHJcblxyXG4gICAgICBpZiAodGhpcy5yZW5kZXJUbykge1xyXG4gICAgICAgIHRoaXMucmVuZGVyVG8uaW5uZXJIVE1MID0gcm9vdFRlbXBsYXRlSFRNTDtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zdCBlbGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgW2h5cG89XCIke3RoaXMubWFnaWNLZXl9XCJdYCk7XHJcbiAgICAgICAgaWYgKGVsZW0pIHtcclxuICAgICAgICAgIHRoaXMucmVuZGVyVG8gPSBlbGVtIGFzIEhUTUxFbGVtZW50O1xyXG4gICAgICAgICAgZWxlbS5pbm5lckhUTUwgPSByb290VGVtcGxhdGVIVE1MO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICB0aGlzLmFmdGVyUmVuZGVyQ2FsbGJhY2tBcnIuZm9yRWFjaCgoY2FsbGJhY2spID0+IHtcclxuICAgICAgICBjYWxsYmFjaygpO1xyXG4gICAgICB9KTtcclxuICAgICAgdGhpcy50ZW1wbGF0ZXNQcm9taXNlcyA9IFtdO1xyXG4gICAgICByZXR1cm4gdGhhdDtcclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIHByaXZhdGUgcmVyZW5kZXIoKSB7XHJcbiAgICB0aGlzLnJlbmRlcigpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGdldFN0YXRlKCk6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IHtcclxuICAgIHRoaXMuc3RvcmUgPSB0aGlzLmNyZWF0ZVN0b3JlKHRoaXMuZGF0YSk7XHJcbiAgICByZXR1cm4gdGhpcy5zdG9yZTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgY3JlYXRlU3RvcmUoc3RvcmU6IGFueSkge1xyXG4gICAgY29uc3QgdGhhdCA9IHRoaXM7XHJcbiAgICBjb25zdCBoYW5kbGVyOiBQcm94eUhhbmRsZXI8UmVjb3JkPHN0cmluZywgdW5rbm93bj4+ID0ge1xyXG4gICAgICBnZXQodGFyZ2V0LCBwcm9wZXJ0eSkge1xyXG4gICAgICAgIHJldHVybiB0YXJnZXRbPHN0cmluZz5wcm9wZXJ0eV07XHJcbiAgICAgIH0sXHJcbiAgICAgIHNldCh0YXJnZXQsIHByb3BlcnR5LCB2YWx1ZSkge1xyXG4gICAgICAgIHRhcmdldFs8c3RyaW5nPnByb3BlcnR5XSA9IHZhbHVlO1xyXG4gICAgICAgIHRoYXQucmVyZW5kZXIoKTtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfSxcclxuICAgIH07XHJcbiAgICBzdG9yZSA9IG5ldyBQcm94eShzdG9yZSwgaGFuZGxlcik7XHJcblxyXG4gICAgT2JqZWN0LmtleXMoc3RvcmUpLmZvckVhY2goKGZpZWxkKSA9PiB7XHJcbiAgICAgIGlmICh0eXBlb2Ygc3RvcmVbZmllbGRdID09PSBcIm9iamVjdFwiKSB7XHJcbiAgICAgICAgc3RvcmVbZmllbGRdID0gbmV3IFByb3h5KHN0b3JlW2ZpZWxkXSwgaGFuZGxlcik7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVTdG9yZShzdG9yZVtmaWVsZF0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gc3RvcmU7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldERhdGFXaXRob3V0SWVyYXJoeShkYXRhOiBhbnkpIHtcclxuICAgIGxldCBwYXRoQXJyOiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgbGV0IHJlc3VsdE9iamVjdDogYW55ID0ge307XHJcbiAgICBmdW5jdGlvbiBmbnoob2JqOiBhbnkpIHtcclxuICAgICAgZm9yIChsZXQga2V5IGluIG9iaikge1xyXG4gICAgICAgIHBhdGhBcnIucHVzaChrZXkpO1xyXG4gICAgICAgIGlmICh0eXBlb2Ygb2JqW2tleV0gPT09IFwib2JqZWN0XCIpIHtcclxuICAgICAgICAgIGZueihvYmpba2V5XSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJlc3VsdE9iamVjdFtwYXRoQXJyLmpvaW4oXCIuXCIpXSA9IG9ialtrZXldO1xyXG4gICAgICAgICAgcGF0aEFyci5wb3AoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgcGF0aEFyci5wb3AoKTtcclxuICAgIH1cclxuICAgIGZueihkYXRhKTtcclxuXHJcbiAgICByZXR1cm4gcmVzdWx0T2JqZWN0O1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGFmdGVyUmVuZGVyKGNhbGxiYWNrOiAoKSA9PiB2b2lkKTogSFlQTyB7XHJcbiAgICB0aGlzLmFmdGVyUmVuZGVyQ2FsbGJhY2sgPSBjYWxsYmFjaztcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGhpZGUoKSB7XHJcbiAgICBpZiAodGhpcy5yZW5kZXJUbykge1xyXG4gICAgICBsZXQgY2hpbGRyZW47XHJcblxyXG4gICAgICBjaGlsZHJlbiA9IHRoaXMucmVuZGVyVG8uY2hpbGRyZW47XHJcbiAgICAgIGlmIChjaGlsZHJlbikge1xyXG4gICAgICAgIGZvciAobGV0IGNoaWxkIG9mIGNoaWxkcmVuKSB7XHJcbiAgICAgICAgICBjaGlsZC5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgSFlQTyB9IGZyb20gXCIuLi9IWVBPL0hZUE9cIjtcclxuXHJcbmNsYXNzIFJvdXRlIHtcclxuICBwcml2YXRlIF9wYXRobmFtZTogc3RyaW5nID0gXCJcIjtcclxuICBwcml2YXRlIF9ibG9jaz86IChyZXN1bHQ/OiBhbnkpID0+IEhZUE87XHJcbiAgcHJpdmF0ZSBfcHJvcHM6IFJlY29yZDxzdHJpbmcsIHVua25vd24+O1xyXG4gIGFzeW5jRk4/OiAoKSA9PiBQcm9taXNlPGFueT47XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcGF0aG5hbWU6IHN0cmluZyxcclxuICAgIHZpZXc6ICgpID0+IEhZUE8sXHJcbiAgICBwcm9wczogUmVjb3JkPHN0cmluZywgdW5rbm93bj4sXHJcbiAgICBhc3luY0ZOPzogKCkgPT4gUHJvbWlzZTxhbnk+XHJcbiAgKSB7XHJcbiAgICB0aGlzLl9wYXRobmFtZSA9IHBhdGhuYW1lO1xyXG4gICAgdGhpcy5fcHJvcHMgPSBwcm9wcztcclxuICAgIHRoaXMuX2Jsb2NrID0gdmlldztcclxuICAgIHRoaXMuYXN5bmNGTiA9IGFzeW5jRk47XHJcbiAgfVxyXG5cclxuICBuYXZpZ2F0ZShwYXRobmFtZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICBpZiAodGhpcy5tYXRjaChwYXRobmFtZSkpIHtcclxuICAgICAgdGhpcy5fcGF0aG5hbWUgPSBwYXRobmFtZTtcclxuICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGxlYXZlKCk6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMuX2Jsb2NrKSB7XHJcbiAgICAgIHRoaXMuX2Jsb2NrKCkuaGlkZSgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbWF0Y2gocGF0aG5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuIGlzRXF1YWwocGF0aG5hbWUsIHRoaXMuX3BhdGhuYW1lKTtcclxuICB9XHJcblxyXG4gIHJlbmRlcigpIHtcclxuICAgIGlmICghdGhpcy5fYmxvY2spIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMuYXN5bmNGTikge1xyXG4gICAgICB0aGlzLmFzeW5jRk4oKS50aGVuKChyZXN1bHQpID0+IHtcclxuICAgICAgICB0aGlzLl9ibG9jaz8uKHJlc3VsdCkucmVuZGVyKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5fYmxvY2soKS5yZW5kZXIoKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBSb3V0ZXIge1xyXG4gIHByaXZhdGUgX19pbnN0YW5jZTogUm91dGVyID0gdGhpcztcclxuICByb3V0ZXM6IFJvdXRlW10gPSBbXTtcclxuICBwcml2YXRlIGhpc3Rvcnk6IEhpc3RvcnkgPSB3aW5kb3cuaGlzdG9yeTtcclxuICBwcml2YXRlIF9jdXJyZW50Um91dGU6IFJvdXRlIHwgbnVsbCA9IG51bGw7XHJcbiAgcHJpdmF0ZSBfcm9vdFF1ZXJ5OiBzdHJpbmcgPSBcIlwiO1xyXG4gIHByaXZhdGUgYXN5bmNGTj86ICgpID0+IFByb21pc2U8YW55PjtcclxuXHJcbiAgY29uc3RydWN0b3Iocm9vdFF1ZXJ5OiBzdHJpbmcpIHtcclxuICAgIGlmICh0aGlzLl9faW5zdGFuY2UpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuX19pbnN0YW5jZTtcclxuICAgIH1cclxuICAgIHRoaXMuX3Jvb3RRdWVyeSA9IHJvb3RRdWVyeTtcclxuICB9XHJcblxyXG4gIHVzZShcclxuICAgIHBhdGhuYW1lOiBzdHJpbmcsXHJcbiAgICBibG9jazogKHJlc3VsdD86IGFueSkgPT4gSFlQTyxcclxuICAgIGFzeW5jRk4/OiAoKSA9PiBQcm9taXNlPGFueT5cclxuICApOiBSb3V0ZXIge1xyXG4gICAgY29uc3Qgcm91dGUgPSBuZXcgUm91dGUoXHJcbiAgICAgIHBhdGhuYW1lLFxyXG4gICAgICBibG9jayxcclxuICAgICAgeyByb290UXVlcnk6IHRoaXMuX3Jvb3RRdWVyeSB9LFxyXG4gICAgICBhc3luY0ZOXHJcbiAgICApO1xyXG4gICAgdGhpcy5yb3V0ZXMucHVzaChyb3V0ZSk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIHN0YXJ0KCk6IFJvdXRlciB7XHJcbiAgICB3aW5kb3cub25wb3BzdGF0ZSA9IChfOiBQb3BTdGF0ZUV2ZW50KSA9PiB7XHJcbiAgICAgIGxldCBtYXNrID0gbmV3IFJlZ0V4cChcIiNcIiwgXCJnXCIpO1xyXG4gICAgICBjb25zdCB1cmwgPSB3aW5kb3cubG9jYXRpb24uaGFzaC5yZXBsYWNlKG1hc2ssIFwiXCIpO1xyXG4gICAgICB0aGlzLl9vblJvdXRlKHVybCk7XHJcbiAgICB9O1xyXG4gICAgbGV0IG1hc2sgPSBuZXcgUmVnRXhwKFwiI1wiLCBcImdcIik7XHJcbiAgICBjb25zdCB1cmwgPSB3aW5kb3cubG9jYXRpb24uaGFzaC5yZXBsYWNlKG1hc2ssIFwiXCIpIHx8IFwiL1wiO1xyXG4gICAgdGhpcy5fb25Sb3V0ZSh1cmwpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICBfb25Sb3V0ZShwYXRobmFtZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICBjb25zdCByb3V0ZSA9IHRoaXMuZ2V0Um91dGUocGF0aG5hbWUpO1xyXG4gICAgaWYgKCFyb3V0ZSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5fY3VycmVudFJvdXRlKSB7XHJcbiAgICAgIHRoaXMuX2N1cnJlbnRSb3V0ZS5sZWF2ZSgpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5fY3VycmVudFJvdXRlID0gcm91dGU7XHJcbiAgICB0aGlzLl9jdXJyZW50Um91dGUucmVuZGVyKCk7XHJcbiAgfVxyXG5cclxuICBnbyhwYXRobmFtZTogc3RyaW5nKTogdm9pZCB7XHJcbiAgICB0aGlzLmhpc3RvcnkucHVzaFN0YXRlKHt9LCBcIlwiLCBgIyR7cGF0aG5hbWV9YCk7XHJcbiAgICB0aGlzLl9vblJvdXRlKHBhdGhuYW1lKTtcclxuICB9XHJcblxyXG4gIGJhY2soKTogdm9pZCB7XHJcbiAgICB0aGlzLmhpc3RvcnkuYmFjaygpO1xyXG4gIH1cclxuXHJcbiAgZm9yd2FyZCgpOiB2b2lkIHtcclxuICAgIHRoaXMuaGlzdG9yeS5mb3J3YXJkKCk7XHJcbiAgfVxyXG5cclxuICBnZXRSb3V0ZShwYXRobmFtZTogc3RyaW5nKTogUm91dGUgfCB1bmRlZmluZWQge1xyXG4gICAgcmV0dXJuIHRoaXMucm91dGVzLmZpbmQoKHJvdXRlKSA9PiByb3V0ZS5tYXRjaChwYXRobmFtZSkpO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gaXNFcXVhbChsaHM6IHVua25vd24sIHJoczogdW5rbm93bikge1xyXG4gIHJldHVybiBsaHMgPT09IHJocztcclxufVxyXG4iLCJjb25zdCBNRVRIT0RTID0ge1xyXG4gIEdFVDogXCJHRVRcIixcclxuICBQVVQ6IFwiUFVUXCIsXHJcbiAgUE9TVDogXCJQT1NUXCIsXHJcbiAgREVMRVRFOiBcIkRFTEVURVwiLFxyXG59O1xyXG5cclxuY29uc3QgRE9NRU4gPSBcImh0dHBzOi8veWEtcHJha3Rpa3VtLnRlY2gvYXBpL3YyXCI7XHJcblxyXG5jbGFzcyBIVFRQVHJhbnNwb3J0Q2xhc3Mge1xyXG4gIGRlZmF1bHRPcHRpb25zID0ge1xyXG4gICAgaGVhZGVyczoge30sXHJcbiAgICBkYXRhOiB7fSxcclxuICB9O1xyXG5cclxuICBHRVQgPSAoXHJcbiAgICB1cmw6IHN0cmluZyxcclxuICAgIG9wdGlvbnM6IHsgW2tleTogc3RyaW5nXTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiB9ID0gdGhpcy5kZWZhdWx0T3B0aW9uc1xyXG4gICkgPT4ge1xyXG4gICAgY29uc3QgcmVxdWVzdFBhcmFtcyA9IHF1ZXJ5U3RyaW5naWZ5KG9wdGlvbnMuZGF0YSk7XHJcbiAgICB1cmwgKz0gcmVxdWVzdFBhcmFtcztcclxuICAgIHJldHVybiB0aGlzLnJlcXVlc3QoXHJcbiAgICAgIHVybCxcclxuICAgICAgeyAuLi5vcHRpb25zLCBtZXRob2Q6IE1FVEhPRFMuR0VUIH0sXHJcbiAgICAgIE51bWJlcihvcHRpb25zLnRpbWVvdXQpIHx8IDUwMDBcclxuICAgICk7XHJcbiAgfTtcclxuXHJcbiAgUFVUID0gKFxyXG4gICAgdXJsOiBzdHJpbmcsXHJcbiAgICBvcHRpb25zOiB7IFtrZXk6IHN0cmluZ106IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gfSA9IHRoaXMuZGVmYXVsdE9wdGlvbnNcclxuICApID0+IHtcclxuICAgIHJldHVybiB0aGlzLnJlcXVlc3QoXHJcbiAgICAgIHVybCxcclxuICAgICAgeyAuLi5vcHRpb25zLCBtZXRob2Q6IE1FVEhPRFMuUFVUIH0sXHJcbiAgICAgIE51bWJlcihvcHRpb25zLnRpbWVvdXQpIHx8IDUwMDBcclxuICAgICk7XHJcbiAgfTtcclxuXHJcbiAgUE9TVCA9IChcclxuICAgIHVybDogc3RyaW5nLFxyXG4gICAgb3B0aW9uczogeyBba2V5OiBzdHJpbmddOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmcgfCBudW1iZXI+IH0gPSB0aGlzXHJcbiAgICAgIC5kZWZhdWx0T3B0aW9uc1xyXG4gICkgPT4ge1xyXG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdChcclxuICAgICAgdXJsLFxyXG4gICAgICB7IC4uLm9wdGlvbnMsIG1ldGhvZDogTUVUSE9EUy5QT1NUIH0sXHJcbiAgICAgIE51bWJlcihvcHRpb25zLnRpbWVvdXQpIHx8IDUwMDBcclxuICAgICk7XHJcbiAgfTtcclxuXHJcbiAgREVMRVRFID0gKFxyXG4gICAgdXJsOiBzdHJpbmcsXHJcbiAgICBvcHRpb25zOiB7IFtrZXk6IHN0cmluZ106IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gfSA9IHRoaXMuZGVmYXVsdE9wdGlvbnNcclxuICApID0+IHtcclxuICAgIHJldHVybiB0aGlzLnJlcXVlc3QoXHJcbiAgICAgIHVybCxcclxuICAgICAgeyAuLi5vcHRpb25zLCBtZXRob2Q6IE1FVEhPRFMuREVMRVRFIH0sXHJcbiAgICAgIE51bWJlcihvcHRpb25zLnRpbWVvdXQpIHx8IDUwMDBcclxuICAgICk7XHJcbiAgfTtcclxuXHJcbiAgc29ja2V0ID0gKHVybDogc3RyaW5nKSA9PiB7XHJcbiAgICByZXR1cm4gbmV3IFdlYlNvY2tldCh1cmwpO1xyXG4gIH07XHJcblxyXG4gIHJlcXVlc3QgPSAoXHJcbiAgICB1cmw6IHN0cmluZyxcclxuICAgIG9wdGlvbnM6IHsgW2tleTogc3RyaW5nXTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiB9IHwgUmVjb3JkPHN0cmluZywgc3RyaW5nPixcclxuICAgIHRpbWVvdXQ6IG51bWJlciA9IDUwMDBcclxuICApID0+IHtcclxuICAgIHVybCA9IERPTUVOICsgdXJsO1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPGFueT4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICBjb25zdCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgeGhyLndpdGhDcmVkZW50aWFscyA9IHRydWU7XHJcbiAgICAgIHhoci5vcGVuKDxzdHJpbmc+b3B0aW9ucy5tZXRob2QsIHVybCk7XHJcbiAgICAgIGNvbnN0IGhlYWRlcnMgPSBvcHRpb25zLmhlYWRlcnM7XHJcbiAgICAgIGZvciAobGV0IGhlYWRlciBpbiBoZWFkZXJzIGFzIFJlY29yZDxzdHJpbmcsIHN0cmluZz4pIHtcclxuICAgICAgICBjb25zdCB2YWx1ZSA9IGhlYWRlcnNbaGVhZGVyIGFzIGtleW9mIHR5cGVvZiBoZWFkZXJzXSBhcyBzdHJpbmc7XHJcbiAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoaGVhZGVyLCB2YWx1ZSk7XHJcbiAgICAgIH1cclxuICAgICAgeGhyLm9ubG9hZCA9ICgpID0+IHtcclxuICAgICAgICByZXNvbHZlKHhocik7XHJcbiAgICAgIH07XHJcbiAgICAgIHhoci5vbmVycm9yID0gKGUpID0+IHtcclxuICAgICAgICByZWplY3QoZSk7XHJcbiAgICAgIH07XHJcbiAgICAgIHhoci5vbmFib3J0ID0gKGUpID0+IHtcclxuICAgICAgICByZWplY3QoZSk7XHJcbiAgICAgIH07XHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIHhoci5hYm9ydCgpO1xyXG4gICAgICB9LCB0aW1lb3V0KTtcclxuXHJcbiAgICAgIHhoci5zZW5kKEpTT04uc3RyaW5naWZ5KG9wdGlvbnMuZGF0YSkpO1xyXG4gICAgfSk7XHJcbiAgfTtcclxufVxyXG5cclxuZnVuY3Rpb24gcXVlcnlTdHJpbmdpZnkoZGF0YTogUmVjb3JkPHN0cmluZywgc3RyaW5nPikge1xyXG4gIGxldCByZXF1ZXN0UGFyYW1zID0gXCI/XCI7XHJcbiAgZm9yIChsZXQga2V5IGluIGRhdGEpIHtcclxuICAgIHJlcXVlc3RQYXJhbXMgKz0gYCR7a2V5fT0ke2RhdGFba2V5XX0mYDtcclxuICB9XHJcbiAgcmVxdWVzdFBhcmFtcyA9IHJlcXVlc3RQYXJhbXMuc3Vic3RyaW5nKDAsIHJlcXVlc3RQYXJhbXMubGVuZ3RoIC0gMSk7XHJcbiAgcmV0dXJuIHJlcXVlc3RQYXJhbXM7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBIVFRQVHJhbnNwb3J0ID0gKCgpOiB7IGdldEluc3RhbmNlOiAoKSA9PiBIVFRQVHJhbnNwb3J0Q2xhc3MgfSA9PiB7XHJcbiAgbGV0IGluc3RhbmNlOiBIVFRQVHJhbnNwb3J0Q2xhc3M7XHJcbiAgcmV0dXJuIHtcclxuICAgIGdldEluc3RhbmNlOiAoKSA9PiBpbnN0YW5jZSB8fCAoaW5zdGFuY2UgPSBuZXcgSFRUUFRyYW5zcG9ydENsYXNzKCkpLFxyXG4gIH07XHJcbn0pKCk7XHJcbiIsImltcG9ydCB7IEhZUE8gfSBmcm9tIFwiLi4vLi4vSFlQT1wiO1xyXG5cclxuZXhwb3J0IGNvbnN0IEVtYWlsVmFsaWRhdG9yID0ge1xyXG4gIHZhbHVlOiBcIlwiLFxyXG4gIGNoZWNrRnVuYzogZnVuY3Rpb24gKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgIHZhciByZWcgPSAvXihbQS1aYS16MC05X1xcLVxcLl0pK1xcQChbQS1aYS16MC05X1xcLVxcLl0pK1xcLihbQS1aYS16XXsyLDR9KSQvO1xyXG4gICAgaWYgKCFyZWcudGVzdCh2YWx1ZSkpIHtcclxuICAgICAgdGhpcy52YWx1ZSA9IFwiXCI7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH0sXHJcbiAgY2FsbGJhY2s6IChlbGVtOiBIWVBPLCBjaGVja1Jlc3VsdDogYm9vbGVhbikgPT4ge1xyXG4gICAgbGV0IHN0YXRlID0gZWxlbS5nZXRTdGF0ZSgpO1xyXG4gICAgaWYgKCFjaGVja1Jlc3VsdCkge1xyXG4gICAgICBzdGF0ZS5tZXNzYWdlID0gXCLim5Qg0Y3RgtC+INC90LUg0L/QvtGF0L7QttC1INC90LAg0LDQtNGA0LXRgSDRjdC70LXQutGC0YDQvtC90L3QvtC5INC/0L7Rh9GC0YtcIjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHN0YXRlLm1lc3NhZ2UgPSBcIlwiO1xyXG4gICAgfVxyXG4gIH0sXHJcbn07XHJcbiIsImltcG9ydCB7IEhZUE8gfSBmcm9tIFwiLi4vLi4vSFlQT1wiO1xyXG5cclxuZXhwb3J0IGNvbnN0IFJlcXVpcmVkID0ge1xyXG4gIHZhbHVlOiBcIlwiLFxyXG4gIGNoZWNrRnVuYzogZnVuY3Rpb24gKHZhbHVlOiBzdHJpbmcpOiBib29sZWFuIHtcclxuICAgIGlmICh2YWx1ZSA9PT0gXCJcIikge1xyXG4gICAgICB0aGlzLnZhbHVlID0gXCJcIjtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfSxcclxuICBjYWxsYmFjazogKGVsZW06IEhZUE8sIGNoZWNrUmVzdWx0OiBib29sZWFuKSA9PiB7XHJcbiAgICBsZXQgc3RhdGUgPSBlbGVtLmdldFN0YXRlKCk7XHJcbiAgICBpZiAoIWNoZWNrUmVzdWx0KSB7XHJcbiAgICAgIHN0YXRlLm1lc3NhZ2UgPSBcIuKblCDQvtCx0Y/Qt9Cw0YLQtdC70YzQvdC+0LUg0L/QvtC70LVcIjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHN0YXRlLm1lc3NhZ2UgPSBcIlwiO1xyXG4gICAgfVxyXG4gIH0sXHJcbn07IiwiZXhwb3J0IGZ1bmN0aW9uIHV1aWR2NCgpIHtcclxuICByZXR1cm4gXCJ4eHh4eHh4eC14eHh4LTR4eHgteXh4eC14eHh4eHh4eHh4eHhcIi5yZXBsYWNlKC9beHldL2csIGZ1bmN0aW9uIChjKSB7XHJcbiAgICB2YXIgciA9IChNYXRoLnJhbmRvbSgpICogMTYpIHwgMCxcclxuICAgICAgdiA9IGMgPT0gXCJ4XCIgPyByIDogKHIgJiAweDMpIHwgMHg4O1xyXG4gICAgcmV0dXJuIGAke3YudG9TdHJpbmcoMTYpfWA7XHJcbiAgfSk7XHJcbn0iLCJpbXBvcnQgeyBMb2dpbkxheW91dCB9IGZyb20gXCIuLi9VSS9MYXlvdXRzL0xvZ2luXCI7XHJcbmltcG9ydCB7IENoYXRMYXlvdXQgfSBmcm9tIFwiLi4vVUkvTGF5b3V0cy9DaGF0XCI7XHJcbmltcG9ydCB7IFJlZ2lzdHJhdGlvbkxheW91dCB9IGZyb20gXCIuLi9VSS9MYXlvdXRzL1JlZ2lzdHJhdGlvblwiO1xyXG5pbXBvcnQgeyBQcm9maWxlTGF5b3V0IH0gZnJvbSBcIi4uL1VJL0xheW91dHMvUHJvZmlsZVwiO1xyXG5pbXBvcnQgeyBDaGFuZ2VQcm9maWxlIH0gZnJvbSBcIi4uL1VJL0xheW91dHMvQ2hhbmdlUHJvZmlsZVwiO1xyXG5pbXBvcnQgeyBDaGFuZ2VQYXNzd29yZCB9IGZyb20gXCIuLi9VSS9MYXlvdXRzL0NoYW5nZVBhc3N3b3JkXCI7XHJcbmltcG9ydCB7IFJvdXRlciB9IGZyb20gXCIuLi9saWJzL1JvdXRlclwiO1xyXG5pbXBvcnQgeyBIVFRQVHJhbnNwb3J0IH0gZnJvbSBcIi4uL2xpYnMvVHJhbnNwb3J0XCI7XHJcbmltcG9ydCB7IElDaGF0Vmlld01vZGVsIH0gZnJvbSBcIi4uL1ZpZXdNb2RlbC9DaGF0Vmlld01vZGVsXCI7XHJcbmltcG9ydCB7IFZJRVdfTU9ERUwgfSBmcm9tIFwiLi4vVmlld01vZGVsXCI7XHJcbmltcG9ydCB7IENvbnRhaW5lciB9IGZyb20gXCIuLi9saWJzL0NvbnRhaW5lclwiO1xyXG5pbXBvcnQgeyBJVXNlclZpZXdNb2RlbCB9IGZyb20gXCIuLi9WaWV3TW9kZWwvVXNlclZpZXdNb2RlbFwiO1xyXG5cclxuZXhwb3J0IGNvbnN0IFJvdXRlckluaXQgPSAoY29udGFpbmVyOiBDb250YWluZXIpOiBSb3V0ZXIgPT4ge1xyXG4gIHJldHVybiBuZXcgUm91dGVyKFwiI3Jvb3RcIilcclxuICAgIC51c2UoXCIvXCIsIExvZ2luTGF5b3V0LCAoKSA9PiB7XHJcbiAgICAgIHJldHVybiBIVFRQVHJhbnNwb3J0LmdldEluc3RhbmNlKClcclxuICAgICAgICAuR0VUKFwiL2F1dGgvdXNlclwiKVxyXG4gICAgICAgIC50aGVuKCh1c2VyKSA9PiB7XHJcbiAgICAgICAgICByZXR1cm4gSlNPTi5wYXJzZSh1c2VyLnJlc3BvbnNlKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pXHJcbiAgICAudXNlKFwiL3JlZ2lzdHJhdGlvblwiLCBSZWdpc3RyYXRpb25MYXlvdXQpXHJcbiAgICAudXNlKFwiL2NoYXRcIiwgQ2hhdExheW91dCwgYXN5bmMgKCkgPT4ge1xyXG4gICAgICBjb25zdCBjaGF0Vmlld01vZGVsID0gY29udGFpbmVyLmdldDxJQ2hhdFZpZXdNb2RlbD4oVklFV19NT0RFTC5DSEFUKTtcclxuICAgICAgYXdhaXQgY2hhdFZpZXdNb2RlbC5nZXRDaGF0cygpO1xyXG4gICAgICByZXR1cm4gY2hhdFZpZXdNb2RlbC5jaGF0cztcclxuICAgICAgcmV0dXJuIEhUVFBUcmFuc3BvcnQuZ2V0SW5zdGFuY2UoKVxyXG4gICAgICAgIC5HRVQoXCIvY2hhdHNcIilcclxuICAgICAgICAudGhlbigocmVzdWx0KSA9PiB7XHJcbiAgICAgICAgICBjb25zdCByZXNwID0gSlNPTi5wYXJzZShyZXN1bHQucmVzcG9uc2UpO1xyXG4gICAgICAgICAgcmV0dXJuIHJlc3A7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KVxyXG4gICAgLnVzZShcIi9wcm9maWxlXCIsIFByb2ZpbGVMYXlvdXQsICgpID0+IHtcclxuICAgICAgcmV0dXJuIEhUVFBUcmFuc3BvcnQuZ2V0SW5zdGFuY2UoKVxyXG4gICAgICAgIC5HRVQoXCIvYXV0aC91c2VyXCIpXHJcbiAgICAgICAgLnRoZW4oKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgY29uc3QgcmVzcCA9IEpTT04ucGFyc2UocmVzdWx0LnJlc3BvbnNlKTtcclxuICAgICAgICAgIHJldHVybiByZXNwO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSlcclxuICAgIC51c2UoXCIvZWRpdHByb2ZpbGVcIiwgQ2hhbmdlUHJvZmlsZSwgYXN5bmMgKCkgPT4ge1xyXG4gICAgICBjb25zdCB1c2VyVmlld01vZGVsID0gY29udGFpbmVyLmdldDxJVXNlclZpZXdNb2RlbD4oVklFV19NT0RFTC5VU0VSKTtcclxuICAgICAgYXdhaXQgdXNlclZpZXdNb2RlbC5nZXRVc2VyKCk7XHJcbiAgICAgIHJldHVybiB1c2VyVmlld01vZGVsLnVzZXI7XHJcbiAgICB9KVxyXG4gICAgLnVzZShcIi9lZGl0cGFzc3dvcmRcIiwgQ2hhbmdlUGFzc3dvcmQpXHJcbiAgICAuc3RhcnQoKTtcclxufTtcclxuIiwiZXhwb3J0IGZ1bmN0aW9uIG1lbW9pemUoZnVuYywgcmVzb2x2ZXIpIHtcclxuICBpZiAoXHJcbiAgICB0eXBlb2YgZnVuYyAhPSBcImZ1bmN0aW9uXCIgfHxcclxuICAgIChyZXNvbHZlciAhPSBudWxsICYmIHR5cGVvZiByZXNvbHZlciAhPSBcImZ1bmN0aW9uXCIpXHJcbiAgKSB7XHJcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEZVTkNfRVJST1JfVEVYVCk7XHJcbiAgfVxyXG4gIHZhciBtZW1vaXplZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBhcmdzID0gYXJndW1lbnRzLFxyXG4gICAgICBrZXkgPSByZXNvbHZlciA/IHJlc29sdmVyLmFwcGx5KHRoaXMsIGFyZ3MpIDogYXJnc1swXSxcclxuICAgICAgY2FjaGUgPSBtZW1vaXplZC5jYWNoZTtcclxuXHJcbiAgICBpZiAoY2FjaGUuaGFzKGtleSkpIHtcclxuICAgICAgcmV0dXJuIGNhY2hlLmdldChrZXkpO1xyXG4gICAgfVxyXG4gICAgdmFyIHJlc3VsdCA9IGZ1bmMuYXBwbHkodGhpcywgYXJncyk7XHJcbiAgICBtZW1vaXplZC5jYWNoZSA9IGNhY2hlLnNldChrZXksIHJlc3VsdCkgfHwgY2FjaGU7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH07XHJcbiAgbWVtb2l6ZWQuY2FjaGUgPSBuZXcgKG1lbW9pemUuQ2FjaGUgfHwgTWFwQ2FjaGUpKCk7XHJcbiAgcmV0dXJuIG1lbW9pemVkO1xyXG59XHJcblxyXG5tZW1vaXplLkNhY2hlID0gTWFwO1xyXG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHRpZihfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdKSB7XG5cdFx0cmV0dXJuIF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0uZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGVcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG5fX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvaW5kZXgudHNcIik7XG4iXSwic291cmNlUm9vdCI6IiJ9