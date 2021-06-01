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
                        console.log(userViewModel.user);
                        // userViewModel.user.display_name = 'ivan'
                        // userViewModel.saveUser(userViewModel.user)
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
const ViewModel_1 = __webpack_require__(/*! ../../../ViewModel */ "./src/ViewModel/index.ts");
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
                    const userViewModel = __1.container.get(ViewModel_1.VIEW_MODEL.USER);
                    console.log(userViewModel.user);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9Cb290c3RyYXAvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvQnVzc2luZXNMYXllci9DaGF0U2VydmljZS50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9CdXNzaW5lc0xheWVyL1VzZXJTZXJ2aWNlLnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL0J1c3NpbmVzTGF5ZXIvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvSW5mcmFzdHNydWN0dXJlTGF5ZXIvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvSW5mcmFzdHNydWN0dXJlTGF5ZXIvaW50ZXJmYWNlcy50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9JbnRlZ3JhdGlvbmFsTGF5ZXIvQ2hhdEFQSS50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9JbnRlZ3JhdGlvbmFsTGF5ZXIvVXNlckFQSS50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9JbnRlZ3JhdGlvbmFsTGF5ZXIvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvVUkvQ29tcG9uZW50cy9BdHRlbnRpb25NZXNzYWdlL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL1VJL0NvbXBvbmVudHMvQnV0dG9uL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL1VJL0NvbXBvbmVudHMvQ2hhdEl0ZW0vaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvVUkvQ29tcG9uZW50cy9DcmVhdGVDaGF0TW9kYWwvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvVUkvQ29tcG9uZW50cy9EZWxldGUvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvVUkvQ29tcG9uZW50cy9FbXB0eS9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9VSS9Db21wb25lbnRzL0lucHV0L2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL1VJL0xheW91dHMvQ2hhbmdlUGFzc3dvcmQvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvVUkvTGF5b3V0cy9DaGFuZ2VQcm9maWxlL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL1VJL0xheW91dHMvQ2hhdC9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9VSS9MYXlvdXRzL0xvZ2luL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL1VJL0xheW91dHMvUHJvZmlsZS9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9VSS9MYXlvdXRzL1JlZ2lzdHJhdGlvbi9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9WaWV3TW9kZWwvQ2hhdFZpZXdNb2RlbC9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9WaWV3TW9kZWwvVXNlclZpZXdNb2RlbC9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9WaWV3TW9kZWwvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvbGlicy9Db250YWluZXIvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvbGlicy9IWVBPL0hZUE8udHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvbGlicy9Sb3V0ZXIvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvbGlicy9UcmFuc3BvcnQvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvbGlicy9WYWxpZGF0b3JzL0VtYWlsL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL2xpYnMvVmFsaWRhdG9ycy9SZXF1aXJlZC9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9saWJzL3V0aWxzL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL3JvdXRlci9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9saWJzL21vbWl6ZS9pbmRleC5qcyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4L3dlYnBhY2svc3RhcnR1cCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQ0EseUhBQWtFO0FBQ2xFLG1IQUEyRDtBQUMzRCxvR0FBb0Q7QUFDcEQsd0ZBQWtEO0FBRWxELE1BQU0saUJBQWlCLEdBQUcsQ0FDeEIsdUJBQWtDLEVBQ2xDLHFCQUFnQyxFQUNoQyxnQkFBMkIsRUFDM0Isa0JBQTZCLEVBQzdCLEVBQUU7SUFDRixPQUFPLGtCQUFrQjtTQUN0QixNQUFNLENBQUMsZ0JBQWdCLENBQUM7U0FDeEIsTUFBTSxDQUFDLHFCQUFxQixDQUFDO1NBQzdCLE1BQU0sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBQ3JDLENBQUMsQ0FBQztBQUVGLE1BQWEsU0FBUztJQUVwQjtRQUNFLElBQUksQ0FBQyxTQUFTLEdBQUcsaUJBQWlCLENBQ2hDLDhDQUF1QixFQUN2Qix1Q0FBa0IsRUFDbEIsZ0NBQWdCLEVBQ2hCLDhCQUFrQixDQUNuQixDQUFDO0lBQ0osQ0FBQztDQUNGO0FBVkQsOEJBVUM7Ozs7Ozs7Ozs7Ozs7O0FDbkJELE1BQWEsV0FBVztJQUN0QixZQUFzQixTQUF5QjtRQUF6QixjQUFTLEdBQVQsU0FBUyxDQUFnQjtRQUUvQyxhQUFRLEdBQUcsR0FBNkIsRUFBRTtZQUN4QyxPQUFPLElBQUksQ0FBQyxTQUFTLENB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Q3JCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHdDQUF3Qyx5Q0FBeUM7V0FDakY7V0FDQTtXQUNBLEU7Ozs7O1dDUEEsc0Y7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0Esc0RBQXNELGtCQUFrQjtXQUN4RTtXQUNBLCtDQUErQyxjQUFjO1dBQzdELEU7Ozs7VUNOQTtVQUNBO1VBQ0E7VUFDQSIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb250YWluZXIgfSBmcm9tIFwiLi4vbGlicy9Db250YWluZXJcIjtcbmltcG9ydCB7IGluZnJhc3RydWN0dXJlQ29udGFpbmVyIH0gZnJvbSBcIi4uL0luZnJhc3RzcnVjdHVyZUxheWVyXCI7XG5pbXBvcnQgeyBBcGlDbGllbnRDb250YWluZXIgfSBmcm9tIFwiLi4vSW50ZWdyYXRpb25hbExheWVyXCI7XG5pbXBvcnQgeyBTZXJ2aWNlQ29udGFpbmVyIH0gZnJvbSBcIi4uL0J1c3NpbmVzTGF5ZXJcIjtcbmltcG9ydCB7IFZpZXdNb2RlbENvbnRhaW5lciB9IGZyb20gXCIuLi9WaWV3TW9kZWxcIjtcblxuY29uc3QgQ3JlYXRlRElDb250YWluZXIgPSAoXG4gIGluZnJhc3RydWN0dXJlQ29udGFpbmVyOiBDb250YWluZXIsXG4gIGludGVncmVhdGlvbkNvbnRhaW5lcjogQ29udGFpbmVyLFxuICBzZXJ2aWNlQ29udGFpbmVyOiBDb250YWluZXIsXG4gIHZpZXdNb2RlbENvbnRhaW5lcjogQ29udGFpbmVyXG4pID0+IHtcbiAgcmV0dXJuIHZpZXdNb2RlbENvbnRhaW5lclxuICAgIC5wYXJlbnQoc2VydmljZUNvbnRhaW5lcilcbiAgICAucGFyZW50KGludGVncmVhdGlvbkNvbnRhaW5lcilcbiAgICAucGFyZW50KGluZnJhc3RydWN0dXJlQ29udGFpbmVyKTtcbn07XG5cbmV4cG9ydCBjbGFzcyBCb290U3RyYXAge1xuICBjb250YWluZXI6IENvbnRhaW5lcjtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5jb250YWluZXIgPSBDcmVhdGVESUNvbnRhaW5lcihcbiAgICAgIGluZnJhc3RydWN0dXJlQ29udGFpbmVyLFxuICAgICAgQXBpQ2xpZW50Q29udGFpbmVyLFxuICAgICAgU2VydmljZUNvbnRhaW5lcixcbiAgICAgIFZpZXdNb2RlbENvbnRhaW5lclxuICAgICk7XG4gIH1cbn1cbiIsImltcG9ydCB7IElDaGF0RFRPIH0gZnJvbSBcIi4uL1VJL0NvbXBvbmVudHMvQ2hhdEl0ZW1cIjtcbmltcG9ydCB7IElDaGF0QVBJQ2xpZW50IH0gZnJvbSBcIi4uL0ludGVncmF0aW9uYWxMYXllci9DaGF0QVBJXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUNoYXRTZXJ2aWNlIHtcbiAgZ2V0Q2hhdHM6ICgpID0+IFByb21pc2U8QXJyYXk8SUNoYXREVE8+PjtcbiAgc2F2ZUNoYXQ6IChkYXRhOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+KSA9PiBQcm9taXNlPHZvaWQ+O1xuICBkZWxldGVDaGF0OiAoY2hhdElkOiBzdHJpbmcpID0+IFByb21pc2U8dm9pZD47XG59XG5cbmV4cG9ydCBjbGFzcyBDaGF0U2VydmljZSBpbXBsZW1lbnRzIElDaGF0U2VydmljZSB7XG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBBcGlDbGllbnQ6IElDaGF0QVBJQ2xpZW50KSB7fVxuXG4gIGdldENoYXRzID0gKCk6IFByb21pc2U8QXJyYXk8SUNoYXREVE8+PiA9PiB7XG4gICAgcmV0dXJuIHRoaXMuQXBpQ2xpZW50LmdldENoYXRzKCk7XG4gIH07XG5cbiAgc2F2ZUNoYXQgPSAoZGF0YTogUmVjb3JkPHN0cmluZywgc3RyaW5nPikgPT4ge1xuICAgIHJldHVybiB0aGlzLkFwaUNsaWVudC5zYXZlQ2hhdChkYXRhKTtcbiAgfTtcblxuICBkZWxldGVDaGF0KGNoYXRJZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMuQXBpQ2xpZW50LmRlbGV0ZUNoYXQoY2hhdElkKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgSVVzZXJBUElDbGllbnQgfSBmcm9tIFwiLi4vSW50ZWdyYXRpb25hbExheWVyL1VzZXJBUElcIjtcbmltcG9ydCB7IElQcm9maWxlRFRPIH0gZnJvbSBcIi4uL1VJL0xheW91dHMvUHJvZmlsZVwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIElVc2VyU2VydmljZSB7XG4gIGdldFVzZXIoKTogUHJvbWlzZTxJUHJvZmlsZURUTz47XG4gIHNhdmVVc2VyKHVzZXI6SVByb2ZpbGVEVE8pOlByb21pc2U8SVByb2ZpbGVEVE8+O1xufVxuXG5leHBvcnQgY2xhc3MgVXNlclNlcnZpY2UgaW1wbGVtZW50cyBJVXNlclNlcnZpY2Uge1xuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgQXBpQ2xpZW50OiBJVXNlckFQSUNsaWVudCkge31cbiAgc2F2ZVVzZXIodXNlcjpJUHJvZmlsZURUTyk6UHJvbWlzZTxJUHJvZmlsZURUTz57XG4gICAgcmV0dXJuIHRoaXMuQXBpQ2xpZW50LnNhdmVVc2VyKHVzZXIpXG4gIH1cbiAgZ2V0VXNlcigpIHtcbiAgICByZXR1cm4gdGhpcy5BcGlDbGllbnQuZ2V0VXNlcigpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBBUElfQ0xJRU5UIH0gZnJvbSBcIi4uL0ludGVncmF0aW9uYWxMYXllclwiO1xuaW1wb3J0IHsgSUNoYXRBUElDbGllbnQgfSBmcm9tIFwiLi4vSW50ZWdyYXRpb25hbExheWVyL0NoYXRBUElcIjtcbmltcG9ydCB7IElVc2VyQVBJQ2xpZW50IH0gZnJvbSBcIi4uL0ludGVncmF0aW9uYWxMYXllci9Vc2VyQVBJXCI7XG5pbXBvcnQgeyBDb250YWluZXIgfSBmcm9tIFwiLi4vbGlicy9Db250YWluZXJcIjtcbmltcG9ydCB7IENoYXRTZXJ2aWNlIH0gZnJvbSBcIi4vQ2hhdFNlcnZpY2VcIjtcbmltcG9ydCB7IFVzZXJTZXJ2aWNlIH0gZnJvbSBcIi4vVXNlclNlcnZpY2VcIjtcblxuZXhwb3J0IGNvbnN0IFNFUlZJQ0UgPSB7XG4gIENIQVQ6IFN5bWJvbC5mb3IoXCJDaGF0U2VydmljZVwiKSxcbiAgVVNFUjogU3ltYm9sLmZvcihcIlVzZXJTZXJ2Y2llXCIpLFxufTtcblxuZXhwb3J0IGNvbnN0IFNlcnZpY2VDb250YWluZXIgPSBuZXcgQ29udGFpbmVyKCk7XG5cblNlcnZpY2VDb250YWluZXIuYmluZChTRVJWSUNFLkNIQVQpLnRvRHluYW1pY1ZhbHVlKChjb250YWluZXIpID0+IHtcbiAgY29uc3QgQVBJQ2xpZW50ID0gY29udGFpbmVyLmdldDxJQ2hhdEFQSUNsaWVudD4oQVBJX0NMSUVOVC5DSEFUKTtcbiAgcmV0dXJuIG5ldyBDaGF0U2VydmljZShBUElDbGllbnQpO1xufSk7XG5cblNlcnZpY2VDb250YWluZXIuYmluZChTRVJWSUNFLlVTRVIpLnRvRHluYW1pY1ZhbHVlKChjb250YWluZXIpID0+IHtcbiAgY29uc3QgQVBJQ2xpZW50ID0gY29udGFpbmVyLmdldDxJVXNlckFQSUNsaWVudD4oQVBJX0NMSUVOVC5VU0VSKTtcbiAgcmV0dXJuIG5ldyBVc2VyU2VydmljZShBUElDbGllbnQpO1xufSk7XG4iLCJpbXBvcnQgeyBDb250YWluZXIgfSBmcm9tIFwiLi4vbGlicy9Db250YWluZXJcIjtcbmltcG9ydCB7IEFQSU1vZHVsZSB9IGZyb20gXCIuL2ludGVyZmFjZXNcIjtcblxuZXhwb3J0IGNvbnN0IElOVEVHUkFUSU9OX01PRFVMRSA9IHtcbiAgQVBJTW9kdWxlOiBTeW1ib2wuZm9yKFwiQVBJXCIpLFxufTtcblxuZXhwb3J0IGNvbnN0IGluZnJhc3RydWN0dXJlQ29udGFpbmVyID0gbmV3IENvbnRhaW5lcigpO1xuXG5pbmZyYXN0cnVjdHVyZUNvbnRhaW5lclxuICAuYmluZChJTlRFR1JBVElPTl9NT0RVTEUuQVBJTW9kdWxlKVxuICAudG9EeW5hbWljVmFsdWUoKGNvbnRhaW5lcikgPT4ge1xuICAgIHJldHVybiBuZXcgQVBJTW9kdWxlKCk7XG4gIH0pO1xuIiwiaW1wb3J0IHsgSFRUUFRyYW5zcG9ydCB9IGZyb20gXCIuLi9saWJzL1RyYW5zcG9ydFwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIElBUElNb2R1bGUge1xuICBnZXREYXRhOiA8UD4odXJsOiBzdHJpbmcsIHBhcmFtczogUmVjb3JkPHN0cmluZywgc3RyaW5nPikgPT4gUHJvbWlzZTxQPjtcbiAgcG9zdERhdGE6IDxQIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgc3RyaW5nPj4oXG4gICAgdXJsOiBzdHJpbmcsXG4gICAgcGFyYW1zOiBQXG4gICkgPT4gUHJvbWlzZTxQPjtcbiAgcHV0RGF0YTogPFA+KHVybDogc3RyaW5nLCBwYXJhbXM6IFJlY29yZDxzdHJpbmcsIGFueT4pID0+IFByb21pc2U8UD47XG4gIGRlbGV0ZURhdGE6ICh1cmw6IHN0cmluZywgcGFyYW1zOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+KSA9PiBQcm9taXNlPHZvaWQ+O1xufVxuXG5leHBvcnQgY2xhc3MgQVBJTW9kdWxlIGltcGxlbWVudHMgSUFQSU1vZHVsZSB7XG4gIGNvbnN0cnVjdG9yKCkge31cbiAgZ2V0RGF0YSA9IDxQPih1cmw6IHN0cmluZywgZGF0YTogUmVjb3JkPHN0cmluZywgc3RyaW5nPik6IFByb21pc2U8UD4gPT4ge1xuICAgIHJldHVybiBIVFRQVHJhbnNwb3J0LmdldEluc3RhbmNlKClcbiAgICAgIC5HRVQodXJsLCB0aGlzLmdldFBhcm1zKGRhdGEpKVxuICAgICAgLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShyZXN1bHQucmVzcG9uc2UpO1xuICAgICAgfSk7XG4gIH07XG5cbiAgcG9zdERhdGEgPSBhc3luYyA8UCBleHRlbmRzIFJlY29yZDxzdHJpbmcsIHN0cmluZz4+KFxuICAgIHVybDogc3RyaW5nLFxuICAgIGRhdGE6IFBcbiAgKTogUHJvbWlzZTxQPiA9PiB7XG4gICAgcmV0dXJuIEhUVFBUcmFuc3BvcnQuZ2V0SW5zdGFuY2UoKVxuICAgICAgLlBPU1QodXJsLCB0aGlzLmdldFBhcm1zKGRhdGEpKVxuICAgICAgLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShyZXN1bHQucmVzcG9uc2UpO1xuICAgICAgfSk7XG4gIH07XG5cbiAgZGVsZXRlRGF0YSA9ICh1cmw6IHN0cmluZywgZGF0YTogUmVjb3JkPHN0cmluZywgc3RyaW5nPik6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIHJldHVybiBIVFRQVHJhbnNwb3J0LmdldEluc3RhbmNlKClcbiAgICAgIC5ERUxFVEUodXJsLCB0aGlzLmdldFBhcm1zKGRhdGEpKVxuICAgICAgLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShyZXN1bHQucmVzcG9uc2UpO1xuICAgICAgfSk7XG4gIH07XG5cbiAgcHV0RGF0YSA9IDxQPih1cmw6IHN0cmluZywgZGF0YTogUmVjb3JkPHN0cmluZywgc3RyaW5nPik6IFByb21pc2U8UD4gPT4ge1xuICAgIHJldHVybiBIVFRQVHJhbnNwb3J0LmdldEluc3RhbmNlKCkuUFVUKHVybCwgdGhpcy5nZXRQYXJtcyhkYXRhKSk7XG4gIH07XG5cbiAgcHJpdmF0ZSBnZXRQYXJtczxUIGV4dGVuZHMgUmVjb3JkPHN0cmluZywgc3RyaW5nPj4oXG4gICAgZGF0YTogVFxuICApOiB7IFtrZXk6IHN0cmluZ106IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gfSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgXCJDb250ZW50LXR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICB9LFxuICAgICAgZGF0YToge1xuICAgICAgICAuLi5kYXRhLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG59XG4iLCJpbXBvcnQgeyBJQVBJTW9kdWxlIH0gZnJvbSBcIi4uL0luZnJhc3RzcnVjdHVyZUxheWVyL2ludGVyZmFjZXNcIjtcbmltcG9ydCB7IElDaGF0RFRPIH0gZnJvbSBcIi4uL1VJL0NvbXBvbmVudHMvQ2hhdEl0ZW1cIjtcblxuZXhwb3J0IGludGVyZmFjZSBJQ2hhdEFQSUNsaWVudCB7XG4gIGdldENoYXRzKCk6IFByb21pc2U8QXJyYXk8SUNoYXREVE8+PjtcbiAgc2F2ZUNoYXQoZGF0YTogUmVjb3JkPHN0cmluZywgc3RyaW5nPik6IFByb21pc2U8dm9pZD47XG4gIGRlbGV0ZUNoYXQoaWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD47XG59XG5cbmV4cG9ydCBjbGFzcyBDaGF0QVBJQ2xpZW50IGltcGxlbWVudHMgSUNoYXRBUElDbGllbnQge1xuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgQVBJTW9kdWxlOiBJQVBJTW9kdWxlKSB7fVxuXG4gIGdldENoYXRzID0gYXN5bmMgKCk6IFByb21pc2U8QXJyYXk8SUNoYXREVE8+PiA9PiB7XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMuQVBJTW9kdWxlLmdldERhdGE8SUNoYXREVE9bXT4oXCIvY2hhdHNcIiwge30pLnRoZW4oXG4gICAgICAocmVzdWx0KSA9PiB7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9XG4gICAgKTtcbiAgfTtcblxuICBzYXZlQ2hhdCA9IGFzeW5jIChkYXRhOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+KTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgYXdhaXQgdGhpcy5BUElNb2R1bGUucG9zdERhdGEoXCIvY2hhdHNcIiwgZGF0YSk7XG4gIH07XG5cbiAgZGVsZXRlQ2hhdChpZDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMuQVBJTW9kdWxlLmRlbGV0ZURhdGEoXCIvY2hhdHNcIiwgeyBjaGF0SWQ6IGlkIH0pO1xuICB9XG59XG4iLCJpbXBvcnQgeyBJQVBJTW9kdWxlIH0gZnJvbSBcIi4uL0luZnJhc3RzcnVjdHVyZUxheWVyL2ludGVyZmFjZXNcIjtcbmltcG9ydCB7IElQcm9maWxlRFRPIH0gZnJvbSBcIi4uL1VJL0xheW91dHMvUHJvZmlsZVwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIElVc2VyQVBJQ2xpZW50IHtcbiAgZ2V0VXNlcigpOiBQcm9taXNlPElQcm9maWxlRFRPPjtcbiAgc2F2ZVVzZXIodXNlcjogSVByb2ZpbGVEVE8pOiBQcm9taXNlPElQcm9maWxlRFRPPlxufVxuXG5leHBvcnQgY2xhc3MgVXNlckFQSUNsaWVudCBpbXBsZW1lbnRzIElVc2VyQVBJQ2xpZW50IHtcbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIEFQSU1vZHVsZTogSUFQSU1vZHVsZSkgeyB9XG5cbiAgZ2V0VXNlciA9IGFzeW5jICgpID0+IHtcbiAgICBjb25zdCB1c2VyID0gYXdhaXQgdGhpcy5BUElNb2R1bGUuZ2V0RGF0YTxJUHJvZmlsZURUTz4oXCIvYXV0aC91c2VyXCIsIHt9KTtcbiAgICByZXR1cm4gdXNlcjtcbiAgfTtcblxuICBzYXZlVXNlciA9ICh1c2VyOiBJUHJvZmlsZURUTykgPT4ge1xuICAgIHJldHVybiB0aGlzLkFQSU1vZHVsZS5wdXREYXRhPElQcm9maWxlRFRPPignL3VzZXIvcHJvZmlsZScsIHVzZXIpXG4gIH1cbn1cbiIsImltcG9ydCB7IENvbnRhaW5lciB9IGZyb20gXCIuLi9saWJzL0NvbnRhaW5lclwiO1xuaW1wb3J0IHsgSU5URUdSQVRJT05fTU9EVUxFIH0gZnJvbSBcIi4uL0luZnJhc3RzcnVjdHVyZUxheWVyXCI7XG5pbXBvcnQgeyBDaGF0QVBJQ2xpZW50IH0gZnJvbSBcIi4vQ2hhdEFQSVwiO1xuaW1wb3J0IHsgSUFQSU1vZHVsZSB9IGZyb20gXCIuLi9JbmZyYXN0c3J1Y3R1cmVMYXllci9pbnRlcmZhY2VzXCI7XG5pbXBvcnQgeyBjb250YWluZXIgfSBmcm9tIFwiLi5cIjtcbmltcG9ydCB7IFVzZXJBUElDbGllbnQgfSBmcm9tIFwiLi9Vc2VyQVBJXCI7XG5cbmV4cG9ydCBjb25zdCBBUElfQ0xJRU5UID0ge1xuICBDSEFUOiBTeW1ib2wuZm9yKFwiQ2hhdEFQSUNsaWVudFwiKSxcbiAgVVNFUjogU3ltYm9sLmZvcihcIlVzZXJBUElDbGllbnRcIiksXG59O1xuXG5leHBvcnQgY29uc3QgQXBpQ2xpZW50Q29udGFpbmVyID0gbmV3IENvbnRhaW5lcigpO1xuXG5BcGlDbGllbnRDb250YWluZXIuYmluZChBUElfQ0xJRU5ULkNIQVQpLnRvRHluYW1pY1ZhbHVlKChjb250YWluZXIpID0+IHtcbiAgY29uc3QgQVBJTW9kdWxlID0gY29udGFpbmVyLmdldDxJQVBJTW9kdWxlPihJTlRFR1JBVElPTl9NT0RVTEUuQVBJTW9kdWxlKTtcbiAgcmV0dXJuIG5ldyBDaGF0QVBJQ2xpZW50KEFQSU1vZHVsZSk7XG59KTtcblxuQXBpQ2xpZW50Q29udGFpbmVyLmJpbmQoQVBJX0NMSUVOVC5VU0VSKS50b0R5bmFtaWNWYWx1ZSgoY29udGFpbmVyKSA9PiB7XG4gIGNvbnN0IEFQSU1vZHVsZSA9IGNvbnRhaW5lci5nZXQ8SUFQSU1vZHVsZT4oSU5URUdSQVRJT05fTU9EVUxFLkFQSU1vZHVsZSk7XG4gIHJldHVybiBuZXcgVXNlckFQSUNsaWVudChBUElNb2R1bGUpO1xufSk7XG4iLCJpbXBvcnQgeyBIWVBPIH0gZnJvbSBcIi4uLy4uLy4uL2xpYnMvSFlQTy9IWVBPXCI7XG5cbmV4cG9ydCBjb25zdCBBdHRlbnRpb25NZXNzYWdlID0gKCk6IEhZUE8gPT4ge1xuICByZXR1cm4gbmV3IEhZUE8oe1xuICAgIHRlbXBsYXRlUGF0aDogXCJhdHRlbnRpb24udGVtcGxhdGUuaHRtbFwiLFxuICAgIGRhdGE6IHtcbiAgICAgIG1lc3NhZ2U6IFwiXCIsXG4gICAgfSxcbiAgICBjaGlsZHJlbjoge30sXG4gIH0pO1xufTtcbiIsImltcG9ydCB7IEhZUE8gfSBmcm9tIFwiLi4vLi4vLi4vbGlicy9IWVBPL0hZUE9cIjtcbmltcG9ydCB7IHV1aWR2NCB9IGZyb20gXCIuLi8uLi8uLi9saWJzL3V0aWxzXCI7XG5cbmludGVyZmFjZSBJUHJvcHMge1xuICBpZD86IHN0cmluZztcbiAgdGl0bGU6IHN0cmluZztcbiAgY2xhc3NOYW1lOiBzdHJpbmc7XG4gIG9uQ2xpY2s6IChlOiBFdmVudCkgPT4gdm9pZDtcbn1cblxuZXhwb3J0IGNvbnN0IEJ1dHRvbiA9IChwcm9wczogSVByb3BzKSA9PiB7XG4gIGNvbnN0IGlkID0gcHJvcHMuaWQgfHwgdXVpZHY0KCk7XG4gIHJldHVybiBuZXcgSFlQTyh7XG4gICAgdGVtcGxhdGVQYXRoOiBcImJ1dHRvbi50ZW1wbGF0ZS5odG1sXCIsXG4gICAgZGF0YToge1xuICAgICAgaWQ6IGlkLFxuICAgICAgdGl0bGU6IHByb3BzLnRpdGxlLFxuICAgICAgY2xhc3NOYW1lOiBwcm9wcy5jbGFzc05hbWUsXG4gICAgfSxcbiAgfSkuYWZ0ZXJSZW5kZXIoKCkgPT4ge1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKT8uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIChlKSA9PiB7XG4gICAgICBwcm9wcy5vbkNsaWNrKGUpO1xuICAgIH0pO1xuICB9KTtcbn07XG4iLCJpbXBvcnQgeyBjb250YWluZXIsIHJvdXRlciB9IGZyb20gXCIuLi8uLi8uLlwiO1xuaW1wb3J0IHsgQ2hhdExheW91dCB9IGZyb20gXCIuLi8uLi9MYXlvdXRzL0NoYXRcIjtcbmltcG9ydCB7IEhZUE8gfSBmcm9tIFwiLi4vLi4vLi4vbGlicy9IWVBPL0hZUE9cIjtcbmltcG9ydCB7IEhUVFBUcmFuc3BvcnQgfSBmcm9tIFwiLi4vLi4vLi4vbGlicy9UcmFuc3BvcnRcIjtcbmltcG9ydCB7IERlbGV0ZSB9IGZyb20gXCIuLi9EZWxldGVcIjtcbmltcG9ydCB7IFZJRVdfTU9ERUwgfSBmcm9tIFwiLi4vLi4vLi4vVmlld01vZGVsXCI7XG5pbXBvcnQgeyBJQ2hhdFZpZXdNb2RlbCB9IGZyb20gXCIuLi8uLi8uLi9WaWV3TW9kZWwvQ2hhdFZpZXdNb2RlbFwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIElDaGF0RFRPIHtcbiAgdGl0bGU6IHN0cmluZztcbiAgYXZhdGFyOiBzdHJpbmcgfCBudWxsO1xuICBjcmVhdGVkX2J5OiBudW1iZXI7XG4gIGlkOiBudW1iZXI7XG59XG5cbmludGVyZmFjZSBJUHJvcHMgZXh0ZW5kcyBJQ2hhdERUTyB7XG4gIGNsYXNzTmFtZT86IHN0cmluZztcbn1cblxuZXhwb3J0IGNvbnN0IENoYXRJdGVtID0gKHByb3BzOiBJQ2hhdERUTykgPT4ge1xuICByZXR1cm4gbmV3IEhZUE8oe1xuICAgIHRlbXBsYXRlUGF0aDogXCJjaGF0SXRlbS50ZW1wbGF0ZS5odG1sXCIsXG4gICAgZGF0YToge1xuICAgICAgQ2hhdE5hbWU6IHByb3BzLnRpdGxlLFxuICAgICAgbGFzdFRpbWU6IHByb3BzLmNyZWF0ZWRfYnkgfHwgXCIxMDoyMlwiLFxuICAgICAgbGFzdE1lc3NhZ2U6IHByb3BzLmlkIHx8IFwiSGksIGhvdyBhcmUgeW91P1wiLFxuICAgICAgbm90aWZpY2F0aW9uQ291bnQ6IHByb3BzLmF2YXRhciB8fCAzLFxuICAgIH0sXG4gICAgY2hpbGRyZW46IHtcbiAgICAgIGRlbGV0ZTogRGVsZXRlKHtcbiAgICAgICAgaWQ6IGBkZWxldGVJdGVtJHtwcm9wcy5pZH1gLFxuICAgICAgICBvbkNsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgY29uc3QgY2hhdFZpZXdNb2RlbCA9IGNvbnRhaW5lci5nZXQ8SUNoYXRWaWV3TW9kZWw+KFZJRVdfTU9ERUwuQ0hBVCk7XG4gICAgICAgICAgY2hhdFZpZXdNb2RlbC5kZWxldGVDaGF0KFN0cmluZyhwcm9wcy5pZCkpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgQ2hhdExheW91dChjaGF0Vmlld01vZGVsLmNoYXRzKS5yZW5kZXIoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgIH0sXG4gIH0pO1xufTtcbiIsImltcG9ydCB7IGNvbnRhaW5lciB9IGZyb20gXCIuLi8uLi8uLlwiO1xuaW1wb3J0IHsgSFlQTyB9IGZyb20gXCIuLi8uLi8uLi9saWJzL0hZUE8vSFlQT1wiO1xuaW1wb3J0IHsgUmVxdWlyZWQgfSBmcm9tIFwiLi4vLi4vLi4vbGlicy9WYWxpZGF0b3JzL1JlcXVpcmVkXCI7XG5pbXBvcnQgeyBBdHRlbnRpb25NZXNzYWdlIH0gZnJvbSBcIi4uL0F0dGVudGlvbk1lc3NhZ2VcIjtcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gXCIuLi9CdXR0b25cIjtcbmltcG9ydCB7IElucHV0IH0gZnJvbSBcIi4uL0lucHV0XCI7XG5pbXBvcnQgeyBJQ2hhdFZpZXdNb2RlbCB9IGZyb20gXCIuLi8uLi8uLi9WaWV3TW9kZWwvQ2hhdFZpZXdNb2RlbFwiO1xuaW1wb3J0IHsgQ2hhdExheW91dCB9IGZyb20gXCIuLi8uLi9MYXlvdXRzL0NoYXRcIjtcbmltcG9ydCB7IFZJRVdfTU9ERUwgfSBmcm9tIFwiLi4vLi4vLi4vVmlld01vZGVsXCI7XG5cbmV4cG9ydCBjb25zdCBDcmVhdGVDaGF0TW9kYWwgPSAoKSA9PiB7XG4gIGNvbnN0IGF0dGVudGlvbk1lc3NhZ2UgPSBBdHRlbnRpb25NZXNzYWdlKCk7XG4gIGNvbnN0IHN0YXRlID0gYXR0ZW50aW9uTWVzc2FnZS5nZXRTdGF0ZSgpO1xuXG4gIGxldCBDaGF0TmFtZSA9IFwiXCI7XG5cbiAgcmV0dXJuIG5ldyBIWVBPKHtcbiAgICB0ZW1wbGF0ZVBhdGg6IFwiY3JlYXRlY2hhdG1vZGFsLnRlbXBsYXRlLmh0bWxcIixcbiAgICBkYXRhOiB7fSxcbiAgICBjaGlsZHJlbjoge1xuICAgICAgaW5wdXQ6IElucHV0KHtcbiAgICAgICAgbGFiZWw6IFwiQ2hhdCBuYW1lXCIsXG4gICAgICAgIHR5cGU6IFwidGV4dFwiLFxuICAgICAgICBuYW1lOiBcImNoYXRuYW1lXCIsXG4gICAgICAgIGlkOiBcImNoYXRuYW1lXCIsXG4gICAgICAgIGNsYXNzTmFtZTogXCJjLWMtbW9kYWxfX2lucHV0XCIsXG4gICAgICAgIENoaWxkQXR0ZW50aW9uOiBhdHRlbnRpb25NZXNzYWdlLFxuICAgICAgICBvbkJsdXI6IChlOiBFdmVudCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGlucHV0ID0gZS50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICAgICAgICBpZiAoUmVxdWlyZWQuY2hlY2tGdW5jKGlucHV0LnZhbHVlKSkge1xuICAgICAgICAgICAgc3RhdGUubWVzc2FnZSA9IFwiXCI7XG4gICAgICAgICAgICBDaGF0TmFtZSA9IGlucHV0LnZhbHVlO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdGF0ZS5tZXNzYWdlID0gXCLim5Qg0L7QsdGP0LfQsNGC0LXQu9GM0L3QvtC1INC/0L7Qu9C1XCI7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICBjcmVhdGU6IEJ1dHRvbih7XG4gICAgICAgIHRpdGxlOiBcItCh0L7Qt9C00LDRgtGMXCIsXG4gICAgICAgIGNsYXNzTmFtZTogXCJjcmVhdGUtYnV0dG9uXCIsXG4gICAgICAgIG9uQ2xpY2s6IChlOiBFdmVudCkgPT4ge1xuICAgICAgICAgIGlmICghQ2hhdE5hbWUpIHtcbiAgICAgICAgICAgIHN0YXRlLm1lc3NhZ2UgPSBcIuKblCDQvtCx0Y/Qt9Cw0YLQtdC70YzQvdC+0LUg0L/QvtC70LVcIjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgY2hhdFZpZXdNb2RlbCA9IGNvbnRhaW5lci5nZXQ8SUNoYXRWaWV3TW9kZWw+KFxuICAgICAgICAgICAgICBWSUVXX01PREVMLkNIQVRcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBjaGF0Vmlld01vZGVsLnNhdmVDaGF0KHsgdGl0bGU6IENoYXROYW1lIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICBkb2N1bWVudFxuICAgICAgICAgICAgICAgIC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiYy1jLW1vZGFsXCIpWzBdXG4gICAgICAgICAgICAgICAgLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gICAgICAgICAgICAgIENoYXRMYXlvdXQoY2hhdFZpZXdNb2RlbC5jaGF0cykucmVuZGVyKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICAgIGNhbmNlbDogQnV0dG9uKHtcbiAgICAgICAgdGl0bGU6IFwi0J7RgtC80LXQvdCwXCIsXG4gICAgICAgIGNsYXNzTmFtZTogXCJjYW5jZWwtYnV0dG9uXCIsXG4gICAgICAgIG9uQ2xpY2s6IChlOiBFdmVudCkgPT4ge1xuICAgICAgICAgIGRvY3VtZW50XG4gICAgICAgICAgICAuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcImMtYy1tb2RhbFwiKVswXVxuICAgICAgICAgICAgLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIik7XG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICB9LFxuICB9KTtcbn07XG4iLCJpbXBvcnQgeyBIWVBPIH0gZnJvbSBcIi4uLy4uLy4uL2xpYnMvSFlQTy9IWVBPXCI7XG5cbmludGVyZmFjZSBJUHJvcHMge1xuICBpZDogc3RyaW5nO1xuICBvbkNsaWNrOiAoKSA9PiB2b2lkO1xufVxuZXhwb3J0IGNvbnN0IERlbGV0ZSA9IChwcm9wczogSVByb3BzKSA9PiB7XG4gIHJldHVybiBuZXcgSFlQTyh7XG4gICAgdGVtcGxhdGVQYXRoOiBcImRlbGV0ZS50ZW1wbGF0ZS5odG1sXCIsXG4gICAgZGF0YToge1xuICAgICAgcGF0aDogXCIvbWVkaWEvVmVjdG9yLnN2Z1wiLFxuICAgICAgaWQ6IHByb3BzLmlkLFxuICAgIH0sXG4gICAgY2hpbGRyZW46IHt9LFxuICB9KS5hZnRlclJlbmRlcigoKSA9PiB7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocHJvcHMuaWQpPy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgcHJvcHMub25DbGljaygpO1xuICAgIH0pO1xuICB9KTtcbn07XG4iLCJpbXBvcnQgeyBIWVBPIH0gZnJvbSBcIi4uLy4uLy4uL2xpYnMvSFlQTy9IWVBPXCI7XG5cbmV4cG9ydCBjb25zdCBFbXB0eSA9ICgpID0+IHtcbiAgcmV0dXJuIG5ldyBIWVBPKHtcbiAgICB0ZW1wbGF0ZVBhdGg6IFwiZW1wdHkudGVtcGxhdGUuaHRtbFwiLFxuICAgIGRhdGE6IHt9LFxuICB9KTtcbn07XG4iLCJpbXBvcnQgeyBIWVBPIH0gZnJvbSBcIi4uLy4uLy4uL2xpYnMvSFlQTy9IWVBPXCI7XG5pbXBvcnQgeyBFbXB0eSB9IGZyb20gXCIuLi9FbXB0eVwiO1xuXG5pbnRlcmZhY2UgSVByb3BzIHtcbiAgbGFiZWw6IHN0cmluZztcbiAgdHlwZTogc3RyaW5nO1xuICBuYW1lOiBzdHJpbmc7XG4gIGlkOiBzdHJpbmc7XG4gIGNsYXNzTmFtZTogc3RyaW5nO1xuICBDaGlsZEF0dGVudGlvbj86IEhZUE87XG4gIG9uRm9jdXM/OiAoZTogRXZlbnQpID0+IHZvaWQ7XG4gIG9uQmx1cj86IChlOiBFdmVudCkgPT4gdm9pZDtcbn1cblxuLy9AdG9kbzog0L/RgNC40LrRgNGD0YLQuNGC0Ywg0YPQvdC40LrQsNC70YzQvdC+0YHRgtGMINC60LDQttC00L7Qs9C+INGN0LvQtdC80LXQvdGC0LBcblxuZXhwb3J0IGNvbnN0IElucHV0ID0gKHByb3BzOiBJUHJvcHMpID0+IHtcbiAgcmV0dXJuIG5ldyBIWVBPKHtcbiAgICB0ZW1wbGF0ZVBhdGg6IFwiaW5wdXQudGVtcGxhdGUuaHRtbFwiLFxuICAgIGRhdGE6IHtcbiAgICAgIGxhYmVsOiB7XG4gICAgICAgIG5hbWU6IHByb3BzLmxhYmVsLFxuICAgICAgfSxcbiAgICAgIGF0cmlidXRlOiB7XG4gICAgICAgIHR5cGU6IHByb3BzLnR5cGUsXG4gICAgICAgIG5hbWU6IHByb3BzLm5hbWUsXG4gICAgICAgIGlkOiBwcm9wcy5pZCxcbiAgICAgICAgY2xhc3NOYW1lOiBwcm9wcy5jbGFzc05hbWUsXG4gICAgICB9LFxuICAgIH0sXG4gICAgY2hpbGRyZW46IHtcbiAgICAgIEF0dGVudGlvbjogcHJvcHMuQ2hpbGRBdHRlbnRpb24gfHwgRW1wdHkoKSxcbiAgICB9LFxuICB9KS5hZnRlclJlbmRlcigoKSA9PiB7XG4gICAgZG9jdW1lbnRcbiAgICAgIC5nZXRFbGVtZW50QnlJZChwcm9wcy5pZClcbiAgICAgID8uYWRkRXZlbnRMaXN0ZW5lcihcImZvY3VzXCIsIChlOiBGb2N1c0V2ZW50KSA9PiB7XG4gICAgICAgIGNvbnN0IGlucHV0ID0gZS50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICAgICAgY29uc3QgaW5wdXRMYWJlbCA9IGlucHV0LnBhcmVudEVsZW1lbnQ/LnBhcmVudEVsZW1lbnQ/LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgICAgXCIuZm9ybS1pbnB1dF9fbGFiZWxcIlxuICAgICAgICApO1xuICAgICAgICBpbnB1dExhYmVsPy5jbGFzc0xpc3QuYWRkKFwiZm9ybS1pbnB1dF9fbGFiZWxfc2VsZWN0XCIpO1xuICAgICAgICBwcm9wcy5vbkZvY3VzPy4oZSk7XG4gICAgICB9KTtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChwcm9wcy5pZCk/LmFkZEV2ZW50TGlzdGVuZXIoXCJibHVyXCIsIChlOiBFdmVudCkgPT4ge1xuICAgICAgY29uc3QgaW5wdXQgPSBlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgICAgY29uc3QgaW5wdXRMYWJlbCA9IGlucHV0LnBhcmVudEVsZW1lbnQ/LnBhcmVudEVsZW1lbnQ/LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIFwiLmZvcm0taW5wdXRfX2xhYmVsXCJcbiAgICAgICk7XG4gICAgICBpZiAoIWlucHV0LnZhbHVlKSB7XG4gICAgICAgIGlucHV0TGFiZWw/LmNsYXNzTGlzdC5yZW1vdmUoXCJmb3JtLWlucHV0X19sYWJlbF9zZWxlY3RcIik7XG4gICAgICB9XG4gICAgICBwcm9wcy5vbkJsdXI/LihlKTtcbiAgICB9KTtcbiAgfSk7XG59O1xuIiwiaW1wb3J0IHsgSFlQTyB9IGZyb20gXCIuLi8uLi8uLi9saWJzL0hZUE8vSFlQT1wiO1xuaW1wb3J0IHsgcm91dGVyIH0gZnJvbSBcIi4uLy4uLy4uXCI7XG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tIFwiLi4vLi4vQ29tcG9uZW50cy9CdXR0b25cIjtcbmltcG9ydCB7IG1lbW9pemUgfSBmcm9tIFwiLi4vLi4vLi4vbGlicy9tb21pemVcIjtcblxuZXhwb3J0IGNvbnN0IENoYW5nZVBhc3N3b3JkID0gbWVtb2l6ZSgoKSA9PiB7XG4gIHJldHVybiBuZXcgSFlQTyh7XG4gICAgcmVuZGVyVG86IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiI3Jvb3RcIikgfHwgZG9jdW1lbnQuYm9keSxcbiAgICB0ZW1wbGF0ZVBhdGg6IFwiY2hhbmdlUGFzc3dvcmQudGVtcGxhdGUuaHRtbFwiLFxuICAgIGRhdGE6IHt9LFxuICAgIGNoaWxkcmVuOiB7XG4gICAgICBzYXZlOiBCdXR0b24oe1xuICAgICAgICB0aXRsZTogXCLQodC+0YXRgNCw0L3QuNGC0YxcIixcbiAgICAgICAgY2xhc3NOYW1lOiBcInBhc3N3b3JkX2VkaXRfX2FjdGlvbl9fc2F2ZVwiLFxuICAgICAgICBvbkNsaWNrOiAoZTogRXZlbnQpID0+IHtcbiAgICAgICAgICByb3V0ZXIuZ28oXCIvcHJvZmlsZVwiKTtcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgIH0sXG4gIH0pO1xufSk7XG4iLCJpbXBvcnQgeyBIWVBPIH0gZnJvbSBcIi4uLy4uLy4uL2xpYnMvSFlQTy9IWVBPXCI7XG5pbXBvcnQgeyBjb250YWluZXIsIHJvdXRlciB9IGZyb20gXCIuLi8uLi8uLlwiO1xuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSBcIi4uLy4uL0NvbXBvbmVudHMvQnV0dG9uXCI7XG5pbXBvcnQgeyBJUHJvZmlsZURUTyB9IGZyb20gXCIuLi9Qcm9maWxlXCI7XG5pbXBvcnQgeyBJVXNlclZpZXdNb2RlbCB9IGZyb20gXCIuLi8uLi8uLi9WaWV3TW9kZWwvVXNlclZpZXdNb2RlbFwiO1xuaW1wb3J0IHsgVklFV19NT0RFTCB9IGZyb20gXCIuLi8uLi8uLi9WaWV3TW9kZWxcIjtcblxuZXhwb3J0IGNvbnN0IENoYW5nZVByb2ZpbGUgPSAoZGF0YTogSVByb2ZpbGVEVE8pID0+IHtcbiAgcmV0dXJuIG5ldyBIWVBPKHtcbiAgICByZW5kZXJUbzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb290XCIpIHx8IGRvY3VtZW50LmJvZHksXG4gICAgdGVtcGxhdGVQYXRoOiBcImNoYW5nZVByb2ZpbGUudGVtcGxhdGUuaHRtbFwiLFxuICAgIGRhdGE6IHtcbiAgICAgIGVtYWlsOiBkYXRhPy5lbWFpbCxcbiAgICAgIGxvZ2luOiBkYXRhPy5sb2dpbixcbiAgICAgIGZpcnN0TmFtZTogZGF0YT8uZmlyc3RfbmFtZSxcbiAgICAgIHNlY29uZE5hbWU6IGRhdGE/LnNlY29uZF9uYW1lLFxuICAgICAgZGlzcGxheU5hbWU6IGRhdGE/LmRpc3BsYXlfbmFtZSxcbiAgICAgIHBob25lOiBkYXRhPy5waG9uZSxcbiAgICB9LFxuICAgIGNoaWxkcmVuOiB7XG4gICAgICBzYXZlOiBCdXR0b24oe1xuICAgICAgICB0aXRsZTogXCLQodC+0YXRgNCw0L3QuNGC0YxcIixcbiAgICAgICAgY2xhc3NOYW1lOiBcInByb2ZpbGVfZWRpdF9fYWN0aW9uX19zYXZlXCIsXG4gICAgICAgIG9uQ2xpY2s6IChlOiBFdmVudCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHVzZXJWaWV3TW9kZWwgPSBjb250YWluZXIuZ2V0PElVc2VyVmlld01vZGVsPihWSUVXX01PREVMLlVTRVIpO1xuICAgICAgICAgIGlmICh1c2VyVmlld01vZGVsLnVzZXIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHVzZXJWaWV3TW9kZWwudXNlcik7XG4gICAgICAgICAgICAvLyB1c2VyVmlld01vZGVsLnVzZXIuZGlzcGxheV9uYW1lID0gJ2l2YW4nXG4gICAgICAgICAgICAvLyB1c2VyVmlld01vZGVsLnNhdmVVc2VyKHVzZXJWaWV3TW9kZWwudXNlcilcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICB9LFxuICB9KTtcbn07XG4iLCJpbXBvcnQgeyBIWVBPIH0gZnJvbSBcIi4uLy4uLy4uL2xpYnMvSFlQTy9IWVBPXCI7XG5pbXBvcnQgeyBDaGF0SXRlbSwgSUNoYXREVE8gfSBmcm9tIFwiLi4vLi4vQ29tcG9uZW50cy9DaGF0SXRlbVwiO1xuaW1wb3J0IHsgY29udGFpbmVyLCByb3V0ZXIgfSBmcm9tIFwiLi4vLi4vLi5cIjtcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gXCIuLi8uLi9Db21wb25lbnRzL0J1dHRvblwiO1xuaW1wb3J0IHsgRW1wdHkgfSBmcm9tIFwiLi4vLi4vQ29tcG9uZW50cy9FbXB0eVwiO1xuaW1wb3J0IHsgQ3JlYXRlQ2hhdE1vZGFsIH0gZnJvbSBcIi4uLy4uL0NvbXBvbmVudHMvQ3JlYXRlQ2hhdE1vZGFsXCI7XG5pbXBvcnQgeyBJVXNlclZpZXdNb2RlbCB9IGZyb20gXCIuLi8uLi8uLi9WaWV3TW9kZWwvVXNlclZpZXdNb2RlbFwiO1xuaW1wb3J0IHsgVklFV19NT0RFTCB9IGZyb20gXCIuLi8uLi8uLi9WaWV3TW9kZWxcIjtcblxuZXhwb3J0IGNvbnN0IENoYXRMYXlvdXQgPSAocmVzdWx0OiBJQ2hhdERUT1tdKSA9PiB7XG4gIGNvbnN0IENoYXRJdGVtTGlzdDogSFlQT1tdID0gW107XG4gIGlmIChBcnJheS5pc0FycmF5KHJlc3VsdCkpIHtcbiAgICByZXN1bHQuZm9yRWFjaCgoaXRlbTogYW55KSA9PiB7XG4gICAgICBDaGF0SXRlbUxpc3QucHVzaChDaGF0SXRlbSh7IC4uLml0ZW0gfSkpO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIENoYXRJdGVtTGlzdC5wdXNoKEVtcHR5KCkpO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBIWVBPKHtcbiAgICByZW5kZXJUbzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb290XCIpIHx8IGRvY3VtZW50LmJvZHksXG4gICAgdGVtcGxhdGVQYXRoOiBcImNoYXQudGVtcGxhdGUuaHRtbFwiLFxuICAgIGRhdGE6IHt9LFxuICAgIGNoaWxkcmVuOiB7XG4gICAgICBQcm9maWxlTGluazogQnV0dG9uKHtcbiAgICAgICAgdGl0bGU6IFwiUHJvZmlsZVwiLFxuICAgICAgICBjbGFzc05hbWU6IFwicHJvZmlsZS1saW5rX19idXR0b25cIixcbiAgICAgICAgb25DbGljazogKGU6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgcm91dGVyLmdvKFwiL3Byb2ZpbGVcIik7XG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICAgIGNoYXRJdGVtOiBDaGF0SXRlbUxpc3QsXG4gICAgICBjcmVhdGVDaGF0TW9kYWw6IENyZWF0ZUNoYXRNb2RhbCgpLFxuICAgICAgY3JlYXRlQ2hhdEJ1dHRvbjogQnV0dG9uKHtcbiAgICAgICAgdGl0bGU6IFwiK1wiLFxuICAgICAgICBjbGFzc05hbWU6IFwibmF2aWdhdGlvbl9fY3JlYXRlQ2hhdEJ1dHRvblwiLFxuICAgICAgICBvbkNsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgY29uc3QgdXNlclZpZXdNb2RlbCA9IGNvbnRhaW5lci5nZXQ8SVVzZXJWaWV3TW9kZWw+KFZJRVdfTU9ERUwuVVNFUik7XG4gICAgICAgICAgY29uc29sZS5sb2codXNlclZpZXdNb2RlbC51c2VyKTtcbiAgICAgICAgICBkb2N1bWVudFxuICAgICAgICAgICAgLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJjLWMtbW9kYWxcIilbMF1cbiAgICAgICAgICAgIC5jbGFzc0xpc3QucmVtb3ZlKFwiaGlkZGVuXCIpO1xuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgfSxcbiAgfSk7XG59O1xuIiwiaW1wb3J0IHsgSW5wdXQgfSBmcm9tIFwiLi4vLi4vQ29tcG9uZW50cy9JbnB1dFwiO1xuaW1wb3J0IHsgUmVxdWlyZWQgfSBmcm9tIFwiLi4vLi4vLi4vbGlicy9WYWxpZGF0b3JzL1JlcXVpcmVkXCI7XG5pbXBvcnQgeyBBdHRlbnRpb25NZXNzYWdlIH0gZnJvbSBcIi4uLy4uL0NvbXBvbmVudHMvQXR0ZW50aW9uTWVzc2FnZVwiO1xuaW1wb3J0IHsgcm91dGVyIH0gZnJvbSBcIi4uLy4uLy4uL2luZGV4XCI7XG5pbXBvcnQgeyBIVFRQVHJhbnNwb3J0IH0gZnJvbSBcIi4uLy4uLy4uL2xpYnMvVHJhbnNwb3J0XCI7XG5pbXBvcnQgeyBIWVBPIH0gZnJvbSBcIi4uLy4uLy4uL2xpYnMvSFlQTy9IWVBPXCI7XG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tIFwiLi4vLi4vQ29tcG9uZW50cy9CdXR0b25cIjtcbmltcG9ydCB7IElQcm9maWxlRFRPIH0gZnJvbSBcIi4uL1Byb2ZpbGVcIjtcblxuLyoqXG4gKiBubm5ycnIxMTFOTlxuICovXG5cbmV4cG9ydCBjb25zdCBMb2dpbkxheW91dCA9ICh1c2VyOiBJUHJvZmlsZURUTyk6IEhZUE8gPT4ge1xuICBpZiAodXNlciAmJiB1c2VyLmlkKSB7XG4gICAgcm91dGVyLmdvKFwiL2NoYXRcIik7XG4gIH1cblxuICBjb25zdCBhdHRlbnRpb25Mb2dpbiA9IEF0dGVudGlvbk1lc3NhZ2UoKTtcbiAgY29uc3QgYXR0ZW50aW9uTG9naW5TdG9yZSA9IGF0dGVudGlvbkxvZ2luLmdldFN0YXRlKCk7XG4gIGNvbnN0IGF0dGVudGlvblBhc3MgPSBBdHRlbnRpb25NZXNzYWdlKCk7XG4gIGNvbnN0IGF0dGVudGlvblBhc3NTdG9yZSA9IGF0dGVudGlvblBhc3MuZ2V0U3RhdGUoKTtcblxuICBjb25zdCBGb3JtRGF0YTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuICByZXR1cm4gbmV3IEhZUE8oe1xuICAgIHJlbmRlclRvOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvb3RcIikgfHwgZG9jdW1lbnQuYm9keSxcbiAgICB0ZW1wbGF0ZVBhdGg6IFwibG9naW4udGVtcGxhdGUuaHRtbFwiLFxuICAgIGRhdGE6IHtcbiAgICAgIEZvcm1OYW1lOiBcItCS0YXQvtC0XCIsXG4gICAgfSxcbiAgICBjaGlsZHJlbjoge1xuICAgICAgSW5wdXRMb2dpbjogSW5wdXQoe1xuICAgICAgICBsYWJlbDogXCLQm9C+0LPQuNC9XCIsXG4gICAgICAgIHR5cGU6IFwidGV4dFwiLFxuICAgICAgICBuYW1lOiBcImxvZ2luXCIsXG4gICAgICAgIGlkOiBcImZvcm0taW5wdXQtbG9naW5cIixcbiAgICAgICAgY2xhc3NOYW1lOiBcImZvcm0tbG9naW5fX2Zvcm0taW5wdXRcIixcbiAgICAgICAgb25CbHVyOiAoZTogRXZlbnQpID0+IHtcbiAgICAgICAgICBjb25zdCBpbnB1dCA9IGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgICAgICAgY29uc3QgY2hlY2sgPSBSZXF1aXJlZC5jaGVja0Z1bmMoaW5wdXQ/LnZhbHVlKTtcbiAgICAgICAgICBpZiAoIWNoZWNrKSB7XG4gICAgICAgICAgICBhdHRlbnRpb25Mb2dpblN0b3JlLm1lc3NhZ2UgPSBcIuKblCDQvtCx0Y/Qt9Cw0YLQtdC70YzQvdC+0LUg0L/QvtC70LVcIjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYXR0ZW50aW9uTG9naW5TdG9yZS5tZXNzYWdlID0gXCJcIjtcbiAgICAgICAgICAgIEZvcm1EYXRhW1wibG9naW5cIl0gPSBpbnB1dC52YWx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIENoaWxkQXR0ZW50aW9uOiBhdHRlbnRpb25Mb2dpbixcbiAgICAgIH0pLFxuICAgICAgSW5wdXRQYXNzd29yZDogSW5wdXQoe1xuICAgICAgICBsYWJlbDogXCLQn9Cw0YDQvtC70YxcIixcbiAgICAgICAgdHlwZTogXCJwYXNzd29yZFwiLFxuICAgICAgICBuYW1lOiBcInBhc3N3b3JkXCIsXG4gICAgICAgIGlkOiBcImZvcm0taW5wdXQtcGFzc3dvcmRcIixcbiAgICAgICAgY2xhc3NOYW1lOiBcImZvcm0tbG9naW5fX2Zvcm0taW5wdXRcIixcbiAgICAgICAgb25CbHVyOiAoZTogRXZlbnQpID0+IHtcbiAgICAgICAgICBjb25zdCBpbnB1dCA9IGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgICAgICAgaWYgKCFSZXF1aXJlZC5jaGVja0Z1bmMoaW5wdXQudmFsdWUpKSB7XG4gICAgICAgICAgICBhdHRlbnRpb25QYXNzU3RvcmUubWVzc2FnZSA9IFwi4puUINC+0LHRj9C30LDRgtC10LvRjNC90L7QtSDQv9C+0LvQtVwiO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhdHRlbnRpb25QYXNzU3RvcmUubWVzc2FnZSA9IFwiXCI7XG4gICAgICAgICAgICBGb3JtRGF0YVtcInBhc3N3b3JkXCJdID0gaW5wdXQudmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBDaGlsZEF0dGVudGlvbjogYXR0ZW50aW9uUGFzcyxcbiAgICAgIH0pLFxuICAgICAgQnV0dG9uOiBCdXR0b24oe1xuICAgICAgICB0aXRsZTogXCLQkNCy0YLQvtGA0LjQt9C+0LLQsNGC0YzRgdGPXCIsXG4gICAgICAgIGNsYXNzTmFtZTogXCJmb3JtLWJ1dHRvblwiLFxuICAgICAgICBvbkNsaWNrOiAoZTogRXZlbnQpID0+IHtcbiAgICAgICAgICBjb25zdCBkYXRhOiB7IFtrZXk6IHN0cmluZ106IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gfSA9IHtcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgbG9naW46IEZvcm1EYXRhLmxvZ2luLFxuICAgICAgICAgICAgICBwYXNzd29yZDogRm9ybURhdGEucGFzc3dvcmQsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICBcIkNvbnRlbnQtdHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfTtcbiAgICAgICAgICBIVFRQVHJhbnNwb3J0LmdldEluc3RhbmNlKClcbiAgICAgICAgICAgIC5QT1NUKFwiL2F1dGgvc2lnbmluXCIsIGRhdGEpXG4gICAgICAgICAgICAudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgIGlmIChyZXN1bHQuc3RhdHVzIDwgMzAwKSB7XG4gICAgICAgICAgICAgICAgcm91dGVyLmdvKFwiL2NoYXRcIik7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICBMaW5rVG9SZWdpc3RyYXRpb246IEJ1dHRvbih7XG4gICAgICAgIHRpdGxlOiBcItCX0LDRgNC10LPQuNGB0YLRgNC40YDQvtCy0LDRgtGM0YHRj1wiLFxuICAgICAgICBjbGFzc05hbWU6IFwiZm9ybS1saW5rXCIsXG4gICAgICAgIG9uQ2xpY2s6IChlOiBFdmVudCkgPT4ge1xuICAgICAgICAgIHJvdXRlci5nbyhcIi9yZWdpc3RyYXRpb25cIik7XG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICB9LFxuICB9KTtcbn07XG4iLCJpbXBvcnQgeyBIWVBPIH0gZnJvbSBcIi4uLy4uLy4uL2xpYnMvSFlQTy9IWVBPXCI7XG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tIFwiLi4vLi4vQ29tcG9uZW50cy9CdXR0b25cIjtcbmltcG9ydCB7IHJvdXRlciB9IGZyb20gXCIuLi8uLi8uLlwiO1xuaW1wb3J0IHsgSFRUUFRyYW5zcG9ydCB9IGZyb20gXCIuLi8uLi8uLi9saWJzL1RyYW5zcG9ydFwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIElQcm9maWxlRFRPIHtcbiAgaWQ6IG51bWJlcjtcbiAgZGlzcGxheV9uYW1lOiBzdHJpbmc7XG4gIGVtYWlsOiBzdHJpbmc7XG4gIGZpcnN0X25hbWU6IHN0cmluZztcbiAgc2Vjb25kX25hbWU6IHN0cmluZztcbiAgbG9naW46IHN0cmluZztcbiAgcGhvbmU6IHN0cmluZztcbn1cblxuZXhwb3J0IGNvbnN0IFByb2ZpbGVMYXlvdXQgPSAoZGF0YTogSVByb2ZpbGVEVE8pID0+IHtcbiAgcmV0dXJuIG5ldyBIWVBPKHtcbiAgICByZW5kZXJUbzogPEhUTUxFbGVtZW50PmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcm9vdFwiKSxcbiAgICB0ZW1wbGF0ZVBhdGg6IFwicHJvZmlsZS50ZW1wbGF0ZS5odG1sXCIsXG4gICAgZGF0YToge1xuICAgICAgLi4uZGF0YSxcbiAgICB9LFxuICAgIGNoaWxkcmVuOiB7XG4gICAgICBFZGl0UHJvZmlsZUxpbms6IEJ1dHRvbih7XG4gICAgICAgIHRpdGxlOiBcItCY0LfQvNC10L3QuNGC0Ywg0LTQsNC90L3Ri9C1XCIsXG4gICAgICAgIGNsYXNzTmFtZTogXCJhY3Rpb25fX2NoYW5nZS1wcm9maWxlXCIsXG4gICAgICAgIG9uQ2xpY2s6ICgpID0+IHtcbiAgICAgICAgICByb3V0ZXIuZ28oXCIvZWRpdHByb2ZpbGVcIik7XG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICAgIEVkaXRQYXNzd29yZExpbms6IEJ1dHRvbih7XG4gICAgICAgIHRpdGxlOiBcItCY0LfQvNC10L3QuNGC0Ywg0L/QsNGA0L7Qu9GMXCIsXG4gICAgICAgIGNsYXNzTmFtZTogXCJhY3Rpb25fX2NoYW5nZS1wYXNzd29yZFwiLFxuICAgICAgICBvbkNsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgcm91dGVyLmdvKFwiL2VkaXRwYXNzd29yZFwiKTtcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgQmFja0xpbms6IEJ1dHRvbih7XG4gICAgICAgIHRpdGxlOiBcItCd0LDQt9Cw0LRcIixcbiAgICAgICAgY2xhc3NOYW1lOiBcImFjdGlvbl9fYmFja1wiLFxuICAgICAgICBvbkNsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgcm91dGVyLmdvKFwiL2NoYXRcIik7XG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICAgIEV4aXRMaW5rOiBCdXR0b24oe1xuICAgICAgICB0aXRsZTogXCLQktGL0LnRgtC4XCIsXG4gICAgICAgIGNsYXNzTmFtZTogXCJhY3Rpb25fX2V4aXRcIixcbiAgICAgICAgb25DbGljazogKCkgPT4ge1xuICAgICAgICAgIEhUVFBUcmFuc3BvcnQuZ2V0SW5zdGFuY2UoKVxuICAgICAgICAgICAgLlBPU1QoXCIvYXV0aC9sb2dvdXRcIilcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgcm91dGVyLmdvKFwiL1wiKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgfSxcbiAgfSk7XG59O1xuIiwiaW1wb3J0IHsgSFlQTyB9IGZyb20gXCIuLi8uLi8uLi9saWJzL0hZUE8vSFlQT1wiO1xuaW1wb3J0IHsgSW5wdXQgfSBmcm9tIFwiLi4vLi4vQ29tcG9uZW50cy9JbnB1dFwiO1xuLy8gaW1wb3J0IHsgVmFsaWRhdG9yLCBSdWxlIH0gZnJvbSBcIi4uLy4uL2xpYnMvVmFsaWRhdG9yXCI7XG5pbXBvcnQgeyBFbWFpbFZhbGlkYXRvciB9IGZyb20gXCIuLi8uLi8uLi9saWJzL1ZhbGlkYXRvcnMvRW1haWxcIjtcbmltcG9ydCB7IFJlcXVpcmVkIH0gZnJvbSBcIi4uLy4uLy4uL2xpYnMvVmFsaWRhdG9ycy9SZXF1aXJlZFwiO1xuaW1wb3J0IHsgQXR0ZW50aW9uTWVzc2FnZSB9IGZyb20gXCIuLi8uLi9Db21wb25lbnRzL0F0dGVudGlvbk1lc3NhZ2VcIjtcbmltcG9ydCB7IHJvdXRlciB9IGZyb20gXCIuLi8uLi8uLlwiO1xuaW1wb3J0IHsgSFRUUFRyYW5zcG9ydCB9IGZyb20gXCIuLi8uLi8uLi9saWJzL1RyYW5zcG9ydFwiO1xuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSBcIi4uLy4uL0NvbXBvbmVudHMvQnV0dG9uXCI7XG5cbmV4cG9ydCBjb25zdCBSZWdpc3RyYXRpb25MYXlvdXQgPSAoKSA9PiB7XG4gIGNvbnN0IEF0dGVudGlvbkVtYWlsID0gQXR0ZW50aW9uTWVzc2FnZSgpO1xuICBjb25zdCBBdHRlbnRpb25Mb2dpbiA9IEF0dGVudGlvbk1lc3NhZ2UoKTtcbiAgY29uc3QgQXR0ZW50aW9uUGFzc3dvcmQgPSBBdHRlbnRpb25NZXNzYWdlKCk7XG4gIGNvbnN0IEF0dGVudGlvblBhc3N3b3JkRG91YmxlID0gQXR0ZW50aW9uTWVzc2FnZSgpO1xuICBjb25zdCBBdHRlbnRpb25GaXJzdE5hbWUgPSBBdHRlbnRpb25NZXNzYWdlKCk7XG4gIGNvbnN0IEF0dGVudGlvblNlY29uZE5hbWUgPSBBdHRlbnRpb25NZXNzYWdlKCk7XG4gIGNvbnN0IEF0dGVudGlvblBob25lID0gQXR0ZW50aW9uTWVzc2FnZSgpO1xuXG4gIGNvbnN0IEZvcm1EYXRhOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG5cbiAgcmV0dXJuIG5ldyBIWVBPKHtcbiAgICByZW5kZXJUbzogPEhUTUxFbGVtZW50PmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjcm9vdFwiKSxcbiAgICB0ZW1wbGF0ZVBhdGg6IFwicmVnaXN0cmF0aW9uLnRlbXBsYXRlLmh0bWxcIixcbiAgICBkYXRhOiB7XG4gICAgICBmb3JtVGl0bGU6IFwi0KDQtdCz0LjRgdGC0YDQsNGG0LjRj1wiLFxuICAgIH0sXG4gICAgY2hpbGRyZW46IHtcbiAgICAgIElucHV0RW1haWw6IElucHV0KHtcbiAgICAgICAgbGFiZWw6IFwi0J/QvtGH0YLQsFwiLFxuICAgICAgICB0eXBlOiBcInRleHRcIixcbiAgICAgICAgbmFtZTogXCJlbWFpbFwiLFxuICAgICAgICBpZDogXCJmb3JtX19lbWFpbF9faW5wdXRcIixcbiAgICAgICAgY2xhc3NOYW1lOiBcImZvcm0tcmVnX19mb3JtLWlucHV0XCIsXG4gICAgICAgIENoaWxkQXR0ZW50aW9uOiBBdHRlbnRpb25FbWFpbCxcbiAgICAgICAgb25CbHVyOiAoZTogRXZlbnQpID0+IHtcbiAgICAgICAgICBjb25zdCBzdGF0ZSA9IEF0dGVudGlvbkVtYWlsLmdldFN0YXRlKCk7XG4gICAgICAgICAgY29uc3QgaW5wdXQgPSBlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgICAgICAgIGlmIChFbWFpbFZhbGlkYXRvci5jaGVja0Z1bmMoaW5wdXQudmFsdWUpKSB7XG4gICAgICAgICAgICBGb3JtRGF0YVtcImVtYWlsXCJdID0gaW5wdXQudmFsdWU7XG4gICAgICAgICAgICBzdGF0ZS5tZXNzYWdlID0gXCJcIjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RhdGUubWVzc2FnZSA9IFwi4puUINGN0YLQviDQvdC1INC/0L7RhdC+0LbQtSDQvdCwINCw0LTRgNC10YEg0Y3Qu9C10LrRgtGA0L7QvdC90L7QuSDQv9C+0YfRgtGLXCI7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICBJbnB1dExvZ2luOiBJbnB1dCh7XG4gICAgICAgIGxhYmVsOiBcItCb0L7Qs9C40L1cIixcbiAgICAgICAgdHlwZTogXCJ0ZXh0XCIsXG4gICAgICAgIG5hbWU6IFwibG9naW5cIixcbiAgICAgICAgaWQ6IFwiZm9ybV9fbG9naW5fX2lucHV0XCIsXG4gICAgICAgIGNsYXNzTmFtZTogXCJmb3JtLXJlZ19fZm9ybS1pbnB1dFwiLFxuICAgICAgICBDaGlsZEF0dGVudGlvbjogQXR0ZW50aW9uTG9naW4sXG4gICAgICAgIG9uQmx1cjogKGU6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgY29uc3Qgc3RhdGUgPSBBdHRlbnRpb25Mb2dpbi5nZXRTdGF0ZSgpO1xuICAgICAgICAgIGNvbnN0IGlucHV0ID0gZS50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICAgICAgICBpZiAoUmVxdWlyZWQuY2hlY2tGdW5jKGlucHV0LnZhbHVlKSkge1xuICAgICAgICAgICAgRm9ybURhdGFbXCJsb2dpblwiXSA9IGlucHV0LnZhbHVlO1xuICAgICAgICAgICAgc3RhdGUubWVzc2FnZSA9IFwiXCI7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0YXRlLm1lc3NhZ2UgPSBcIuKblCDQvtCx0Y/Qt9Cw0YLQtdC70YzQvdC+0LUg0L/QvtC70LVcIjtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICAgIEZpcnN0TmFtZTogSW5wdXQoe1xuICAgICAgICBsYWJlbDogXCLQmNC80Y9cIixcbiAgICAgICAgdHlwZTogXCJ0ZXh0XCIsXG4gICAgICAgIG5hbWU6IFwiZmlyc3RfbmFtZVwiLFxuICAgICAgICBpZDogXCJmb3JtX19maXJzdF9uYW1lX19pbnB1dFwiLFxuICAgICAgICBjbGFzc05hbWU6IFwiZm9ybS1yZWdfX2Zvcm0taW5wdXRcIixcbiAgICAgICAgQ2hpbGRBdHRlbnRpb246IEF0dGVudGlvbkZpcnN0TmFtZSxcbiAgICAgICAgb25CbHVyOiAoZTogRXZlbnQpID0+IHtcbiAgICAgICAgICBjb25zdCBzdGF0ZSA9IEF0dGVudGlvbkZpcnN0TmFtZS5nZXRTdGF0ZSgpO1xuICAgICAgICAgIGNvbnN0IGlucHV0ID0gZS50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICAgICAgICBpZiAoUmVxdWlyZWQuY2hlY2tGdW5jKGlucHV0LnZhbHVlKSkge1xuICAgICAgICAgICAgRm9ybURhdGFbXCJmaXJzdF9uYW1lXCJdID0gaW5wdXQudmFsdWU7XG4gICAgICAgICAgICBzdGF0ZS5tZXNzYWdlID0gXCJcIjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RhdGUubWVzc2FnZSA9IFwi4puUINC+0LHRj9C30LDRgtC10LvRjNC90L7QtSDQv9C+0LvQtVwiO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgU2Vjb25kTmFtZTogSW5wdXQoe1xuICAgICAgICBsYWJlbDogXCLQpNCw0LzQuNC70LjRj1wiLFxuICAgICAgICB0eXBlOiBcInRleHRcIixcbiAgICAgICAgbmFtZTogXCJzZWNvbmRfbmFtZVwiLFxuICAgICAgICBpZDogXCJmb3JtX19zZWNvbmRfbmFtZV9faW5wdXRcIixcbiAgICAgICAgY2xhc3NOYW1lOiBcImZvcm0tcmVnX19mb3JtLWlucHV0XCIsXG4gICAgICAgIENoaWxkQXR0ZW50aW9uOiBBdHRlbnRpb25TZWNvbmROYW1lLFxuICAgICAgICBvbkJsdXI6IChlOiBFdmVudCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHN0YXRlID0gQXR0ZW50aW9uU2Vjb25kTmFtZS5nZXRTdGF0ZSgpO1xuICAgICAgICAgIGNvbnN0IGlucHV0ID0gZS50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICAgICAgICBpZiAoUmVxdWlyZWQuY2hlY2tGdW5jKGlucHV0LnZhbHVlKSkge1xuICAgICAgICAgICAgRm9ybURhdGFbXCJzZWNvbmRfbmFtZVwiXSA9IGlucHV0LnZhbHVlO1xuICAgICAgICAgICAgc3RhdGUubWVzc2FnZSA9IFwiXCI7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0YXRlLm1lc3NhZ2UgPSBcIuKblCDQvtCx0Y/Qt9Cw0YLQtdC70YzQvdC+0LUg0L/QvtC70LVcIjtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICAgIFBob25lOiBJbnB1dCh7XG4gICAgICAgIGxhYmVsOiBcItCi0LXQu9C10YTQvtC9XCIsXG4gICAgICAgIHR5cGU6IFwidGV4dFwiLFxuICAgICAgICBuYW1lOiBcInBob25lXCIsXG4gICAgICAgIGlkOiBcImZvcm1fX3Bob25lX19pbnB1dFwiLFxuICAgICAgICBjbGFzc05hbWU6IFwiZm9ybS1yZWdfX2Zvcm0taW5wdXRcIixcbiAgICAgICAgQ2hpbGRBdHRlbnRpb246IEF0dGVudGlvblBob25lLFxuICAgICAgICBvbkJsdXI6IChlOiBFdmVudCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHN0YXRlID0gQXR0ZW50aW9uUGhvbmUuZ2V0U3RhdGUoKTtcbiAgICAgICAgICBjb25zdCBpbnB1dCA9IGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgICAgICAgaWYgKFJlcXVpcmVkLmNoZWNrRnVuYyhpbnB1dC52YWx1ZSkpIHtcbiAgICAgICAgICAgIEZvcm1EYXRhW1wicGhvbmVcIl0gPSBpbnB1dC52YWx1ZTtcbiAgICAgICAgICAgIHN0YXRlLm1lc3NhZ2UgPSBcIlwiO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdGF0ZS5tZXNzYWdlID0gXCLim5Qg0L7QsdGP0LfQsNGC0LXQu9GM0L3QvtC1INC/0L7Qu9C1XCI7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICBQYXNzd29yZDogSW5wdXQoe1xuICAgICAgICBsYWJlbDogXCLQn9Cw0YDQvtC70YxcIixcbiAgICAgICAgdHlwZTogXCJwYXNzd29yZFwiLFxuICAgICAgICBuYW1lOiBcInBhc3N3b3JkXCIsXG4gICAgICAgIGlkOiBcImZvcm1fX3Bhc3N3b3JkX19pbnB1dFwiLFxuICAgICAgICBjbGFzc05hbWU6IFwiZm9ybS1yZWdfX2Zvcm0taW5wdXRcIixcbiAgICAgICAgQ2hpbGRBdHRlbnRpb246IEF0dGVudGlvblBhc3N3b3JkLFxuICAgICAgICBvbkJsdXI6IChlOiBFdmVudCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGlucHV0ID0gZS50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICAgICAgICBjb25zdCBzdGF0ZSA9IEF0dGVudGlvblBhc3N3b3JkLmdldFN0YXRlKCk7XG4gICAgICAgICAgY29uc3Qgc3RhdGVEID0gQXR0ZW50aW9uUGFzc3dvcmREb3VibGUuZ2V0U3RhdGUoKTtcbiAgICAgICAgICBpZiAoUmVxdWlyZWQuY2hlY2tGdW5jKGlucHV0LnZhbHVlKSkge1xuICAgICAgICAgICAgRm9ybURhdGFbXCJwYXNzd29yZFwiXSA9IGlucHV0LnZhbHVlO1xuICAgICAgICAgICAgc3RhdGUubWVzc2FnZSA9IFwiXCI7XG4gICAgICAgICAgICBpZiAoRm9ybURhdGFbXCJwYXNzd29yZFwiXSAhPT0gRm9ybURhdGFbXCJkb3VibGVwYXNzd29yZFwiXSkge1xuICAgICAgICAgICAgICBzdGF0ZUQubWVzc2FnZSA9IFwi8J+UpdC/0LDRgNC+0LvQuCDQvdC1INGB0L7QstC/0LDQtNCw0Y7RglwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdGF0ZS5tZXNzYWdlID0gXCLim5Qg0L7QsdGP0LfQsNGC0LXQu9GM0L3QvtC1INC/0L7Qu9C1XCI7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICBQYXNzd29yZERvdWJsZTogSW5wdXQoe1xuICAgICAgICBsYWJlbDogXCLQn9Cw0YDQvtC70YxcIixcbiAgICAgICAgdHlwZTogXCJwYXNzd29yZFwiLFxuICAgICAgICBuYW1lOiBcImRvdWJsZXBhc3N3b3JkXCIsXG4gICAgICAgIGlkOiBcImZvcm1fX2RvdWJsZXBhc3N3b3JkX19pbnB1dFwiLFxuICAgICAgICBjbGFzc05hbWU6IFwiZm9ybS1yZWdfX2Zvcm0taW5wdXRcIixcbiAgICAgICAgQ2hpbGRBdHRlbnRpb246IEF0dGVudGlvblBhc3N3b3JkRG91YmxlLFxuICAgICAgICBvbkJsdXI6IChlOiBFdmVudCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGlucHV0ID0gZS50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICAgICAgICBjb25zdCBzdGF0ZSA9IEF0dGVudGlvblBhc3N3b3JkRG91YmxlLmdldFN0YXRlKCk7XG4gICAgICAgICAgaWYgKFJlcXVpcmVkLmNoZWNrRnVuYyhpbnB1dC52YWx1ZSkpIHtcbiAgICAgICAgICAgIEZvcm1EYXRhW1wiZG91YmxlcGFzc3dvcmRcIl0gPSBpbnB1dC52YWx1ZTtcbiAgICAgICAgICAgIHN0YXRlLm1lc3NhZ2UgPSBcIlwiO1xuICAgICAgICAgICAgaWYgKEZvcm1EYXRhW1wicGFzc3dvcmRcIl0gIT09IEZvcm1EYXRhW1wiZG91YmxlcGFzc3dvcmRcIl0pIHtcbiAgICAgICAgICAgICAgc3RhdGUubWVzc2FnZSA9IFwi8J+UpdC/0LDRgNC+0LvQuCDQvdC1INGB0L7QstC/0LDQtNCw0Y7RglwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdGF0ZS5tZXNzYWdlID0gXCLim5Qg0L7QsdGP0LfQsNGC0LXQu9GM0L3QvtC1INC/0L7Qu9C1XCI7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICBSZWdCdXR0b246IEJ1dHRvbih7XG4gICAgICAgIHRpdGxlOiBcItCX0LDRgNC10LPQuNGB0YLRgNC40YDQvtCy0LDRgtGM0YHRj1wiLFxuICAgICAgICBjbGFzc05hbWU6IFwiZm9ybS1idXR0b25cIixcbiAgICAgICAgb25DbGljazogKGU6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgT2JqZWN0LmtleXMoRm9ybURhdGEpLmxlbmd0aCA9PSAwIHx8XG4gICAgICAgICAgICBPYmplY3Qua2V5cyhGb3JtRGF0YSkuZmluZCgoaXRlbSkgPT4ge1xuICAgICAgICAgICAgICByZXR1cm4gRm9ybURhdGFbaXRlbV0gPT09IFwiXCI7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zdCBkYXRhOiB7IFtrZXk6IHN0cmluZ106IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gfSA9IHtcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgZmlyc3RfbmFtZTogRm9ybURhdGEuZmlyc3RfbmFtZSxcbiAgICAgICAgICAgICAgc2Vjb25kX25hbWU6IEZvcm1EYXRhLnNlY29uZF9uYW1lLFxuICAgICAgICAgICAgICBsb2dpbjogRm9ybURhdGEubG9naW4sXG4gICAgICAgICAgICAgIGVtYWlsOiBGb3JtRGF0YS5lbWFpbCxcbiAgICAgICAgICAgICAgcGFzc3dvcmQ6IEZvcm1EYXRhLnBhc3N3b3JkLFxuICAgICAgICAgICAgICBwaG9uZTogRm9ybURhdGEucGhvbmUsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICBcIkNvbnRlbnQtdHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfTtcbiAgICAgICAgICBIVFRQVHJhbnNwb3J0LmdldEluc3RhbmNlKCkuUE9TVChcIi9hdXRoL3NpZ251cFwiLCBkYXRhKTtcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgTG9naW5MaW5rOiBCdXR0b24oe1xuICAgICAgICB0aXRsZTogXCLQktC+0LnRgtC4XCIsXG4gICAgICAgIGNsYXNzTmFtZTogXCJmb3JtLWxpbmtcIixcbiAgICAgICAgb25DbGljazogKGU6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgcm91dGVyLmdvKFwiL1wiKTtcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgIH0sXG4gIH0pO1xufTtcbiIsImltcG9ydCB7IElDaGF0U2VydmljZSB9IGZyb20gXCIuLi8uLi9CdXNzaW5lc0xheWVyL0NoYXRTZXJ2aWNlXCI7XG5pbXBvcnQgeyBJQ2hhdERUTyB9IGZyb20gXCIuLi8uLi9VSS9Db21wb25lbnRzL0NoYXRJdGVtXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUNoYXRWaWV3TW9kZWwge1xuICBjaGF0czogQXJyYXk8SUNoYXREVE8+O1xuICBnZXRDaGF0czogKCkgPT4gUHJvbWlzZTxJQ2hhdERUT1tdPjtcbiAgc2F2ZUNoYXQ6IChkYXRhOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+KSA9PiBQcm9taXNlPHZvaWQ+O1xuICBkZWxldGVDaGF0OiAoY2hhdElkOiBzdHJpbmcpID0+IFByb21pc2U8dm9pZD47XG59XG5leHBvcnQgY2xhc3MgQ2hhdFZpZXdNb2RlbCBpbXBsZW1lbnRzIElDaGF0Vmlld01vZGVsIHtcbiAgY2hhdHM6IEFycmF5PElDaGF0RFRPPiA9IFtdO1xuICB4OiBudW1iZXIgPSAxMjtcbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIHNlcnZpY2U6IElDaGF0U2VydmljZSkge31cblxuICBnZXRDaGF0cyA9IGFzeW5jICgpID0+IHtcbiAgICB0aGlzLmNoYXRzID0gYXdhaXQgdGhpcy5zZXJ2aWNlLmdldENoYXRzKCk7XG4gICAgcmV0dXJuIHRoaXMuY2hhdHM7XG4gIH07XG5cbiAgc2F2ZUNoYXQgPSBhc3luYyAoZGF0YTogUmVjb3JkPHN0cmluZywgc3RyaW5nPikgPT4ge1xuICAgIGF3YWl0IHRoaXMuc2VydmljZS5zYXZlQ2hhdChkYXRhKTtcbiAgICBhd2FpdCB0aGlzLmdldENoYXRzKCk7XG4gIH07XG5cbiAgZGVsZXRlQ2hhdCA9IGFzeW5jIChjaGF0SWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGF3YWl0IHRoaXMuc2VydmljZS5kZWxldGVDaGF0KGNoYXRJZCk7XG4gICAgYXdhaXQgdGhpcy5nZXRDaGF0cygpO1xuICB9O1xufVxuIiwiaW1wb3J0IHsgSVVzZXJTZXJ2aWNlIH0gZnJvbSBcIi4uLy4uL0J1c3NpbmVzTGF5ZXIvVXNlclNlcnZpY2VcIjtcbmltcG9ydCB7IElQcm9maWxlRFRPIH0gZnJvbSBcIi4uLy4uL1VJL0xheW91dHMvUHJvZmlsZVwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIElVc2VyVmlld01vZGVsIHtcbiAgdXNlcj86IElQcm9maWxlRFRPO1xuICBnZXRVc2VyOiAoKSA9PiBQcm9taXNlPHZvaWQ+O1xuICBzYXZlVXNlcjogKHVzZXI6IElQcm9maWxlRFRPKSA9PiBQcm9taXNlPElQcm9maWxlRFRPPjtcbiAgc2V0VXNlckZpZWxkOiAobmFtZToga2V5b2YgSVByb2ZpbGVEVE8sIHZhbHVlOiBhbnkpID0+IHZvaWQ7XG59XG5cbmV4cG9ydCBjbGFzcyBVc2VyVmlld01vZGVsIGltcGxlbWVudHMgSVVzZXJWaWV3TW9kZWwge1xuICB1c2VyPzogSVByb2ZpbGVEVE87XG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBzZXJ2aWNlOiBJVXNlclNlcnZpY2UpIHt9XG5cbiAgZ2V0VXNlciA9IGFzeW5jICgpID0+IHtcbiAgICB0aGlzLnVzZXIgPSBhd2FpdCB0aGlzLnNlcnZpY2UuZ2V0VXNlcigpO1xuICB9O1xuXG4gIHNhdmVVc2VyID0gYXN5bmMgKHVzZXI6IElQcm9maWxlRFRPKSA9PiB7XG4gICAgcmV0dXJuIHRoaXMuc2VydmljZS5zYXZlVXNlcih1c2VyKTtcbiAgfTtcblxuICBzZXRVc2VyRmllbGQobmFtZToga2V5b2YgSVByb2ZpbGVEVE8sIHZhbHVlOiBhbnkpIHtcbiAgICBpZiAodGhpcy51c2VyKSB7XG4gICAgICB0aGlzLnVzZXJbbmFtZV0gPSB2YWx1ZSBhcyBuZXZlcjtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy51c2VyID0ge30gYXMgSVByb2ZpbGVEVE87XG4gICAgICB0aGlzLnVzZXJbbmFtZV0gPSB2YWx1ZSBhcyBuZXZlcjtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7IFNFUlZJQ0UgfSBmcm9tIFwiLi4vQnVzc2luZXNMYXllclwiO1xuaW1wb3J0IHsgSUNoYXRTZXJ2aWNlIH0gZnJvbSBcIi4uL0J1c3NpbmVzTGF5ZXIvQ2hhdFNlcnZpY2VcIjtcbmltcG9ydCB7IElVc2VyU2VydmljZSB9IGZyb20gXCIuLi9CdXNzaW5lc0xheWVyL1VzZXJTZXJ2aWNlXCI7XG5pbXBvcnQgeyBDb250YWluZXIgfSBmcm9tIFwiLi4vbGlicy9Db250YWluZXJcIjtcbmltcG9ydCB7IENoYXRWaWV3TW9kZWwgfSBmcm9tIFwiLi9DaGF0Vmlld01vZGVsXCI7XG5pbXBvcnQgeyBVc2VyVmlld01vZGVsIH0gZnJvbSBcIi4vVXNlclZpZXdNb2RlbFwiO1xuXG5leHBvcnQgY29uc3QgVklFV19NT0RFTCA9IHtcbiAgQ0hBVDogU3ltYm9sLmZvcihcIkNoYXRWaWV3TW9kZWxcIiksXG4gIFVTRVI6IFN5bWJvbC5mb3IoXCJVc2VyVmlld01vZGVsXCIpLFxufTtcblxuZXhwb3J0IGNvbnN0IFZpZXdNb2RlbENvbnRhaW5lciA9IG5ldyBDb250YWluZXIoKTtcblxuVmlld01vZGVsQ29udGFpbmVyLmJpbmQoVklFV19NT0RFTC5DSEFUKS50b0R5bmFtaWNWYWx1ZSgoY29udGFpbmVyKSA9PiB7XG4gIGNvbnN0IHNlcnZpY2UgPSBjb250YWluZXIuZ2V0PElDaGF0U2VydmljZT4oU0VSVklDRS5DSEFUKTtcbiAgcmV0dXJuIG5ldyBDaGF0Vmlld01vZGVsKHNlcnZpY2UpO1xufSk7XG5cblZpZXdNb2RlbENvbnRhaW5lci5iaW5kKFZJRVdfTU9ERUwuVVNFUilcbiAgLnRvRHluYW1pY1ZhbHVlKChjb250YWluZXIpID0+IHtcbiAgICBjb25zdCBzZXJ2aWNlID0gY29udGFpbmVyLmdldDxJVXNlclNlcnZpY2U+KFNFUlZJQ0UuVVNFUik7XG4gICAgcmV0dXJuIG5ldyBVc2VyVmlld01vZGVsKHNlcnZpY2UpO1xuICB9KVxuICAuaW5TaW5nbGV0b25lU2NvcGUoKTtcbiIsImltcG9ydCB7IEJvb3RTdHJhcCB9IGZyb20gXCIuL0Jvb3RzdHJhcFwiO1xuaW1wb3J0IHsgUm91dGVySW5pdCB9IGZyb20gXCIuL3JvdXRlclwiO1xuXG5jb25zdCBJbml0QXBwID0gKCkgPT4ge1xuICBjb25zdCB7IGNvbnRhaW5lciB9ID0gbmV3IEJvb3RTdHJhcCgpO1xuICBjb25zdCByb3V0ZXIgPSBSb3V0ZXJJbml0KGNvbnRhaW5lcik7XG4gIHJldHVybiB7IHJvdXRlciwgY29udGFpbmVyIH07XG59O1xuXG5leHBvcnQgY29uc3QgeyByb3V0ZXIsIGNvbnRhaW5lciB9ID0gSW5pdEFwcCgpO1xuIiwiY2xhc3MgU2luZ2xldG9uU2NvcGUge1xuICBJbnN0YW5jZU1ha2VyczogTWFwPHN5bWJvbCwgYW55PiA9IG5ldyBNYXA8XG4gICAgc3ltYm9sLFxuICAgIHsgZm46IChjb250YWluZXI6IENvbnRhaW5lcikgPT4gYW55OyBpZDogc3ltYm9sIH1cbiAgPigpO1xuICBJbnN0YW5jZXM6IE1hcDxzeW1ib2wsIGFueT4gPSBuZXcgTWFwPHN5bWJvbCwgYW55PigpO1xufVxuXG5leHBvcnQgY2xhc3MgQ29udGFpbmVyIHtcbiAgY29udGFpbmVyczogTWFwPHN5bWJvbCwgYW55PiA9IG5ldyBNYXAoKTtcbiAgbGFzdElkPzogc3ltYm9sO1xuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgc2luZ2xldG9uZVNjb3BlOiBTaW5nbGV0b25TY29wZSA9IG5ldyBTaW5nbGV0b25TY29wZSgpXG4gICkge31cbiAgYmluZChpZDogc3ltYm9sKTogQ29udGFpbmVyIHtcbiAgICB0aGlzLmxhc3RJZCA9IGlkO1xuICAgIHRoaXMuY29udGFpbmVycy5zZXQoaWQsIG51bGwpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIGdldCA9IDxUPihpZDogc3ltYm9sKTogVCA9PiB7XG4gICAgY29uc3Qgc2luZ2xlVG9uZUNvbnRhaW5lciA9IHRoaXMuc2luZ2xldG9uZVNjb3BlLkluc3RhbmNlTWFrZXJzLmdldChpZCk7XG4gICAgaWYgKHNpbmdsZVRvbmVDb250YWluZXIpIHtcbiAgICAgIGNvbnN0IGluc3RhbmNlID0gdGhpcy5zaW5nbGV0b25lU2NvcGUuSW5zdGFuY2VzLmdldChpZCk7XG4gICAgICBpZiAoaW5zdGFuY2UpIHtcbiAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zaW5nbGV0b25lU2NvcGUuSW5zdGFuY2VzLnNldChpZCwgc2luZ2xlVG9uZUNvbnRhaW5lci5mbih0aGlzKSk7XG4gICAgICAgIHJldHVybiB0aGlzLnNpbmdsZXRvbmVTY29wZS5JbnN0YW5jZXMuZ2V0KGlkKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgY3JlYXRlQ29udGFpbmVyRm4gPSB0aGlzLmNvbnRhaW5lcnMuZ2V0KGlkKTtcbiAgICAgIHJldHVybiBjcmVhdGVDb250YWluZXJGbi5mbih0aGlzKTtcbiAgICB9XG4gIH07XG5cbiAgdG9EeW5hbWljVmFsdWUoZm46IChjb250YWluZXI6IENvbnRhaW5lcikgPT4gdW5rbm93bikge1xuICAgIGlmICh0aGlzLmxhc3RJZCkge1xuICAgICAgdGhpcy5jb250YWluZXJzLnNldCh0aGlzLmxhc3RJZCwgeyBmbjogZm4sIGlkOiB0aGlzLmxhc3RJZCB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHBhcmVudChjb250YWluZXI6IENvbnRhaW5lcik6IENvbnRhaW5lciB7XG4gICAgZm9yIChsZXQgY29udCBvZiBjb250YWluZXIuY29udGFpbmVycykge1xuICAgICAgdGhpcy5jb250YWluZXJzLnNldChjb250WzBdLCBjb250WzFdKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBpblNpbmdsZXRvbmVTY29wZSgpIHtcbiAgICBpZiAodGhpcy5sYXN0SWQpIHtcbiAgICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMuY29udGFpbmVycy5nZXQodGhpcy5sYXN0SWQpO1xuICAgICAgdGhpcy5zaW5nbGV0b25lU2NvcGUuSW5zdGFuY2VNYWtlcnMuc2V0KHRoaXMubGFzdElkLCBjb250YWluZXIpO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHsgdXVpZHY0IH0gZnJvbSBcIi4uL3V0aWxzXCI7XG5pbnRlcmZhY2UgSUhZUE9Qcm9wcyB7XG4gIHJlbmRlclRvPzogSFRNTEVsZW1lbnQ7XG4gIHRlbXBsYXRlUGF0aDogc3RyaW5nO1xuICBjaGlsZHJlbj86IFJlY29yZDxzdHJpbmcsIEhZUE8gfCBIWVBPW10+O1xuICBkYXRhOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPjtcbn1cblxuaW50ZXJmYWNlIElUZW1wYXRlUHJvcCB7XG4gIGh0bWw6IHN0cmluZztcbiAgdGVtcGxhdGVLZXk6IHN0cmluZztcbiAgbWFnaWNLZXk6IHN0cmluZztcbiAgaXNBcnJheTogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGNsYXNzIEhZUE8ge1xuICBwcml2YXRlIHJlbmRlclRvPzogSFRNTEVsZW1lbnQ7XG4gIHByaXZhdGUgY2hpbGRyZW4/OiBSZWNvcmQ8c3RyaW5nLCBIWVBPIHwgSFlQT1tdPjtcbiAgcHJpdmF0ZSB0ZW1wbGF0ZVBhdGg6IHN0cmluZztcbiAgcHJpdmF0ZSBkYXRhOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPjtcbiAgcHJpdmF0ZSB0ZW1wbGF0ZXNQcm9taXNlczogUHJvbWlzZTxJVGVtcGF0ZVByb3A+W107XG4gIHByaXZhdGUgc3RvcmU6IFJlY29yZDxzdHJpbmcsIHVua25vd24+O1xuICBwcml2YXRlIG1hZ2ljS2V5OiBzdHJpbmc7XG4gIHByaXZhdGUgYWZ0ZXJSZW5kZXJDYWxsYmFjazogKCkgPT4gdm9pZDtcbiAgcHJpdmF0ZSBhZnRlclJlbmRlckNhbGxiYWNrQXJyOiBTZXQ8KCkgPT4gdm9pZD47XG5cbiAgY29uc3RydWN0b3IocGFyYW1zOiBJSFlQT1Byb3BzKSB7XG4gICAgdGhpcy5yZW5kZXJUbyA9IHBhcmFtcy5yZW5kZXJUbztcbiAgICB0aGlzLmRhdGEgPSBwYXJhbXMuZGF0YTtcbiAgICB0aGlzLnRlbXBsYXRlUGF0aCA9IGAuL3RlbXBsYXRlcy8ke3BhcmFtcy50ZW1wbGF0ZVBhdGh9YDtcbiAgICB0aGlzLmNoaWxkcmVuID0gcGFyYW1zLmNoaWxkcmVuO1xuICAgIHRoaXMudGVtcGxhdGVzUHJvbWlzZXMgPSBbXTtcbiAgICB0aGlzLnN0b3JlID0ge307XG4gICAgdGhpcy5tYWdpY0tleSA9IHV1aWR2NCgpO1xuICAgIHRoaXMuYWZ0ZXJSZW5kZXJDYWxsYmFjayA9ICgpID0+IHt9O1xuICAgIHRoaXMuYWZ0ZXJSZW5kZXJDYWxsYmFja0FyciA9IG5ldyBTZXQoKTtcbiAgfVxuXG4gIC8vQHRvZG86INC/0YDQuNC60YDRg9GC0LjRgtGMINC80LXQvNC+0LjQt9Cw0YbQuNGOXG5cbiAgcHVibGljIGdldFRlbXBsYXRlSFRNTChcbiAgICBrZXk6IHN0cmluZyxcbiAgICBoeXBvOiBIWVBPLFxuICAgIGlzQXJyYXk6IGJvb2xlYW5cbiAgKTogUHJvbWlzZTxJVGVtcGF0ZVByb3A+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2U8SVRlbXBhdGVQcm9wPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBmZXRjaChoeXBvLnRlbXBsYXRlUGF0aClcbiAgICAgICAgLnRoZW4oKGh0bWwpID0+IHtcbiAgICAgICAgICBpZiAoaHRtbC5zdGF0dXMgIT09IDIwMCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiZmlsZSBkbyBub3QgZG93bmxvYWRcIik7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBodG1sLmJsb2IoKTtcbiAgICAgICAgfSlcbiAgICAgICAgLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICAgIHJldHVybiByZXN1bHQudGV4dCgpO1xuICAgICAgICB9KVxuICAgICAgICAudGhlbigodGV4dCkgPT4ge1xuICAgICAgICAgIHRleHQgPSB0aGlzLmluc2VydERhdGFJbnRvSFRNTCh0ZXh0LCBoeXBvLmRhdGEpO1xuICAgICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgaHRtbDogdGV4dCxcbiAgICAgICAgICAgIHRlbXBsYXRlS2V5OiBrZXksXG4gICAgICAgICAgICBtYWdpY0tleTogaHlwby5tYWdpY0tleSxcbiAgICAgICAgICAgIGlzQXJyYXk6IGlzQXJyYXksXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBjb2xsZWN0VGVtcGxhdGVzKFxuICAgIGh5cG86IEhZUE8gfCBIWVBPW10sXG4gICAgbmFtZTogc3RyaW5nLFxuICAgIGlzQXJyYXk6IGJvb2xlYW5cbiAgKTogSFlQTyB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoaHlwbykpIHtcbiAgICAgIHRoaXMuaGFuZGxlQXJyYXlIWVBPKGh5cG8sIG5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmhhbmRsZVNpbXBsZUhZUE8oaHlwbywgbmFtZSk7XG4gICAgICB0aGlzLnRlbXBsYXRlc1Byb21pc2VzLnB1c2godGhpcy5nZXRUZW1wbGF0ZUhUTUwobmFtZSwgaHlwbywgaXNBcnJheSkpO1xuICAgICAgdGhpcy5hZnRlclJlbmRlckNhbGxiYWNrQXJyLmFkZChoeXBvLmFmdGVyUmVuZGVyQ2FsbGJhY2spO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHByaXZhdGUgaGFuZGxlQXJyYXlIWVBPKGh5cG9zOiBIWVBPW10sIG5hbWU6IHN0cmluZyk6IHZvaWQge1xuICAgIGh5cG9zLmZvckVhY2goKGh5cG8pID0+IHtcbiAgICAgIHRoaXMuY29sbGVjdFRlbXBsYXRlcyhoeXBvLCBgJHtuYW1lfWAsIHRydWUpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBoYW5kbGVTaW1wbGVIWVBPKGh5cG86IEhZUE8sIG5hbWU6IHN0cmluZyk6IHZvaWQge1xuICAgIGlmIChoeXBvLmNoaWxkcmVuKSB7XG4gICAgICBPYmplY3Qua2V5cyhoeXBvLmNoaWxkcmVuKS5mb3JFYWNoKChjaGlsZE5hbWUpID0+IHtcbiAgICAgICAgaWYgKGh5cG8uY2hpbGRyZW4pIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5jb2xsZWN0VGVtcGxhdGVzKFxuICAgICAgICAgICAgaHlwby5jaGlsZHJlbltjaGlsZE5hbWVdLFxuICAgICAgICAgICAgY2hpbGROYW1lLFxuICAgICAgICAgICAgZmFsc2VcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGluc2VydERhdGFJbnRvSFRNTChcbiAgICBodG1sVGVtcGxhdGU6IHN0cmluZyxcbiAgICBkYXRhOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPlxuICApOiBzdHJpbmcge1xuICAgIGRhdGEgPSB0aGlzLmdldERhdGFXaXRob3V0SWVyYXJoeShkYXRhKTtcbiAgICBmb3IgKGxldCBrZXkgaW4gZGF0YSkge1xuICAgICAgaWYgKHR5cGVvZiBkYXRhW2tleV0gIT09IFwib2JqZWN0XCIgfHwgZGF0YVtrZXldID09PSBudWxsKSB7XG4gICAgICAgIGNvbnN0IG1hc2sgPSBuZXcgUmVnRXhwKFwie3tcIiArIGtleSArIFwifX1cIiwgXCJnXCIpO1xuICAgICAgICBodG1sVGVtcGxhdGUgPSBodG1sVGVtcGxhdGUucmVwbGFjZShtYXNrLCBTdHJpbmcoZGF0YVtrZXldKSk7XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IG1hc2sgPSBuZXcgUmVnRXhwKC97e1thLXouX10rfX0vZyk7XG4gICAgaHRtbFRlbXBsYXRlID0gaHRtbFRlbXBsYXRlLnJlcGxhY2UobWFzaywgXCJcIik7XG4gICAgcmV0dXJuIGh0bWxUZW1wbGF0ZTtcbiAgfVxuXG4gIHByaXZhdGUgY29udmVydEFyclRlbXBsYXRlVG9NYXAoXG4gICAgdGVtcGxhdGVBcnI6IHtcbiAgICAgIGh0bWw6IHN0cmluZztcbiAgICAgIHRlbXBsYXRlS2V5OiBzdHJpbmc7XG4gICAgICBtYWdpY0tleTogc3RyaW5nO1xuICAgICAgaXNBcnJheTogYm9vbGVhbiB8IHVuZGVmaW5lZDtcbiAgICB9W11cbiAgKTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiB7XG4gICAgY29uc3QgcmVzdWx0OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG4gICAgdGVtcGxhdGVBcnIuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgaWYgKHJlc3VsdFtpdGVtLnRlbXBsYXRlS2V5XSkge1xuICAgICAgICByZXN1bHRbXG4gICAgICAgICAgaXRlbS50ZW1wbGF0ZUtleVxuICAgICAgICBdICs9IGA8c3BhbiBoeXBvPVwiJHtpdGVtLm1hZ2ljS2V5fVwiPiR7aXRlbS5odG1sfTwvc3Bhbj5gO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0W2Ake2l0ZW0udGVtcGxhdGVLZXl9LSR7aXRlbS5tYWdpY0tleX1gXSA9IGl0ZW0uaHRtbDtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwcml2YXRlIGluc2VydFRlbXBsYXRlSW50b1RlbXBsYXRlKFxuICAgIHJvb3RUZW1wbGF0ZUhUTUw6IHN0cmluZyxcbiAgICB0ZW1wbGF0ZUtleTogc3RyaW5nLFxuICAgIGNoaWxkVGVtcGxhdGVIVE1MOiBzdHJpbmcsXG4gICAgbWFnaWNLZXk6IHN0cmluZyxcbiAgICBpc0FycmF5OiBib29sZWFuXG4gICk6IHN0cmluZyB7XG4gICAgcm9vdFRlbXBsYXRlSFRNTCA9IHRoaXMuY3JlYXRlRWxlbVdyYXBwZXIoXG4gICAgICByb290VGVtcGxhdGVIVE1MLFxuICAgICAgdGVtcGxhdGVLZXksXG4gICAgICBtYWdpY0tleSxcbiAgICAgIGlzQXJyYXlcbiAgICApO1xuICAgIGNvbnN0IG1hc2sgPSBuZXcgUmVnRXhwKGAtPSR7dGVtcGxhdGVLZXl9LSR7bWFnaWNLZXl9PS1gLCBcImdcIik7XG4gICAgcm9vdFRlbXBsYXRlSFRNTCA9IHJvb3RUZW1wbGF0ZUhUTUwucmVwbGFjZShtYXNrLCBjaGlsZFRlbXBsYXRlSFRNTCk7XG4gICAgcmV0dXJuIHJvb3RUZW1wbGF0ZUhUTUw7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZUVsZW1XcmFwcGVyKFxuICAgIGh0bWxUZW1wbGF0ZTogc3RyaW5nLFxuICAgIHRlbXBsYXRlS2V5OiBzdHJpbmcsXG4gICAgbWFnaWNLZXk6IHN0cmluZyxcbiAgICBpc0FycmF5OiBib29sZWFuXG4gICkge1xuICAgIGNvbnN0IG1hc2sgPSBuZXcgUmVnRXhwKGAtPSR7dGVtcGxhdGVLZXl9PS1gLCBcImdcIik7XG4gICAgaWYgKGlzQXJyYXkpIHtcbiAgICAgIGh0bWxUZW1wbGF0ZSA9IGh0bWxUZW1wbGF0ZS5yZXBsYWNlKFxuICAgICAgICBtYXNrLFxuICAgICAgICBgPHNwYW4gaHlwbz1cIiR7bWFnaWNLZXl9XCI+LT0ke3RlbXBsYXRlS2V5fS0ke21hZ2ljS2V5fT0tLT0ke3RlbXBsYXRlS2V5fT0tPC9zcGFuPmBcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGh0bWxUZW1wbGF0ZSA9IGh0bWxUZW1wbGF0ZS5yZXBsYWNlKFxuICAgICAgICBtYXNrLFxuICAgICAgICBgPHNwYW4gaHlwbz1cIiR7bWFnaWNLZXl9XCI+LT0ke3RlbXBsYXRlS2V5fS0ke21hZ2ljS2V5fT0tPC9zcGFuPmBcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGh0bWxUZW1wbGF0ZTtcbiAgfVxuXG4gIHByaXZhdGUgY2xlYXJFbXRweUNvbXBvbmVudChodG1sOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIGNvbnN0IHJlZ2V4ID0gLy09W2EteixBLVosMC05XSs9LS9nO1xuICAgIHJldHVybiBodG1sLnJlcGxhY2UocmVnZXgsIFwiXCIpO1xuICB9XG5cbiAgcHVibGljIHJlbmRlciA9IGFzeW5jICgpOiBQcm9taXNlPEhZUE8+ID0+IHtcbiAgICBjb25zdCB0aGF0ID0gdGhpcztcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwoXG4gICAgICB0aGlzLmNvbGxlY3RUZW1wbGF0ZXModGhpcywgXCJyb290XCIsIGZhbHNlKS50ZW1wbGF0ZXNQcm9taXNlc1xuICAgICkudGhlbigoYXJyYXlUZW1wbGF0ZXMpID0+IHtcbiAgICAgIGNvbnN0IG1hcFRlbXBsYXRlcyA9IHRoaXMuY29udmVydEFyclRlbXBsYXRlVG9NYXAoYXJyYXlUZW1wbGF0ZXMpO1xuICAgICAgbGV0IHJvb3RUZW1wbGF0ZUhUTUw6IHN0cmluZyA9XG4gICAgICAgIGFycmF5VGVtcGxhdGVzW2FycmF5VGVtcGxhdGVzLmxlbmd0aCAtIDFdLmh0bWw7XG4gICAgICBmb3IgKGxldCBpID0gYXJyYXlUZW1wbGF0ZXMubGVuZ3RoIC0gMjsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgbGV0IHRlbXBsYXRlID1cbiAgICAgICAgICBtYXBUZW1wbGF0ZXNbXG4gICAgICAgICAgICBgJHthcnJheVRlbXBsYXRlc1tpXS50ZW1wbGF0ZUtleX0tJHthcnJheVRlbXBsYXRlc1tpXS5tYWdpY0tleX1gXG4gICAgICAgICAgXTtcbiAgICAgICAgcm9vdFRlbXBsYXRlSFRNTCA9IHRoaXMuaW5zZXJ0VGVtcGxhdGVJbnRvVGVtcGxhdGUoXG4gICAgICAgICAgcm9vdFRlbXBsYXRlSFRNTCxcbiAgICAgICAgICBhcnJheVRlbXBsYXRlc1tpXS50ZW1wbGF0ZUtleSxcbiAgICAgICAgICB0ZW1wbGF0ZSxcbiAgICAgICAgICBhcnJheVRlbXBsYXRlc1tpXS5tYWdpY0tleSxcbiAgICAgICAgICBhcnJheVRlbXBsYXRlc1tpXS5pc0FycmF5XG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIHJvb3RUZW1wbGF0ZUhUTUwgPSB0aGlzLmNsZWFyRW10cHlDb21wb25lbnQocm9vdFRlbXBsYXRlSFRNTCk7XG5cbiAgICAgIGlmICh0aGlzLnJlbmRlclRvKSB7XG4gICAgICAgIHRoaXMucmVuZGVyVG8uaW5uZXJIVE1MID0gcm9vdFRlbXBsYXRlSFRNTDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGVsZW0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbaHlwbz1cIiR7dGhpcy5tYWdpY0tleX1cIl1gKTtcbiAgICAgICAgaWYgKGVsZW0pIHtcbiAgICAgICAgICB0aGlzLnJlbmRlclRvID0gZWxlbSBhcyBIVE1MRWxlbWVudDtcbiAgICAgICAgICBlbGVtLmlubmVySFRNTCA9IHJvb3RUZW1wbGF0ZUhUTUw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRoaXMuYWZ0ZXJSZW5kZXJDYWxsYmFja0Fyci5mb3JFYWNoKChjYWxsYmFjaykgPT4ge1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLnRlbXBsYXRlc1Byb21pc2VzID0gW107XG4gICAgICByZXR1cm4gdGhhdDtcbiAgICB9KTtcbiAgfTtcblxuICBwcml2YXRlIHJlcmVuZGVyKCkge1xuICAgIHRoaXMucmVuZGVyKCk7XG4gIH1cblxuICBwdWJsaWMgZ2V0U3RhdGUoKTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4ge1xuICAgIHRoaXMuc3RvcmUgPSB0aGlzLmNyZWF0ZVN0b3JlKHRoaXMuZGF0YSk7XG4gICAgcmV0dXJuIHRoaXMuc3RvcmU7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZVN0b3JlKHN0b3JlOiBhbnkpIHtcbiAgICBjb25zdCB0aGF0ID0gdGhpcztcbiAgICBjb25zdCBoYW5kbGVyOiBQcm94eUhhbmRsZXI8UmVjb3JkPHN0cmluZywgdW5rbm93bj4+ID0ge1xuICAgICAgZ2V0KHRhcmdldCwgcHJvcGVydHkpIHtcbiAgICAgICAgcmV0dXJuIHRhcmdldFs8c3RyaW5nPnByb3BlcnR5XTtcbiAgICAgIH0sXG4gICAgICBzZXQodGFyZ2V0LCBwcm9wZXJ0eSwgdmFsdWUpIHtcbiAgICAgICAgdGFyZ2V0WzxzdHJpbmc+cHJvcGVydHldID0gdmFsdWU7XG4gICAgICAgIHRoYXQucmVyZW5kZXIoKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9LFxuICAgIH07XG4gICAgc3RvcmUgPSBuZXcgUHJveHkoc3RvcmUsIGhhbmRsZXIpO1xuXG4gICAgT2JqZWN0LmtleXMoc3RvcmUpLmZvckVhY2goKGZpZWxkKSA9PiB7XG4gICAgICBpZiAodHlwZW9mIHN0b3JlW2ZpZWxkXSA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICBzdG9yZVtmaWVsZF0gPSBuZXcgUHJveHkoc3RvcmVbZmllbGRdLCBoYW5kbGVyKTtcbiAgICAgICAgdGhpcy5jcmVhdGVTdG9yZShzdG9yZVtmaWVsZF0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHN0b3JlO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXREYXRhV2l0aG91dEllcmFyaHkoZGF0YTogYW55KSB7XG4gICAgbGV0IHBhdGhBcnI6IHN0cmluZ1tdID0gW107XG4gICAgbGV0IHJlc3VsdE9iamVjdDogYW55ID0ge307XG4gICAgZnVuY3Rpb24gZm56KG9iajogYW55KSB7XG4gICAgICBmb3IgKGxldCBrZXkgaW4gb2JqKSB7XG4gICAgICAgIHBhdGhBcnIucHVzaChrZXkpO1xuICAgICAgICBpZiAodHlwZW9mIG9ialtrZXldID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgZm56KG9ialtrZXldKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXN1bHRPYmplY3RbcGF0aEFyci5qb2luKFwiLlwiKV0gPSBvYmpba2V5XTtcbiAgICAgICAgICBwYXRoQXJyLnBvcCgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBwYXRoQXJyLnBvcCgpO1xuICAgIH1cbiAgICBmbnooZGF0YSk7XG5cbiAgICByZXR1cm4gcmVzdWx0T2JqZWN0O1xuICB9XG5cbiAgcHVibGljIGFmdGVyUmVuZGVyKGNhbGxiYWNrOiAoKSA9PiB2b2lkKTogSFlQTyB7XG4gICAgdGhpcy5hZnRlclJlbmRlckNhbGxiYWNrID0gY2FsbGJhY2s7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBwdWJsaWMgaGlkZSgpIHtcbiAgICBpZiAodGhpcy5yZW5kZXJUbykge1xuICAgICAgbGV0IGNoaWxkcmVuO1xuXG4gICAgICBjaGlsZHJlbiA9IHRoaXMucmVuZGVyVG8uY2hpbGRyZW47XG4gICAgICBpZiAoY2hpbGRyZW4pIHtcbiAgICAgICAgZm9yIChsZXQgY2hpbGQgb2YgY2hpbGRyZW4pIHtcbiAgICAgICAgICBjaGlsZC5yZW1vdmUoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHsgSFlQTyB9IGZyb20gXCIuLi9IWVBPL0hZUE9cIjtcblxuY2xhc3MgUm91dGUge1xuICBwcml2YXRlIF9wYXRobmFtZTogc3RyaW5nID0gXCJcIjtcbiAgcHJpdmF0ZSBfYmxvY2s/OiAocmVzdWx0PzogYW55KSA9PiBIWVBPO1xuICBwcml2YXRlIF9wcm9wczogUmVjb3JkPHN0cmluZywgdW5rbm93bj47XG4gIGFzeW5jRk4/OiAoKSA9PiBQcm9taXNlPGFueT47XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcGF0aG5hbWU6IHN0cmluZyxcbiAgICB2aWV3OiAoKSA9PiBIWVBPLFxuICAgIHByb3BzOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPixcbiAgICBhc3luY0ZOPzogKCkgPT4gUHJvbWlzZTxhbnk+XG4gICkge1xuICAgIHRoaXMuX3BhdGhuYW1lID0gcGF0aG5hbWU7XG4gICAgdGhpcy5fcHJvcHMgPSBwcm9wcztcbiAgICB0aGlzLl9ibG9jayA9IHZpZXc7XG4gICAgdGhpcy5hc3luY0ZOID0gYXN5bmNGTjtcbiAgfVxuXG4gIG5hdmlnYXRlKHBhdGhuYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5tYXRjaChwYXRobmFtZSkpIHtcbiAgICAgIHRoaXMuX3BhdGhuYW1lID0gcGF0aG5hbWU7XG4gICAgICB0aGlzLnJlbmRlcigpO1xuICAgIH1cbiAgfVxuXG4gIGxlYXZlKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9ibG9jaykge1xuICAgICAgdGhpcy5fYmxvY2soKS5oaWRlKCk7XG4gICAgfVxuICB9XG5cbiAgbWF0Y2gocGF0aG5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBpc0VxdWFsKHBhdGhuYW1lLCB0aGlzLl9wYXRobmFtZSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgaWYgKCF0aGlzLl9ibG9jaykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy5hc3luY0ZOKSB7XG4gICAgICB0aGlzLmFzeW5jRk4oKS50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgdGhpcy5fYmxvY2s/LihyZXN1bHQpLnJlbmRlcigpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2Jsb2NrKCkucmVuZGVyKCk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBSb3V0ZXIge1xuICBwcml2YXRlIF9faW5zdGFuY2U6IFJvdXRlciA9IHRoaXM7XG4gIHJvdXRlczogUm91dGVbXSA9IFtdO1xuICBwcml2YXRlIGhpc3Rvcnk6IEhpc3RvcnkgPSB3aW5kb3cuaGlzdG9yeTtcbiAgcHJpdmF0ZSBfY3VycmVudFJvdXRlOiBSb3V0ZSB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIF9yb290UXVlcnk6IHN0cmluZyA9IFwiXCI7XG4gIHByaXZhdGUgYXN5bmNGTj86ICgpID0+IFByb21pc2U8YW55PjtcblxuICBjb25zdHJ1Y3Rvcihyb290UXVlcnk6IHN0cmluZykge1xuICAgIGlmICh0aGlzLl9faW5zdGFuY2UpIHtcbiAgICAgIHJldHVybiB0aGlzLl9faW5zdGFuY2U7XG4gICAgfVxuICAgIHRoaXMuX3Jvb3RRdWVyeSA9IHJvb3RRdWVyeTtcbiAgfVxuXG4gIHVzZShcbiAgICBwYXRobmFtZTogc3RyaW5nLFxuICAgIGJsb2NrOiAocmVzdWx0PzogYW55KSA9PiBIWVBPLFxuICAgIGFzeW5jRk4/OiAoKSA9PiBQcm9taXNlPGFueT5cbiAgKTogUm91dGVyIHtcbiAgICBjb25zdCByb3V0ZSA9IG5ldyBSb3V0ZShcbiAgICAgIHBhdGhuYW1lLFxuICAgICAgYmxvY2ssXG4gICAgICB7IHJvb3RRdWVyeTogdGhpcy5fcm9vdFF1ZXJ5IH0sXG4gICAgICBhc3luY0ZOXG4gICAgKTtcbiAgICB0aGlzLnJvdXRlcy5wdXNoKHJvdXRlKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHN0YXJ0KCk6IFJvdXRlciB7XG4gICAgd2luZG93Lm9ucG9wc3RhdGUgPSAoXzogUG9wU3RhdGVFdmVudCkgPT4ge1xuICAgICAgbGV0IG1hc2sgPSBuZXcgUmVnRXhwKFwiI1wiLCBcImdcIik7XG4gICAgICBjb25zdCB1cmwgPSB3aW5kb3cubG9jYXRpb24uaGFzaC5yZXBsYWNlKG1hc2ssIFwiXCIpO1xuICAgICAgdGhpcy5fb25Sb3V0ZSh1cmwpO1xuICAgIH07XG4gICAgbGV0IG1hc2sgPSBuZXcgUmVnRXhwKFwiI1wiLCBcImdcIik7XG4gICAgY29uc3QgdXJsID0gd2luZG93LmxvY2F0aW9uLmhhc2gucmVwbGFjZShtYXNrLCBcIlwiKSB8fCBcIi9cIjtcbiAgICB0aGlzLl9vblJvdXRlKHVybCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBfb25Sb3V0ZShwYXRobmFtZTogc3RyaW5nKTogdm9pZCB7XG4gICAgY29uc3Qgcm91dGUgPSB0aGlzLmdldFJvdXRlKHBhdGhuYW1lKTtcbiAgICBpZiAoIXJvdXRlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0aGlzLl9jdXJyZW50Um91dGUpIHtcbiAgICAgIHRoaXMuX2N1cnJlbnRSb3V0ZS5sZWF2ZSgpO1xuICAgIH1cbiAgICB0aGlzLl9jdXJyZW50Um91dGUgPSByb3V0ZTtcbiAgICB0aGlzLl9jdXJyZW50Um91dGUucmVuZGVyKCk7XG4gIH1cblxuICBnbyhwYXRobmFtZTogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5oaXN0b3J5LnB1c2hTdGF0ZSh7fSwgXCJcIiwgYCMke3BhdGhuYW1lfWApO1xuICAgIHRoaXMuX29uUm91dGUocGF0aG5hbWUpO1xuICB9XG5cbiAgYmFjaygpOiB2b2lkIHtcbiAgICB0aGlzLmhpc3RvcnkuYmFjaygpO1xuICB9XG5cbiAgZm9yd2FyZCgpOiB2b2lkIHtcbiAgICB0aGlzLmhpc3RvcnkuZm9yd2FyZCgpO1xuICB9XG5cbiAgZ2V0Um91dGUocGF0aG5hbWU6IHN0cmluZyk6IFJvdXRlIHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gdGhpcy5yb3V0ZXMuZmluZCgocm91dGUpID0+IHJvdXRlLm1hdGNoKHBhdGhuYW1lKSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaXNFcXVhbChsaHM6IHVua25vd24sIHJoczogdW5rbm93bikge1xuICByZXR1cm4gbGhzID09PSByaHM7XG59XG4iLCJjb25zdCBNRVRIT0RTID0ge1xuICBHRVQ6IFwiR0VUXCIsXG4gIFBVVDogXCJQVVRcIixcbiAgUE9TVDogXCJQT1NUXCIsXG4gIERFTEVURTogXCJERUxFVEVcIixcbn07XG5cbmNvbnN0IERPTUVOID0gXCJodHRwczovL3lhLXByYWt0aWt1bS50ZWNoL2FwaS92MlwiO1xuXG5jbGFzcyBIVFRQVHJhbnNwb3J0Q2xhc3Mge1xuICBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgICBoZWFkZXJzOiB7fSxcbiAgICBkYXRhOiB7fSxcbiAgfTtcblxuICBHRVQgPSAoXG4gICAgdXJsOiBzdHJpbmcsXG4gICAgb3B0aW9uczogeyBba2V5OiBzdHJpbmddOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IH0gPSB0aGlzLmRlZmF1bHRPcHRpb25zXG4gICkgPT4ge1xuICAgIGNvbnN0IHJlcXVlc3RQYXJhbXMgPSBxdWVyeVN0cmluZ2lmeShvcHRpb25zLmRhdGEpO1xuICAgIHVybCArPSByZXF1ZXN0UGFyYW1zO1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QoXG4gICAgICB1cmwsXG4gICAgICB7IC4uLm9wdGlvbnMsIG1ldGhvZDogTUVUSE9EUy5HRVQgfSxcbiAgICAgIE51bWJlcihvcHRpb25zLnRpbWVvdXQpIHx8IDUwMDBcbiAgICApO1xuICB9O1xuXG4gIFBVVCA9IChcbiAgICB1cmw6IHN0cmluZyxcbiAgICBvcHRpb25zOiB7IFtrZXk6IHN0cmluZ106IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gfSA9IHRoaXMuZGVmYXVsdE9wdGlvbnNcbiAgKSA9PiB7XG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdChcbiAgICAgIHVybCxcbiAgICAgIHsgLi4ub3B0aW9ucywgbWV0aG9kOiBNRVRIT0RTLlBVVCB9LFxuICAgICAgTnVtYmVyKG9wdGlvbnMudGltZW91dCkgfHwgNTAwMFxuICAgICk7XG4gIH07XG5cbiAgUE9TVCA9IChcbiAgICB1cmw6IHN0cmluZyxcbiAgICBvcHRpb25zOiB7IFtrZXk6IHN0cmluZ106IFJlY29yZDxzdHJpbmcsIHN0cmluZyB8IG51bWJlcj4gfSA9IHRoaXNcbiAgICAgIC5kZWZhdWx0T3B0aW9uc1xuICApID0+IHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KFxuICAgICAgdXJsLFxuICAgICAgeyAuLi5vcHRpb25zLCBtZXRob2Q6IE1FVEhPRFMuUE9TVCB9LFxuICAgICAgTnVtYmVyKG9wdGlvbnMudGltZW91dCkgfHwgNTAwMFxuICAgICk7XG4gIH07XG5cbiAgREVMRVRFID0gKFxuICAgIHVybDogc3RyaW5nLFxuICAgIG9wdGlvbnM6IHsgW2tleTogc3RyaW5nXTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiB9ID0gdGhpcy5kZWZhdWx0T3B0aW9uc1xuICApID0+IHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KFxuICAgICAgdXJsLFxuICAgICAgeyAuLi5vcHRpb25zLCBtZXRob2Q6IE1FVEhPRFMuREVMRVRFIH0sXG4gICAgICBOdW1iZXIob3B0aW9ucy50aW1lb3V0KSB8fCA1MDAwXG4gICAgKTtcbiAgfTtcblxuICBzb2NrZXQgPSAodXJsOiBzdHJpbmcpID0+IHtcbiAgICByZXR1cm4gbmV3IFdlYlNvY2tldCh1cmwpO1xuICB9O1xuXG4gIHJlcXVlc3QgPSAoXG4gICAgdXJsOiBzdHJpbmcsXG4gICAgb3B0aW9uczogeyBba2V5OiBzdHJpbmddOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IH0gfCBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+LFxuICAgIHRpbWVvdXQ6IG51bWJlciA9IDUwMDBcbiAgKSA9PiB7XG4gICAgdXJsID0gRE9NRU4gKyB1cmw7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPGFueT4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3QgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICB4aHIud2l0aENyZWRlbnRpYWxzID0gdHJ1ZTtcbiAgICAgIHhoci5vcGVuKDxzdHJpbmc+b3B0aW9ucy5tZXRob2QsIHVybCk7XG4gICAgICBjb25zdCBoZWFkZXJzID0gb3B0aW9ucy5oZWFkZXJzO1xuICAgICAgZm9yIChsZXQgaGVhZGVyIGluIGhlYWRlcnMgYXMgUmVjb3JkPHN0cmluZywgc3RyaW5nPikge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGhlYWRlcnNbaGVhZGVyIGFzIGtleW9mIHR5cGVvZiBoZWFkZXJzXSBhcyBzdHJpbmc7XG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKGhlYWRlciwgdmFsdWUpO1xuICAgICAgfVxuICAgICAgeGhyLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgcmVzb2x2ZSh4aHIpO1xuICAgICAgfTtcbiAgICAgIHhoci5vbmVycm9yID0gKGUpID0+IHtcbiAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgfTtcbiAgICAgIHhoci5vbmFib3J0ID0gKGUpID0+IHtcbiAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgfTtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB4aHIuYWJvcnQoKTtcbiAgICAgIH0sIHRpbWVvdXQpO1xuXG4gICAgICB4aHIuc2VuZChKU09OLnN0cmluZ2lmeShvcHRpb25zLmRhdGEpKTtcbiAgICB9KTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gcXVlcnlTdHJpbmdpZnkoZGF0YTogUmVjb3JkPHN0cmluZywgc3RyaW5nPikge1xuICBsZXQgcmVxdWVzdFBhcmFtcyA9IFwiP1wiO1xuICBmb3IgKGxldCBrZXkgaW4gZGF0YSkge1xuICAgIHJlcXVlc3RQYXJhbXMgKz0gYCR7a2V5fT0ke2RhdGFba2V5XX0mYDtcbiAgfVxuICByZXF1ZXN0UGFyYW1zID0gcmVxdWVzdFBhcmFtcy5zdWJzdHJpbmcoMCwgcmVxdWVzdFBhcmFtcy5sZW5ndGggLSAxKTtcbiAgcmV0dXJuIHJlcXVlc3RQYXJhbXM7XG59XG5cbmV4cG9ydCBjb25zdCBIVFRQVHJhbnNwb3J0ID0gKCgpOiB7IGdldEluc3RhbmNlOiAoKSA9PiBIVFRQVHJhbnNwb3J0Q2xhc3MgfSA9PiB7XG4gIGxldCBpbnN0YW5jZTogSFRUUFRyYW5zcG9ydENsYXNzO1xuICByZXR1cm4ge1xuICAgIGdldEluc3RhbmNlOiAoKSA9PiBpbnN0YW5jZSB8fCAoaW5zdGFuY2UgPSBuZXcgSFRUUFRyYW5zcG9ydENsYXNzKCkpLFxuICB9O1xufSkoKTtcbiIsImltcG9ydCB7IEhZUE8gfSBmcm9tIFwiLi4vLi4vSFlQT1wiO1xuXG5leHBvcnQgY29uc3QgRW1haWxWYWxpZGF0b3IgPSB7XG4gIHZhbHVlOiBcIlwiLFxuICBjaGVja0Z1bmM6IGZ1bmN0aW9uICh2YWx1ZTogc3RyaW5nKSB7XG4gICAgdmFyIHJlZyA9IC9eKFtBLVphLXowLTlfXFwtXFwuXSkrXFxAKFtBLVphLXowLTlfXFwtXFwuXSkrXFwuKFtBLVphLXpdezIsNH0pJC87XG4gICAgaWYgKCFyZWcudGVzdCh2YWx1ZSkpIHtcbiAgICAgIHRoaXMudmFsdWUgPSBcIlwiO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0sXG4gIGNhbGxiYWNrOiAoZWxlbTogSFlQTywgY2hlY2tSZXN1bHQ6IGJvb2xlYW4pID0+IHtcbiAgICBsZXQgc3RhdGUgPSBlbGVtLmdldFN0YXRlKCk7XG4gICAgaWYgKCFjaGVja1Jlc3VsdCkge1xuICAgICAgc3RhdGUubWVzc2FnZSA9IFwi4puUINGN0YLQviDQvdC1INC/0L7RhdC+0LbQtSDQvdCwINCw0LTRgNC10YEg0Y3Qu9C10LrRgtGA0L7QvdC90L7QuSDQv9C+0YfRgtGLXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0YXRlLm1lc3NhZ2UgPSBcIlwiO1xuICAgIH1cbiAgfSxcbn07XG4iLCJpbXBvcnQgeyBIWVBPIH0gZnJvbSBcIi4uLy4uL0hZUE9cIjtcblxuZXhwb3J0IGNvbnN0IFJlcXVpcmVkID0ge1xuICB2YWx1ZTogXCJcIixcbiAgY2hlY2tGdW5jOiBmdW5jdGlvbiAodmFsdWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIGlmICh2YWx1ZSA9PT0gXCJcIikge1xuICAgICAgdGhpcy52YWx1ZSA9IFwiXCI7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSxcbiAgY2FsbGJhY2s6IChlbGVtOiBIWVBPLCBjaGVja1Jlc3VsdDogYm9vbGVhbikgPT4ge1xuICAgIGxldCBzdGF0ZSA9IGVsZW0uZ2V0U3RhdGUoKTtcbiAgICBpZiAoIWNoZWNrUmVzdWx0KSB7XG4gICAgICBzdGF0ZS5tZXNzYWdlID0gXCLim5Qg0L7QsdGP0LfQsNGC0LXQu9GM0L3QvtC1INC/0L7Qu9C1XCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0YXRlLm1lc3NhZ2UgPSBcIlwiO1xuICAgIH1cbiAgfSxcbn07IiwiZXhwb3J0IGZ1bmN0aW9uIHV1aWR2NCgpIHtcbiAgcmV0dXJuIFwieHh4eHh4eHgteHh4eC00eHh4LXl4eHgteHh4eHh4eHh4eHh4XCIucmVwbGFjZSgvW3h5XS9nLCBmdW5jdGlvbiAoYykge1xuICAgIHZhciByID0gKE1hdGgucmFuZG9tKCkgKiAxNikgfCAwLFxuICAgICAgdiA9IGMgPT0gXCJ4XCIgPyByIDogKHIgJiAweDMpIHwgMHg4O1xuICAgIHJldHVybiBgJHt2LnRvU3RyaW5nKDE2KX1gO1xuICB9KTtcbn0iLCJpbXBvcnQgeyBMb2dpbkxheW91dCB9IGZyb20gXCIuLi9VSS9MYXlvdXRzL0xvZ2luXCI7XG5pbXBvcnQgeyBDaGF0TGF5b3V0IH0gZnJvbSBcIi4uL1VJL0xheW91dHMvQ2hhdFwiO1xuaW1wb3J0IHsgUmVnaXN0cmF0aW9uTGF5b3V0IH0gZnJvbSBcIi4uL1VJL0xheW91dHMvUmVnaXN0cmF0aW9uXCI7XG5pbXBvcnQgeyBQcm9maWxlTGF5b3V0IH0gZnJvbSBcIi4uL1VJL0xheW91dHMvUHJvZmlsZVwiO1xuaW1wb3J0IHsgQ2hhbmdlUHJvZmlsZSB9IGZyb20gXCIuLi9VSS9MYXlvdXRzL0NoYW5nZVByb2ZpbGVcIjtcbmltcG9ydCB7IENoYW5nZVBhc3N3b3JkIH0gZnJvbSBcIi4uL1VJL0xheW91dHMvQ2hhbmdlUGFzc3dvcmRcIjtcbmltcG9ydCB7IFJvdXRlciB9IGZyb20gXCIuLi9saWJzL1JvdXRlclwiO1xuaW1wb3J0IHsgSFRUUFRyYW5zcG9ydCB9IGZyb20gXCIuLi9saWJzL1RyYW5zcG9ydFwiO1xuaW1wb3J0IHsgSUNoYXRWaWV3TW9kZWwgfSBmcm9tIFwiLi4vVmlld01vZGVsL0NoYXRWaWV3TW9kZWxcIjtcbmltcG9ydCB7IFZJRVdfTU9ERUwgfSBmcm9tIFwiLi4vVmlld01vZGVsXCI7XG5pbXBvcnQgeyBDb250YWluZXIgfSBmcm9tIFwiLi4vbGlicy9Db250YWluZXJcIjtcbmltcG9ydCB7IElVc2VyVmlld01vZGVsIH0gZnJvbSBcIi4uL1ZpZXdNb2RlbC9Vc2VyVmlld01vZGVsXCI7XG5cbmV4cG9ydCBjb25zdCBSb3V0ZXJJbml0ID0gKGNvbnRhaW5lcjogQ29udGFpbmVyKTogUm91dGVyID0+IHtcbiAgcmV0dXJuIG5ldyBSb3V0ZXIoXCIjcm9vdFwiKVxuICAgIC51c2UoXCIvXCIsIExvZ2luTGF5b3V0LCAoKSA9PiB7XG4gICAgICByZXR1cm4gSFRUUFRyYW5zcG9ydC5nZXRJbnN0YW5jZSgpXG4gICAgICAgIC5HRVQoXCIvYXV0aC91c2VyXCIpXG4gICAgICAgIC50aGVuKCh1c2VyKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UodXNlci5yZXNwb25zZSk7XG4gICAgICAgIH0pO1xuICAgIH0pXG4gICAgLnVzZShcIi9yZWdpc3RyYXRpb25cIiwgUmVnaXN0cmF0aW9uTGF5b3V0KVxuICAgIC51c2UoXCIvY2hhdFwiLCBDaGF0TGF5b3V0LCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCBjaGF0Vmlld01vZGVsID0gY29udGFpbmVyLmdldDxJQ2hhdFZpZXdNb2RlbD4oVklFV19NT0RFTC5DSEFUKTtcbiAgICAgIGF3YWl0IGNoYXRWaWV3TW9kZWwuZ2V0Q2hhdHMoKTtcbiAgICAgIHJldHVybiBjaGF0Vmlld01vZGVsLmNoYXRzO1xuICAgICAgcmV0dXJuIEhUVFBUcmFuc3BvcnQuZ2V0SW5zdGFuY2UoKVxuICAgICAgICAuR0VUKFwiL2NoYXRzXCIpXG4gICAgICAgIC50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgICBjb25zdCByZXNwID0gSlNPTi5wYXJzZShyZXN1bHQucmVzcG9uc2UpO1xuICAgICAgICAgIHJldHVybiByZXNwO1xuICAgICAgICB9KTtcbiAgICB9KVxuICAgIC51c2UoXCIvcHJvZmlsZVwiLCBQcm9maWxlTGF5b3V0LCBhc3luYyAoKSA9PiB7XG4gICAgICAvLyByZXR1cm4gSFRUUFRyYW5zcG9ydC5nZXRJbnN0YW5jZSgpXG4gICAgICAvLyAgIC5HRVQoXCIvYXV0aC91c2VyXCIpXG4gICAgICAvLyAgIC50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgIC8vICAgICBjb25zdCByZXNwID0gSlNPTi5wYXJzZShyZXN1bHQucmVzcG9uc2UpO1xuICAgICAgLy8gICAgIHJldHVybiByZXNwO1xuICAgICAgLy8gICB9KTtcbiAgICAgIGNvbnN0IHVzZXJWaWV3TW9kZWwgPSBjb250YWluZXIuZ2V0PElVc2VyVmlld01vZGVsPihWSUVXX01PREVMLlVTRVIpO1xuICAgICAgYXdhaXQgdXNlclZpZXdNb2RlbC5nZXRVc2VyKCk7XG4gICAgICByZXR1cm4gdXNlclZpZXdNb2RlbC51c2VyO1xuICAgIH0pXG4gICAgLnVzZShcIi9lZGl0cHJvZmlsZVwiLCBDaGFuZ2VQcm9maWxlLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCB1c2VyVmlld01vZGVsID0gY29udGFpbmVyLmdldDxJVXNlclZpZXdNb2RlbD4oVklFV19NT0RFTC5VU0VSKTtcbiAgICAgIGF3YWl0IHVzZXJWaWV3TW9kZWwuZ2V0VXNlcigpO1xuICAgICAgcmV0dXJuIHVzZXJWaWV3TW9kZWwudXNlcjtcbiAgICB9KVxuICAgIC51c2UoXCIvZWRpdHBhc3N3b3JkXCIsIENoYW5nZVBhc3N3b3JkKVxuICAgIC5zdGFydCgpO1xufTtcbiIsImV4cG9ydCBmdW5jdGlvbiBtZW1vaXplKGZ1bmMsIHJlc29sdmVyKSB7XG4gIGlmIChcbiAgICB0eXBlb2YgZnVuYyAhPSBcImZ1bmN0aW9uXCIgfHxcbiAgICAocmVzb2x2ZXIgIT0gbnVsbCAmJiB0eXBlb2YgcmVzb2x2ZXIgIT0gXCJmdW5jdGlvblwiKVxuICApIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEZVTkNfRVJST1JfVEVYVCk7XG4gIH1cbiAgdmFyIG1lbW9pemVkID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBhcmdzID0gYXJndW1lbnRzLFxuICAgICAga2V5ID0gcmVzb2x2ZXIgPyByZXNvbHZlci5hcHBseSh0aGlzLCBhcmdzKSA6IGFyZ3NbMF0sXG4gICAgICBjYWNoZSA9IG1lbW9pemVkLmNhY2hlO1xuXG4gICAgaWYgKGNhY2hlLmhhcyhrZXkpKSB7XG4gICAgICByZXR1cm4gY2FjaGUuZ2V0KGtleSk7XG4gICAgfVxuICAgIHZhciByZXN1bHQgPSBmdW5jLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIG1lbW9pemVkLmNhY2hlID0gY2FjaGUuc2V0KGtleSwgcmVzdWx0KSB8fCBjYWNoZTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuICBtZW1vaXplZC5jYWNoZSA9IG5ldyAobWVtb2l6ZS5DYWNoZSB8fCBNYXBDYWNoZSkoKTtcbiAgcmV0dXJuIG1lbW9pemVkO1xufVxuXG5tZW1vaXplLkNhY2hlID0gTWFwO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0aWYoX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSkge1xuXHRcdHJldHVybiBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxuX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2luZGV4LnRzXCIpO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==