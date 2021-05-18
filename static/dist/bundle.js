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
            displayName: data === null || data === void 0 ? void 0 : data.email,
            phone: data === null || data === void 0 ? void 0 : data.phone,
        },
        children: {
            save: Button_1.Button({
                title: "Сохранить",
                className: "profile_edit__action__save",
                onClick: (e) => {
                    const userViewModel = __1.container.get(ViewModel_1.VIEW_MODEL.USER);
                    console.log(userViewModel.user);
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
});


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
class Container {
    constructor() {
        this.containers = new Map();
        this.get = (id) => {
            const createContainerFn = this.containers.get(id);
            const createContainer = createContainerFn.fn(this);
            return createContainer;
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
    }
    parent(container) {
        for (let cont of container.containers) {
            this.containers.set(cont[0], cont[1]);
        }
        return this;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9Cb290c3RyYXAvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvQnVzc2luZXNMYXllci9DaGF0U2VydmljZS50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9CdXNzaW5lc0xheWVyL1VzZXJTZXJ2aWNlLnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL0J1c3NpbmVzTGF5ZXIvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvSW5mcmFzdHNydWN0dXJlTGF5ZXIvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvSW5mcmFzdHNydWN0dXJlTGF5ZXIvaW50ZXJmYWNlcy50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9JbnRlZ3JhdGlvbmFsTGF5ZXIvQ2hhdEFQSS50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9JbnRlZ3JhdGlvbmFsTGF5ZXIvVXNlckFQSS50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9JbnRlZ3JhdGlvbmFsTGF5ZXIvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvVUkvQ29tcG9uZW50cy9BdHRlbnRpb25NZXNzYWdlL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL1VJL0NvbXBvbmVudHMvQnV0dG9uL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL1VJL0NvbXBvbmVudHMvQ2hhdEl0ZW0vaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvVUkvQ29tcG9uZW50cy9DcmVhdGVDaGF0TW9kYWwvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvVUkvQ29tcG9uZW50cy9EZWxldGUvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvVUkvQ29tcG9uZW50cy9FbXB0eS9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9VSS9Db21wb25lbnRzL0lucHV0L2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL1VJL0xheW91dHMvQ2hhbmdlUGFzc3dvcmQvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvVUkvTGF5b3V0cy9DaGFuZ2VQcm9maWxlL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL1VJL0xheW91dHMvQ2hhdC9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9VSS9MYXlvdXRzL0xvZ2luL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL1VJL0xheW91dHMvUHJvZmlsZS9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9VSS9MYXlvdXRzL1JlZ2lzdHJhdGlvbi9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9WaWV3TW9kZWwvQ2hhdFZpZXdNb2RlbC9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9WaWV3TW9kZWwvVXNlclZpZXdNb2RlbC9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9WaWV3TW9kZWwvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvbGlicy9Db250YWluZXIvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvbGlicy9IWVBPL0hZUE8udHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvbGlicy9Sb3V0ZXIvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvbGlicy9UcmFuc3BvcnQvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvLi9zcmMvbGlicy9WYWxpZGF0b3JzL0VtYWlsL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL2xpYnMvVmFsaWRhdG9ycy9SZXF1aXJlZC9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9saWJzL3V0aWxzL2luZGV4LnRzIiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4Ly4vc3JjL3JvdXRlci9pbmRleC50cyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC8uL3NyYy9saWJzL21vbWl6ZS9pbmRleC5qcyIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vbWYubWVzc2VuZ2VyLnByYWt0aWt1bS55YW5kZXgvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9tZi5tZXNzZW5nZXIucHJha3Rpa3VtLnlhbmRleC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL21mLm1lc3Nlbmdlci5wcmFrdGlrdW0ueWFuZGV4L3dlYnBhY2svc3RhcnR1cCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQ0EseUhBQWtFO0FBQ2xFLG1IQUEyRDtBQUMzRCxvR0FBb0Q7QUFDcEQsd0ZBQWtEO0FBRWxELE1BQU0saUJBQWlCLEdBQUcsQ0FDeEIsdUJBQWtDLEVBQ2xDLHFCQUFnQyxFQUNoQyxnQkFBMkIsRUFDM0Isa0JBQTZCLEVBQzdCLEVBQUU7SUFDRixPQUFPLGtCQUFrQjtTQUN0QixNQUFNLENBQUMsZ0JBQWdCLENBQUM7U0FDeEIsTUFBTSxDQUFDLHFCQUFxQixDQUFDO1NBQzdCLE1BQU0sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBQ3JDLENBQUMsQ0FBQztBQUVGLE1BQWEsU0FBUztJQUVwQjtRQUNFLElBQUksQ0FBQyxTQUFTLEdBQUcsaUJBQWlCLENBQ2hDLDhDQUF1QixFQUN2Qix1Q0FBa0IsRUFDbEIsZ0NBQWdCLEVBQ2hCLDhCQUFrQixDQUNuQixDQUFDO0lBQ0osQ0FBQztDQUNGO0FBVkQsOEJBVUM7Ozs7Ozs7Ozs7Ozs7O0FDbkJELE1BQWEsV0FBVztJQUN0QixZQUFzQixTQUF5QjtRQUF6QixjQUFTLEdBQVQsU0FBUyxDQUFnQjtRQUUvQyxhQUFRLEdBQUcsR0FBNkIsRUFBRTtZQUN4QyxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDbkMsQ0FBQyxDQUFDO1FBRUYsYUFBUSxHQUFHLENBQUMsSUFBNEIsRUFBRSxFQUFFO1lBQzFDLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdkMsQ0FBQyxDQUFDO0lBUmdELENBQUM7SUFVbkQsVUFBVSxDQUFDLE1BQWM7UUFDdkIsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMzQyxDQUFDO0NBQ0Y7QUFkRCxrQ0FjQzs7Ozs7Ozs7Ozs7Ozs7QUNoQkQsTUFBYSxXQUFXO0lBQ3RCLFlBQXNCLFNBQXlCO1FBQXpCLGNBQVMsR0FBVCxTQUFTLENBQWdCO0lBQUcsQ0FBQztJQUNuRCxPQUFPO1FBQ0wsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ2xDLENBQUM7Q0FDRjtBQUxELGtDQUtDOzs7Ozs7Ozs7Ozs7OztBQ1pELG1IQUFtRDtBQUduRCxrR0FBOEM7QUFDOUMscUdBQTRDO0FBQzVDLHFHQUE0QztBQUUvQixlQUFPLEdBQUc7SUFDckIsSUFBSSxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDO0lBQy9CLElBQUksRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQztDQUNoQyxDQUFDO0FBRVcsd0JBQWdCLEdBQUcsSUFBSSxxQkFBUyxFQUFFLENBQUM7QUFFaEQsd0JBQWdCLENBQUMsSUFBSSxDQUFDLGVBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxTQUFTLEVBQUUsRUFBRTtJQUMvRCxNQUFNLFNBQVMsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFpQiwrQkFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2pFLE9BQU8sSUFBSSx5QkFBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3BDLENBQUMsQ0FBQyxDQUFDO0FBRUgsd0JBQWdCLENBQUMsSUFBSSxDQUFDLGVBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxTQUFTLEVBQUUsRUFBRTtJQUMvRCxNQUFNLFNBQVMsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFpQiwrQkFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2pFLE9BQU8sSUFBSSx5QkFBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3BDLENBQUMsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7OztBQ3RCSCxrR0FBOEM7QUFDOUMseUdBQXlDO0FBRTVCLDBCQUFrQixHQUFHO0lBQ2hDLFNBQVMsRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQztDQUM3QixDQUFDO0FBRVcsK0JBQXVCLEdBQUcsSUFBSSxxQkFBUyxFQUFFLENBQUM7QUFFdkQsK0JBQXVCO0tBQ3BCLElBQUksQ0FBQywwQkFBa0IsQ0FBQyxTQUFTLENBQUM7S0FDbEMsY0FBYyxDQUFDLENBQUMsU0FBUyxFQUFFLEVBQUU7SUFDNUIsT0FBTyxJQUFJLHNCQUFTLEVBQUUsQ0FBQztBQUN6QixDQUFDLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNiTCxrR0FBa0Q7QUFZbEQsTUFBYSxTQUFTO0lBQ3BCO1FBQ0EsWUFBTyxHQUFHLENBQUksR0FBVyxFQUFFLElBQTRCLEVBQWMsRUFBRTtZQUNyRSxPQUFPLHlCQUFhLENBQUMsV0FBVyxFQUFFO2lCQUMvQixHQUFHLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQzdCLElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFO2dCQUNmLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDckMsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUM7UUFFRixhQUFRLEdBQUcsQ0FDVCxHQUFXLEVBQ1gsSUFBTyxFQUNLLEVBQUU7WUFDZCxPQUFPLHlCQUFhLENBQUMsV0FBVyxFQUFFO2lCQUMvQixJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQzlCLElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFO2dCQUNmLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDckMsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLEVBQUM7UUFFRixlQUFVLEdBQUcsQ0FBQyxHQUFXLEVBQUUsSUFBNEIsRUFBaUIsRUFBRTtZQUN4RSxPQUFPLHlCQUFhLENBQUMsV0FBVyxFQUFFO2lCQUMvQixNQUFNLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQ2hDLElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFO2dCQUNmLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDckMsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUM7UUFFRixZQUFPLEdBQUcsQ0FBSSxHQUFXLEVBQUUsSUFBNEIsRUFBYyxFQUFFO1lBQ3JFLE9BQU8seUJBQWEsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNuRSxDQUFDLENBQUM7SUE5QmEsQ0FBQztJQWdDUixRQUFRLENBQ2QsSUFBTztRQUVQLE9BQU87WUFDTCxPQUFPLEVBQUU7Z0JBQ1AsY0FBYyxFQUFFLGtCQUFrQjthQUNuQztZQUNELElBQUksb0JBQ0MsSUFBSSxDQUNSO1NBQ0YsQ0FBQztJQUNKLENBQUM7Q0FDRjtBQTdDRCw4QkE2Q0M7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDaERELE1BQWEsYUFBYTtJQUN4QixZQUFzQixTQUFxQjtRQUFyQixjQUFTLEdBQVQsU0FBUyxDQUFZO1FBRTNDLGFBQVEsR0FBRyxHQUFtQyxFQUFFO1lBQzlDLE9BQU8sTUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBYSxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUNoRSxDQUFDLE1BQU0sRUFBRSxFQUFFO2dCQUNULE9BQU8sTUFBTSxDQUFDO1lBQ2hCLENBQUMsQ0FDRixDQUFDO1FBQ0osQ0FBQyxFQUFDO1FBRUYsYUFBUSxHQUFHLENBQU8sSUFBNEIsRUFBaUIsRUFBRTtZQUMvRCxNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNoRCxDQUFDLEVBQUM7SUFaNEMsQ0FBQztJQWMvQyxVQUFVLENBQUMsRUFBVTtRQUNuQixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQzdELENBQUM7Q0FDRjtBQWxCRCxzQ0FrQkM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDcEJELE1BQWEsYUFBYTtJQUN4QixZQUFzQixTQUFxQjtRQUFyQixjQUFTLEdBQVQsU0FBUyxDQUFZO1FBQzNDLFlBQU8sR0FBRyxHQUFTLEVBQUU7WUFDbkIsTUFBTSxJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBYyxZQUFZLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDekUsT0FBTyxJQUFJLENBQUM7UUFDZCxDQUFDLEVBQUM7SUFKNEMsQ0FBQztDQUtoRDtBQU5ELHNDQU1DOzs7Ozs7Ozs7Ozs7OztBQ2JELGtHQUE4QztBQUM5Qyx5SEFBNkQ7QUFDN0QsOEZBQTBDO0FBRzFDLDhGQUEwQztBQUU3QixrQkFBVSxHQUFHO0lBQ3hCLElBQUksRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQztJQUNqQyxJQUFJLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUM7Q0FDbEMsQ0FBQztBQUVXLDBCQUFrQixHQUFHLElBQUkscUJBQVMsRUFBRSxDQUFDO0FBRWxELDBCQUFrQixDQUFDLElBQUksQ0FBQyxrQkFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLFNBQVMsRUFBRSxFQUFFO0lBQ3BFLE1BQU0sU0FBUyxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQWEseUNBQWtCLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDMUUsT0FBTyxJQUFJLHVCQUFhLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDdEMsQ0FBQyxDQUFDLENBQUM7QUFFSCwwQkFBa0IsQ0FBQyxJQUFJLENBQUMsa0JBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxTQUFTLEVBQUUsRUFBRTtJQUNwRSxNQUFNLFNBQVMsR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFhLHlDQUFrQixDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzFFLE9BQU8sSUFBSSx1QkFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3RDLENBQUMsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7OztBQ3RCSCw2RkFBK0M7QUFFeEMsTUFBTSxnQkFBZ0IsR0FBRyxHQUFTLEVBQUU7SUFDekMsT0FBTyxJQUFJLFdBQUksQ0FBQztRQUNkLFlBQVksRUFBRSx5QkFBeUI7UUFDdkMsSUFBSSxFQUFFO1lBQ0osT0FBTyxFQUFFLEVBQUU7U0FDWjtRQUNELFFBQVEsRUFBRSxFQUFFO0tBQ2IsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDO0FBUlcsd0JBQWdCLG9CQVEzQjs7Ozs7Ozs7Ozs7Ozs7QUNWRiw2RkFBK0M7QUFDL0MsNEZBQTZDO0FBU3RDLE1BQU0sTUFBTSxHQUFHLENBQUMsS0FBYSxFQUFFLEVBQUU7SUFDdEMsTUFBTSxFQUFFLEdBQUcsS0FBSyxDQUFDLEVBQUUsSUFBSSxjQUFNLEVBQUUsQ0FBQztJQUNoQyxPQUFPLElBQUksV0FBSSxDQUFDO1FBQ2QsWUFBWSxFQUFFLHNCQUFzQjtRQUNwQyxJQUFJLEVBQUU7WUFDSixFQUFFLEVBQUUsRUFBRTtZQUNOLEtBQUssRUFBRSxLQUFLLENBQUMsS0FBSztZQUNsQixTQUFTLEVBQUUsS0FBSyxDQUFDLFNBQVM7U0FDM0I7S0FDRixDQUFDLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRTs7UUFDbEIsY0FBUSxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsMENBQUUsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUU7WUFDM0QsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuQixDQUFDLEVBQUU7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQztBQWRXLGNBQU0sVUFjakI7Ozs7Ozs7Ozs7Ozs7O0FDeEJGLGtFQUE2QztBQUM3QywrRkFBZ0Q7QUFDaEQsNkZBQStDO0FBRS9DLDZGQUFtQztBQUNuQyw4RkFBZ0Q7QUFjekMsTUFBTSxRQUFRLEdBQUcsQ0FBQyxLQUFlLEVBQUUsRUFBRTtJQUMxQyxPQUFPLElBQUksV0FBSSxDQUFDO1FBQ2QsWUFBWSxFQUFFLHdCQUF3QjtRQUN0QyxJQUFJLEVBQUU7WUFDSixRQUFRLEVBQUUsS0FBSyxDQUFDLEtBQUs7WUFDckIsUUFBUSxFQUFFLEtBQUssQ0FBQyxVQUFVLElBQUksT0FBTztZQUNyQyxXQUFXLEVBQUUsS0FBSyxDQUFDLEVBQUUsSUFBSSxrQkFBa0I7WUFDM0MsaUJBQWlCLEVBQUUsS0FBSyxDQUFDLE1BQU0sSUFBSSxDQUFDO1NBQ3JDO1FBQ0QsUUFBUSxFQUFFO1lBQ1IsTUFBTSxFQUFFLGVBQU0sQ0FBQztnQkFDYixFQUFFLEVBQUUsYUFBYSxLQUFLLENBQUMsRUFBRSxFQUFFO2dCQUMzQixPQUFPLEVBQUUsR0FBRyxFQUFFO29CQUNaLE1BQU0sYUFBYSxHQUFHLGFBQVMsQ0FBQyxHQUFHLENBQWlCLHNCQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ3JFLGFBQWEsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUU7d0JBQ25ELGlCQUFVLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO29CQUMzQyxDQUFDLENBQUMsQ0FBQztnQkFDTCxDQUFDO2FBQ0YsQ0FBQztTQUNIO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDO0FBckJXLGdCQUFRLFlBcUJuQjs7Ozs7Ozs7Ozs7Ozs7QUN4Q0Ysa0VBQXFDO0FBQ3JDLDZGQUErQztBQUMvQywySEFBNkQ7QUFDN0QsMkhBQXVEO0FBQ3ZELDZGQUFtQztBQUNuQywwRkFBaUM7QUFFakMsK0ZBQWdEO0FBQ2hELDhGQUFnRDtBQUV6QyxNQUFNLGVBQWUsR0FBRyxHQUFHLEVBQUU7SUFDbEMsTUFBTSxnQkFBZ0IsR0FBRyxtQ0FBZ0IsRUFBRSxDQUFDO0lBQzVDLE1BQU0sS0FBSyxHQUFHLGdCQUFnQixDQUFDLFFBQVEsRUFBRSxDQUFDO0lBRTFDLElBQUksUUFBUSxHQUFHLEVBQUUsQ0FBQztJQUVsQixPQUFPLElBQUksV0FBSSxDQUFDO1FBQ2QsWUFBWSxFQUFFLCtCQUErQjtRQUM3QyxJQUFJLEVBQUUsRUFBRTtRQUNSLFFBQVEsRUFBRTtZQUNSLEtBQUssRUFBRSxhQUFLLENBQUM7Z0JBQ1gsS0FBSyxFQUFFLFdBQVc7Z0JBQ2xCLElBQUksRUFBRSxNQUFNO2dCQUNaLElBQUksRUFBRSxVQUFVO2dCQUNoQixFQUFFLEVBQUUsVUFBVTtnQkFDZCxTQUFTLEVBQUUsa0JBQWtCO2dCQUM3QixjQUFjLEVBQUUsZ0JBQWdCO2dCQUNoQyxNQUFNLEVBQUUsQ0FBQyxDQUFRLEVBQUUsRUFBRTtvQkFDbkIsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLE1BQTBCLENBQUM7b0JBQzNDLElBQUksbUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFO3dCQUNuQyxLQUFLLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQzt3QkFDbkIsUUFBUSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7cUJBQ3hCO3lCQUFNO3dCQUNMLEtBQUssQ0FBQyxPQUFPLEdBQUcscUJBQXFCLENBQUM7cUJBQ3ZDO2dCQUNILENBQUM7YUFDRixDQUFDO1lBQ0YsTUFBTSxFQUFFLGVBQU0sQ0FBQztnQkFDYixLQUFLLEVBQUUsU0FBUztnQkFDaEIsU0FBUyxFQUFFLGVBQWU7Z0JBQzFCLE9BQU8sRUFBRSxDQUFDLENBQVEsRUFBRSxFQUFFO29CQUNwQixJQUFJLENBQUMsUUFBUSxFQUFFO3dCQUNiLEtBQUssQ0FBQyxPQUFPLEdBQUcscUJBQXFCLENBQUM7cUJBQ3ZDO3lCQUFNO3dCQUNMLE1BQU0sYUFBYSxHQUFHLGFBQVMsQ0FBQyxHQUFHLENBQ2pDLHNCQUFVLENBQUMsSUFBSSxDQUNoQixDQUFDO3dCQUNGLGFBQWEsQ0FBQyxRQUFRLENBQUMsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFOzRCQUNwRCxRQUFRO2lDQUNMLHNCQUFzQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQ0FDdEMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQzs0QkFDM0IsaUJBQVUsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7d0JBQzNDLENBQUMsQ0FBQyxDQUFDO3FCQUNKO2dCQUNILENBQUM7YUFDRixDQUFDO1lBQ0YsTUFBTSxFQUFFLGVBQU0sQ0FBQztnQkFDYixLQUFLLEVBQUUsUUFBUTtnQkFDZixTQUFTLEVBQUUsZUFBZTtnQkFDMUIsT0FBTyxFQUFFLENBQUMsQ0FBUSxFQUFFLEVBQUU7b0JBQ3BCLFFBQVE7eUJBQ0wsc0JBQXNCLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO3lCQUN0QyxTQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2dCQUM3QixDQUFDO2FBQ0YsQ0FBQztTQUNIO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDO0FBekRXLHVCQUFlLG1CQXlEMUI7Ozs7Ozs7Ozs7Ozs7O0FDbkVGLDZGQUErQztBQU14QyxNQUFNLE1BQU0sR0FBRyxDQUFDLEtBQWEsRUFBRSxFQUFFO0lBQ3RDLE9BQU8sSUFBSSxXQUFJLENBQUM7UUFDZCxZQUFZLEVBQUUsc0JBQXNCO1FBQ3BDLElBQUksRUFBRTtZQUNKLElBQUksRUFBRSxtQkFBbUI7WUFDekIsRUFBRSxFQUFFLEtBQUssQ0FBQyxFQUFFO1NBQ2I7UUFDRCxRQUFRLEVBQUUsRUFBRTtLQUNiLENBQUMsQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFOztRQUNsQixjQUFRLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsMENBQUUsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtZQUNoRSxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDbEIsQ0FBQyxFQUFFO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUM7QUFiVyxjQUFNLFVBYWpCOzs7Ozs7Ozs7Ozs7OztBQ25CRiw2RkFBK0M7QUFFeEMsTUFBTSxLQUFLLEdBQUcsR0FBRyxFQUFFO0lBQ3hCLE9BQU8sSUFBSSxXQUFJLENBQUM7UUFDZCxZQUFZLEVBQUUscUJBQXFCO1FBQ25DLElBQUksRUFBRSxFQUFFO0tBQ1QsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDO0FBTFcsYUFBSyxTQUtoQjs7Ozs7Ozs7Ozs7Ozs7QUNQRiw2RkFBK0M7QUFDL0MsMEZBQWlDO0FBYWpDLGlEQUFpRDtBQUUxQyxNQUFNLEtBQUssR0FBRyxDQUFDLEtBQWEsRUFBRSxFQUFFO0lBQ3JDLE9BQU8sSUFBSSxXQUFJLENBQUM7UUFDZCxZQUFZLEVBQUUscUJBQXFCO1FBQ25DLElBQUksRUFBRTtZQUNKLEtBQUssRUFBRTtnQkFDTCxJQUFJLEVBQUUsS0FBSyxDQUFDLEtBQUs7YUFDbEI7WUFDRCxRQUFRLEVBQUU7Z0JBQ1IsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJO2dCQUNoQixJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUk7Z0JBQ2hCLEVBQUUsRUFBRSxLQUFLLENBQUMsRUFBRTtnQkFDWixTQUFTLEVBQUUsS0FBSyxDQUFDLFNBQVM7YUFDM0I7U0FDRjtRQUNELFFBQVEsRUFBRTtZQUNSLFNBQVMsRUFBRSxLQUFLLENBQUMsY0FBYyxJQUFJLGFBQUssRUFBRTtTQUMzQztLQUNGLENBQUMsQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFOztRQUNsQixjQUFRO2FBQ0wsY0FBYyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsMENBQ3ZCLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxDQUFDLENBQWEsRUFBRSxFQUFFOztZQUM1QyxNQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsTUFBMEIsQ0FBQztZQUMzQyxNQUFNLFVBQVUsZUFBRyxLQUFLLENBQUMsYUFBYSwwQ0FBRSxhQUFhLDBDQUFFLGFBQWEsQ0FDbEUsb0JBQW9CLENBQ3JCLENBQUM7WUFDRixVQUFVLGFBQVYsVUFBVSx1QkFBVixVQUFVLENBQUUsU0FBUyxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsRUFBRTtZQUN0RCxXQUFLLENBQUMsT0FBTywrQ0FBYixLQUFLLEVBQVcsQ0FBQyxFQUFFO1FBQ3JCLENBQUMsRUFBRTtRQUNMLGNBQVEsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQywwQ0FBRSxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFRLEVBQUUsRUFBRTs7WUFDdkUsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLE1BQTBCLENBQUM7WUFDM0MsTUFBTSxVQUFVLGVBQUcsS0FBSyxDQUFDLGFBQWEsMENBQUUsYUFBYSwwQ0FBRSxhQUFhLENBQ2xFLG9CQUFvQixDQUNyQixDQUFDO1lBQ0YsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUU7Z0JBQ2hCLFVBQVUsYUFBVixVQUFVLHVCQUFWLFVBQVUsQ0FBRSxTQUFTLENBQUMsTUFBTSxDQUFDLDBCQUEwQixFQUFFO2FBQzFEO1lBQ0QsV0FBSyxDQUFDLE1BQU0sK0NBQVosS0FBSyxFQUFVLENBQUMsRUFBRTtRQUNwQixDQUFDLEVBQUU7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQztBQXZDVyxhQUFLLFNBdUNoQjs7Ozs7Ozs7Ozs7Ozs7QUN2REYsNkZBQStDO0FBQy9DLGtFQUFrQztBQUNsQywyR0FBaUQ7QUFDakQsK0ZBQStDO0FBRWxDLHNCQUFjLEdBQUcsZ0JBQU8sQ0FBQyxHQUFHLEVBQUU7SUFDekMsT0FBTyxJQUFJLFdBQUksQ0FBQztRQUNkLFFBQVEsRUFBRSxRQUFRLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxJQUFJLFFBQVEsQ0FBQyxJQUFJO1FBQzNELFlBQVksRUFBRSw4QkFBOEI7UUFDNUMsSUFBSSxFQUFFLEVBQUU7UUFDUixRQUFRLEVBQUU7WUFDUixJQUFJLEVBQUUsZUFBTSxDQUFDO2dCQUNYLEtBQUssRUFBRSxXQUFXO2dCQUNsQixTQUFTLEVBQUUsNkJBQTZCO2dCQUN4QyxPQUFPLEVBQUUsQ0FBQyxDQUFRLEVBQUUsRUFBRTtvQkFDcEIsVUFBTSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDeEIsQ0FBQzthQUNGLENBQUM7U0FDSDtLQUNGLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7OztBQ3BCSCw2RkFBK0M7QUFDL0Msa0VBQTZDO0FBQzdDLDJHQUFpRDtBQUdqRCw4RkFBZ0Q7QUFFekMsTUFBTSxhQUFhLEdBQUcsQ0FBQyxJQUFpQixFQUFFLEVBQUU7SUFDakQsT0FBTyxJQUFJLFdBQUksQ0FBQztRQUNkLFFBQVEsRUFBRSxRQUFRLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxJQUFJLFFBQVEsQ0FBQyxJQUFJO1FBQzFELFlBQVksRUFBRSw2QkFBNkI7UUFDM0MsSUFBSSxFQUFFO1lBQ0osS0FBSyxFQUFFLElBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxLQUFLO1lBQ2xCLEtBQUssRUFBRSxJQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsS0FBSztZQUNsQixTQUFTLEVBQUUsSUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLFVBQVU7WUFDM0IsVUFBVSxFQUFFLElBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxXQUFXO1lBQzdCLFdBQVcsRUFBRSxJQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsS0FBSztZQUN4QixLQUFLLEVBQUUsSUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLEtBQUs7U0FDbkI7UUFDRCxRQUFRLEVBQUU7WUFDUixJQUFJLEVBQUUsZUFBTSxDQUFDO2dCQUNYLEtBQUssRUFBRSxXQUFXO2dCQUNsQixTQUFTLEVBQUUsNEJBQTRCO2dCQUN2QyxPQUFPLEVBQUUsQ0FBQyxDQUFRLEVBQUUsRUFBRTtvQkFDcEIsTUFBTSxhQUFhLEdBQUcsYUFBUyxDQUFDLEdBQUcsQ0FBaUIsc0JBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDckUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2xDLENBQUM7YUFDRixDQUFDO1NBQ0g7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDLENBQUM7QUF2QlcscUJBQWEsaUJBdUJ4Qjs7Ozs7Ozs7Ozs7Ozs7QUM5QkYsNkZBQStDO0FBQy9DLGlIQUErRDtBQUMvRCxrRUFBa0M7QUFDbEMsMkdBQWlEO0FBQ2pELHdHQUErQztBQUMvQyxzSUFBbUU7QUFFNUQsTUFBTSxVQUFVLEdBQUcsQ0FBQyxNQUFrQixFQUFFLEVBQUU7SUFDL0MsTUFBTSxZQUFZLEdBQVcsRUFBRSxDQUFDO0lBQ2hDLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRTtRQUN6QixNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBUyxFQUFFLEVBQUU7WUFDM0IsWUFBWSxDQUFDLElBQUksQ0FBQyxtQkFBUSxtQkFBTSxJQUFJLEVBQUcsQ0FBQyxDQUFDO1FBQzNDLENBQUMsQ0FBQyxDQUFDO0tBQ0o7U0FBTTtRQUNMLFlBQVksQ0FBQyxJQUFJLENBQUMsYUFBSyxFQUFFLENBQUMsQ0FBQztLQUM1QjtJQUVELE9BQU8sSUFBSSxXQUFJLENBQUM7UUFDZCxRQUFRLEVBQUUsUUFBUSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsSUFBSSxRQUFRLENBQUMsSUFBSTtRQUMxRCxZQUFZLEVBQUUsb0JBQW9CO1FBQ2xDLElBQUksRUFBRSxFQUFFO1FBQ1IsUUFBUSxFQUFFO1lBQ1IsV0FBVyxFQUFFLGVBQU0sQ0FBQztnQkFDbEIsS0FBSyxFQUFFLFNBQVM7Z0JBQ2hCLFNBQVMsRUFBRSxzQkFBc0I7Z0JBQ2pDLE9BQU8sRUFBRSxDQUFDLENBQVEsRUFBRSxFQUFFO29CQUNwQixVQUFNLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUN4QixDQUFDO2FBQ0YsQ0FBQztZQUNGLFFBQVEsRUFBRSxZQUFZO1lBQ3RCLGVBQWUsRUFBRSxpQ0FBZSxFQUFFO1lBQ2xDLGdCQUFnQixFQUFFLGVBQU0sQ0FBQztnQkFDdkIsS0FBSyxFQUFFLEdBQUc7Z0JBQ1YsU0FBUyxFQUFFLDhCQUE4QjtnQkFDekMsT0FBTyxFQUFFLEdBQUcsRUFBRTtvQkFDWixRQUFRO3lCQUNMLHNCQUFzQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQzt5QkFDdEMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDaEMsQ0FBQzthQUNGLENBQUM7U0FDSDtLQUNGLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQztBQW5DVyxrQkFBVSxjQW1DckI7Ozs7Ozs7Ozs7Ozs7O0FDMUNGLHdHQUErQztBQUMvQywySEFBNkQ7QUFDN0QseUlBQXFFO0FBQ3JFLDRFQUF3QztBQUN4Qyx3R0FBd0Q7QUFDeEQsNkZBQStDO0FBQy9DLDJHQUFpRDtBQUdqRDs7R0FFRztBQUVJLE1BQU0sV0FBVyxHQUFHLENBQUMsSUFBaUIsRUFBUSxFQUFFO0lBQ3JELElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxFQUFFLEVBQUU7UUFDbkIsY0FBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUNwQjtJQUVELE1BQU0sY0FBYyxHQUFHLG1DQUFnQixFQUFFLENBQUM7SUFDMUMsTUFBTSxtQkFBbUIsR0FBRyxjQUFjLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDdEQsTUFBTSxhQUFhLEdBQUcsbUNBQWdCLEVBQUUsQ0FBQztJQUN6QyxNQUFNLGtCQUFrQixHQUFHLGFBQWEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUVwRCxNQUFNLFFBQVEsR0FBMkIsRUFBRSxDQUFDO0lBQzVDLE9BQU8sSUFBSSxXQUFJLENBQUM7UUFDZCxRQUFRLEVBQUUsUUFBUSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsSUFBSSxRQUFRLENBQUMsSUFBSTtRQUMxRCxZQUFZLEVBQUUscUJBQXFCO1FBQ25DLElBQUksRUFBRTtZQUNKLFFBQVEsRUFBRSxNQUFNO1NBQ2pCO1FBQ0QsUUFBUSxFQUFFO1lBQ1IsVUFBVSxFQUFFLGFBQUssQ0FBQztnQkFDaEIsS0FBSyxFQUFFLE9BQU87Z0JBQ2QsSUFBSSxFQUFFLE1BQU07Z0JBQ1osSUFBSSxFQUFFLE9BQU87Z0JBQ2IsRUFBRSxFQUFFLGtCQUFrQjtnQkFDdEIsU0FBUyxFQUFFLHdCQUF3QjtnQkFDbkMsTUFBTSxFQUFFLENBQUMsQ0FBUSxFQUFFLEVBQUU7b0JBQ25CLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQyxNQUEwQixDQUFDO29CQUMzQyxNQUFNLEtBQUssR0FBRyxtQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLGFBQUwsS0FBSyx1QkFBTCxLQUFLLENBQUUsS0FBSyxDQUFDLENBQUM7b0JBQy9DLElBQUksQ0FBQyxLQUFLLEVBQUU7d0JBQ1YsbUJBQW1CLENBQUMsT0FBTyxHQUFHLHFCQUFxQixDQUFDO3FCQUNyRDt5QkFBTTt3QkFDTCxtQkFBbUIsQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO3dCQUNqQyxRQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQztxQkFDakM7Z0JBQ0gsQ0FBQztnQkFDRCxjQUFjLEVBQUUsY0FBYzthQUMvQixDQUFDO1lBQ0YsYUFBYSxFQUFFLGFBQUssQ0FBQztnQkFDbkIsS0FBSyxFQUFFLFFBQVE7Z0JBQ2YsSUFBSSxFQUFFLFVBQVU7Z0JBQ2hCLElBQUksRUFBRSxVQUFVO2dCQUNoQixFQUFFLEVBQUUscUJBQXFCO2dCQUN6QixTQUFTLEVBQUUsd0JBQXdCO2dCQUNuQyxNQUFNLEVBQUUsQ0FBQyxDQUFRLEVBQUUsRUFBRTtvQkFDbkIsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLE1BQTBCLENBQUM7b0JBQzNDLElBQUksQ0FBQyxtQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUU7d0JBQ3BDLGtCQUFrQixDQUFDLE9BQU8sR0FBRyxxQkFBcUIsQ0FBQztxQkFDcEQ7eUJBQU07d0JBQ0wsa0JBQWtCLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQzt3QkFDaEMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7cUJBQ3BDO2dCQUNILENBQUM7Z0JBQ0QsY0FBYyxFQUFFLGFBQWE7YUFDOUIsQ0FBQztZQUNGLE1BQU0sRUFBRSxlQUFNLENBQUM7Z0JBQ2IsS0FBSyxFQUFFLGdCQUFnQjtnQkFDdkIsU0FBUyxFQUFFLGFBQWE7Z0JBQ3hCLE9BQU8sRUFBRSxDQUFDLENBQVEsRUFBRSxFQUFFO29CQUNwQixNQUFNLElBQUksR0FBOEM7d0JBQ3RELElBQUksRUFBRTs0QkFDSixLQUFLLEVBQUUsUUFBUSxDQUFDLEtBQUs7NEJBQ3JCLFFBQVEsRUFBRSxRQUFRLENBQUMsUUFBUTt5QkFDNUI7d0JBQ0QsT0FBTyxFQUFFOzRCQUNQLGNBQWMsRUFBRSxrQkFBa0I7eUJBQ25DO3FCQUNGLENBQUM7b0JBQ0YseUJBQWEsQ0FBQyxXQUFXLEVBQUU7eUJBQ3hCLElBQUksQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDO3lCQUMxQixJQUFJLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRTt3QkFDZixJQUFJLE1BQU0sQ0FBQyxNQUFNLEdBQUcsR0FBRyxFQUFFOzRCQUN2QixjQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDO3lCQUNwQjtvQkFDSCxDQUFDLENBQUMsQ0FBQztnQkFDUCxDQUFDO2FBQ0YsQ0FBQztZQUNGLGtCQUFrQixFQUFFLGVBQU0sQ0FBQztnQkFDekIsS0FBSyxFQUFFLG9CQUFvQjtnQkFDM0IsU0FBUyxFQUFFLFdBQVc7Z0JBQ3RCLE9BQU8sRUFBRSxDQUFDLENBQVEsRUFBRSxFQUFFO29CQUNwQixjQUFNLENBQUMsRUFBRSxDQUFDLGVBQWUsQ0FBQyxDQUFDO2dCQUM3QixDQUFDO2FBQ0YsQ0FBQztTQUNIO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDO0FBcEZXLG1CQUFXLGVBb0Z0Qjs7Ozs7Ozs7Ozs7Ozs7QUNqR0YsNkZBQStDO0FBQy9DLDJHQUFpRDtBQUNqRCxrRUFBa0M7QUFDbEMsd0dBQXdEO0FBWWpELE1BQU0sYUFBYSxHQUFHLENBQUMsSUFBaUIsRUFBRSxFQUFFO0lBQ2pELE9BQU8sSUFBSSxXQUFJLENBQUM7UUFDZCxRQUFRLEVBQWUsUUFBUSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUM7UUFDdEQsWUFBWSxFQUFFLHVCQUF1QjtRQUNyQyxJQUFJLG9CQUNDLElBQUksQ0FDUjtRQUNELFFBQVEsRUFBRTtZQUNSLGVBQWUsRUFBRSxlQUFNLENBQUM7Z0JBQ3RCLEtBQUssRUFBRSxpQkFBaUI7Z0JBQ3hCLFNBQVMsRUFBRSx3QkFBd0I7Z0JBQ25DLE9BQU8sRUFBRSxHQUFHLEVBQUU7b0JBQ1osVUFBTSxDQUFDLEVBQUUsQ0FBQyxjQUFjLENBQUMsQ0FBQztnQkFDNUIsQ0FBQzthQUNGLENBQUM7WUFDRixnQkFBZ0IsRUFBRSxlQUFNLENBQUM7Z0JBQ3ZCLEtBQUssRUFBRSxpQkFBaUI7Z0JBQ3hCLFNBQVMsRUFBRSx5QkFBeUI7Z0JBQ3BDLE9BQU8sRUFBRSxHQUFHLEVBQUU7b0JBQ1osVUFBTSxDQUFDLEVBQUUsQ0FBQyxlQUFlLENBQUMsQ0FBQztnQkFDN0IsQ0FBQzthQUNGLENBQUM7WUFDRixRQUFRLEVBQUUsZUFBTSxDQUFDO2dCQUNmLEtBQUssRUFBRSxPQUFPO2dCQUNkLFNBQVMsRUFBRSxjQUFjO2dCQUN6QixPQUFPLEVBQUUsR0FBRyxFQUFFO29CQUNaLFVBQU0sQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ3JCLENBQUM7YUFDRixDQUFDO1lBQ0YsUUFBUSxFQUFFLGVBQU0sQ0FBQztnQkFDZixLQUFLLEVBQUUsT0FBTztnQkFDZCxTQUFTLEVBQUUsY0FBYztnQkFDekIsT0FBTyxFQUFFLEdBQUcsRUFBRTtvQkFDWix5QkFBYSxDQUFDLFdBQVcsRUFBRTt5QkFDeEIsSUFBSSxDQUFDLGNBQWMsQ0FBQzt5QkFDcEIsSUFBSSxDQUFDLEdBQUcsRUFBRTt3QkFDVCxVQUFNLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUNqQixDQUFDLENBQUMsQ0FBQztnQkFDUCxDQUFDO2FBQ0YsQ0FBQztTQUNIO0tBQ0YsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDO0FBMUNXLHFCQUFhLGlCQTBDeEI7Ozs7Ozs7Ozs7Ozs7O0FDekRGLDZGQUErQztBQUMvQyx3R0FBK0M7QUFHL0Msa0hBQWdFO0FBQ2hFLDJIQUE2RDtBQUM3RCx5SUFBcUU7QUFFckUsa0VBQWtDO0FBQ2xDLHdHQUF3RDtBQUN4RCwyR0FBaUQ7QUFFMUMsTUFBTSxrQkFBa0IsR0FBRyxHQUFHLEVBQUU7SUFDckMsTUFBTSxjQUFjLEdBQUcsbUNBQWdCLEVBQUUsQ0FBQztJQUMxQyxNQUFNLGNBQWMsR0FBRyxtQ0FBZ0IsRUFBRSxDQUFDO0lBQzFDLE1BQU0saUJBQWlCLEdBQUcsbUNBQWdCLEVBQUUsQ0FBQztJQUM3QyxNQUFNLHVCQUF1QixHQUFHLG1DQUFnQixFQUFFLENBQUM7SUFDbkQsTUFBTSxrQkFBa0IsR0FBRyxtQ0FBZ0IsRUFBRSxDQUFDO0lBQzlDLE1BQU0sbUJBQW1CLEdBQUcsbUNBQWdCLEVBQUUsQ0FBQztJQUMvQyxNQUFNLGNBQWMsR0FBRyxtQ0FBZ0IsRUFBRSxDQUFDO0lBRTFDLE1BQU0sUUFBUSxHQUEyQixFQUFFLENBQUM7SUFFNUMsT0FBTyxJQUFJLFdBQUksQ0FBQztRQUNkLFFBQVEsRUFBZSxRQUFRLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQztRQUN0RCxZQUFZLEVBQUUsNEJBQTRCO1FBQzFDLElBQUksRUFBRTtZQUNKLFNBQVMsRUFBRSxhQUFhO1NBQ3pCO1FBQ0QsUUFBUSxFQUFFO1lBQ1IsVUFBVSxFQUFFLGFBQUssQ0FBQztnQkFDaEIsS0FBSyxFQUFFLE9BQU87Z0JBQ2QsSUFBSSxFQUFFLE1BQU07Z0JBQ1osSUFBSSxFQUFFLE9BQU87Z0JBQ2IsRUFBRSxFQUFFLG9CQUFvQjtnQkFDeEIsU0FBUyxFQUFFLHNCQUFzQjtnQkFDakMsY0FBYyxFQUFFLGNBQWM7Z0JBQzlCLE1BQU0sRUFBRSxDQUFDLENBQVEsRUFBRSxFQUFFO29CQUNuQixNQUFNLEtBQUssR0FBRyxjQUFjLENBQUMsUUFBUSxFQUFFLENBQUM7b0JBQ3hDLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQyxNQUEwQixDQUFDO29CQUMzQyxJQUFJLHNCQUFjLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRTt3QkFDekMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7d0JBQ2hDLEtBQUssQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO3FCQUNwQjt5QkFBTTt3QkFDTCxLQUFLLENBQUMsT0FBTyxHQUFHLDRDQUE0QyxDQUFDO3FCQUM5RDtnQkFDSCxDQUFDO2FBQ0YsQ0FBQztZQUNGLFVBQVUsRUFBRSxhQUFLLENBQUM7Z0JBQ2hCLEtBQUssRUFBRSxPQUFPO2dCQUNkLElBQUksRUFBRSxNQUFNO2dCQUNaLElBQUksRUFBRSxPQUFPO2dCQUNiLEVBQUUsRUFBRSxvQkFBb0I7Z0JBQ3hCLFNBQVMsRUFBRSxzQkFBc0I7Z0JBQ2pDLGNBQWMsRUFBRSxjQUFjO2dCQUM5QixNQUFNLEVBQUUsQ0FBQyxDQUFRLEVBQUUsRUFBRTtvQkFDbkIsTUFBTSxLQUFLLEdBQUcsY0FBYyxDQUFDLFFBQVEsRUFBRSxDQUFDO29CQUN4QyxNQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsTUFBMEIsQ0FBQztvQkFDM0MsSUFBSSxtQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUU7d0JBQ25DLFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO3dCQUNoQyxLQUFLLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztxQkFDcEI7eUJBQU07d0JBQ0wsS0FBSyxDQUFDLE9BQU8sR0FBRyxxQkFBcUIsQ0FBQztxQkFDdkM7Z0JBQ0gsQ0FBQzthQUNGLENBQUM7WUFDRixTQUFTLEVBQUUsYUFBSyxDQUFDO2dCQUNmLEtBQUssRUFBRSxLQUFLO2dCQUNaLElBQUksRUFBRSxNQUFNO2dCQUNaLElBQUksRUFBRSxZQUFZO2dCQUNsQixFQUFFLEVBQUUseUJBQXlCO2dCQUM3QixTQUFTLEVBQUUsc0JBQXNCO2dCQUNqQyxjQUFjLEVBQUUsa0JBQWtCO2dCQUNsQyxNQUFNLEVBQUUsQ0FBQyxDQUFRLEVBQUUsRUFBRTtvQkFDbkIsTUFBTSxLQUFLLEdBQUcsa0JBQWtCLENBQUMsUUFBUSxFQUFFLENBQUM7b0JBQzVDLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQyxNQUEwQixDQUFDO29CQUMzQyxJQUFJLG1CQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRTt3QkFDbkMsUUFBUSxDQUFDLFlBQVksQ0FBQyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7d0JBQ3JDLEtBQUssQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO3FCQUNwQjt5QkFBTTt3QkFDTCxLQUFLLENBQUMsT0FBTyxHQUFHLHFCQUFxQixDQUFDO3FCQUN2QztnQkFDSCxDQUFDO2FBQ0YsQ0FBQztZQUNGLFVBQVUsRUFBRSxhQUFLLENBQUM7Z0JBQ2hCLEtBQUssRUFBRSxTQUFTO2dCQUNoQixJQUFJLEVBQUUsTUFBTTtnQkFDWixJQUFJLEVBQUUsYUFBYTtnQkFDbkIsRUFBRSxFQUFFLDBCQUEwQjtnQkFDOUIsU0FBUyxFQUFFLHNCQUFzQjtnQkFDakMsY0FBYyxFQUFFLG1CQUFtQjtnQkFDbkMsTUFBTSxFQUFFLENBQUMsQ0FBUSxFQUFFLEVBQUU7b0JBQ25CLE1BQU0sS0FBSyxHQUFHLG1CQUFtQixDQUFDLFFBQVEsRUFBRSxDQUFDO29CQUM3QyxNQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsTUFBMEIsQ0FBQztvQkFDM0MsSUFBSSxtQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUU7d0JBQ25DLFFBQVEsQ0FBQyxhQUFhLENBQUMsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO3dCQUN0QyxLQUFLLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztxQkFDcEI7eUJBQU07d0JBQ0wsS0FBSyxDQUFDLE9BQU8sR0FBRyxxQkFBcUIsQ0FBQztxQkFDdkM7Z0JBQ0gsQ0FBQzthQUNGLENBQUM7WUFDRixLQUFLLEVBQUUsYUFBSyxDQUFDO2dCQUNYLEtBQUssRUFBRSxTQUFTO2dCQUNoQixJQUFJLEVBQUUsTUFBTTtnQkFDWixJQUFJLEVBQUUsT0FBTztnQkFDYixFQUFFLEVBQUUsb0JBQW9CO2dCQUN4QixTQUFTLEVBQUUsc0JBQXNCO2dCQUNqQyxjQUFjLEVBQUUsY0FBYztnQkFDOUIsTUFBTSxFQUFFLENBQUMsQ0FBUSxFQUFFLEVBQUU7b0JBQ25CLE1BQU0sS0FBSyxHQUFHLGNBQWMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztvQkFDeEMsTUFBTSxLQUFLLEdBQUcsQ0FBQyxDQUFDLE1BQTBCLENBQUM7b0JBQzNDLElBQUksbUJBQVEsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFO3dCQUNuQyxRQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQzt3QkFDaEMsS0FBSyxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7cUJBQ3BCO3lCQUFNO3dCQUNMLEtBQUssQ0FBQyxPQUFPLEdBQUcscUJBQXFCLENBQUM7cUJBQ3ZDO2dCQUNILENBQUM7YUFDRixDQUFDO1lBQ0YsUUFBUSxFQUFFLGFBQUssQ0FBQztnQkFDZCxLQUFLLEVBQUUsUUFBUTtnQkFDZixJQUFJLEVBQUUsVUFBVTtnQkFDaEIsSUFBSSxFQUFFLFVBQVU7Z0JBQ2hCLEVBQUUsRUFBRSx1QkFBdUI7Z0JBQzNCLFNBQVMsRUFBRSxzQkFBc0I7Z0JBQ2pDLGNBQWMsRUFBRSxpQkFBaUI7Z0JBQ2pDLE1BQU0sRUFBRSxDQUFDLENBQVEsRUFBRSxFQUFFO29CQUNuQixNQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsTUFBMEIsQ0FBQztvQkFDM0MsTUFBTSxLQUFLLEdBQUcsaUJBQWlCLENBQUMsUUFBUSxFQUFFLENBQUM7b0JBQzNDLE1BQU0sTUFBTSxHQUFHLHVCQUF1QixDQUFDLFFBQVEsRUFBRSxDQUFDO29CQUNsRCxJQUFJLG1CQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRTt3QkFDbkMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7d0JBQ25DLEtBQUssQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO3dCQUNuQixJQUFJLFFBQVEsQ0FBQyxVQUFVLENBQUMsS0FBSyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsRUFBRTs0QkFDdkQsTUFBTSxDQUFDLE9BQU8sR0FBRyx1QkFBdUIsQ0FBQzt5QkFDMUM7cUJBQ0Y7eUJBQU07d0JBQ0wsS0FBSyxDQUFDLE9BQU8sR0FBRyxxQkFBcUIsQ0FBQztxQkFDdkM7Z0JBQ0gsQ0FBQzthQUNGLENBQUM7WUFDRixjQUFjLEVBQUUsYUFBSyxDQUFDO2dCQUNwQixLQUFLLEVBQUUsUUFBUTtnQkFDZixJQUFJLEVBQUUsVUFBVTtnQkFDaEIsSUFBSSxFQUFFLGdCQUFnQjtnQkFDdEIsRUFBRSxFQUFFLDZCQUE2QjtnQkFDakMsU0FBUyxFQUFFLHNCQUFzQjtnQkFDakMsY0FBYyxFQUFFLHVCQUF1QjtnQkFDdkMsTUFBTSxFQUFFLENBQUMsQ0FBUSxFQUFFLEVBQUU7b0JBQ25CLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQyxNQUEwQixDQUFDO29CQUMzQyxNQUFNLEtBQUssR0FBRyx1QkFBdUIsQ0FBQyxRQUFRLEVBQUUsQ0FBQztvQkFDakQsSUFBSSxtQkFBUSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUU7d0JBQ25DLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7d0JBQ3pDLEtBQUssQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO3dCQUNuQixJQUFJLFFBQVEsQ0FBQyxVQUFVLENBQUMsS0FBSyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsRUFBRTs0QkFDdkQsS0FBSyxDQUFDLE9BQU8sR0FBRyx1QkFBdUIsQ0FBQzt5QkFDekM7cUJBQ0Y7eUJBQU07d0JBQ0wsS0FBSyxDQUFDLE9BQU8sR0FBRyxxQkFBcUIsQ0FBQztxQkFDdkM7Z0JBQ0gsQ0FBQzthQUNGLENBQUM7WUFDRixTQUFTLEVBQUUsZUFBTSxDQUFDO2dCQUNoQixLQUFLLEVBQUUsb0JBQW9CO2dCQUMzQixTQUFTLEVBQUUsYUFBYTtnQkFDeEIsT0FBTyxFQUFFLENBQUMsQ0FBUSxFQUFFLEVBQUU7b0JBQ3BCLElBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQzt3QkFDakMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTs0QkFDbEMsT0FBTyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO3dCQUMvQixDQUFDLENBQUMsRUFDRjt3QkFDQSxPQUFPO3FCQUNSO29CQUNELE1BQU0sSUFBSSxHQUE4Qzt3QkFDdEQsSUFBSSxFQUFFOzRCQUNKLFVBQVUsRUFBRSxRQUFRLENBQUMsVUFBVTs0QkFDL0IsV0FBVyxFQUFFLFFBQVEsQ0FBQyxXQUFXOzRCQUNqQyxLQUFLLEVBQUUsUUFBUSxDQUFDLEtBQUs7NEJBQ3JCLEtBQUssRUFBRSxRQUFRLENBQUMsS0FBSzs0QkFDckIsUUFBUSxFQUFFLFFBQVEsQ0FBQyxRQUFROzRCQUMzQixLQUFLLEVBQUUsUUFBUSxDQUFDLEtBQUs7eUJBQ3RCO3dCQUNELE9BQU8sRUFBRTs0QkFDUCxjQUFjLEVBQUUsa0JBQWtCO3lCQUNuQztxQkFDRixDQUFDO29CQUNGLHlCQUFhLENBQUMsV0FBVyxFQUFFLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDekQsQ0FBQzthQUNGLENBQUM7WUFDRixTQUFTLEVBQUUsZUFBTSxDQUFDO2dCQUNoQixLQUFLLEVBQUUsT0FBTztnQkFDZCxTQUFTLEVBQUUsV0FBVztnQkFDdEIsT0FBTyxFQUFFLENBQUMsQ0FBUSxFQUFFLEVBQUU7b0JBQ3BCLFVBQU0sQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2pCLENBQUM7YUFDRixDQUFDO1NBQ0g7S0FDRixDQUFDLENBQUM7QUFDTCxDQUFDLENBQUM7QUE1TFcsMEJBQWtCLHNCQTRMN0I7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDL0xGLE1BQWEsYUFBYTtJQUd4QixZQUFzQixPQUFxQjtRQUFyQixZQUFPLEdBQVAsT0FBTyxDQUFjO1FBRjNDLFVBQUssR0FBb0IsRUFBRSxDQUFDO1FBQzVCLE1BQUMsR0FBVyxFQUFFLENBQUM7UUFHZixhQUFRLEdBQUcsR0FBUyxFQUFFO1lBQ3BCLElBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQzNDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztRQUNwQixDQUFDLEVBQUM7UUFFRixhQUFRLEdBQUcsQ0FBTyxJQUE0QixFQUFFLEVBQUU7WUFDaEQsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsQyxNQUFNLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUN4QixDQUFDLEVBQUM7UUFFRixlQUFVLEdBQUcsQ0FBTyxNQUFjLEVBQWlCLEVBQUU7WUFDbkQsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN0QyxNQUFNLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUN4QixDQUFDLEVBQUM7SUFmNEMsQ0FBQztDQWdCaEQ7QUFuQkQsc0NBbUJDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3BCRCxNQUFhLGFBQWE7SUFFeEIsWUFBc0IsT0FBcUI7UUFBckIsWUFBTyxHQUFQLE9BQU8sQ0FBYztRQUMzQyxZQUFPLEdBQUcsR0FBUyxFQUFFO1lBQ25CLElBQUksQ0FBQyxJQUFJLEdBQUcsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQzNDLENBQUMsRUFBQztJQUg0QyxDQUFDO0NBSWhEO0FBTkQsc0NBTUM7Ozs7Ozs7Ozs7Ozs7O0FDZEQsb0dBQTJDO0FBRzNDLGtHQUE4QztBQUM5Qyw2R0FBZ0Q7QUFDaEQsNkdBQWdEO0FBRW5DLGtCQUFVLEdBQUc7SUFDeEIsSUFBSSxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDO0lBQ2pDLElBQUksRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQztDQUNsQyxDQUFDO0FBRVcsMEJBQWtCLEdBQUcsSUFBSSxxQkFBUyxFQUFFLENBQUM7QUFFbEQsMEJBQWtCLENBQUMsSUFBSSxDQUFDLGtCQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsU0FBUyxFQUFFLEVBQUU7SUFDcEUsTUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBZSx1QkFBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzFELE9BQU8sSUFBSSw2QkFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3BDLENBQUMsQ0FBQyxDQUFDO0FBRUgsMEJBQWtCLENBQUMsSUFBSSxDQUFDLGtCQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsU0FBUyxFQUFFLEVBQUU7SUFDcEUsTUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBZSx1QkFBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzFELE9BQU8sSUFBSSw2QkFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3BDLENBQUMsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7QUN0QkgsdUZBQXdDO0FBQ3hDLDhFQUFzQztBQUV0QyxNQUFNLE9BQU8sR0FBRyxHQUFHLEVBQUU7SUFDbkIsTUFBTSxFQUFFLFNBQVMsRUFBRSxHQUFHLElBQUkscUJBQVMsRUFBRSxDQUFDO0lBQ3RDLE1BQU0sTUFBTSxHQUFHLG1CQUFVLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDckMsT0FBTyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsQ0FBQztBQUMvQixDQUFDLENBQUM7QUFFVyxLQUF3QixPQUFPLEVBQUUsRUFBL0IsY0FBTSxjQUFFLGlCQUFTLGdCQUFlOzs7Ozs7Ozs7Ozs7OztBQ1QvQyxNQUFhLFNBQVM7SUFHcEI7UUFGQSxlQUFVLEdBQXFCLElBQUksR0FBRyxFQUFFLENBQUM7UUFRekMsUUFBRyxHQUFHLENBQUksRUFBVSxFQUFLLEVBQUU7WUFDekIsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNsRCxNQUFNLGVBQWUsR0FBRyxpQkFBaUIsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbkQsT0FBTyxlQUFlLENBQUM7UUFDekIsQ0FBQyxDQUFDO0lBVmEsQ0FBQztJQUNoQixJQUFJLENBQUMsRUFBVTtRQUNiLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUM5QixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFPRCxjQUFjLENBQUMsRUFBcUM7UUFDbEQsSUFBSSxJQUFJLENBQUMsTUFBTTtZQUNiLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztJQUNsRSxDQUFDO0lBRUQsTUFBTSxDQUFDLFNBQW9CO1FBQ3pCLEtBQUssSUFBSSxJQUFJLElBQUksU0FBUyxDQUFDLFVBQVUsRUFBRTtZQUNyQyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDdkM7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7Q0FDRjtBQTFCRCw4QkEwQkM7QUFFRCx1QkFBdUI7QUFDdkIsdUNBQXVDO0FBQ3ZDLEtBQUs7QUFFTCxvQkFBb0I7QUFDcEIscUNBQXFDO0FBQ3JDLEtBQUs7QUFFTCw4Q0FBOEM7QUFDOUMsNENBQTRDO0FBRTVDLFlBQVk7QUFDWixnQ0FBZ0M7QUFDaEMsbUJBQW1CO0FBQ25CLElBQUk7QUFFSixZQUFZO0FBQ1osbUJBQW1CO0FBQ25CLElBQUk7QUFFSiwyRUFBMkU7QUFDM0Usb0JBQW9CO0FBQ3BCLE1BQU07QUFFTixzRUFBc0U7QUFDdEUsa0VBQWtFO0FBQ2xFLHNDQUFzQztBQUN0QyxNQUFNO0FBRU4sK0NBQStDO0FBRS9DLHlEQUF5RDtBQUN6RCx3QkFBd0I7QUFFeEIsOERBQThEO0FBQzlELDBCQUEwQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMvRDFCLGlGQUFrQztBQWVsQyxNQUFhLElBQUk7SUFXZixZQUFZLE1BQWtCO1FBbUt2QixXQUFNLEdBQUcsR0FBd0IsRUFBRTtZQUN4QyxNQUFNLElBQUksR0FBRyxJQUFJLENBQUM7WUFDbEIsT0FBTyxPQUFPLENBQUMsR0FBRyxDQUNoQixJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQyxpQkFBaUIsQ0FDN0QsQ0FBQyxJQUFJLENBQUMsQ0FBQyxjQUFjLEVBQUUsRUFBRTtnQkFDeEIsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLHVCQUF1QixDQUFDLGNBQWMsQ0FBQyxDQUFDO2dCQUNsRSxJQUFJLGdCQUFnQixHQUNsQixjQUFjLENBQUMsY0FBYyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBQ2pELEtBQUssSUFBSSxDQUFDLEdBQUcsY0FBYyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDbkQsSUFBSSxRQUFRLEdBQ1YsWUFBWSxDQUNWLEdBQUcsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsSUFBSSxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQ2pFLENBQUM7b0JBQ0osZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLDBCQUEwQixDQUNoRCxnQkFBZ0IsRUFDaEIsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFDN0IsUUFBUSxFQUNSLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQzFCLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQzFCLENBQUM7aUJBQ0g7Z0JBRUQsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLGdCQUFnQixDQUFDLENBQUM7Z0JBRTlELElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtvQkFDakIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEdBQUcsZ0JBQWdCLENBQUM7aUJBQzVDO3FCQUFNO29CQUNMLE1BQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsVUFBVSxJQUFJLENBQUMsUUFBUSxJQUFJLENBQUMsQ0FBQztvQkFDakUsSUFBSSxJQUFJLEVBQUU7d0JBQ1IsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFtQixDQUFDO3dCQUNwQyxJQUFJLENBQUMsU0FBUyxHQUFHLGdCQUFnQixDQUFDO3FCQUNuQztpQkFDRjtnQkFDRCxJQUFJLENBQUMsc0JBQXNCLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUU7b0JBQy9DLFFBQVEsRUFBRSxDQUFDO2dCQUNiLENBQUMsQ0FBQyxDQUFDO2dCQUNILElBQUksQ0FBQyxpQkFBaUIsR0FBRyxFQUFFLENBQUM7Z0JBQzVCLE9BQU8sSUFBSSxDQUFDO1lBQ2QsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLEVBQUM7UUF6TUEsSUFBSSxDQUFDLFFBQVEsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQ2hDLElBQUksQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztRQUN4QixJQUFJLENBQUMsWUFBWSxHQUFHLGVBQWUsTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3pELElBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUNoQyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsRUFBRSxDQUFDO1FBQzVCLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO1FBQ2hCLElBQUksQ0FBQyxRQUFRLEdBQUcsY0FBTSxFQUFFLENBQUM7UUFDekIsSUFBSSxDQUFDLG1CQUFtQixHQUFHLEdBQUcsRUFBRSxHQUFFLENBQUMsQ0FBQztRQUNwQyxJQUFJLENBQUMsc0JBQXNCLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztJQUMxQyxDQUFDO0lBRUQsOEJBQThCO0lBRXZCLGVBQWUsQ0FDcEIsR0FBVyxFQUNYLElBQVUsRUFDVixPQUFnQjtRQUVoQixPQUFPLElBQUksT0FBTyxDQUFlLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1lBQ25ELEtBQUssQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDO2lCQUNyQixJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtnQkFDYixJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssR0FBRyxFQUFFO29CQUN2QixNQUFNLElBQUksS0FBSyxDQUFDLHNCQUFzQixDQUFDLENBQUM7aUJBQ3pDO2dCQUNELE9BQU8sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ3JCLENBQUMsQ0FBQztpQkFDRCxJQUFJLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRTtnQkFDZixPQUFPLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUN2QixDQUFDLENBQUM7aUJBQ0QsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7Z0JBQ2IsSUFBSSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNoRCxPQUFPLENBQUM7b0JBQ04sSUFBSSxFQUFFLElBQUk7b0JBQ1YsV0FBVyxFQUFFLEdBQUc7b0JBQ2hCLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtvQkFDdkIsT0FBTyxFQUFFLE9BQU87aUJBQ2pCLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQztpQkFDRCxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtnQkFDYixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDZCxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVPLGdCQUFnQixDQUN0QixJQUFtQixFQUNuQixJQUFZLEVBQ1osT0FBZ0I7UUFFaEIsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ3ZCLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQ2xDO2FBQU07WUFDTCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ2xDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDdkUsSUFBSSxDQUFDLHNCQUFzQixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQztTQUMzRDtRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVPLGVBQWUsQ0FBQyxLQUFhLEVBQUUsSUFBWTtRQUNqRCxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7WUFDckIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSxHQUFHLElBQUksRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQy9DLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVPLGdCQUFnQixDQUFDLElBQVUsRUFBRSxJQUFZO1FBQy9DLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNqQixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLEVBQUUsRUFBRTtnQkFDL0MsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO29CQUNqQixPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FDMUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsRUFDeEIsU0FBUyxFQUNULEtBQUssQ0FDTixDQUFDO2lCQUNIO1lBQ0gsQ0FBQyxDQUFDLENBQUM7U0FDSjtJQUNILENBQUM7SUFFTyxrQkFBa0IsQ0FDeEIsWUFBb0IsRUFDcEIsSUFBNkI7UUFFN0IsSUFBSSxHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN4QyxLQUFLLElBQUksR0FBRyxJQUFJLElBQUksRUFBRTtZQUNwQixJQUFJLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLFFBQVEsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssSUFBSSxFQUFFO2dCQUN2RCxNQUFNLElBQUksR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLEdBQUcsR0FBRyxHQUFHLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDaEQsWUFBWSxHQUFHLFlBQVksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQzlEO1NBQ0Y7UUFDRCxNQUFNLElBQUksR0FBRyxJQUFJLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUN6QyxZQUFZLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDOUMsT0FBTyxZQUFZLENBQUM7SUFDdEIsQ0FBQztJQUVPLHVCQUF1QixDQUM3QixXQUtHO1FBRUgsTUFBTSxNQUFNLEdBQTJCLEVBQUUsQ0FBQztRQUMxQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7WUFDM0IsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFFO2dCQUM1QixNQUFNLENBQ0osSUFBSSxDQUFDLFdBQVcsQ0FDakIsSUFBSSxlQUFlLElBQUksQ0FBQyxRQUFRLEtBQUssSUFBSSxDQUFDLElBQUksU0FBUyxDQUFDO2FBQzFEO2lCQUFNO2dCQUNMLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQzthQUM1RDtRQUNILENBQUMsQ0FBQyxDQUFDO1FBRUgsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQUVPLDBCQUEwQixDQUNoQyxnQkFBd0IsRUFDeEIsV0FBbUIsRUFDbkIsaUJBQXlCLEVBQ3pCLFFBQWdCLEVBQ2hCLE9BQWdCO1FBRWhCLGdCQUFnQixHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FDdkMsZ0JBQWdCLEVBQ2hCLFdBQVcsRUFDWCxRQUFRLEVBQ1IsT0FBTyxDQUNSLENBQUM7UUFDRixNQUFNLElBQUksR0FBRyxJQUFJLE1BQU0sQ0FBQyxLQUFLLFdBQVcsSUFBSSxRQUFRLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztRQUMvRCxnQkFBZ0IsR0FBRyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLGlCQUFpQixDQUFDLENBQUM7UUFDckUsT0FBTyxnQkFBZ0IsQ0FBQztJQUMxQixDQUFDO0lBRU8saUJBQWlCLENBQ3ZCLFlBQW9CLEVBQ3BCLFdBQW1CLEVBQ25CLFFBQWdCLEVBQ2hCLE9BQWdCO1FBRWhCLE1BQU0sSUFBSSxHQUFHLElBQUksTUFBTSxDQUFDLEtBQUssV0FBVyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDbkQsSUFBSSxPQUFPLEVBQUU7WUFDWCxZQUFZLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FDakMsSUFBSSxFQUNKLGVBQWUsUUFBUSxPQUFPLFdBQVcsSUFBSSxRQUFRLE9BQU8sV0FBVyxXQUFXLENBQ25GLENBQUM7U0FDSDthQUFNO1lBQ0wsWUFBWSxHQUFHLFlBQVksQ0FBQyxPQUFPLENBQ2pDLElBQUksRUFDSixlQUFlLFFBQVEsT0FBTyxXQUFXLElBQUksUUFBUSxXQUFXLENBQ2pFLENBQUM7U0FDSDtRQUVELE9BQU8sWUFBWSxDQUFDO0lBQ3RCLENBQUM7SUFFTyxtQkFBbUIsQ0FBQyxJQUFZO1FBQ3RDLE1BQU0sS0FBSyxHQUFHLHFCQUFxQixDQUFDO1FBQ3BDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDakMsQ0FBQztJQTJDTyxRQUFRO1FBQ2QsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ2hCLENBQUM7SUFFTSxRQUFRO1FBQ2IsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN6QyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDcEIsQ0FBQztJQUVPLFdBQVcsQ0FBQyxLQUFVO1FBQzVCLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQztRQUNsQixNQUFNLE9BQU8sR0FBMEM7WUFDckQsR0FBRyxDQUFDLE1BQU0sRUFBRSxRQUFRO2dCQUNsQixPQUFPLE1BQU0sQ0FBUyxRQUFRLENBQUMsQ0FBQztZQUNsQyxDQUFDO1lBQ0QsR0FBRyxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsS0FBSztnQkFDekIsTUFBTSxDQUFTLFFBQVEsQ0FBQyxHQUFHLEtBQUssQ0FBQztnQkFDakMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUNoQixPQUFPLElBQUksQ0FBQztZQUNkLENBQUM7U0FDRixDQUFDO1FBQ0YsS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztRQUVsQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFO1lBQ25DLElBQUksT0FBTyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssUUFBUSxFQUFFO2dCQUNwQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUNoRCxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2FBQ2hDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7SUFFTyxxQkFBcUIsQ0FBQyxJQUFTO1FBQ3JDLElBQUksT0FBTyxHQUFhLEVBQUUsQ0FBQztRQUMzQixJQUFJLFlBQVksR0FBUSxFQUFFLENBQUM7UUFDM0IsU0FBUyxHQUFHLENBQUMsR0FBUTtZQUNuQixLQUFLLElBQUksR0FBRyxJQUFJLEdBQUcsRUFBRTtnQkFDbkIsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDbEIsSUFBSSxPQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxRQUFRLEVBQUU7b0JBQ2hDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztpQkFDZjtxQkFBTTtvQkFDTCxZQUFZLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDM0MsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDO2lCQUNmO2FBQ0Y7WUFDRCxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDaEIsQ0FBQztRQUNELEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVWLE9BQU8sWUFBWSxDQUFDO0lBQ3RCLENBQUM7SUFFTSxXQUFXLENBQUMsUUFBb0I7UUFDckMsSUFBSSxDQUFDLG1CQUFtQixHQUFHLFFBQVEsQ0FBQztRQUNwQyxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFTSxJQUFJO1FBQ1QsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2pCLElBQUksUUFBUSxDQUFDO1lBRWIsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDO1lBQ2xDLElBQUksUUFBUSxFQUFFO2dCQUNaLEtBQUssSUFBSSxLQUFLLElBQUksUUFBUSxFQUFFO29CQUMxQixLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7aUJBQ2hCO2FBQ0Y7U0FDRjtJQUNILENBQUM7Q0FDRjtBQTdSRCxvQkE2UkM7Ozs7Ozs7Ozs7Ozs7O0FDMVNELE1BQU0sS0FBSztJQU1ULFlBQ0UsUUFBZ0IsRUFDaEIsSUFBZ0IsRUFDaEIsS0FBOEIsRUFDOUIsT0FBNEI7UUFUdEIsY0FBUyxHQUFXLEVBQUUsQ0FBQztRQVc3QixJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztRQUMxQixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztRQUNwQixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztRQUNuQixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztJQUN6QixDQUFDO0lBRUQsUUFBUSxDQUFDLFFBQWdCO1FBQ3ZCLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUN4QixJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztZQUMxQixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7U0FDZjtJQUNILENBQUM7SUFFRCxLQUFLO1FBQ0gsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ2YsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDO1NBQ3RCO0lBQ0gsQ0FBQztJQUVELEtBQUssQ0FBQyxRQUFnQjtRQUNwQixPQUFPLE9BQU8sQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFFRCxNQUFNO1FBQ0osSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDaEIsT0FBTztTQUNSO1FBQ0QsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2hCLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRTs7Z0JBQzdCLFVBQUksQ0FBQyxNQUFNLCtDQUFYLElBQUksRUFBVSxNQUFNLEVBQUUsTUFBTSxHQUFHO1lBQ2pDLENBQUMsQ0FBQyxDQUFDO1NBQ0o7YUFBTTtZQUNMLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQztTQUN4QjtJQUNILENBQUM7Q0FDRjtBQUVELE1BQWEsTUFBTTtJQVFqQixZQUFZLFNBQWlCO1FBUHJCLGVBQVUsR0FBVyxJQUFJLENBQUM7UUFDbEMsV0FBTSxHQUFZLEVBQUUsQ0FBQztRQUNiLFlBQU8sR0FBWSxNQUFNLENBQUMsT0FBTyxDQUFDO1FBQ2xDLGtCQUFhLEdBQWlCLElBQUksQ0FBQztRQUNuQyxlQUFVLEdBQVcsRUFBRSxDQUFDO1FBSTlCLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNuQixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7U0FDeEI7UUFDRCxJQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQztJQUM5QixDQUFDO0lBRUQsR0FBRyxDQUNELFFBQWdCLEVBQ2hCLEtBQTZCLEVBQzdCLE9BQTRCO1FBRTVCLE1BQU0sS0FBSyxHQUFHLElBQUksS0FBSyxDQUNyQixRQUFRLEVBQ1IsS0FBSyxFQUNMLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFDOUIsT0FBTyxDQUNSLENBQUM7UUFDRixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN4QixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCxLQUFLO1FBQ0gsTUFBTSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQWdCLEVBQUUsRUFBRTtZQUN2QyxJQUFJLElBQUksR0FBRyxJQUFJLE1BQU0sQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDaEMsTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztZQUNuRCxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3JCLENBQUMsQ0FBQztRQUNGLElBQUksSUFBSSxHQUFHLElBQUksTUFBTSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNoQyxNQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLEdBQUcsQ0FBQztRQUMxRCxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ25CLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELFFBQVEsQ0FBQyxRQUFnQjtRQUN2QixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDVixPQUFPO1NBQ1I7UUFDRCxJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDdEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztTQUM1QjtRQUNELElBQUksQ0FBQyxhQUFhLEdBQUcsS0FBSyxDQUFDO1FBQzNCLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDOUIsQ0FBQztJQUVELEVBQUUsQ0FBQyxRQUFnQjtRQUNqQixJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLElBQUksUUFBUSxFQUFFLENBQUMsQ0FBQztRQUMvQyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzFCLENBQUM7SUFFRCxJQUFJO1FBQ0YsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUN0QixDQUFDO0lBRUQsT0FBTztRQUNMLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDekIsQ0FBQztJQUVELFFBQVEsQ0FBQyxRQUFnQjtRQUN2QixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDNUQsQ0FBQztDQUNGO0FBdEVELHdCQXNFQztBQUVELFNBQVMsT0FBTyxDQUFDLEdBQVksRUFBRSxHQUFZO0lBQ3pDLE9BQU8sR0FBRyxLQUFLLEdBQUcsQ0FBQztBQUNyQixDQUFDOzs7Ozs7Ozs7Ozs7OztBQzdIRCxNQUFNLE9BQU8sR0FBRztJQUNkLEdBQUcsRUFBRSxLQUFLO0lBQ1YsR0FBRyxFQUFFLEtBQUs7SUFDVixJQUFJLEVBQUUsTUFBTTtJQUNaLE1BQU0sRUFBRSxRQUFRO0NBQ2pCLENBQUM7QUFFRixNQUFNLEtBQUssR0FBRyxrQ0FBa0MsQ0FBQztBQUVqRCxNQUFNLGtCQUFrQjtJQUF4QjtRQUNFLG1CQUFjLEdBQUc7WUFDZixPQUFPLEVBQUUsRUFBRTtZQUNYLElBQUksRUFBRSxFQUFFO1NBQ1QsQ0FBQztRQUVGLFFBQUcsR0FBRyxDQUNKLEdBQVcsRUFDWCxVQUFxRCxJQUFJLENBQUMsY0FBYyxFQUN4RSxFQUFFO1lBQ0YsTUFBTSxhQUFhLEdBQUcsY0FBYyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNuRCxHQUFHLElBQUksYUFBYSxDQUFDO1lBQ3JCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FDakIsR0FBRyxrQ0FDRSxPQUFPLEtBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxHQUFHLEtBQ2pDLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxDQUNoQyxDQUFDO1FBQ0osQ0FBQyxDQUFDO1FBRUYsUUFBRyxHQUFHLENBQ0osR0FBVyxFQUNYLFVBQXFELElBQUksQ0FBQyxjQUFjLEVBQ3hFLEVBQUU7WUFDRixPQUFPLElBQUksQ0FBQyxPQUFPLENBQ2pCLEdBQUcsa0NBQ0UsT0FBTyxLQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsR0FBRyxLQUNqQyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLElBQUksQ0FDaEMsQ0FBQztRQUNKLENBQUMsQ0FBQztRQUVGLFNBQUksR0FBRyxDQUNMLEdBQVcsRUFDWCxVQUE4RCxJQUFJO2FBQy9ELGNBQWMsRUFDakIsRUFBRTtZQUNGLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FDakIsR0FBRyxrQ0FDRSxPQUFPLEtBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxJQUFJLEtBQ2xDLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxDQUNoQyxDQUFDO1FBQ0osQ0FBQyxDQUFDO1FBRUYsV0FBTSxHQUFHLENBQ1AsR0FBVyxFQUNYLFVBQXFELElBQUksQ0FBQyxjQUFjLEVBQ3hFLEVBQUU7WUFDRixPQUFPLElBQUksQ0FBQyxPQUFPLENBQ2pCLEdBQUcsa0NBQ0UsT0FBTyxLQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsTUFBTSxLQUNwQyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLElBQUksQ0FDaEMsQ0FBQztRQUNKLENBQUMsQ0FBQztRQUVGLFdBQU0sR0FBRyxDQUFDLEdBQVcsRUFBRSxFQUFFO1lBQ3ZCLE9BQU8sSUFBSSxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDNUIsQ0FBQyxDQUFDO1FBRUYsWUFBTyxHQUFHLENBQ1IsR0FBVyxFQUNYLE9BQTJFLEVBQzNFLFVBQWtCLElBQUksRUFDdEIsRUFBRTtZQUNGLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxDQUFDO1lBQ2xCLE9BQU8sSUFBSSxPQUFPLENBQU0sQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7Z0JBQzFDLE1BQU0sR0FBRyxHQUFHLElBQUksY0FBYyxFQUFFLENBQUM7Z0JBQ2pDLEdBQUcsQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDO2dCQUMzQixHQUFHLENBQUMsSUFBSSxDQUFTLE9BQU8sQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQ3RDLE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUM7Z0JBQ2hDLEtBQUssSUFBSSxNQUFNLElBQUksT0FBaUMsRUFBRTtvQkFDcEQsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLE1BQThCLENBQVcsQ0FBQztvQkFDaEUsR0FBRyxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztpQkFDckM7Z0JBQ0QsR0FBRyxDQUFDLE1BQU0sR0FBRyxHQUFHLEVBQUU7b0JBQ2hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDZixDQUFDLENBQUM7Z0JBQ0YsR0FBRyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFO29CQUNsQixNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ1osQ0FBQyxDQUFDO2dCQUNGLEdBQUcsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLEVBQUUsRUFBRTtvQkFDbEIsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNaLENBQUMsQ0FBQztnQkFDRixVQUFVLENBQUMsR0FBRyxFQUFFO29CQUNkLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDZCxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7Z0JBRVosR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ3pDLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDO0lBQ0osQ0FBQztDQUFBO0FBRUQsU0FBUyxjQUFjLENBQUMsSUFBNEI7SUFDbEQsSUFBSSxhQUFhLEdBQUcsR0FBRyxDQUFDO0lBQ3hCLEtBQUssSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFO1FBQ3BCLGFBQWEsSUFBSSxHQUFHLEdBQUcsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQztLQUN6QztJQUNELGFBQWEsR0FBRyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxhQUFhLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3JFLE9BQU8sYUFBYSxDQUFDO0FBQ3ZCLENBQUM7QUFFWSxxQkFBYSxHQUFHLENBQUMsR0FBOEMsRUFBRTtJQUM1RSxJQUFJLFFBQTRCLENBQUM7SUFDakMsT0FBTztRQUNMLFdBQVcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxRQUFRLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxrQkFBa0IsRUFBRSxDQUFDO0tBQ3JFLENBQUM7QUFDSixDQUFDLENBQUMsRUFBRSxDQUFDOzs7Ozs7Ozs7Ozs7OztBQy9HUSxzQkFBYyxHQUFHO0lBQzVCLEtBQUssRUFBRSxFQUFFO0lBQ1QsU0FBUyxFQUFFLFVBQVUsS0FBYTtRQUNoQyxJQUFJLEdBQUcsR0FBRyw2REFBNkQsQ0FBQztRQUN4RSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUNwQixJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztZQUNoQixPQUFPLEtBQUssQ0FBQztTQUNkO1FBQ0QsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBQ0QsUUFBUSxFQUFFLENBQUMsSUFBVSxFQUFFLFdBQW9CLEVBQUUsRUFBRTtRQUM3QyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDNUIsSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUNoQixLQUFLLENBQUMsT0FBTyxHQUFHLDRDQUE0QyxDQUFDO1NBQzlEO2FBQU07WUFDTCxLQUFLLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztTQUNwQjtJQUNILENBQUM7Q0FDRixDQUFDOzs7Ozs7Ozs7Ozs7OztBQ25CVyxnQkFBUSxHQUFHO0lBQ3RCLEtBQUssRUFBRSxFQUFFO0lBQ1QsU0FBUyxFQUFFLFVBQVUsS0FBYTtRQUNoQyxJQUFJLEtBQUssS0FBSyxFQUFFLEVBQUU7WUFDaEIsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7WUFDaEIsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUNELElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUNELFFBQVEsRUFBRSxDQUFDLElBQVUsRUFBRSxXQUFvQixFQUFFLEVBQUU7UUFDN0MsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzVCLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDaEIsS0FBSyxDQUFDLE9BQU8sR0FBRyxxQkFBcUIsQ0FBQztTQUN2QzthQUFNO1lBQ0wsS0FBSyxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7U0FDcEI7SUFDSCxDQUFDO0NBQ0YsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7QUNwQkYsU0FBZ0IsTUFBTTtJQUNwQixPQUFPLHNDQUFzQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDO1FBQ3hFLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFDOUIsQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO1FBQ3JDLE9BQU8sR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7SUFDN0IsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBTkQsd0JBTUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTkQsa0dBQWtEO0FBQ2xELCtGQUFnRDtBQUNoRCx1SEFBZ0U7QUFDaEUsd0dBQXNEO0FBQ3RELDBIQUE0RDtBQUM1RCw2SEFBOEQ7QUFDOUQseUZBQXdDO0FBQ3hDLGtHQUFrRDtBQUVsRCx3RkFBMEM7QUFJbkMsTUFBTSxVQUFVLEdBQUcsQ0FBQyxTQUFvQixFQUFVLEVBQUU7SUFDekQsT0FBTyxJQUFJLGVBQU0sQ0FBQyxPQUFPLENBQUM7U0FDdkIsR0FBRyxDQUFDLEdBQUcsRUFBRSxtQkFBVyxFQUFFLEdBQUcsRUFBRTtRQUMxQixPQUFPLHlCQUFhLENBQUMsV0FBVyxFQUFFO2FBQy9CLEdBQUcsQ0FBQyxZQUFZLENBQUM7YUFDakIsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7WUFDYixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ25DLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDO1NBQ0QsR0FBRyxDQUFDLGVBQWUsRUFBRSxpQ0FBa0IsQ0FBQztTQUN4QyxHQUFHLENBQUMsT0FBTyxFQUFFLGlCQUFVLEVBQUUsR0FBUyxFQUFFO1FBQ25DLE1BQU0sYUFBYSxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQWlCLHNCQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDckUsTUFBTSxhQUFhLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDL0IsT0FBTyxhQUFhLENBQUMsS0FBSyxDQUFDO1FBQzNCLE9BQU8seUJBQWEsQ0FBQyxXQUFXLEVBQUU7YUFDL0IsR0FBRyxDQUFDLFFBQVEsQ0FBQzthQUNiLElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFO1lBQ2YsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDekMsT0FBTyxJQUFJLENBQUM7UUFDZCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUMsRUFBQztTQUNELEdBQUcsQ0FBQyxVQUFVLEVBQUUsdUJBQWEsRUFBRSxHQUFHLEVBQUU7UUFDbkMsT0FBTyx5QkFBYSxDQUFDLFdBQVcsRUFBRTthQUMvQixHQUFHLENBQUMsWUFBWSxDQUFDO2FBQ2pCLElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFO1lBQ2YsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDekMsT0FBTyxJQUFJLENBQUM7UUFDZCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQztTQUNELEdBQUcsQ0FBQyxjQUFjLEVBQUUsNkJBQWEsRUFBRSxHQUFTLEVBQUU7UUFDN0MsTUFBTSxhQUFhLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBaUIsc0JBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNyRSxNQUFNLGFBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUM5QixPQUFPLGFBQWEsQ0FBQyxJQUFJLENBQUM7SUFDNUIsQ0FBQyxFQUFDO1NBQ0QsR0FBRyxDQUFDLGVBQWUsRUFBRSwrQkFBYyxDQUFDO1NBQ3BDLEtBQUssRUFBRSxDQUFDO0FBQ2IsQ0FBQyxDQUFDO0FBcENXLGtCQUFVLGNBb0NyQjs7Ozs7Ozs7Ozs7Ozs7O0FDakRLO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7VUN2QkE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDckJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0Esd0NBQXdDLHlDQUF5QztXQUNqRjtXQUNBO1dBQ0EsRTs7Ozs7V0NQQSxzRjs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSxzREFBc0Qsa0JBQWtCO1dBQ3hFO1dBQ0EsK0NBQStDLGNBQWM7V0FDN0QsRTs7OztVQ05BO1VBQ0E7VUFDQTtVQUNBIiwiZmlsZSI6ImJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbnRhaW5lciB9IGZyb20gXCIuLi9saWJzL0NvbnRhaW5lclwiO1xuaW1wb3J0IHsgaW5mcmFzdHJ1Y3R1cmVDb250YWluZXIgfSBmcm9tIFwiLi4vSW5mcmFzdHNydWN0dXJlTGF5ZXJcIjtcbmltcG9ydCB7IEFwaUNsaWVudENvbnRhaW5lciB9IGZyb20gXCIuLi9JbnRlZ3JhdGlvbmFsTGF5ZXJcIjtcbmltcG9ydCB7IFNlcnZpY2VDb250YWluZXIgfSBmcm9tIFwiLi4vQnVzc2luZXNMYXllclwiO1xuaW1wb3J0IHsgVmlld01vZGVsQ29udGFpbmVyIH0gZnJvbSBcIi4uL1ZpZXdNb2RlbFwiO1xuXG5jb25zdCBDcmVhdGVESUNvbnRhaW5lciA9IChcbiAgaW5mcmFzdHJ1Y3R1cmVDb250YWluZXI6IENvbnRhaW5lcixcbiAgaW50ZWdyZWF0aW9uQ29udGFpbmVyOiBDb250YWluZXIsXG4gIHNlcnZpY2VDb250YWluZXI6IENvbnRhaW5lcixcbiAgdmlld01vZGVsQ29udGFpbmVyOiBDb250YWluZXJcbikgPT4ge1xuICByZXR1cm4gdmlld01vZGVsQ29udGFpbmVyXG4gICAgLnBhcmVudChzZXJ2aWNlQ29udGFpbmVyKVxuICAgIC5wYXJlbnQoaW50ZWdyZWF0aW9uQ29udGFpbmVyKVxuICAgIC5wYXJlbnQoaW5mcmFzdHJ1Y3R1cmVDb250YWluZXIpO1xufTtcblxuZXhwb3J0IGNsYXNzIEJvb3RTdHJhcCB7XG4gIGNvbnRhaW5lcjogQ29udGFpbmVyO1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmNvbnRhaW5lciA9IENyZWF0ZURJQ29udGFpbmVyKFxuICAgICAgaW5mcmFzdHJ1Y3R1cmVDb250YWluZXIsXG4gICAgICBBcGlDbGllbnRDb250YWluZXIsXG4gICAgICBTZXJ2aWNlQ29udGFpbmVyLFxuICAgICAgVmlld01vZGVsQ29udGFpbmVyXG4gICAgKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgSUNoYXREVE8gfSBmcm9tIFwiLi4vVUkvQ29tcG9uZW50cy9DaGF0SXRlbVwiO1xuaW1wb3J0IHsgSUNoYXRBUElDbGllbnQgfSBmcm9tIFwiLi4vSW50ZWdyYXRpb25hbExheWVyL0NoYXRBUElcIjtcblxuZXhwb3J0IGludGVyZmFjZSBJQ2hhdFNlcnZpY2Uge1xuICBnZXRDaGF0czogKCkgPT4gUHJvbWlzZTxBcnJheTxJQ2hhdERUTz4+O1xuICBzYXZlQ2hhdDogKGRhdGE6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4pID0+IFByb21pc2U8dm9pZD47XG4gIGRlbGV0ZUNoYXQ6IChjaGF0SWQ6IHN0cmluZykgPT4gUHJvbWlzZTx2b2lkPjtcbn1cblxuZXhwb3J0IGNsYXNzIENoYXRTZXJ2aWNlIGltcGxlbWVudHMgSUNoYXRTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIEFwaUNsaWVudDogSUNoYXRBUElDbGllbnQpIHt9XG5cbiAgZ2V0Q2hhdHMgPSAoKTogUHJvbWlzZTxBcnJheTxJQ2hhdERUTz4+ID0+IHtcbiAgICByZXR1cm4gdGhpcy5BcGlDbGllbnQuZ2V0Q2hhdHMoKTtcbiAgfTtcblxuICBzYXZlQ2hhdCA9IChkYXRhOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+KSA9PiB7XG4gICAgcmV0dXJuIHRoaXMuQXBpQ2xpZW50LnNhdmVDaGF0KGRhdGEpO1xuICB9O1xuXG4gIGRlbGV0ZUNoYXQoY2hhdElkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gdGhpcy5BcGlDbGllbnQuZGVsZXRlQ2hhdChjaGF0SWQpO1xuICB9XG59XG4iLCJpbXBvcnQgeyBJVXNlckFQSUNsaWVudCB9IGZyb20gXCIuLi9JbnRlZ3JhdGlvbmFsTGF5ZXIvVXNlckFQSVwiO1xuaW1wb3J0IHsgSVByb2ZpbGVEVE8gfSBmcm9tIFwiLi4vVUkvTGF5b3V0cy9Qcm9maWxlXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVVzZXJTZXJ2aWNlIHtcbiAgZ2V0VXNlcigpOiBQcm9taXNlPElQcm9maWxlRFRPPjtcbn1cblxuZXhwb3J0IGNsYXNzIFVzZXJTZXJ2aWNlIGltcGxlbWVudHMgSVVzZXJTZXJ2aWNlIHtcbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIEFwaUNsaWVudDogSVVzZXJBUElDbGllbnQpIHt9XG4gIGdldFVzZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuQXBpQ2xpZW50LmdldFVzZXIoKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgQVBJX0NMSUVOVCB9IGZyb20gXCIuLi9JbnRlZ3JhdGlvbmFsTGF5ZXJcIjtcbmltcG9ydCB7IElDaGF0QVBJQ2xpZW50IH0gZnJvbSBcIi4uL0ludGVncmF0aW9uYWxMYXllci9DaGF0QVBJXCI7XG5pbXBvcnQgeyBJVXNlckFQSUNsaWVudCB9IGZyb20gXCIuLi9JbnRlZ3JhdGlvbmFsTGF5ZXIvVXNlckFQSVwiO1xuaW1wb3J0IHsgQ29udGFpbmVyIH0gZnJvbSBcIi4uL2xpYnMvQ29udGFpbmVyXCI7XG5pbXBvcnQgeyBDaGF0U2VydmljZSB9IGZyb20gXCIuL0NoYXRTZXJ2aWNlXCI7XG5pbXBvcnQgeyBVc2VyU2VydmljZSB9IGZyb20gXCIuL1VzZXJTZXJ2aWNlXCI7XG5cbmV4cG9ydCBjb25zdCBTRVJWSUNFID0ge1xuICBDSEFUOiBTeW1ib2wuZm9yKFwiQ2hhdFNlcnZpY2VcIiksXG4gIFVTRVI6IFN5bWJvbC5mb3IoXCJVc2VyU2VydmNpZVwiKSxcbn07XG5cbmV4cG9ydCBjb25zdCBTZXJ2aWNlQ29udGFpbmVyID0gbmV3IENvbnRhaW5lcigpO1xuXG5TZXJ2aWNlQ29udGFpbmVyLmJpbmQoU0VSVklDRS5DSEFUKS50b0R5bmFtaWNWYWx1ZSgoY29udGFpbmVyKSA9PiB7XG4gIGNvbnN0IEFQSUNsaWVudCA9IGNvbnRhaW5lci5nZXQ8SUNoYXRBUElDbGllbnQ+KEFQSV9DTElFTlQuQ0hBVCk7XG4gIHJldHVybiBuZXcgQ2hhdFNlcnZpY2UoQVBJQ2xpZW50KTtcbn0pO1xuXG5TZXJ2aWNlQ29udGFpbmVyLmJpbmQoU0VSVklDRS5VU0VSKS50b0R5bmFtaWNWYWx1ZSgoY29udGFpbmVyKSA9PiB7XG4gIGNvbnN0IEFQSUNsaWVudCA9IGNvbnRhaW5lci5nZXQ8SVVzZXJBUElDbGllbnQ+KEFQSV9DTElFTlQuVVNFUik7XG4gIHJldHVybiBuZXcgVXNlclNlcnZpY2UoQVBJQ2xpZW50KTtcbn0pO1xuIiwiaW1wb3J0IHsgQ29udGFpbmVyIH0gZnJvbSBcIi4uL2xpYnMvQ29udGFpbmVyXCI7XG5pbXBvcnQgeyBBUElNb2R1bGUgfSBmcm9tIFwiLi9pbnRlcmZhY2VzXCI7XG5cbmV4cG9ydCBjb25zdCBJTlRFR1JBVElPTl9NT0RVTEUgPSB7XG4gIEFQSU1vZHVsZTogU3ltYm9sLmZvcihcIkFQSVwiKSxcbn07XG5cbmV4cG9ydCBjb25zdCBpbmZyYXN0cnVjdHVyZUNvbnRhaW5lciA9IG5ldyBDb250YWluZXIoKTtcblxuaW5mcmFzdHJ1Y3R1cmVDb250YWluZXJcbiAgLmJpbmQoSU5URUdSQVRJT05fTU9EVUxFLkFQSU1vZHVsZSlcbiAgLnRvRHluYW1pY1ZhbHVlKChjb250YWluZXIpID0+IHtcbiAgICByZXR1cm4gbmV3IEFQSU1vZHVsZSgpO1xuICB9KTtcbiIsImltcG9ydCB7IEhUVFBUcmFuc3BvcnQgfSBmcm9tIFwiLi4vbGlicy9UcmFuc3BvcnRcIjtcblxuZXhwb3J0IGludGVyZmFjZSBJQVBJTW9kdWxlIHtcbiAgZ2V0RGF0YTogPFA+KHVybDogc3RyaW5nLCBwYXJhbXM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4pID0+IFByb21pc2U8UD47XG4gIHBvc3REYXRhOiA8UCBleHRlbmRzIFJlY29yZDxzdHJpbmcsIHN0cmluZz4+KFxuICAgIHVybDogc3RyaW5nLFxuICAgIHBhcmFtczogUFxuICApID0+IFByb21pc2U8UD47XG4gIHB1dERhdGE6IDxQPih1cmw6IHN0cmluZywgcGFyYW1zOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+KSA9PiBQcm9taXNlPFA+O1xuICBkZWxldGVEYXRhOiAodXJsOiBzdHJpbmcsIHBhcmFtczogUmVjb3JkPHN0cmluZywgc3RyaW5nPikgPT4gUHJvbWlzZTx2b2lkPjtcbn1cblxuZXhwb3J0IGNsYXNzIEFQSU1vZHVsZSBpbXBsZW1lbnRzIElBUElNb2R1bGUge1xuICBjb25zdHJ1Y3RvcigpIHt9XG4gIGdldERhdGEgPSA8UD4odXJsOiBzdHJpbmcsIGRhdGE6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4pOiBQcm9taXNlPFA+ID0+IHtcbiAgICByZXR1cm4gSFRUUFRyYW5zcG9ydC5nZXRJbnN0YW5jZSgpXG4gICAgICAuR0VUKHVybCwgdGhpcy5nZXRQYXJtcyhkYXRhKSlcbiAgICAgIC50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UocmVzdWx0LnJlc3BvbnNlKTtcbiAgICAgIH0pO1xuICB9O1xuXG4gIHBvc3REYXRhID0gYXN5bmMgPFAgZXh0ZW5kcyBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+PihcbiAgICB1cmw6IHN0cmluZyxcbiAgICBkYXRhOiBQXG4gICk6IFByb21pc2U8UD4gPT4ge1xuICAgIHJldHVybiBIVFRQVHJhbnNwb3J0LmdldEluc3RhbmNlKClcbiAgICAgIC5QT1NUKHVybCwgdGhpcy5nZXRQYXJtcyhkYXRhKSlcbiAgICAgIC50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UocmVzdWx0LnJlc3BvbnNlKTtcbiAgICAgIH0pO1xuICB9O1xuXG4gIGRlbGV0ZURhdGEgPSAodXJsOiBzdHJpbmcsIGRhdGE6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4pOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICByZXR1cm4gSFRUUFRyYW5zcG9ydC5nZXRJbnN0YW5jZSgpXG4gICAgICAuREVMRVRFKHVybCwgdGhpcy5nZXRQYXJtcyhkYXRhKSlcbiAgICAgIC50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgcmV0dXJuIEpTT04ucGFyc2UocmVzdWx0LnJlc3BvbnNlKTtcbiAgICAgIH0pO1xuICB9O1xuXG4gIHB1dERhdGEgPSA8UD4odXJsOiBzdHJpbmcsIGRhdGE6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4pOiBQcm9taXNlPFA+ID0+IHtcbiAgICByZXR1cm4gSFRUUFRyYW5zcG9ydC5nZXRJbnN0YW5jZSgpLlBVVCh1cmwsIHRoaXMuZ2V0UGFybXMoZGF0YSkpO1xuICB9O1xuXG4gIHByaXZhdGUgZ2V0UGFybXM8VCBleHRlbmRzIFJlY29yZDxzdHJpbmcsIHN0cmluZz4+KFxuICAgIGRhdGE6IFRcbiAgKTogeyBba2V5OiBzdHJpbmddOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IH0ge1xuICAgIHJldHVybiB7XG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgIFwiQ29udGVudC10eXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgfSxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgLi4uZGF0YSxcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgSUFQSU1vZHVsZSB9IGZyb20gXCIuLi9JbmZyYXN0c3J1Y3R1cmVMYXllci9pbnRlcmZhY2VzXCI7XG5pbXBvcnQgeyBJQ2hhdERUTyB9IGZyb20gXCIuLi9VSS9Db21wb25lbnRzL0NoYXRJdGVtXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUNoYXRBUElDbGllbnQge1xuICBnZXRDaGF0cygpOiBQcm9taXNlPEFycmF5PElDaGF0RFRPPj47XG4gIHNhdmVDaGF0KGRhdGE6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4pOiBQcm9taXNlPHZvaWQ+O1xuICBkZWxldGVDaGF0KGlkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+O1xufVxuXG5leHBvcnQgY2xhc3MgQ2hhdEFQSUNsaWVudCBpbXBsZW1lbnRzIElDaGF0QVBJQ2xpZW50IHtcbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIEFQSU1vZHVsZTogSUFQSU1vZHVsZSkge31cblxuICBnZXRDaGF0cyA9IGFzeW5jICgpOiBQcm9taXNlPEFycmF5PElDaGF0RFRPPj4gPT4ge1xuICAgIHJldHVybiBhd2FpdCB0aGlzLkFQSU1vZHVsZS5nZXREYXRhPElDaGF0RFRPW10+KFwiL2NoYXRzXCIsIHt9KS50aGVuKFxuICAgICAgKHJlc3VsdCkgPT4ge1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfVxuICAgICk7XG4gIH07XG5cbiAgc2F2ZUNoYXQgPSBhc3luYyAoZGF0YTogUmVjb3JkPHN0cmluZywgc3RyaW5nPik6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIGF3YWl0IHRoaXMuQVBJTW9kdWxlLnBvc3REYXRhKFwiL2NoYXRzXCIsIGRhdGEpO1xuICB9O1xuXG4gIGRlbGV0ZUNoYXQoaWQ6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiB0aGlzLkFQSU1vZHVsZS5kZWxldGVEYXRhKFwiL2NoYXRzXCIsIHsgY2hhdElkOiBpZCB9KTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgSUFQSU1vZHVsZSB9IGZyb20gXCIuLi9JbmZyYXN0c3J1Y3R1cmVMYXllci9pbnRlcmZhY2VzXCI7XG5pbXBvcnQgeyBJUHJvZmlsZURUTyB9IGZyb20gXCIuLi9VSS9MYXlvdXRzL1Byb2ZpbGVcIjtcblxuZXhwb3J0IGludGVyZmFjZSBJVXNlckFQSUNsaWVudCB7XG4gIGdldFVzZXIoKTogUHJvbWlzZTxJUHJvZmlsZURUTz47XG59XG5cbmV4cG9ydCBjbGFzcyBVc2VyQVBJQ2xpZW50IGltcGxlbWVudHMgSVVzZXJBUElDbGllbnQge1xuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgQVBJTW9kdWxlOiBJQVBJTW9kdWxlKSB7fVxuICBnZXRVc2VyID0gYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHVzZXIgPSBhd2FpdCB0aGlzLkFQSU1vZHVsZS5nZXREYXRhPElQcm9maWxlRFRPPihcIi9hdXRoL3VzZXJcIiwge30pO1xuICAgIHJldHVybiB1c2VyO1xuICB9O1xufVxuIiwiaW1wb3J0IHsgQ29udGFpbmVyIH0gZnJvbSBcIi4uL2xpYnMvQ29udGFpbmVyXCI7XG5pbXBvcnQgeyBJTlRFR1JBVElPTl9NT0RVTEUgfSBmcm9tIFwiLi4vSW5mcmFzdHNydWN0dXJlTGF5ZXJcIjtcbmltcG9ydCB7IENoYXRBUElDbGllbnQgfSBmcm9tIFwiLi9DaGF0QVBJXCI7XG5pbXBvcnQgeyBJQVBJTW9kdWxlIH0gZnJvbSBcIi4uL0luZnJhc3RzcnVjdHVyZUxheWVyL2ludGVyZmFjZXNcIjtcbmltcG9ydCB7IGNvbnRhaW5lciB9IGZyb20gXCIuLlwiO1xuaW1wb3J0IHsgVXNlckFQSUNsaWVudCB9IGZyb20gXCIuL1VzZXJBUElcIjtcblxuZXhwb3J0IGNvbnN0IEFQSV9DTElFTlQgPSB7XG4gIENIQVQ6IFN5bWJvbC5mb3IoXCJDaGF0QVBJQ2xpZW50XCIpLFxuICBVU0VSOiBTeW1ib2wuZm9yKFwiVXNlckFQSUNsaWVudFwiKSxcbn07XG5cbmV4cG9ydCBjb25zdCBBcGlDbGllbnRDb250YWluZXIgPSBuZXcgQ29udGFpbmVyKCk7XG5cbkFwaUNsaWVudENvbnRhaW5lci5iaW5kKEFQSV9DTElFTlQuQ0hBVCkudG9EeW5hbWljVmFsdWUoKGNvbnRhaW5lcikgPT4ge1xuICBjb25zdCBBUElNb2R1bGUgPSBjb250YWluZXIuZ2V0PElBUElNb2R1bGU+KElOVEVHUkFUSU9OX01PRFVMRS5BUElNb2R1bGUpO1xuICByZXR1cm4gbmV3IENoYXRBUElDbGllbnQoQVBJTW9kdWxlKTtcbn0pO1xuXG5BcGlDbGllbnRDb250YWluZXIuYmluZChBUElfQ0xJRU5ULlVTRVIpLnRvRHluYW1pY1ZhbHVlKChjb250YWluZXIpID0+IHtcbiAgY29uc3QgQVBJTW9kdWxlID0gY29udGFpbmVyLmdldDxJQVBJTW9kdWxlPihJTlRFR1JBVElPTl9NT0RVTEUuQVBJTW9kdWxlKTtcbiAgcmV0dXJuIG5ldyBVc2VyQVBJQ2xpZW50KEFQSU1vZHVsZSk7XG59KTtcbiIsImltcG9ydCB7IEhZUE8gfSBmcm9tIFwiLi4vLi4vLi4vbGlicy9IWVBPL0hZUE9cIjtcblxuZXhwb3J0IGNvbnN0IEF0dGVudGlvbk1lc3NhZ2UgPSAoKTogSFlQTyA9PiB7XG4gIHJldHVybiBuZXcgSFlQTyh7XG4gICAgdGVtcGxhdGVQYXRoOiBcImF0dGVudGlvbi50ZW1wbGF0ZS5odG1sXCIsXG4gICAgZGF0YToge1xuICAgICAgbWVzc2FnZTogXCJcIixcbiAgICB9LFxuICAgIGNoaWxkcmVuOiB7fSxcbiAgfSk7XG59O1xuIiwiaW1wb3J0IHsgSFlQTyB9IGZyb20gXCIuLi8uLi8uLi9saWJzL0hZUE8vSFlQT1wiO1xuaW1wb3J0IHsgdXVpZHY0IH0gZnJvbSBcIi4uLy4uLy4uL2xpYnMvdXRpbHNcIjtcblxuaW50ZXJmYWNlIElQcm9wcyB7XG4gIGlkPzogc3RyaW5nO1xuICB0aXRsZTogc3RyaW5nO1xuICBjbGFzc05hbWU6IHN0cmluZztcbiAgb25DbGljazogKGU6IEV2ZW50KSA9PiB2b2lkO1xufVxuXG5leHBvcnQgY29uc3QgQnV0dG9uID0gKHByb3BzOiBJUHJvcHMpID0+IHtcbiAgY29uc3QgaWQgPSBwcm9wcy5pZCB8fCB1dWlkdjQoKTtcbiAgcmV0dXJuIG5ldyBIWVBPKHtcbiAgICB0ZW1wbGF0ZVBhdGg6IFwiYnV0dG9uLnRlbXBsYXRlLmh0bWxcIixcbiAgICBkYXRhOiB7XG4gICAgICBpZDogaWQsXG4gICAgICB0aXRsZTogcHJvcHMudGl0bGUsXG4gICAgICBjbGFzc05hbWU6IHByb3BzLmNsYXNzTmFtZSxcbiAgICB9LFxuICB9KS5hZnRlclJlbmRlcigoKSA9PiB7XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpPy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGUpID0+IHtcbiAgICAgIHByb3BzLm9uQ2xpY2soZSk7XG4gICAgfSk7XG4gIH0pO1xufTtcbiIsImltcG9ydCB7IGNvbnRhaW5lciwgcm91dGVyIH0gZnJvbSBcIi4uLy4uLy4uXCI7XG5pbXBvcnQgeyBDaGF0TGF5b3V0IH0gZnJvbSBcIi4uLy4uL0xheW91dHMvQ2hhdFwiO1xuaW1wb3J0IHsgSFlQTyB9IGZyb20gXCIuLi8uLi8uLi9saWJzL0hZUE8vSFlQT1wiO1xuaW1wb3J0IHsgSFRUUFRyYW5zcG9ydCB9IGZyb20gXCIuLi8uLi8uLi9saWJzL1RyYW5zcG9ydFwiO1xuaW1wb3J0IHsgRGVsZXRlIH0gZnJvbSBcIi4uL0RlbGV0ZVwiO1xuaW1wb3J0IHsgVklFV19NT0RFTCB9IGZyb20gXCIuLi8uLi8uLi9WaWV3TW9kZWxcIjtcbmltcG9ydCB7IElDaGF0Vmlld01vZGVsIH0gZnJvbSBcIi4uLy4uLy4uL1ZpZXdNb2RlbC9DaGF0Vmlld01vZGVsXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUNoYXREVE8ge1xuICB0aXRsZTogc3RyaW5nO1xuICBhdmF0YXI6IHN0cmluZyB8IG51bGw7XG4gIGNyZWF0ZWRfYnk6IG51bWJlcjtcbiAgaWQ6IG51bWJlcjtcbn1cblxuaW50ZXJmYWNlIElQcm9wcyBleHRlbmRzIElDaGF0RFRPIHtcbiAgY2xhc3NOYW1lPzogc3RyaW5nO1xufVxuXG5leHBvcnQgY29uc3QgQ2hhdEl0ZW0gPSAocHJvcHM6IElDaGF0RFRPKSA9PiB7XG4gIHJldHVybiBuZXcgSFlQTyh7XG4gICAgdGVtcGxhdGVQYXRoOiBcImNoYXRJdGVtLnRlbXBsYXRlLmh0bWxcIixcbiAgICBkYXRhOiB7XG4gICAgICBDaGF0TmFtZTogcHJvcHMudGl0bGUsXG4gICAgICBsYXN0VGltZTogcHJvcHMuY3JlYXRlZF9ieSB8fCBcIjEwOjIyXCIsXG4gICAgICBsYXN0TWVzc2FnZTogcHJvcHMuaWQgfHwgXCJIaSwgaG93IGFyZSB5b3U/XCIsXG4gICAgICBub3RpZmljYXRpb25Db3VudDogcHJvcHMuYXZhdGFyIHx8IDMsXG4gICAgfSxcbiAgICBjaGlsZHJlbjoge1xuICAgICAgZGVsZXRlOiBEZWxldGUoe1xuICAgICAgICBpZDogYGRlbGV0ZUl0ZW0ke3Byb3BzLmlkfWAsXG4gICAgICAgIG9uQ2xpY2s6ICgpID0+IHtcbiAgICAgICAgICBjb25zdCBjaGF0Vmlld01vZGVsID0gY29udGFpbmVyLmdldDxJQ2hhdFZpZXdNb2RlbD4oVklFV19NT0RFTC5DSEFUKTtcbiAgICAgICAgICBjaGF0Vmlld01vZGVsLmRlbGV0ZUNoYXQoU3RyaW5nKHByb3BzLmlkKSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBDaGF0TGF5b3V0KGNoYXRWaWV3TW9kZWwuY2hhdHMpLnJlbmRlcigpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgfSxcbiAgfSk7XG59O1xuIiwiaW1wb3J0IHsgY29udGFpbmVyIH0gZnJvbSBcIi4uLy4uLy4uXCI7XG5pbXBvcnQgeyBIWVBPIH0gZnJvbSBcIi4uLy4uLy4uL2xpYnMvSFlQTy9IWVBPXCI7XG5pbXBvcnQgeyBSZXF1aXJlZCB9IGZyb20gXCIuLi8uLi8uLi9saWJzL1ZhbGlkYXRvcnMvUmVxdWlyZWRcIjtcbmltcG9ydCB7IEF0dGVudGlvbk1lc3NhZ2UgfSBmcm9tIFwiLi4vQXR0ZW50aW9uTWVzc2FnZVwiO1xuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSBcIi4uL0J1dHRvblwiO1xuaW1wb3J0IHsgSW5wdXQgfSBmcm9tIFwiLi4vSW5wdXRcIjtcbmltcG9ydCB7IElDaGF0Vmlld01vZGVsIH0gZnJvbSBcIi4uLy4uLy4uL1ZpZXdNb2RlbC9DaGF0Vmlld01vZGVsXCI7XG5pbXBvcnQgeyBDaGF0TGF5b3V0IH0gZnJvbSBcIi4uLy4uL0xheW91dHMvQ2hhdFwiO1xuaW1wb3J0IHsgVklFV19NT0RFTCB9IGZyb20gXCIuLi8uLi8uLi9WaWV3TW9kZWxcIjtcblxuZXhwb3J0IGNvbnN0IENyZWF0ZUNoYXRNb2RhbCA9ICgpID0+IHtcbiAgY29uc3QgYXR0ZW50aW9uTWVzc2FnZSA9IEF0dGVudGlvbk1lc3NhZ2UoKTtcbiAgY29uc3Qgc3RhdGUgPSBhdHRlbnRpb25NZXNzYWdlLmdldFN0YXRlKCk7XG5cbiAgbGV0IENoYXROYW1lID0gXCJcIjtcblxuICByZXR1cm4gbmV3IEhZUE8oe1xuICAgIHRlbXBsYXRlUGF0aDogXCJjcmVhdGVjaGF0bW9kYWwudGVtcGxhdGUuaHRtbFwiLFxuICAgIGRhdGE6IHt9LFxuICAgIGNoaWxkcmVuOiB7XG4gICAgICBpbnB1dDogSW5wdXQoe1xuICAgICAgICBsYWJlbDogXCJDaGF0IG5hbWVcIixcbiAgICAgICAgdHlwZTogXCJ0ZXh0XCIsXG4gICAgICAgIG5hbWU6IFwiY2hhdG5hbWVcIixcbiAgICAgICAgaWQ6IFwiY2hhdG5hbWVcIixcbiAgICAgICAgY2xhc3NOYW1lOiBcImMtYy1tb2RhbF9faW5wdXRcIixcbiAgICAgICAgQ2hpbGRBdHRlbnRpb246IGF0dGVudGlvbk1lc3NhZ2UsXG4gICAgICAgIG9uQmx1cjogKGU6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgY29uc3QgaW5wdXQgPSBlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgICAgICAgIGlmIChSZXF1aXJlZC5jaGVja0Z1bmMoaW5wdXQudmFsdWUpKSB7XG4gICAgICAgICAgICBzdGF0ZS5tZXNzYWdlID0gXCJcIjtcbiAgICAgICAgICAgIENoYXROYW1lID0gaW5wdXQudmFsdWU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0YXRlLm1lc3NhZ2UgPSBcIuKblCDQvtCx0Y/Qt9Cw0YLQtdC70YzQvdC+0LUg0L/QvtC70LVcIjtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICAgIGNyZWF0ZTogQnV0dG9uKHtcbiAgICAgICAgdGl0bGU6IFwi0KHQvtC30LTQsNGC0YxcIixcbiAgICAgICAgY2xhc3NOYW1lOiBcImNyZWF0ZS1idXR0b25cIixcbiAgICAgICAgb25DbGljazogKGU6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgaWYgKCFDaGF0TmFtZSkge1xuICAgICAgICAgICAgc3RhdGUubWVzc2FnZSA9IFwi4puUINC+0LHRj9C30LDRgtC10LvRjNC90L7QtSDQv9C+0LvQtVwiO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBjaGF0Vmlld01vZGVsID0gY29udGFpbmVyLmdldDxJQ2hhdFZpZXdNb2RlbD4oXG4gICAgICAgICAgICAgIFZJRVdfTU9ERUwuQ0hBVFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGNoYXRWaWV3TW9kZWwuc2F2ZUNoYXQoeyB0aXRsZTogQ2hhdE5hbWUgfSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgIGRvY3VtZW50XG4gICAgICAgICAgICAgICAgLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJjLWMtbW9kYWxcIilbMF1cbiAgICAgICAgICAgICAgICAuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbiAgICAgICAgICAgICAgQ2hhdExheW91dChjaGF0Vmlld01vZGVsLmNoYXRzKS5yZW5kZXIoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgY2FuY2VsOiBCdXR0b24oe1xuICAgICAgICB0aXRsZTogXCLQntGC0LzQtdC90LBcIixcbiAgICAgICAgY2xhc3NOYW1lOiBcImNhbmNlbC1idXR0b25cIixcbiAgICAgICAgb25DbGljazogKGU6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgZG9jdW1lbnRcbiAgICAgICAgICAgIC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiYy1jLW1vZGFsXCIpWzBdXG4gICAgICAgICAgICAuY2xhc3NMaXN0LmFkZChcImhpZGRlblwiKTtcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgIH0sXG4gIH0pO1xufTtcbiIsImltcG9ydCB7IEhZUE8gfSBmcm9tIFwiLi4vLi4vLi4vbGlicy9IWVBPL0hZUE9cIjtcblxuaW50ZXJmYWNlIElQcm9wcyB7XG4gIGlkOiBzdHJpbmc7XG4gIG9uQ2xpY2s6ICgpID0+IHZvaWQ7XG59XG5leHBvcnQgY29uc3QgRGVsZXRlID0gKHByb3BzOiBJUHJvcHMpID0+IHtcbiAgcmV0dXJuIG5ldyBIWVBPKHtcbiAgICB0ZW1wbGF0ZVBhdGg6IFwiZGVsZXRlLnRlbXBsYXRlLmh0bWxcIixcbiAgICBkYXRhOiB7XG4gICAgICBwYXRoOiBcIi9tZWRpYS9WZWN0b3Iuc3ZnXCIsXG4gICAgICBpZDogcHJvcHMuaWQsXG4gICAgfSxcbiAgICBjaGlsZHJlbjoge30sXG4gIH0pLmFmdGVyUmVuZGVyKCgpID0+IHtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChwcm9wcy5pZCk/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICBwcm9wcy5vbkNsaWNrKCk7XG4gICAgfSk7XG4gIH0pO1xufTtcbiIsImltcG9ydCB7IEhZUE8gfSBmcm9tIFwiLi4vLi4vLi4vbGlicy9IWVBPL0hZUE9cIjtcblxuZXhwb3J0IGNvbnN0IEVtcHR5ID0gKCkgPT4ge1xuICByZXR1cm4gbmV3IEhZUE8oe1xuICAgIHRlbXBsYXRlUGF0aDogXCJlbXB0eS50ZW1wbGF0ZS5odG1sXCIsXG4gICAgZGF0YToge30sXG4gIH0pO1xufTtcbiIsImltcG9ydCB7IEhZUE8gfSBmcm9tIFwiLi4vLi4vLi4vbGlicy9IWVBPL0hZUE9cIjtcbmltcG9ydCB7IEVtcHR5IH0gZnJvbSBcIi4uL0VtcHR5XCI7XG5cbmludGVyZmFjZSBJUHJvcHMge1xuICBsYWJlbDogc3RyaW5nO1xuICB0eXBlOiBzdHJpbmc7XG4gIG5hbWU6IHN0cmluZztcbiAgaWQ6IHN0cmluZztcbiAgY2xhc3NOYW1lOiBzdHJpbmc7XG4gIENoaWxkQXR0ZW50aW9uPzogSFlQTztcbiAgb25Gb2N1cz86IChlOiBFdmVudCkgPT4gdm9pZDtcbiAgb25CbHVyPzogKGU6IEV2ZW50KSA9PiB2b2lkO1xufVxuXG4vL0B0b2RvOiDQv9GA0LjQutGA0YPRgtC40YLRjCDRg9C90LjQutCw0LvRjNC90L7RgdGC0Ywg0LrQsNC20LTQvtCz0L4g0Y3Qu9C10LzQtdC90YLQsFxuXG5leHBvcnQgY29uc3QgSW5wdXQgPSAocHJvcHM6IElQcm9wcykgPT4ge1xuICByZXR1cm4gbmV3IEhZUE8oe1xuICAgIHRlbXBsYXRlUGF0aDogXCJpbnB1dC50ZW1wbGF0ZS5odG1sXCIsXG4gICAgZGF0YToge1xuICAgICAgbGFiZWw6IHtcbiAgICAgICAgbmFtZTogcHJvcHMubGFiZWwsXG4gICAgICB9LFxuICAgICAgYXRyaWJ1dGU6IHtcbiAgICAgICAgdHlwZTogcHJvcHMudHlwZSxcbiAgICAgICAgbmFtZTogcHJvcHMubmFtZSxcbiAgICAgICAgaWQ6IHByb3BzLmlkLFxuICAgICAgICBjbGFzc05hbWU6IHByb3BzLmNsYXNzTmFtZSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBjaGlsZHJlbjoge1xuICAgICAgQXR0ZW50aW9uOiBwcm9wcy5DaGlsZEF0dGVudGlvbiB8fCBFbXB0eSgpLFxuICAgIH0sXG4gIH0pLmFmdGVyUmVuZGVyKCgpID0+IHtcbiAgICBkb2N1bWVudFxuICAgICAgLmdldEVsZW1lbnRCeUlkKHByb3BzLmlkKVxuICAgICAgPy5hZGRFdmVudExpc3RlbmVyKFwiZm9jdXNcIiwgKGU6IEZvY3VzRXZlbnQpID0+IHtcbiAgICAgICAgY29uc3QgaW5wdXQgPSBlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgICAgICBjb25zdCBpbnB1dExhYmVsID0gaW5wdXQucGFyZW50RWxlbWVudD8ucGFyZW50RWxlbWVudD8ucXVlcnlTZWxlY3RvcihcbiAgICAgICAgICBcIi5mb3JtLWlucHV0X19sYWJlbFwiXG4gICAgICAgICk7XG4gICAgICAgIGlucHV0TGFiZWw/LmNsYXNzTGlzdC5hZGQoXCJmb3JtLWlucHV0X19sYWJlbF9zZWxlY3RcIik7XG4gICAgICAgIHByb3BzLm9uRm9jdXM/LihlKTtcbiAgICAgIH0pO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHByb3BzLmlkKT8uYWRkRXZlbnRMaXN0ZW5lcihcImJsdXJcIiwgKGU6IEV2ZW50KSA9PiB7XG4gICAgICBjb25zdCBpbnB1dCA9IGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgICBjb25zdCBpbnB1dExhYmVsID0gaW5wdXQucGFyZW50RWxlbWVudD8ucGFyZW50RWxlbWVudD8ucXVlcnlTZWxlY3RvcihcbiAgICAgICAgXCIuZm9ybS1pbnB1dF9fbGFiZWxcIlxuICAgICAgKTtcbiAgICAgIGlmICghaW5wdXQudmFsdWUpIHtcbiAgICAgICAgaW5wdXRMYWJlbD8uY2xhc3NMaXN0LnJlbW92ZShcImZvcm0taW5wdXRfX2xhYmVsX3NlbGVjdFwiKTtcbiAgICAgIH1cbiAgICAgIHByb3BzLm9uQmx1cj8uKGUpO1xuICAgIH0pO1xuICB9KTtcbn07XG4iLCJpbXBvcnQgeyBIWVBPIH0gZnJvbSBcIi4uLy4uLy4uL2xpYnMvSFlQTy9IWVBPXCI7XG5pbXBvcnQgeyByb3V0ZXIgfSBmcm9tIFwiLi4vLi4vLi5cIjtcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gXCIuLi8uLi9Db21wb25lbnRzL0J1dHRvblwiO1xuaW1wb3J0IHsgbWVtb2l6ZSB9IGZyb20gXCIuLi8uLi8uLi9saWJzL21vbWl6ZVwiO1xuXG5leHBvcnQgY29uc3QgQ2hhbmdlUGFzc3dvcmQgPSBtZW1vaXplKCgpID0+IHtcbiAgcmV0dXJuIG5ldyBIWVBPKHtcbiAgICByZW5kZXJUbzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCIjcm9vdFwiKSB8fCBkb2N1bWVudC5ib2R5LFxuICAgIHRlbXBsYXRlUGF0aDogXCJjaGFuZ2VQYXNzd29yZC50ZW1wbGF0ZS5odG1sXCIsXG4gICAgZGF0YToge30sXG4gICAgY2hpbGRyZW46IHtcbiAgICAgIHNhdmU6IEJ1dHRvbih7XG4gICAgICAgIHRpdGxlOiBcItCh0L7RhdGA0LDQvdC40YLRjFwiLFxuICAgICAgICBjbGFzc05hbWU6IFwicGFzc3dvcmRfZWRpdF9fYWN0aW9uX19zYXZlXCIsXG4gICAgICAgIG9uQ2xpY2s6IChlOiBFdmVudCkgPT4ge1xuICAgICAgICAgIHJvdXRlci5nbyhcIi9wcm9maWxlXCIpO1xuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgfSxcbiAgfSk7XG59KTtcbiIsImltcG9ydCB7IEhZUE8gfSBmcm9tIFwiLi4vLi4vLi4vbGlicy9IWVBPL0hZUE9cIjtcbmltcG9ydCB7IGNvbnRhaW5lciwgcm91dGVyIH0gZnJvbSBcIi4uLy4uLy4uXCI7XG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tIFwiLi4vLi4vQ29tcG9uZW50cy9CdXR0b25cIjtcbmltcG9ydCB7IElQcm9maWxlRFRPIH0gZnJvbSBcIi4uL1Byb2ZpbGVcIjtcbmltcG9ydCB7IElVc2VyVmlld01vZGVsIH0gZnJvbSBcIi4uLy4uLy4uL1ZpZXdNb2RlbC9Vc2VyVmlld01vZGVsXCI7XG5pbXBvcnQgeyBWSUVXX01PREVMIH0gZnJvbSBcIi4uLy4uLy4uL1ZpZXdNb2RlbFwiO1xuXG5leHBvcnQgY29uc3QgQ2hhbmdlUHJvZmlsZSA9IChkYXRhOiBJUHJvZmlsZURUTykgPT4ge1xuICByZXR1cm4gbmV3IEhZUE8oe1xuICAgIHJlbmRlclRvOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInJvb3RcIikgfHwgZG9jdW1lbnQuYm9keSxcbiAgICB0ZW1wbGF0ZVBhdGg6IFwiY2hhbmdlUHJvZmlsZS50ZW1wbGF0ZS5odG1sXCIsXG4gICAgZGF0YToge1xuICAgICAgZW1haWw6IGRhdGE/LmVtYWlsLFxuICAgICAgbG9naW46IGRhdGE/LmxvZ2luLFxuICAgICAgZmlyc3ROYW1lOiBkYXRhPy5maXJzdF9uYW1lLFxuICAgICAgc2Vjb25kTmFtZTogZGF0YT8uc2Vjb25kX25hbWUsXG4gICAgICBkaXNwbGF5TmFtZTogZGF0YT8uZW1haWwsXG4gICAgICBwaG9uZTogZGF0YT8ucGhvbmUsXG4gICAgfSxcbiAgICBjaGlsZHJlbjoge1xuICAgICAgc2F2ZTogQnV0dG9uKHtcbiAgICAgICAgdGl0bGU6IFwi0KHQvtGF0YDQsNC90LjRgtGMXCIsXG4gICAgICAgIGNsYXNzTmFtZTogXCJwcm9maWxlX2VkaXRfX2FjdGlvbl9fc2F2ZVwiLFxuICAgICAgICBvbkNsaWNrOiAoZTogRXZlbnQpID0+IHtcbiAgICAgICAgICBjb25zdCB1c2VyVmlld01vZGVsID0gY29udGFpbmVyLmdldDxJVXNlclZpZXdNb2RlbD4oVklFV19NT0RFTC5VU0VSKTtcbiAgICAgICAgICBjb25zb2xlLmxvZyh1c2VyVmlld01vZGVsLnVzZXIpO1xuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgfSxcbiAgfSk7XG59O1xuIiwiaW1wb3J0IHsgSFlQTyB9IGZyb20gXCIuLi8uLi8uLi9saWJzL0hZUE8vSFlQT1wiO1xuaW1wb3J0IHsgQ2hhdEl0ZW0sIElDaGF0RFRPIH0gZnJvbSBcIi4uLy4uL0NvbXBvbmVudHMvQ2hhdEl0ZW1cIjtcbmltcG9ydCB7IHJvdXRlciB9IGZyb20gXCIuLi8uLi8uLlwiO1xuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSBcIi4uLy4uL0NvbXBvbmVudHMvQnV0dG9uXCI7XG5pbXBvcnQgeyBFbXB0eSB9IGZyb20gXCIuLi8uLi9Db21wb25lbnRzL0VtcHR5XCI7XG5pbXBvcnQgeyBDcmVhdGVDaGF0TW9kYWwgfSBmcm9tIFwiLi4vLi4vQ29tcG9uZW50cy9DcmVhdGVDaGF0TW9kYWxcIjtcblxuZXhwb3J0IGNvbnN0IENoYXRMYXlvdXQgPSAocmVzdWx0OiBJQ2hhdERUT1tdKSA9PiB7XG4gIGNvbnN0IENoYXRJdGVtTGlzdDogSFlQT1tdID0gW107XG4gIGlmIChBcnJheS5pc0FycmF5KHJlc3VsdCkpIHtcbiAgICByZXN1bHQuZm9yRWFjaCgoaXRlbTogYW55KSA9PiB7XG4gICAgICBDaGF0SXRlbUxpc3QucHVzaChDaGF0SXRlbSh7IC4uLml0ZW0gfSkpO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIENoYXRJdGVtTGlzdC5wdXNoKEVtcHR5KCkpO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBIWVBPKHtcbiAgICByZW5kZXJUbzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb290XCIpIHx8IGRvY3VtZW50LmJvZHksXG4gICAgdGVtcGxhdGVQYXRoOiBcImNoYXQudGVtcGxhdGUuaHRtbFwiLFxuICAgIGRhdGE6IHt9LFxuICAgIGNoaWxkcmVuOiB7XG4gICAgICBQcm9maWxlTGluazogQnV0dG9uKHtcbiAgICAgICAgdGl0bGU6IFwiUHJvZmlsZVwiLFxuICAgICAgICBjbGFzc05hbWU6IFwicHJvZmlsZS1saW5rX19idXR0b25cIixcbiAgICAgICAgb25DbGljazogKGU6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgcm91dGVyLmdvKFwiL3Byb2ZpbGVcIik7XG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICAgIGNoYXRJdGVtOiBDaGF0SXRlbUxpc3QsXG4gICAgICBjcmVhdGVDaGF0TW9kYWw6IENyZWF0ZUNoYXRNb2RhbCgpLFxuICAgICAgY3JlYXRlQ2hhdEJ1dHRvbjogQnV0dG9uKHtcbiAgICAgICAgdGl0bGU6IFwiK1wiLFxuICAgICAgICBjbGFzc05hbWU6IFwibmF2aWdhdGlvbl9fY3JlYXRlQ2hhdEJ1dHRvblwiLFxuICAgICAgICBvbkNsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgZG9jdW1lbnRcbiAgICAgICAgICAgIC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiYy1jLW1vZGFsXCIpWzBdXG4gICAgICAgICAgICAuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKTtcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgIH0sXG4gIH0pO1xufTtcbiIsImltcG9ydCB7IElucHV0IH0gZnJvbSBcIi4uLy4uL0NvbXBvbmVudHMvSW5wdXRcIjtcbmltcG9ydCB7IFJlcXVpcmVkIH0gZnJvbSBcIi4uLy4uLy4uL2xpYnMvVmFsaWRhdG9ycy9SZXF1aXJlZFwiO1xuaW1wb3J0IHsgQXR0ZW50aW9uTWVzc2FnZSB9IGZyb20gXCIuLi8uLi9Db21wb25lbnRzL0F0dGVudGlvbk1lc3NhZ2VcIjtcbmltcG9ydCB7IHJvdXRlciB9IGZyb20gXCIuLi8uLi8uLi9pbmRleFwiO1xuaW1wb3J0IHsgSFRUUFRyYW5zcG9ydCB9IGZyb20gXCIuLi8uLi8uLi9saWJzL1RyYW5zcG9ydFwiO1xuaW1wb3J0IHsgSFlQTyB9IGZyb20gXCIuLi8uLi8uLi9saWJzL0hZUE8vSFlQT1wiO1xuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSBcIi4uLy4uL0NvbXBvbmVudHMvQnV0dG9uXCI7XG5pbXBvcnQgeyBJUHJvZmlsZURUTyB9IGZyb20gXCIuLi9Qcm9maWxlXCI7XG5cbi8qKlxuICogbm5ucnJyMTExTk5cbiAqL1xuXG5leHBvcnQgY29uc3QgTG9naW5MYXlvdXQgPSAodXNlcjogSVByb2ZpbGVEVE8pOiBIWVBPID0+IHtcbiAgaWYgKHVzZXIgJiYgdXNlci5pZCkge1xuICAgIHJvdXRlci5nbyhcIi9jaGF0XCIpO1xuICB9XG5cbiAgY29uc3QgYXR0ZW50aW9uTG9naW4gPSBBdHRlbnRpb25NZXNzYWdlKCk7XG4gIGNvbnN0IGF0dGVudGlvbkxvZ2luU3RvcmUgPSBhdHRlbnRpb25Mb2dpbi5nZXRTdGF0ZSgpO1xuICBjb25zdCBhdHRlbnRpb25QYXNzID0gQXR0ZW50aW9uTWVzc2FnZSgpO1xuICBjb25zdCBhdHRlbnRpb25QYXNzU3RvcmUgPSBhdHRlbnRpb25QYXNzLmdldFN0YXRlKCk7XG5cbiAgY29uc3QgRm9ybURhdGE6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcbiAgcmV0dXJuIG5ldyBIWVBPKHtcbiAgICByZW5kZXJUbzogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJyb290XCIpIHx8IGRvY3VtZW50LmJvZHksXG4gICAgdGVtcGxhdGVQYXRoOiBcImxvZ2luLnRlbXBsYXRlLmh0bWxcIixcbiAgICBkYXRhOiB7XG4gICAgICBGb3JtTmFtZTogXCLQktGF0L7QtFwiLFxuICAgIH0sXG4gICAgY2hpbGRyZW46IHtcbiAgICAgIElucHV0TG9naW46IElucHV0KHtcbiAgICAgICAgbGFiZWw6IFwi0JvQvtCz0LjQvVwiLFxuICAgICAgICB0eXBlOiBcInRleHRcIixcbiAgICAgICAgbmFtZTogXCJsb2dpblwiLFxuICAgICAgICBpZDogXCJmb3JtLWlucHV0LWxvZ2luXCIsXG4gICAgICAgIGNsYXNzTmFtZTogXCJmb3JtLWxvZ2luX19mb3JtLWlucHV0XCIsXG4gICAgICAgIG9uQmx1cjogKGU6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgY29uc3QgaW5wdXQgPSBlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgICAgICAgIGNvbnN0IGNoZWNrID0gUmVxdWlyZWQuY2hlY2tGdW5jKGlucHV0Py52YWx1ZSk7XG4gICAgICAgICAgaWYgKCFjaGVjaykge1xuICAgICAgICAgICAgYXR0ZW50aW9uTG9naW5TdG9yZS5tZXNzYWdlID0gXCLim5Qg0L7QsdGP0LfQsNGC0LXQu9GM0L3QvtC1INC/0L7Qu9C1XCI7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGF0dGVudGlvbkxvZ2luU3RvcmUubWVzc2FnZSA9IFwiXCI7XG4gICAgICAgICAgICBGb3JtRGF0YVtcImxvZ2luXCJdID0gaW5wdXQudmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBDaGlsZEF0dGVudGlvbjogYXR0ZW50aW9uTG9naW4sXG4gICAgICB9KSxcbiAgICAgIElucHV0UGFzc3dvcmQ6IElucHV0KHtcbiAgICAgICAgbGFiZWw6IFwi0J/QsNGA0L7Qu9GMXCIsXG4gICAgICAgIHR5cGU6IFwicGFzc3dvcmRcIixcbiAgICAgICAgbmFtZTogXCJwYXNzd29yZFwiLFxuICAgICAgICBpZDogXCJmb3JtLWlucHV0LXBhc3N3b3JkXCIsXG4gICAgICAgIGNsYXNzTmFtZTogXCJmb3JtLWxvZ2luX19mb3JtLWlucHV0XCIsXG4gICAgICAgIG9uQmx1cjogKGU6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgY29uc3QgaW5wdXQgPSBlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgICAgICAgIGlmICghUmVxdWlyZWQuY2hlY2tGdW5jKGlucHV0LnZhbHVlKSkge1xuICAgICAgICAgICAgYXR0ZW50aW9uUGFzc1N0b3JlLm1lc3NhZ2UgPSBcIuKblCDQvtCx0Y/Qt9Cw0YLQtdC70YzQvdC+0LUg0L/QvtC70LVcIjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYXR0ZW50aW9uUGFzc1N0b3JlLm1lc3NhZ2UgPSBcIlwiO1xuICAgICAgICAgICAgRm9ybURhdGFbXCJwYXNzd29yZFwiXSA9IGlucHV0LnZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgQ2hpbGRBdHRlbnRpb246IGF0dGVudGlvblBhc3MsXG4gICAgICB9KSxcbiAgICAgIEJ1dHRvbjogQnV0dG9uKHtcbiAgICAgICAgdGl0bGU6IFwi0JDQstGC0L7RgNC40LfQvtCy0LDRgtGM0YHRj1wiLFxuICAgICAgICBjbGFzc05hbWU6IFwiZm9ybS1idXR0b25cIixcbiAgICAgICAgb25DbGljazogKGU6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgY29uc3QgZGF0YTogeyBba2V5OiBzdHJpbmddOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IH0gPSB7XG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgIGxvZ2luOiBGb3JtRGF0YS5sb2dpbixcbiAgICAgICAgICAgICAgcGFzc3dvcmQ6IEZvcm1EYXRhLnBhc3N3b3JkLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgXCJDb250ZW50LXR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH07XG4gICAgICAgICAgSFRUUFRyYW5zcG9ydC5nZXRJbnN0YW5jZSgpXG4gICAgICAgICAgICAuUE9TVChcIi9hdXRoL3NpZ25pblwiLCBkYXRhKVxuICAgICAgICAgICAgLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgICBpZiAocmVzdWx0LnN0YXR1cyA8IDMwMCkge1xuICAgICAgICAgICAgICAgIHJvdXRlci5nbyhcIi9jaGF0XCIpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgTGlua1RvUmVnaXN0cmF0aW9uOiBCdXR0b24oe1xuICAgICAgICB0aXRsZTogXCLQl9Cw0YDQtdCz0LjRgdGC0YDQuNGA0L7QstCw0YLRjNGB0Y9cIixcbiAgICAgICAgY2xhc3NOYW1lOiBcImZvcm0tbGlua1wiLFxuICAgICAgICBvbkNsaWNrOiAoZTogRXZlbnQpID0+IHtcbiAgICAgICAgICByb3V0ZXIuZ28oXCIvcmVnaXN0cmF0aW9uXCIpO1xuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgfSxcbiAgfSk7XG59O1xuIiwiaW1wb3J0IHsgSFlQTyB9IGZyb20gXCIuLi8uLi8uLi9saWJzL0hZUE8vSFlQT1wiO1xuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSBcIi4uLy4uL0NvbXBvbmVudHMvQnV0dG9uXCI7XG5pbXBvcnQgeyByb3V0ZXIgfSBmcm9tIFwiLi4vLi4vLi5cIjtcbmltcG9ydCB7IEhUVFBUcmFuc3BvcnQgfSBmcm9tIFwiLi4vLi4vLi4vbGlicy9UcmFuc3BvcnRcIjtcblxuZXhwb3J0IGludGVyZmFjZSBJUHJvZmlsZURUTyB7XG4gIGlkOiBudW1iZXI7XG4gIGRpc3BsYXlfbmFtZTogc3RyaW5nO1xuICBlbWFpbDogc3RyaW5nO1xuICBmaXJzdF9uYW1lOiBzdHJpbmc7XG4gIHNlY29uZF9uYW1lOiBzdHJpbmc7XG4gIGxvZ2luOiBzdHJpbmc7XG4gIHBob25lOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjb25zdCBQcm9maWxlTGF5b3V0ID0gKGRhdGE6IElQcm9maWxlRFRPKSA9PiB7XG4gIHJldHVybiBuZXcgSFlQTyh7XG4gICAgcmVuZGVyVG86IDxIVE1MRWxlbWVudD5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3Jvb3RcIiksXG4gICAgdGVtcGxhdGVQYXRoOiBcInByb2ZpbGUudGVtcGxhdGUuaHRtbFwiLFxuICAgIGRhdGE6IHtcbiAgICAgIC4uLmRhdGEsXG4gICAgfSxcbiAgICBjaGlsZHJlbjoge1xuICAgICAgRWRpdFByb2ZpbGVMaW5rOiBCdXR0b24oe1xuICAgICAgICB0aXRsZTogXCLQmNC30LzQtdC90LjRgtGMINC00LDQvdC90YvQtVwiLFxuICAgICAgICBjbGFzc05hbWU6IFwiYWN0aW9uX19jaGFuZ2UtcHJvZmlsZVwiLFxuICAgICAgICBvbkNsaWNrOiAoKSA9PiB7XG4gICAgICAgICAgcm91dGVyLmdvKFwiL2VkaXRwcm9maWxlXCIpO1xuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICBFZGl0UGFzc3dvcmRMaW5rOiBCdXR0b24oe1xuICAgICAgICB0aXRsZTogXCLQmNC30LzQtdC90LjRgtGMINC/0LDRgNC+0LvRjFwiLFxuICAgICAgICBjbGFzc05hbWU6IFwiYWN0aW9uX19jaGFuZ2UtcGFzc3dvcmRcIixcbiAgICAgICAgb25DbGljazogKCkgPT4ge1xuICAgICAgICAgIHJvdXRlci5nbyhcIi9lZGl0cGFzc3dvcmRcIik7XG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICAgIEJhY2tMaW5rOiBCdXR0b24oe1xuICAgICAgICB0aXRsZTogXCLQndCw0LfQsNC0XCIsXG4gICAgICAgIGNsYXNzTmFtZTogXCJhY3Rpb25fX2JhY2tcIixcbiAgICAgICAgb25DbGljazogKCkgPT4ge1xuICAgICAgICAgIHJvdXRlci5nbyhcIi9jaGF0XCIpO1xuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICBFeGl0TGluazogQnV0dG9uKHtcbiAgICAgICAgdGl0bGU6IFwi0JLRi9C50YLQuFwiLFxuICAgICAgICBjbGFzc05hbWU6IFwiYWN0aW9uX19leGl0XCIsXG4gICAgICAgIG9uQ2xpY2s6ICgpID0+IHtcbiAgICAgICAgICBIVFRQVHJhbnNwb3J0LmdldEluc3RhbmNlKClcbiAgICAgICAgICAgIC5QT1NUKFwiL2F1dGgvbG9nb3V0XCIpXG4gICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgIHJvdXRlci5nbyhcIi9cIik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgIH0sXG4gIH0pO1xufTtcbiIsImltcG9ydCB7IEhZUE8gfSBmcm9tIFwiLi4vLi4vLi4vbGlicy9IWVBPL0hZUE9cIjtcbmltcG9ydCB7IElucHV0IH0gZnJvbSBcIi4uLy4uL0NvbXBvbmVudHMvSW5wdXRcIjtcbi8vIGltcG9ydCB7IFZhbGlkYXRvciwgUnVsZSB9IGZyb20gXCIuLi8uLi9saWJzL1ZhbGlkYXRvclwiO1xuaW1wb3J0IHsgVmFsaWRhdG9yIH0gZnJvbSBcIi4uLy4uLy4uL2xpYnMvVmFsaWRhdG9yc1wiO1xuaW1wb3J0IHsgRW1haWxWYWxpZGF0b3IgfSBmcm9tIFwiLi4vLi4vLi4vbGlicy9WYWxpZGF0b3JzL0VtYWlsXCI7XG5pbXBvcnQgeyBSZXF1aXJlZCB9IGZyb20gXCIuLi8uLi8uLi9saWJzL1ZhbGlkYXRvcnMvUmVxdWlyZWRcIjtcbmltcG9ydCB7IEF0dGVudGlvbk1lc3NhZ2UgfSBmcm9tIFwiLi4vLi4vQ29tcG9uZW50cy9BdHRlbnRpb25NZXNzYWdlXCI7XG5pbXBvcnQgeyBldmVudEJ1cyB9IGZyb20gXCIuLi8uLi8uLi9saWJzL0V2ZW50QnVzXCI7XG5pbXBvcnQgeyByb3V0ZXIgfSBmcm9tIFwiLi4vLi4vLi5cIjtcbmltcG9ydCB7IEhUVFBUcmFuc3BvcnQgfSBmcm9tIFwiLi4vLi4vLi4vbGlicy9UcmFuc3BvcnRcIjtcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gXCIuLi8uLi9Db21wb25lbnRzL0J1dHRvblwiO1xuXG5leHBvcnQgY29uc3QgUmVnaXN0cmF0aW9uTGF5b3V0ID0gKCkgPT4ge1xuICBjb25zdCBBdHRlbnRpb25FbWFpbCA9IEF0dGVudGlvbk1lc3NhZ2UoKTtcbiAgY29uc3QgQXR0ZW50aW9uTG9naW4gPSBBdHRlbnRpb25NZXNzYWdlKCk7XG4gIGNvbnN0IEF0dGVudGlvblBhc3N3b3JkID0gQXR0ZW50aW9uTWVzc2FnZSgpO1xuICBjb25zdCBBdHRlbnRpb25QYXNzd29yZERvdWJsZSA9IEF0dGVudGlvbk1lc3NhZ2UoKTtcbiAgY29uc3QgQXR0ZW50aW9uRmlyc3ROYW1lID0gQXR0ZW50aW9uTWVzc2FnZSgpO1xuICBjb25zdCBBdHRlbnRpb25TZWNvbmROYW1lID0gQXR0ZW50aW9uTWVzc2FnZSgpO1xuICBjb25zdCBBdHRlbnRpb25QaG9uZSA9IEF0dGVudGlvbk1lc3NhZ2UoKTtcblxuICBjb25zdCBGb3JtRGF0YTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuXG4gIHJldHVybiBuZXcgSFlQTyh7XG4gICAgcmVuZGVyVG86IDxIVE1MRWxlbWVudD5kb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3Jvb3RcIiksXG4gICAgdGVtcGxhdGVQYXRoOiBcInJlZ2lzdHJhdGlvbi50ZW1wbGF0ZS5odG1sXCIsXG4gICAgZGF0YToge1xuICAgICAgZm9ybVRpdGxlOiBcItCg0LXQs9C40YHRgtGA0LDRhtC40Y9cIixcbiAgICB9LFxuICAgIGNoaWxkcmVuOiB7XG4gICAgICBJbnB1dEVtYWlsOiBJbnB1dCh7XG4gICAgICAgIGxhYmVsOiBcItCf0L7Rh9GC0LBcIixcbiAgICAgICAgdHlwZTogXCJ0ZXh0XCIsXG4gICAgICAgIG5hbWU6IFwiZW1haWxcIixcbiAgICAgICAgaWQ6IFwiZm9ybV9fZW1haWxfX2lucHV0XCIsXG4gICAgICAgIGNsYXNzTmFtZTogXCJmb3JtLXJlZ19fZm9ybS1pbnB1dFwiLFxuICAgICAgICBDaGlsZEF0dGVudGlvbjogQXR0ZW50aW9uRW1haWwsXG4gICAgICAgIG9uQmx1cjogKGU6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgY29uc3Qgc3RhdGUgPSBBdHRlbnRpb25FbWFpbC5nZXRTdGF0ZSgpO1xuICAgICAgICAgIGNvbnN0IGlucHV0ID0gZS50YXJnZXQgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICAgICAgICBpZiAoRW1haWxWYWxpZGF0b3IuY2hlY2tGdW5jKGlucHV0LnZhbHVlKSkge1xuICAgICAgICAgICAgRm9ybURhdGFbXCJlbWFpbFwiXSA9IGlucHV0LnZhbHVlO1xuICAgICAgICAgICAgc3RhdGUubWVzc2FnZSA9IFwiXCI7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0YXRlLm1lc3NhZ2UgPSBcIuKblCDRjdGC0L4g0L3QtSDQv9C+0YXQvtC20LUg0L3QsCDQsNC00YDQtdGBINGN0LvQtdC60YLRgNC+0L3QvdC+0Lkg0L/QvtGH0YLRi1wiO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgSW5wdXRMb2dpbjogSW5wdXQoe1xuICAgICAgICBsYWJlbDogXCLQm9C+0LPQuNC9XCIsXG4gICAgICAgIHR5cGU6IFwidGV4dFwiLFxuICAgICAgICBuYW1lOiBcImxvZ2luXCIsXG4gICAgICAgIGlkOiBcImZvcm1fX2xvZ2luX19pbnB1dFwiLFxuICAgICAgICBjbGFzc05hbWU6IFwiZm9ybS1yZWdfX2Zvcm0taW5wdXRcIixcbiAgICAgICAgQ2hpbGRBdHRlbnRpb246IEF0dGVudGlvbkxvZ2luLFxuICAgICAgICBvbkJsdXI6IChlOiBFdmVudCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHN0YXRlID0gQXR0ZW50aW9uTG9naW4uZ2V0U3RhdGUoKTtcbiAgICAgICAgICBjb25zdCBpbnB1dCA9IGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgICAgICAgaWYgKFJlcXVpcmVkLmNoZWNrRnVuYyhpbnB1dC52YWx1ZSkpIHtcbiAgICAgICAgICAgIEZvcm1EYXRhW1wibG9naW5cIl0gPSBpbnB1dC52YWx1ZTtcbiAgICAgICAgICAgIHN0YXRlLm1lc3NhZ2UgPSBcIlwiO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdGF0ZS5tZXNzYWdlID0gXCLim5Qg0L7QsdGP0LfQsNGC0LXQu9GM0L3QvtC1INC/0L7Qu9C1XCI7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICBGaXJzdE5hbWU6IElucHV0KHtcbiAgICAgICAgbGFiZWw6IFwi0JjQvNGPXCIsXG4gICAgICAgIHR5cGU6IFwidGV4dFwiLFxuICAgICAgICBuYW1lOiBcImZpcnN0X25hbWVcIixcbiAgICAgICAgaWQ6IFwiZm9ybV9fZmlyc3RfbmFtZV9faW5wdXRcIixcbiAgICAgICAgY2xhc3NOYW1lOiBcImZvcm0tcmVnX19mb3JtLWlucHV0XCIsXG4gICAgICAgIENoaWxkQXR0ZW50aW9uOiBBdHRlbnRpb25GaXJzdE5hbWUsXG4gICAgICAgIG9uQmx1cjogKGU6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgY29uc3Qgc3RhdGUgPSBBdHRlbnRpb25GaXJzdE5hbWUuZ2V0U3RhdGUoKTtcbiAgICAgICAgICBjb25zdCBpbnB1dCA9IGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgICAgICAgaWYgKFJlcXVpcmVkLmNoZWNrRnVuYyhpbnB1dC52YWx1ZSkpIHtcbiAgICAgICAgICAgIEZvcm1EYXRhW1wiZmlyc3RfbmFtZVwiXSA9IGlucHV0LnZhbHVlO1xuICAgICAgICAgICAgc3RhdGUubWVzc2FnZSA9IFwiXCI7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0YXRlLm1lc3NhZ2UgPSBcIuKblCDQvtCx0Y/Qt9Cw0YLQtdC70YzQvdC+0LUg0L/QvtC70LVcIjtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICAgIFNlY29uZE5hbWU6IElucHV0KHtcbiAgICAgICAgbGFiZWw6IFwi0KTQsNC80LjQu9C40Y9cIixcbiAgICAgICAgdHlwZTogXCJ0ZXh0XCIsXG4gICAgICAgIG5hbWU6IFwic2Vjb25kX25hbWVcIixcbiAgICAgICAgaWQ6IFwiZm9ybV9fc2Vjb25kX25hbWVfX2lucHV0XCIsXG4gICAgICAgIGNsYXNzTmFtZTogXCJmb3JtLXJlZ19fZm9ybS1pbnB1dFwiLFxuICAgICAgICBDaGlsZEF0dGVudGlvbjogQXR0ZW50aW9uU2Vjb25kTmFtZSxcbiAgICAgICAgb25CbHVyOiAoZTogRXZlbnQpID0+IHtcbiAgICAgICAgICBjb25zdCBzdGF0ZSA9IEF0dGVudGlvblNlY29uZE5hbWUuZ2V0U3RhdGUoKTtcbiAgICAgICAgICBjb25zdCBpbnB1dCA9IGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgICAgICAgaWYgKFJlcXVpcmVkLmNoZWNrRnVuYyhpbnB1dC52YWx1ZSkpIHtcbiAgICAgICAgICAgIEZvcm1EYXRhW1wic2Vjb25kX25hbWVcIl0gPSBpbnB1dC52YWx1ZTtcbiAgICAgICAgICAgIHN0YXRlLm1lc3NhZ2UgPSBcIlwiO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdGF0ZS5tZXNzYWdlID0gXCLim5Qg0L7QsdGP0LfQsNGC0LXQu9GM0L3QvtC1INC/0L7Qu9C1XCI7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICBQaG9uZTogSW5wdXQoe1xuICAgICAgICBsYWJlbDogXCLQotC10LvQtdGE0L7QvVwiLFxuICAgICAgICB0eXBlOiBcInRleHRcIixcbiAgICAgICAgbmFtZTogXCJwaG9uZVwiLFxuICAgICAgICBpZDogXCJmb3JtX19waG9uZV9faW5wdXRcIixcbiAgICAgICAgY2xhc3NOYW1lOiBcImZvcm0tcmVnX19mb3JtLWlucHV0XCIsXG4gICAgICAgIENoaWxkQXR0ZW50aW9uOiBBdHRlbnRpb25QaG9uZSxcbiAgICAgICAgb25CbHVyOiAoZTogRXZlbnQpID0+IHtcbiAgICAgICAgICBjb25zdCBzdGF0ZSA9IEF0dGVudGlvblBob25lLmdldFN0YXRlKCk7XG4gICAgICAgICAgY29uc3QgaW5wdXQgPSBlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgICAgICAgIGlmIChSZXF1aXJlZC5jaGVja0Z1bmMoaW5wdXQudmFsdWUpKSB7XG4gICAgICAgICAgICBGb3JtRGF0YVtcInBob25lXCJdID0gaW5wdXQudmFsdWU7XG4gICAgICAgICAgICBzdGF0ZS5tZXNzYWdlID0gXCJcIjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RhdGUubWVzc2FnZSA9IFwi4puUINC+0LHRj9C30LDRgtC10LvRjNC90L7QtSDQv9C+0LvQtVwiO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgUGFzc3dvcmQ6IElucHV0KHtcbiAgICAgICAgbGFiZWw6IFwi0J/QsNGA0L7Qu9GMXCIsXG4gICAgICAgIHR5cGU6IFwicGFzc3dvcmRcIixcbiAgICAgICAgbmFtZTogXCJwYXNzd29yZFwiLFxuICAgICAgICBpZDogXCJmb3JtX19wYXNzd29yZF9faW5wdXRcIixcbiAgICAgICAgY2xhc3NOYW1lOiBcImZvcm0tcmVnX19mb3JtLWlucHV0XCIsXG4gICAgICAgIENoaWxkQXR0ZW50aW9uOiBBdHRlbnRpb25QYXNzd29yZCxcbiAgICAgICAgb25CbHVyOiAoZTogRXZlbnQpID0+IHtcbiAgICAgICAgICBjb25zdCBpbnB1dCA9IGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgICAgICAgY29uc3Qgc3RhdGUgPSBBdHRlbnRpb25QYXNzd29yZC5nZXRTdGF0ZSgpO1xuICAgICAgICAgIGNvbnN0IHN0YXRlRCA9IEF0dGVudGlvblBhc3N3b3JkRG91YmxlLmdldFN0YXRlKCk7XG4gICAgICAgICAgaWYgKFJlcXVpcmVkLmNoZWNrRnVuYyhpbnB1dC52YWx1ZSkpIHtcbiAgICAgICAgICAgIEZvcm1EYXRhW1wicGFzc3dvcmRcIl0gPSBpbnB1dC52YWx1ZTtcbiAgICAgICAgICAgIHN0YXRlLm1lc3NhZ2UgPSBcIlwiO1xuICAgICAgICAgICAgaWYgKEZvcm1EYXRhW1wicGFzc3dvcmRcIl0gIT09IEZvcm1EYXRhW1wiZG91YmxlcGFzc3dvcmRcIl0pIHtcbiAgICAgICAgICAgICAgc3RhdGVELm1lc3NhZ2UgPSBcIvCflKXQv9Cw0YDQvtC70Lgg0L3QtSDRgdC+0LLQv9Cw0LTQsNGO0YJcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RhdGUubWVzc2FnZSA9IFwi4puUINC+0LHRj9C30LDRgtC10LvRjNC90L7QtSDQv9C+0LvQtVwiO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgUGFzc3dvcmREb3VibGU6IElucHV0KHtcbiAgICAgICAgbGFiZWw6IFwi0J/QsNGA0L7Qu9GMXCIsXG4gICAgICAgIHR5cGU6IFwicGFzc3dvcmRcIixcbiAgICAgICAgbmFtZTogXCJkb3VibGVwYXNzd29yZFwiLFxuICAgICAgICBpZDogXCJmb3JtX19kb3VibGVwYXNzd29yZF9faW5wdXRcIixcbiAgICAgICAgY2xhc3NOYW1lOiBcImZvcm0tcmVnX19mb3JtLWlucHV0XCIsXG4gICAgICAgIENoaWxkQXR0ZW50aW9uOiBBdHRlbnRpb25QYXNzd29yZERvdWJsZSxcbiAgICAgICAgb25CbHVyOiAoZTogRXZlbnQpID0+IHtcbiAgICAgICAgICBjb25zdCBpbnB1dCA9IGUudGFyZ2V0IGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgICAgICAgY29uc3Qgc3RhdGUgPSBBdHRlbnRpb25QYXNzd29yZERvdWJsZS5nZXRTdGF0ZSgpO1xuICAgICAgICAgIGlmIChSZXF1aXJlZC5jaGVja0Z1bmMoaW5wdXQudmFsdWUpKSB7XG4gICAgICAgICAgICBGb3JtRGF0YVtcImRvdWJsZXBhc3N3b3JkXCJdID0gaW5wdXQudmFsdWU7XG4gICAgICAgICAgICBzdGF0ZS5tZXNzYWdlID0gXCJcIjtcbiAgICAgICAgICAgIGlmIChGb3JtRGF0YVtcInBhc3N3b3JkXCJdICE9PSBGb3JtRGF0YVtcImRvdWJsZXBhc3N3b3JkXCJdKSB7XG4gICAgICAgICAgICAgIHN0YXRlLm1lc3NhZ2UgPSBcIvCflKXQv9Cw0YDQvtC70Lgg0L3QtSDRgdC+0LLQv9Cw0LTQsNGO0YJcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RhdGUubWVzc2FnZSA9IFwi4puUINC+0LHRj9C30LDRgtC10LvRjNC90L7QtSDQv9C+0LvQtVwiO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgUmVnQnV0dG9uOiBCdXR0b24oe1xuICAgICAgICB0aXRsZTogXCLQl9Cw0YDQtdCz0LjRgdGC0YDQuNGA0L7QstCw0YLRjNGB0Y9cIixcbiAgICAgICAgY2xhc3NOYW1lOiBcImZvcm0tYnV0dG9uXCIsXG4gICAgICAgIG9uQ2xpY2s6IChlOiBFdmVudCkgPT4ge1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIE9iamVjdC5rZXlzKEZvcm1EYXRhKS5sZW5ndGggPT0gMCB8fFxuICAgICAgICAgICAgT2JqZWN0LmtleXMoRm9ybURhdGEpLmZpbmQoKGl0ZW0pID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIEZvcm1EYXRhW2l0ZW1dID09PSBcIlwiO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgZGF0YTogeyBba2V5OiBzdHJpbmddOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IH0gPSB7XG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgIGZpcnN0X25hbWU6IEZvcm1EYXRhLmZpcnN0X25hbWUsXG4gICAgICAgICAgICAgIHNlY29uZF9uYW1lOiBGb3JtRGF0YS5zZWNvbmRfbmFtZSxcbiAgICAgICAgICAgICAgbG9naW46IEZvcm1EYXRhLmxvZ2luLFxuICAgICAgICAgICAgICBlbWFpbDogRm9ybURhdGEuZW1haWwsXG4gICAgICAgICAgICAgIHBhc3N3b3JkOiBGb3JtRGF0YS5wYXNzd29yZCxcbiAgICAgICAgICAgICAgcGhvbmU6IEZvcm1EYXRhLnBob25lLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgXCJDb250ZW50LXR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH07XG4gICAgICAgICAgSFRUUFRyYW5zcG9ydC5nZXRJbnN0YW5jZSgpLlBPU1QoXCIvYXV0aC9zaWdudXBcIiwgZGF0YSk7XG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICAgIExvZ2luTGluazogQnV0dG9uKHtcbiAgICAgICAgdGl0bGU6IFwi0JLQvtC50YLQuFwiLFxuICAgICAgICBjbGFzc05hbWU6IFwiZm9ybS1saW5rXCIsXG4gICAgICAgIG9uQ2xpY2s6IChlOiBFdmVudCkgPT4ge1xuICAgICAgICAgIHJvdXRlci5nbyhcIi9cIik7XG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICB9LFxuICB9KTtcbn07XG4iLCJpbXBvcnQgeyBJQ2hhdFNlcnZpY2UgfSBmcm9tIFwiLi4vLi4vQnVzc2luZXNMYXllci9DaGF0U2VydmljZVwiO1xuaW1wb3J0IHsgSUNoYXREVE8gfSBmcm9tIFwiLi4vLi4vVUkvQ29tcG9uZW50cy9DaGF0SXRlbVwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIElDaGF0Vmlld01vZGVsIHtcbiAgY2hhdHM6IEFycmF5PElDaGF0RFRPPjtcbiAgZ2V0Q2hhdHM6ICgpID0+IFByb21pc2U8SUNoYXREVE9bXT47XG4gIHNhdmVDaGF0OiAoZGF0YTogUmVjb3JkPHN0cmluZywgc3RyaW5nPikgPT4gUHJvbWlzZTx2b2lkPjtcbiAgZGVsZXRlQ2hhdDogKGNoYXRJZDogc3RyaW5nKSA9PiBQcm9taXNlPHZvaWQ+O1xufVxuZXhwb3J0IGNsYXNzIENoYXRWaWV3TW9kZWwgaW1wbGVtZW50cyBJQ2hhdFZpZXdNb2RlbCB7XG4gIGNoYXRzOiBBcnJheTxJQ2hhdERUTz4gPSBbXTtcbiAgeDogbnVtYmVyID0gMTI7XG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBzZXJ2aWNlOiBJQ2hhdFNlcnZpY2UpIHt9XG5cbiAgZ2V0Q2hhdHMgPSBhc3luYyAoKSA9PiB7XG4gICAgdGhpcy5jaGF0cyA9IGF3YWl0IHRoaXMuc2VydmljZS5nZXRDaGF0cygpO1xuICAgIHJldHVybiB0aGlzLmNoYXRzO1xuICB9O1xuXG4gIHNhdmVDaGF0ID0gYXN5bmMgKGRhdGE6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4pID0+IHtcbiAgICBhd2FpdCB0aGlzLnNlcnZpY2Uuc2F2ZUNoYXQoZGF0YSk7XG4gICAgYXdhaXQgdGhpcy5nZXRDaGF0cygpO1xuICB9O1xuXG4gIGRlbGV0ZUNoYXQgPSBhc3luYyAoY2hhdElkOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+ID0+IHtcbiAgICBhd2FpdCB0aGlzLnNlcnZpY2UuZGVsZXRlQ2hhdChjaGF0SWQpO1xuICAgIGF3YWl0IHRoaXMuZ2V0Q2hhdHMoKTtcbiAgfTtcbn1cbiIsImltcG9ydCB7IElVc2VyU2VydmljZSB9IGZyb20gXCIuLi8uLi9CdXNzaW5lc0xheWVyL1VzZXJTZXJ2aWNlXCI7XG5pbXBvcnQgeyBJUHJvZmlsZURUTyB9IGZyb20gXCIuLi8uLi9VSS9MYXlvdXRzL1Byb2ZpbGVcIjtcblxuZXhwb3J0IGludGVyZmFjZSBJVXNlclZpZXdNb2RlbCB7XG4gIHVzZXI/OiBJUHJvZmlsZURUTztcbiAgZ2V0VXNlcjogKCkgPT4gUHJvbWlzZTx2b2lkPjtcbn1cblxuZXhwb3J0IGNsYXNzIFVzZXJWaWV3TW9kZWwgaW1wbGVtZW50cyBJVXNlclZpZXdNb2RlbCB7XG4gIHVzZXI/OiBJUHJvZmlsZURUTztcbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIHNlcnZpY2U6IElVc2VyU2VydmljZSkge31cbiAgZ2V0VXNlciA9IGFzeW5jICgpID0+IHtcbiAgICB0aGlzLnVzZXIgPSBhd2FpdCB0aGlzLnNlcnZpY2UuZ2V0VXNlcigpO1xuICB9O1xufVxuIiwiaW1wb3J0IHsgU0VSVklDRSB9IGZyb20gXCIuLi9CdXNzaW5lc0xheWVyXCI7XG5pbXBvcnQgeyBJQ2hhdFNlcnZpY2UgfSBmcm9tIFwiLi4vQnVzc2luZXNMYXllci9DaGF0U2VydmljZVwiO1xuaW1wb3J0IHsgSVVzZXJTZXJ2aWNlIH0gZnJvbSBcIi4uL0J1c3NpbmVzTGF5ZXIvVXNlclNlcnZpY2VcIjtcbmltcG9ydCB7IENvbnRhaW5lciB9IGZyb20gXCIuLi9saWJzL0NvbnRhaW5lclwiO1xuaW1wb3J0IHsgQ2hhdFZpZXdNb2RlbCB9IGZyb20gXCIuL0NoYXRWaWV3TW9kZWxcIjtcbmltcG9ydCB7IFVzZXJWaWV3TW9kZWwgfSBmcm9tIFwiLi9Vc2VyVmlld01vZGVsXCI7XG5cbmV4cG9ydCBjb25zdCBWSUVXX01PREVMID0ge1xuICBDSEFUOiBTeW1ib2wuZm9yKFwiQ2hhdFZpZXdNb2RlbFwiKSxcbiAgVVNFUjogU3ltYm9sLmZvcihcIlVzZXJWaWV3TW9kZWxcIiksXG59O1xuXG5leHBvcnQgY29uc3QgVmlld01vZGVsQ29udGFpbmVyID0gbmV3IENvbnRhaW5lcigpO1xuXG5WaWV3TW9kZWxDb250YWluZXIuYmluZChWSUVXX01PREVMLkNIQVQpLnRvRHluYW1pY1ZhbHVlKChjb250YWluZXIpID0+IHtcbiAgY29uc3Qgc2VydmljZSA9IGNvbnRhaW5lci5nZXQ8SUNoYXRTZXJ2aWNlPihTRVJWSUNFLkNIQVQpO1xuICByZXR1cm4gbmV3IENoYXRWaWV3TW9kZWwoc2VydmljZSk7XG59KTtcblxuVmlld01vZGVsQ29udGFpbmVyLmJpbmQoVklFV19NT0RFTC5VU0VSKS50b0R5bmFtaWNWYWx1ZSgoY29udGFpbmVyKSA9PiB7XG4gIGNvbnN0IHNlcnZpY2UgPSBjb250YWluZXIuZ2V0PElVc2VyU2VydmljZT4oU0VSVklDRS5VU0VSKTtcbiAgcmV0dXJuIG5ldyBVc2VyVmlld01vZGVsKHNlcnZpY2UpO1xufSk7XG4iLCJpbXBvcnQgeyBCb290U3RyYXAgfSBmcm9tIFwiLi9Cb290c3RyYXBcIjtcbmltcG9ydCB7IFJvdXRlckluaXQgfSBmcm9tIFwiLi9yb3V0ZXJcIjtcblxuY29uc3QgSW5pdEFwcCA9ICgpID0+IHtcbiAgY29uc3QgeyBjb250YWluZXIgfSA9IG5ldyBCb290U3RyYXAoKTtcbiAgY29uc3Qgcm91dGVyID0gUm91dGVySW5pdChjb250YWluZXIpO1xuICByZXR1cm4geyByb3V0ZXIsIGNvbnRhaW5lciB9O1xufTtcblxuZXhwb3J0IGNvbnN0IHsgcm91dGVyLCBjb250YWluZXIgfSA9IEluaXRBcHAoKTtcbiIsImV4cG9ydCBjbGFzcyBDb250YWluZXIge1xuICBjb250YWluZXJzOiBNYXA8c3ltYm9sLCBhbnk+ID0gbmV3IE1hcCgpO1xuICBsYXN0SWQ/OiBzeW1ib2w7XG4gIGNvbnN0cnVjdG9yKCkge31cbiAgYmluZChpZDogc3ltYm9sKTogQ29udGFpbmVyIHtcbiAgICB0aGlzLmxhc3RJZCA9IGlkO1xuICAgIHRoaXMuY29udGFpbmVycy5zZXQoaWQsIG51bGwpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIGdldCA9IDxUPihpZDogc3ltYm9sKTogVCA9PiB7XG4gICAgY29uc3QgY3JlYXRlQ29udGFpbmVyRm4gPSB0aGlzLmNvbnRhaW5lcnMuZ2V0KGlkKTtcbiAgICBjb25zdCBjcmVhdGVDb250YWluZXIgPSBjcmVhdGVDb250YWluZXJGbi5mbih0aGlzKTtcbiAgICByZXR1cm4gY3JlYXRlQ29udGFpbmVyO1xuICB9O1xuXG4gIHRvRHluYW1pY1ZhbHVlKGZuOiAoY29udGFpbmVyOiBDb250YWluZXIpID0+IHVua25vd24pIHtcbiAgICBpZiAodGhpcy5sYXN0SWQpXG4gICAgICB0aGlzLmNvbnRhaW5lcnMuc2V0KHRoaXMubGFzdElkLCB7IGZuOiBmbiwgaWQ6IHRoaXMubGFzdElkIH0pO1xuICB9XG5cbiAgcGFyZW50KGNvbnRhaW5lcjogQ29udGFpbmVyKTogQ29udGFpbmVyIHtcbiAgICBmb3IgKGxldCBjb250IG9mIGNvbnRhaW5lci5jb250YWluZXJzKSB7XG4gICAgICB0aGlzLmNvbnRhaW5lcnMuc2V0KGNvbnRbMF0sIGNvbnRbMV0pO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxufVxuXG4vLyBjb25zdCBWSUVXX01PREVMID0ge1xuLy8gICBDaGF0OiBTeW1ib2wuZm9yKFwiQ2hhdFZpZXdNb2RlbFwiKSxcbi8vIH07XG5cbi8vIGNvbnN0IFNFUlZJQ0UgPSB7XG4vLyAgIENIQVQ6IFN5bWJvbC5mb3IoXCJDaGF0U2VydmljZVwiKSxcbi8vIH07XG5cbi8vIGNvbnN0IFZpZXdNb2RlbENvbnRhaW5lciA9IG5ldyBDb250YWluZXIoKTtcbi8vIGNvbnN0IFNlcnZpY2VDb250YWluZXIgPSBuZXcgQ29udGFpbmVyKCk7XG5cbi8vIGNsYXNzIFMge1xuLy8gICBjb25zdHJ1Y3RvcihwdWJsaWMgdjogVikge31cbi8vICAgeDogbnVtYmVyID0gMTtcbi8vIH1cblxuLy8gY2xhc3MgViB7XG4vLyAgIHk6IG51bWJlciA9IDI7XG4vLyB9XG5cbi8vIFZpZXdNb2RlbENvbnRhaW5lci5iaW5kKFZJRVdfTU9ERUwuQ2hhdCkudG9EeW5hbWljVmFsdWUoKGNvbnRhaW5lcikgPT4ge1xuLy8gICByZXR1cm4gbmV3IFYoKTtcbi8vIH0pO1xuXG4vLyBTZXJ2aWNlQ29udGFpbmVyLmJpbmQoU0VSVklDRS5DSEFUKS50b0R5bmFtaWNWYWx1ZSgoY29udGFpbmVyKSA9PiB7XG4vLyAgIGNvbnN0IHZpZXdNb2RlbENvbnRhaW5lciA9IGNvbnRhaW5lci5nZXQ8Vj4oVklFV19NT0RFTC5DaGF0KTtcbi8vICAgcmV0dXJuIG5ldyBTKHZpZXdNb2RlbENvbnRhaW5lcik7XG4vLyB9KTtcblxuLy8gU2VydmljZUNvbnRhaW5lci5wYXJlbnQoVmlld01vZGVsQ29udGFpbmVyKTtcblxuLy8gY29uc3Qgc2VydmljZSA9IFNlcnZpY2VDb250YWluZXIuZ2V0PFM+KFNFUlZJQ0UuQ0hBVCk7XG4vLyBjb25zb2xlLmxvZyhzZXJ2aWNlKTtcblxuLy8gY29uc3Qgdmlld01vZGVsID0gU2VydmljZUNvbnRhaW5lci5nZXQ8Vj4oVklFV19NT0RFTC5DaGF0KTtcbi8vIGNvbnNvbGUubG9nKHZpZXdNb2RlbCk7XG4iLCJpbXBvcnQgeyB1dWlkdjQgfSBmcm9tIFwiLi4vdXRpbHNcIjtcbmludGVyZmFjZSBJSFlQT1Byb3BzIHtcbiAgcmVuZGVyVG8/OiBIVE1MRWxlbWVudDtcbiAgdGVtcGxhdGVQYXRoOiBzdHJpbmc7XG4gIGNoaWxkcmVuPzogUmVjb3JkPHN0cmluZywgSFlQTyB8IEhZUE9bXT47XG4gIGRhdGE6IFJlY29yZDxzdHJpbmcsIHVua25vd24+O1xufVxuXG5pbnRlcmZhY2UgSVRlbXBhdGVQcm9wIHtcbiAgaHRtbDogc3RyaW5nO1xuICB0ZW1wbGF0ZUtleTogc3RyaW5nO1xuICBtYWdpY0tleTogc3RyaW5nO1xuICBpc0FycmF5OiBib29sZWFuO1xufVxuXG5leHBvcnQgY2xhc3MgSFlQTyB7XG4gIHByaXZhdGUgcmVuZGVyVG8/OiBIVE1MRWxlbWVudDtcbiAgcHJpdmF0ZSBjaGlsZHJlbj86IFJlY29yZDxzdHJpbmcsIEhZUE8gfCBIWVBPW10+O1xuICBwcml2YXRlIHRlbXBsYXRlUGF0aDogc3RyaW5nO1xuICBwcml2YXRlIGRhdGE6IFJlY29yZDxzdHJpbmcsIHVua25vd24+O1xuICBwcml2YXRlIHRlbXBsYXRlc1Byb21pc2VzOiBQcm9taXNlPElUZW1wYXRlUHJvcD5bXTtcbiAgcHJpdmF0ZSBzdG9yZTogUmVjb3JkPHN0cmluZywgdW5rbm93bj47XG4gIHByaXZhdGUgbWFnaWNLZXk6IHN0cmluZztcbiAgcHJpdmF0ZSBhZnRlclJlbmRlckNhbGxiYWNrOiAoKSA9PiB2b2lkO1xuICBwcml2YXRlIGFmdGVyUmVuZGVyQ2FsbGJhY2tBcnI6IFNldDwoKSA9PiB2b2lkPjtcblxuICBjb25zdHJ1Y3RvcihwYXJhbXM6IElIWVBPUHJvcHMpIHtcbiAgICB0aGlzLnJlbmRlclRvID0gcGFyYW1zLnJlbmRlclRvO1xuICAgIHRoaXMuZGF0YSA9IHBhcmFtcy5kYXRhO1xuICAgIHRoaXMudGVtcGxhdGVQYXRoID0gYC4vdGVtcGxhdGVzLyR7cGFyYW1zLnRlbXBsYXRlUGF0aH1gO1xuICAgIHRoaXMuY2hpbGRyZW4gPSBwYXJhbXMuY2hpbGRyZW47XG4gICAgdGhpcy50ZW1wbGF0ZXNQcm9taXNlcyA9IFtdO1xuICAgIHRoaXMuc3RvcmUgPSB7fTtcbiAgICB0aGlzLm1hZ2ljS2V5ID0gdXVpZHY0KCk7XG4gICAgdGhpcy5hZnRlclJlbmRlckNhbGxiYWNrID0gKCkgPT4ge307XG4gICAgdGhpcy5hZnRlclJlbmRlckNhbGxiYWNrQXJyID0gbmV3IFNldCgpO1xuICB9XG5cbiAgLy9AdG9kbzog0L/RgNC40LrRgNGD0YLQuNGC0Ywg0LzQtdC80L7QuNC30LDRhtC40Y5cblxuICBwdWJsaWMgZ2V0VGVtcGxhdGVIVE1MKFxuICAgIGtleTogc3RyaW5nLFxuICAgIGh5cG86IEhZUE8sXG4gICAgaXNBcnJheTogYm9vbGVhblxuICApOiBQcm9taXNlPElUZW1wYXRlUHJvcD4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZTxJVGVtcGF0ZVByb3A+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGZldGNoKGh5cG8udGVtcGxhdGVQYXRoKVxuICAgICAgICAudGhlbigoaHRtbCkgPT4ge1xuICAgICAgICAgIGlmIChodG1sLnN0YXR1cyAhPT0gMjAwKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJmaWxlIGRvIG5vdCBkb3dubG9hZFwiKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGh0bWwuYmxvYigpO1xuICAgICAgICB9KVxuICAgICAgICAudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdC50ZXh0KCk7XG4gICAgICAgIH0pXG4gICAgICAgIC50aGVuKCh0ZXh0KSA9PiB7XG4gICAgICAgICAgdGV4dCA9IHRoaXMuaW5zZXJ0RGF0YUludG9IVE1MKHRleHQsIGh5cG8uZGF0YSk7XG4gICAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgICBodG1sOiB0ZXh0LFxuICAgICAgICAgICAgdGVtcGxhdGVLZXk6IGtleSxcbiAgICAgICAgICAgIG1hZ2ljS2V5OiBoeXBvLm1hZ2ljS2V5LFxuICAgICAgICAgICAgaXNBcnJheTogaXNBcnJheSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSlcbiAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGNvbGxlY3RUZW1wbGF0ZXMoXG4gICAgaHlwbzogSFlQTyB8IEhZUE9bXSxcbiAgICBuYW1lOiBzdHJpbmcsXG4gICAgaXNBcnJheTogYm9vbGVhblxuICApOiBIWVBPIHtcbiAgICBpZiAoQXJyYXkuaXNBcnJheShoeXBvKSkge1xuICAgICAgdGhpcy5oYW5kbGVBcnJheUhZUE8oaHlwbywgbmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaGFuZGxlU2ltcGxlSFlQTyhoeXBvLCBuYW1lKTtcbiAgICAgIHRoaXMudGVtcGxhdGVzUHJvbWlzZXMucHVzaCh0aGlzLmdldFRlbXBsYXRlSFRNTChuYW1lLCBoeXBvLCBpc0FycmF5KSk7XG4gICAgICB0aGlzLmFmdGVyUmVuZGVyQ2FsbGJhY2tBcnIuYWRkKGh5cG8uYWZ0ZXJSZW5kZXJDYWxsYmFjayk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcHJpdmF0ZSBoYW5kbGVBcnJheUhZUE8oaHlwb3M6IEhZUE9bXSwgbmFtZTogc3RyaW5nKTogdm9pZCB7XG4gICAgaHlwb3MuZm9yRWFjaCgoaHlwbykgPT4ge1xuICAgICAgdGhpcy5jb2xsZWN0VGVtcGxhdGVzKGh5cG8sIGAke25hbWV9YCwgdHJ1ZSk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGhhbmRsZVNpbXBsZUhZUE8oaHlwbzogSFlQTywgbmFtZTogc3RyaW5nKTogdm9pZCB7XG4gICAgaWYgKGh5cG8uY2hpbGRyZW4pIHtcbiAgICAgIE9iamVjdC5rZXlzKGh5cG8uY2hpbGRyZW4pLmZvckVhY2goKGNoaWxkTmFtZSkgPT4ge1xuICAgICAgICBpZiAoaHlwby5jaGlsZHJlbikge1xuICAgICAgICAgIHJldHVybiB0aGlzLmNvbGxlY3RUZW1wbGF0ZXMoXG4gICAgICAgICAgICBoeXBvLmNoaWxkcmVuW2NoaWxkTmFtZV0sXG4gICAgICAgICAgICBjaGlsZE5hbWUsXG4gICAgICAgICAgICBmYWxzZVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgaW5zZXJ0RGF0YUludG9IVE1MKFxuICAgIGh0bWxUZW1wbGF0ZTogc3RyaW5nLFxuICAgIGRhdGE6IFJlY29yZDxzdHJpbmcsIHVua25vd24+XG4gICk6IHN0cmluZyB7XG4gICAgZGF0YSA9IHRoaXMuZ2V0RGF0YVdpdGhvdXRJZXJhcmh5KGRhdGEpO1xuICAgIGZvciAobGV0IGtleSBpbiBkYXRhKSB7XG4gICAgICBpZiAodHlwZW9mIGRhdGFba2V5XSAhPT0gXCJvYmplY3RcIiB8fCBkYXRhW2tleV0gPT09IG51bGwpIHtcbiAgICAgICAgY29uc3QgbWFzayA9IG5ldyBSZWdFeHAoXCJ7e1wiICsga2V5ICsgXCJ9fVwiLCBcImdcIik7XG4gICAgICAgIGh0bWxUZW1wbGF0ZSA9IGh0bWxUZW1wbGF0ZS5yZXBsYWNlKG1hc2ssIFN0cmluZyhkYXRhW2tleV0pKTtcbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgbWFzayA9IG5ldyBSZWdFeHAoL3t7W2Etei5fXSt9fS9nKTtcbiAgICBodG1sVGVtcGxhdGUgPSBodG1sVGVtcGxhdGUucmVwbGFjZShtYXNrLCBcIlwiKTtcbiAgICByZXR1cm4gaHRtbFRlbXBsYXRlO1xuICB9XG5cbiAgcHJpdmF0ZSBjb252ZXJ0QXJyVGVtcGxhdGVUb01hcChcbiAgICB0ZW1wbGF0ZUFycjoge1xuICAgICAgaHRtbDogc3RyaW5nO1xuICAgICAgdGVtcGxhdGVLZXk6IHN0cmluZztcbiAgICAgIG1hZ2ljS2V5OiBzdHJpbmc7XG4gICAgICBpc0FycmF5OiBib29sZWFuIHwgdW5kZWZpbmVkO1xuICAgIH1bXVxuICApOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IHtcbiAgICBjb25zdCByZXN1bHQ6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcbiAgICB0ZW1wbGF0ZUFyci5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICBpZiAocmVzdWx0W2l0ZW0udGVtcGxhdGVLZXldKSB7XG4gICAgICAgIHJlc3VsdFtcbiAgICAgICAgICBpdGVtLnRlbXBsYXRlS2V5XG4gICAgICAgIF0gKz0gYDxzcGFuIGh5cG89XCIke2l0ZW0ubWFnaWNLZXl9XCI+JHtpdGVtLmh0bWx9PC9zcGFuPmA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHRbYCR7aXRlbS50ZW1wbGF0ZUtleX0tJHtpdGVtLm1hZ2ljS2V5fWBdID0gaXRlbS5odG1sO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHByaXZhdGUgaW5zZXJ0VGVtcGxhdGVJbnRvVGVtcGxhdGUoXG4gICAgcm9vdFRlbXBsYXRlSFRNTDogc3RyaW5nLFxuICAgIHRlbXBsYXRlS2V5OiBzdHJpbmcsXG4gICAgY2hpbGRUZW1wbGF0ZUhUTUw6IHN0cmluZyxcbiAgICBtYWdpY0tleTogc3RyaW5nLFxuICAgIGlzQXJyYXk6IGJvb2xlYW5cbiAgKTogc3RyaW5nIHtcbiAgICByb290VGVtcGxhdGVIVE1MID0gdGhpcy5jcmVhdGVFbGVtV3JhcHBlcihcbiAgICAgIHJvb3RUZW1wbGF0ZUhUTUwsXG4gICAgICB0ZW1wbGF0ZUtleSxcbiAgICAgIG1hZ2ljS2V5LFxuICAgICAgaXNBcnJheVxuICAgICk7XG4gICAgY29uc3QgbWFzayA9IG5ldyBSZWdFeHAoYC09JHt0ZW1wbGF0ZUtleX0tJHttYWdpY0tleX09LWAsIFwiZ1wiKTtcbiAgICByb290VGVtcGxhdGVIVE1MID0gcm9vdFRlbXBsYXRlSFRNTC5yZXBsYWNlKG1hc2ssIGNoaWxkVGVtcGxhdGVIVE1MKTtcbiAgICByZXR1cm4gcm9vdFRlbXBsYXRlSFRNTDtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlRWxlbVdyYXBwZXIoXG4gICAgaHRtbFRlbXBsYXRlOiBzdHJpbmcsXG4gICAgdGVtcGxhdGVLZXk6IHN0cmluZyxcbiAgICBtYWdpY0tleTogc3RyaW5nLFxuICAgIGlzQXJyYXk6IGJvb2xlYW5cbiAgKSB7XG4gICAgY29uc3QgbWFzayA9IG5ldyBSZWdFeHAoYC09JHt0ZW1wbGF0ZUtleX09LWAsIFwiZ1wiKTtcbiAgICBpZiAoaXNBcnJheSkge1xuICAgICAgaHRtbFRlbXBsYXRlID0gaHRtbFRlbXBsYXRlLnJlcGxhY2UoXG4gICAgICAgIG1hc2ssXG4gICAgICAgIGA8c3BhbiBoeXBvPVwiJHttYWdpY0tleX1cIj4tPSR7dGVtcGxhdGVLZXl9LSR7bWFnaWNLZXl9PS0tPSR7dGVtcGxhdGVLZXl9PS08L3NwYW4+YFxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaHRtbFRlbXBsYXRlID0gaHRtbFRlbXBsYXRlLnJlcGxhY2UoXG4gICAgICAgIG1hc2ssXG4gICAgICAgIGA8c3BhbiBoeXBvPVwiJHttYWdpY0tleX1cIj4tPSR7dGVtcGxhdGVLZXl9LSR7bWFnaWNLZXl9PS08L3NwYW4+YFxuICAgICAgKTtcbiAgICB9XG5cbiAgICByZXR1cm4gaHRtbFRlbXBsYXRlO1xuICB9XG5cbiAgcHJpdmF0ZSBjbGVhckVtdHB5Q29tcG9uZW50KGh0bWw6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgY29uc3QgcmVnZXggPSAvLT1bYS16LEEtWiwwLTldKz0tL2c7XG4gICAgcmV0dXJuIGh0bWwucmVwbGFjZShyZWdleCwgXCJcIik7XG4gIH1cblxuICBwdWJsaWMgcmVuZGVyID0gYXN5bmMgKCk6IFByb21pc2U8SFlQTz4gPT4ge1xuICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xuICAgIHJldHVybiBQcm9taXNlLmFsbChcbiAgICAgIHRoaXMuY29sbGVjdFRlbXBsYXRlcyh0aGlzLCBcInJvb3RcIiwgZmFsc2UpLnRlbXBsYXRlc1Byb21pc2VzXG4gICAgKS50aGVuKChhcnJheVRlbXBsYXRlcykgPT4ge1xuICAgICAgY29uc3QgbWFwVGVtcGxhdGVzID0gdGhpcy5jb252ZXJ0QXJyVGVtcGxhdGVUb01hcChhcnJheVRlbXBsYXRlcyk7XG4gICAgICBsZXQgcm9vdFRlbXBsYXRlSFRNTDogc3RyaW5nID1cbiAgICAgICAgYXJyYXlUZW1wbGF0ZXNbYXJyYXlUZW1wbGF0ZXMubGVuZ3RoIC0gMV0uaHRtbDtcbiAgICAgIGZvciAobGV0IGkgPSBhcnJheVRlbXBsYXRlcy5sZW5ndGggLSAyOyBpID49IDA7IGktLSkge1xuICAgICAgICBsZXQgdGVtcGxhdGUgPVxuICAgICAgICAgIG1hcFRlbXBsYXRlc1tcbiAgICAgICAgICAgIGAke2FycmF5VGVtcGxhdGVzW2ldLnRlbXBsYXRlS2V5fS0ke2FycmF5VGVtcGxhdGVzW2ldLm1hZ2ljS2V5fWBcbiAgICAgICAgICBdO1xuICAgICAgICByb290VGVtcGxhdGVIVE1MID0gdGhpcy5pbnNlcnRUZW1wbGF0ZUludG9UZW1wbGF0ZShcbiAgICAgICAgICByb290VGVtcGxhdGVIVE1MLFxuICAgICAgICAgIGFycmF5VGVtcGxhdGVzW2ldLnRlbXBsYXRlS2V5LFxuICAgICAgICAgIHRlbXBsYXRlLFxuICAgICAgICAgIGFycmF5VGVtcGxhdGVzW2ldLm1hZ2ljS2V5LFxuICAgICAgICAgIGFycmF5VGVtcGxhdGVzW2ldLmlzQXJyYXlcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgcm9vdFRlbXBsYXRlSFRNTCA9IHRoaXMuY2xlYXJFbXRweUNvbXBvbmVudChyb290VGVtcGxhdGVIVE1MKTtcblxuICAgICAgaWYgKHRoaXMucmVuZGVyVG8pIHtcbiAgICAgICAgdGhpcy5yZW5kZXJUby5pbm5lckhUTUwgPSByb290VGVtcGxhdGVIVE1MO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgZWxlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYFtoeXBvPVwiJHt0aGlzLm1hZ2ljS2V5fVwiXWApO1xuICAgICAgICBpZiAoZWxlbSkge1xuICAgICAgICAgIHRoaXMucmVuZGVyVG8gPSBlbGVtIGFzIEhUTUxFbGVtZW50O1xuICAgICAgICAgIGVsZW0uaW5uZXJIVE1MID0gcm9vdFRlbXBsYXRlSFRNTDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhpcy5hZnRlclJlbmRlckNhbGxiYWNrQXJyLmZvckVhY2goKGNhbGxiYWNrKSA9PiB7XG4gICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMudGVtcGxhdGVzUHJvbWlzZXMgPSBbXTtcbiAgICAgIHJldHVybiB0aGF0O1xuICAgIH0pO1xuICB9O1xuXG4gIHByaXZhdGUgcmVyZW5kZXIoKSB7XG4gICAgdGhpcy5yZW5kZXIoKTtcbiAgfVxuXG4gIHB1YmxpYyBnZXRTdGF0ZSgpOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB7XG4gICAgdGhpcy5zdG9yZSA9IHRoaXMuY3JlYXRlU3RvcmUodGhpcy5kYXRhKTtcbiAgICByZXR1cm4gdGhpcy5zdG9yZTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlU3RvcmUoc3RvcmU6IGFueSkge1xuICAgIGNvbnN0IHRoYXQgPSB0aGlzO1xuICAgIGNvbnN0IGhhbmRsZXI6IFByb3h5SGFuZGxlcjxSZWNvcmQ8c3RyaW5nLCB1bmtub3duPj4gPSB7XG4gICAgICBnZXQodGFyZ2V0LCBwcm9wZXJ0eSkge1xuICAgICAgICByZXR1cm4gdGFyZ2V0WzxzdHJpbmc+cHJvcGVydHldO1xuICAgICAgfSxcbiAgICAgIHNldCh0YXJnZXQsIHByb3BlcnR5LCB2YWx1ZSkge1xuICAgICAgICB0YXJnZXRbPHN0cmluZz5wcm9wZXJ0eV0gPSB2YWx1ZTtcbiAgICAgICAgdGhhdC5yZXJlbmRlcigpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH0sXG4gICAgfTtcbiAgICBzdG9yZSA9IG5ldyBQcm94eShzdG9yZSwgaGFuZGxlcik7XG5cbiAgICBPYmplY3Qua2V5cyhzdG9yZSkuZm9yRWFjaCgoZmllbGQpID0+IHtcbiAgICAgIGlmICh0eXBlb2Ygc3RvcmVbZmllbGRdID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIHN0b3JlW2ZpZWxkXSA9IG5ldyBQcm94eShzdG9yZVtmaWVsZF0sIGhhbmRsZXIpO1xuICAgICAgICB0aGlzLmNyZWF0ZVN0b3JlKHN0b3JlW2ZpZWxkXSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gc3RvcmU7XG4gIH1cblxuICBwcml2YXRlIGdldERhdGFXaXRob3V0SWVyYXJoeShkYXRhOiBhbnkpIHtcbiAgICBsZXQgcGF0aEFycjogc3RyaW5nW10gPSBbXTtcbiAgICBsZXQgcmVzdWx0T2JqZWN0OiBhbnkgPSB7fTtcbiAgICBmdW5jdGlvbiBmbnoob2JqOiBhbnkpIHtcbiAgICAgIGZvciAobGV0IGtleSBpbiBvYmopIHtcbiAgICAgICAgcGF0aEFyci5wdXNoKGtleSk7XG4gICAgICAgIGlmICh0eXBlb2Ygb2JqW2tleV0gPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgICBmbnoob2JqW2tleV0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc3VsdE9iamVjdFtwYXRoQXJyLmpvaW4oXCIuXCIpXSA9IG9ialtrZXldO1xuICAgICAgICAgIHBhdGhBcnIucG9wKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHBhdGhBcnIucG9wKCk7XG4gICAgfVxuICAgIGZueihkYXRhKTtcblxuICAgIHJldHVybiByZXN1bHRPYmplY3Q7XG4gIH1cblxuICBwdWJsaWMgYWZ0ZXJSZW5kZXIoY2FsbGJhY2s6ICgpID0+IHZvaWQpOiBIWVBPIHtcbiAgICB0aGlzLmFmdGVyUmVuZGVyQ2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHB1YmxpYyBoaWRlKCkge1xuICAgIGlmICh0aGlzLnJlbmRlclRvKSB7XG4gICAgICBsZXQgY2hpbGRyZW47XG5cbiAgICAgIGNoaWxkcmVuID0gdGhpcy5yZW5kZXJUby5jaGlsZHJlbjtcbiAgICAgIGlmIChjaGlsZHJlbikge1xuICAgICAgICBmb3IgKGxldCBjaGlsZCBvZiBjaGlsZHJlbikge1xuICAgICAgICAgIGNoaWxkLnJlbW92ZSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgeyBIWVBPIH0gZnJvbSBcIi4uL0hZUE8vSFlQT1wiO1xuXG5jbGFzcyBSb3V0ZSB7XG4gIHByaXZhdGUgX3BhdGhuYW1lOiBzdHJpbmcgPSBcIlwiO1xuICBwcml2YXRlIF9ibG9jaz86IChyZXN1bHQ/OiBhbnkpID0+IEhZUE87XG4gIHByaXZhdGUgX3Byb3BzOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPjtcbiAgYXN5bmNGTj86ICgpID0+IFByb21pc2U8YW55PjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwYXRobmFtZTogc3RyaW5nLFxuICAgIHZpZXc6ICgpID0+IEhZUE8sXG4gICAgcHJvcHM6IFJlY29yZDxzdHJpbmcsIHVua25vd24+LFxuICAgIGFzeW5jRk4/OiAoKSA9PiBQcm9taXNlPGFueT5cbiAgKSB7XG4gICAgdGhpcy5fcGF0aG5hbWUgPSBwYXRobmFtZTtcbiAgICB0aGlzLl9wcm9wcyA9IHByb3BzO1xuICAgIHRoaXMuX2Jsb2NrID0gdmlldztcbiAgICB0aGlzLmFzeW5jRk4gPSBhc3luY0ZOO1xuICB9XG5cbiAgbmF2aWdhdGUocGF0aG5hbWU6IHN0cmluZyk6IHZvaWQge1xuICAgIGlmICh0aGlzLm1hdGNoKHBhdGhuYW1lKSkge1xuICAgICAgdGhpcy5fcGF0aG5hbWUgPSBwYXRobmFtZTtcbiAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgfVxuICB9XG5cbiAgbGVhdmUoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuX2Jsb2NrKSB7XG4gICAgICB0aGlzLl9ibG9jaygpLmhpZGUoKTtcbiAgICB9XG4gIH1cblxuICBtYXRjaChwYXRobmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGlzRXF1YWwocGF0aG5hbWUsIHRoaXMuX3BhdGhuYW1lKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICBpZiAoIXRoaXMuX2Jsb2NrKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0aGlzLmFzeW5jRk4pIHtcbiAgICAgIHRoaXMuYXN5bmNGTigpLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICB0aGlzLl9ibG9jaz8uKHJlc3VsdCkucmVuZGVyKCk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fYmxvY2soKS5yZW5kZXIoKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFJvdXRlciB7XG4gIHByaXZhdGUgX19pbnN0YW5jZTogUm91dGVyID0gdGhpcztcbiAgcm91dGVzOiBSb3V0ZVtdID0gW107XG4gIHByaXZhdGUgaGlzdG9yeTogSGlzdG9yeSA9IHdpbmRvdy5oaXN0b3J5O1xuICBwcml2YXRlIF9jdXJyZW50Um91dGU6IFJvdXRlIHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgX3Jvb3RRdWVyeTogc3RyaW5nID0gXCJcIjtcbiAgcHJpdmF0ZSBhc3luY0ZOPzogKCkgPT4gUHJvbWlzZTxhbnk+O1xuXG4gIGNvbnN0cnVjdG9yKHJvb3RRdWVyeTogc3RyaW5nKSB7XG4gICAgaWYgKHRoaXMuX19pbnN0YW5jZSkge1xuICAgICAgcmV0dXJuIHRoaXMuX19pbnN0YW5jZTtcbiAgICB9XG4gICAgdGhpcy5fcm9vdFF1ZXJ5ID0gcm9vdFF1ZXJ5O1xuICB9XG5cbiAgdXNlKFxuICAgIHBhdGhuYW1lOiBzdHJpbmcsXG4gICAgYmxvY2s6IChyZXN1bHQ/OiBhbnkpID0+IEhZUE8sXG4gICAgYXN5bmNGTj86ICgpID0+IFByb21pc2U8YW55PlxuICApOiBSb3V0ZXIge1xuICAgIGNvbnN0IHJvdXRlID0gbmV3IFJvdXRlKFxuICAgICAgcGF0aG5hbWUsXG4gICAgICBibG9jayxcbiAgICAgIHsgcm9vdFF1ZXJ5OiB0aGlzLl9yb290UXVlcnkgfSxcbiAgICAgIGFzeW5jRk5cbiAgICApO1xuICAgIHRoaXMucm91dGVzLnB1c2gocm91dGUpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgc3RhcnQoKTogUm91dGVyIHtcbiAgICB3aW5kb3cub25wb3BzdGF0ZSA9IChfOiBQb3BTdGF0ZUV2ZW50KSA9PiB7XG4gICAgICBsZXQgbWFzayA9IG5ldyBSZWdFeHAoXCIjXCIsIFwiZ1wiKTtcbiAgICAgIGNvbnN0IHVybCA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoLnJlcGxhY2UobWFzaywgXCJcIik7XG4gICAgICB0aGlzLl9vblJvdXRlKHVybCk7XG4gICAgfTtcbiAgICBsZXQgbWFzayA9IG5ldyBSZWdFeHAoXCIjXCIsIFwiZ1wiKTtcbiAgICBjb25zdCB1cmwgPSB3aW5kb3cubG9jYXRpb24uaGFzaC5yZXBsYWNlKG1hc2ssIFwiXCIpIHx8IFwiL1wiO1xuICAgIHRoaXMuX29uUm91dGUodXJsKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIF9vblJvdXRlKHBhdGhuYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zdCByb3V0ZSA9IHRoaXMuZ2V0Um91dGUocGF0aG5hbWUpO1xuICAgIGlmICghcm91dGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHRoaXMuX2N1cnJlbnRSb3V0ZSkge1xuICAgICAgdGhpcy5fY3VycmVudFJvdXRlLmxlYXZlKCk7XG4gICAgfVxuICAgIHRoaXMuX2N1cnJlbnRSb3V0ZSA9IHJvdXRlO1xuICAgIHRoaXMuX2N1cnJlbnRSb3V0ZS5yZW5kZXIoKTtcbiAgfVxuXG4gIGdvKHBhdGhuYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLmhpc3RvcnkucHVzaFN0YXRlKHt9LCBcIlwiLCBgIyR7cGF0aG5hbWV9YCk7XG4gICAgdGhpcy5fb25Sb3V0ZShwYXRobmFtZSk7XG4gIH1cblxuICBiYWNrKCk6IHZvaWQge1xuICAgIHRoaXMuaGlzdG9yeS5iYWNrKCk7XG4gIH1cblxuICBmb3J3YXJkKCk6IHZvaWQge1xuICAgIHRoaXMuaGlzdG9yeS5mb3J3YXJkKCk7XG4gIH1cblxuICBnZXRSb3V0ZShwYXRobmFtZTogc3RyaW5nKTogUm91dGUgfCB1bmRlZmluZWQge1xuICAgIHJldHVybiB0aGlzLnJvdXRlcy5maW5kKChyb3V0ZSkgPT4gcm91dGUubWF0Y2gocGF0aG5hbWUpKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBpc0VxdWFsKGxoczogdW5rbm93biwgcmhzOiB1bmtub3duKSB7XG4gIHJldHVybiBsaHMgPT09IHJocztcbn1cbiIsImNvbnN0IE1FVEhPRFMgPSB7XG4gIEdFVDogXCJHRVRcIixcbiAgUFVUOiBcIlBVVFwiLFxuICBQT1NUOiBcIlBPU1RcIixcbiAgREVMRVRFOiBcIkRFTEVURVwiLFxufTtcblxuY29uc3QgRE9NRU4gPSBcImh0dHBzOi8veWEtcHJha3Rpa3VtLnRlY2gvYXBpL3YyXCI7XG5cbmNsYXNzIEhUVFBUcmFuc3BvcnRDbGFzcyB7XG4gIGRlZmF1bHRPcHRpb25zID0ge1xuICAgIGhlYWRlcnM6IHt9LFxuICAgIGRhdGE6IHt9LFxuICB9O1xuXG4gIEdFVCA9IChcbiAgICB1cmw6IHN0cmluZyxcbiAgICBvcHRpb25zOiB7IFtrZXk6IHN0cmluZ106IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gfSA9IHRoaXMuZGVmYXVsdE9wdGlvbnNcbiAgKSA9PiB7XG4gICAgY29uc3QgcmVxdWVzdFBhcmFtcyA9IHF1ZXJ5U3RyaW5naWZ5KG9wdGlvbnMuZGF0YSk7XG4gICAgdXJsICs9IHJlcXVlc3RQYXJhbXM7XG4gICAgcmV0dXJuIHRoaXMucmVxdWVzdChcbiAgICAgIHVybCxcbiAgICAgIHsgLi4ub3B0aW9ucywgbWV0aG9kOiBNRVRIT0RTLkdFVCB9LFxuICAgICAgTnVtYmVyKG9wdGlvbnMudGltZW91dCkgfHwgNTAwMFxuICAgICk7XG4gIH07XG5cbiAgUFVUID0gKFxuICAgIHVybDogc3RyaW5nLFxuICAgIG9wdGlvbnM6IHsgW2tleTogc3RyaW5nXTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiB9ID0gdGhpcy5kZWZhdWx0T3B0aW9uc1xuICApID0+IHtcbiAgICByZXR1cm4gdGhpcy5yZXF1ZXN0KFxuICAgICAgdXJsLFxuICAgICAgeyAuLi5vcHRpb25zLCBtZXRob2Q6IE1FVEhPRFMuUFVUIH0sXG4gICAgICBOdW1iZXIob3B0aW9ucy50aW1lb3V0KSB8fCA1MDAwXG4gICAgKTtcbiAgfTtcblxuICBQT1NUID0gKFxuICAgIHVybDogc3RyaW5nLFxuICAgIG9wdGlvbnM6IHsgW2tleTogc3RyaW5nXTogUmVjb3JkPHN0cmluZywgc3RyaW5nIHwgbnVtYmVyPiB9ID0gdGhpc1xuICAgICAgLmRlZmF1bHRPcHRpb25zXG4gICkgPT4ge1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QoXG4gICAgICB1cmwsXG4gICAgICB7IC4uLm9wdGlvbnMsIG1ldGhvZDogTUVUSE9EUy5QT1NUIH0sXG4gICAgICBOdW1iZXIob3B0aW9ucy50aW1lb3V0KSB8fCA1MDAwXG4gICAgKTtcbiAgfTtcblxuICBERUxFVEUgPSAoXG4gICAgdXJsOiBzdHJpbmcsXG4gICAgb3B0aW9uczogeyBba2V5OiBzdHJpbmddOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+IH0gPSB0aGlzLmRlZmF1bHRPcHRpb25zXG4gICkgPT4ge1xuICAgIHJldHVybiB0aGlzLnJlcXVlc3QoXG4gICAgICB1cmwsXG4gICAgICB7IC4uLm9wdGlvbnMsIG1ldGhvZDogTUVUSE9EUy5ERUxFVEUgfSxcbiAgICAgIE51bWJlcihvcHRpb25zLnRpbWVvdXQpIHx8IDUwMDBcbiAgICApO1xuICB9O1xuXG4gIHNvY2tldCA9ICh1cmw6IHN0cmluZykgPT4ge1xuICAgIHJldHVybiBuZXcgV2ViU29ja2V0KHVybCk7XG4gIH07XG5cbiAgcmVxdWVzdCA9IChcbiAgICB1cmw6IHN0cmluZyxcbiAgICBvcHRpb25zOiB7IFtrZXk6IHN0cmluZ106IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gfSB8IFJlY29yZDxzdHJpbmcsIHN0cmluZz4sXG4gICAgdGltZW91dDogbnVtYmVyID0gNTAwMFxuICApID0+IHtcbiAgICB1cmwgPSBET01FTiArIHVybDtcbiAgICByZXR1cm4gbmV3IFByb21pc2U8YW55PigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgIHhoci53aXRoQ3JlZGVudGlhbHMgPSB0cnVlO1xuICAgICAgeGhyLm9wZW4oPHN0cmluZz5vcHRpb25zLm1ldGhvZCwgdXJsKTtcbiAgICAgIGNvbnN0IGhlYWRlcnMgPSBvcHRpb25zLmhlYWRlcnM7XG4gICAgICBmb3IgKGxldCBoZWFkZXIgaW4gaGVhZGVycyBhcyBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+KSB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gaGVhZGVyc1toZWFkZXIgYXMga2V5b2YgdHlwZW9mIGhlYWRlcnNdIGFzIHN0cmluZztcbiAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoaGVhZGVyLCB2YWx1ZSk7XG4gICAgICB9XG4gICAgICB4aHIub25sb2FkID0gKCkgPT4ge1xuICAgICAgICByZXNvbHZlKHhocik7XG4gICAgICB9O1xuICAgICAgeGhyLm9uZXJyb3IgPSAoZSkgPT4ge1xuICAgICAgICByZWplY3QoZSk7XG4gICAgICB9O1xuICAgICAgeGhyLm9uYWJvcnQgPSAoZSkgPT4ge1xuICAgICAgICByZWplY3QoZSk7XG4gICAgICB9O1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHhoci5hYm9ydCgpO1xuICAgICAgfSwgdGltZW91dCk7XG5cbiAgICAgIHhoci5zZW5kKEpTT04uc3RyaW5naWZ5KG9wdGlvbnMuZGF0YSkpO1xuICAgIH0pO1xuICB9O1xufVxuXG5mdW5jdGlvbiBxdWVyeVN0cmluZ2lmeShkYXRhOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+KSB7XG4gIGxldCByZXF1ZXN0UGFyYW1zID0gXCI/XCI7XG4gIGZvciAobGV0IGtleSBpbiBkYXRhKSB7XG4gICAgcmVxdWVzdFBhcmFtcyArPSBgJHtrZXl9PSR7ZGF0YVtrZXldfSZgO1xuICB9XG4gIHJlcXVlc3RQYXJhbXMgPSByZXF1ZXN0UGFyYW1zLnN1YnN0cmluZygwLCByZXF1ZXN0UGFyYW1zLmxlbmd0aCAtIDEpO1xuICByZXR1cm4gcmVxdWVzdFBhcmFtcztcbn1cblxuZXhwb3J0IGNvbnN0IEhUVFBUcmFuc3BvcnQgPSAoKCk6IHsgZ2V0SW5zdGFuY2U6ICgpID0+IEhUVFBUcmFuc3BvcnRDbGFzcyB9ID0+IHtcbiAgbGV0IGluc3RhbmNlOiBIVFRQVHJhbnNwb3J0Q2xhc3M7XG4gIHJldHVybiB7XG4gICAgZ2V0SW5zdGFuY2U6ICgpID0+IGluc3RhbmNlIHx8IChpbnN0YW5jZSA9IG5ldyBIVFRQVHJhbnNwb3J0Q2xhc3MoKSksXG4gIH07XG59KSgpO1xuIiwiaW1wb3J0IHsgSFlQTyB9IGZyb20gXCIuLi8uLi9IWVBPXCI7XG5cbmV4cG9ydCBjb25zdCBFbWFpbFZhbGlkYXRvciA9IHtcbiAgdmFsdWU6IFwiXCIsXG4gIGNoZWNrRnVuYzogZnVuY3Rpb24gKHZhbHVlOiBzdHJpbmcpIHtcbiAgICB2YXIgcmVnID0gL14oW0EtWmEtejAtOV9cXC1cXC5dKStcXEAoW0EtWmEtejAtOV9cXC1cXC5dKStcXC4oW0EtWmEtel17Miw0fSkkLztcbiAgICBpZiAoIXJlZy50ZXN0KHZhbHVlKSkge1xuICAgICAgdGhpcy52YWx1ZSA9IFwiXCI7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSxcbiAgY2FsbGJhY2s6IChlbGVtOiBIWVBPLCBjaGVja1Jlc3VsdDogYm9vbGVhbikgPT4ge1xuICAgIGxldCBzdGF0ZSA9IGVsZW0uZ2V0U3RhdGUoKTtcbiAgICBpZiAoIWNoZWNrUmVzdWx0KSB7XG4gICAgICBzdGF0ZS5tZXNzYWdlID0gXCLim5Qg0Y3RgtC+INC90LUg0L/QvtGF0L7QttC1INC90LAg0LDQtNGA0LXRgSDRjdC70LXQutGC0YDQvtC90L3QvtC5INC/0L7Rh9GC0YtcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RhdGUubWVzc2FnZSA9IFwiXCI7XG4gICAgfVxuICB9LFxufTtcbiIsImltcG9ydCB7IEhZUE8gfSBmcm9tIFwiLi4vLi4vSFlQT1wiO1xuXG5leHBvcnQgY29uc3QgUmVxdWlyZWQgPSB7XG4gIHZhbHVlOiBcIlwiLFxuICBjaGVja0Z1bmM6IGZ1bmN0aW9uICh2YWx1ZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgaWYgKHZhbHVlID09PSBcIlwiKSB7XG4gICAgICB0aGlzLnZhbHVlID0gXCJcIjtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgIHJldHVybiB0cnVlO1xuICB9LFxuICBjYWxsYmFjazogKGVsZW06IEhZUE8sIGNoZWNrUmVzdWx0OiBib29sZWFuKSA9PiB7XG4gICAgbGV0IHN0YXRlID0gZWxlbS5nZXRTdGF0ZSgpO1xuICAgIGlmICghY2hlY2tSZXN1bHQpIHtcbiAgICAgIHN0YXRlLm1lc3NhZ2UgPSBcIuKblCDQvtCx0Y/Qt9Cw0YLQtdC70YzQvdC+0LUg0L/QvtC70LVcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RhdGUubWVzc2FnZSA9IFwiXCI7XG4gICAgfVxuICB9LFxufTsiLCJleHBvcnQgZnVuY3Rpb24gdXVpZHY0KCkge1xuICByZXR1cm4gXCJ4eHh4eHh4eC14eHh4LTR4eHgteXh4eC14eHh4eHh4eHh4eHhcIi5yZXBsYWNlKC9beHldL2csIGZ1bmN0aW9uIChjKSB7XG4gICAgdmFyIHIgPSAoTWF0aC5yYW5kb20oKSAqIDE2KSB8IDAsXG4gICAgICB2ID0gYyA9PSBcInhcIiA/IHIgOiAociAmIDB4MykgfCAweDg7XG4gICAgcmV0dXJuIGAke3YudG9TdHJpbmcoMTYpfWA7XG4gIH0pO1xufSIsImltcG9ydCB7IExvZ2luTGF5b3V0IH0gZnJvbSBcIi4uL1VJL0xheW91dHMvTG9naW5cIjtcbmltcG9ydCB7IENoYXRMYXlvdXQgfSBmcm9tIFwiLi4vVUkvTGF5b3V0cy9DaGF0XCI7XG5pbXBvcnQgeyBSZWdpc3RyYXRpb25MYXlvdXQgfSBmcm9tIFwiLi4vVUkvTGF5b3V0cy9SZWdpc3RyYXRpb25cIjtcbmltcG9ydCB7IFByb2ZpbGVMYXlvdXQgfSBmcm9tIFwiLi4vVUkvTGF5b3V0cy9Qcm9maWxlXCI7XG5pbXBvcnQgeyBDaGFuZ2VQcm9maWxlIH0gZnJvbSBcIi4uL1VJL0xheW91dHMvQ2hhbmdlUHJvZmlsZVwiO1xuaW1wb3J0IHsgQ2hhbmdlUGFzc3dvcmQgfSBmcm9tIFwiLi4vVUkvTGF5b3V0cy9DaGFuZ2VQYXNzd29yZFwiO1xuaW1wb3J0IHsgUm91dGVyIH0gZnJvbSBcIi4uL2xpYnMvUm91dGVyXCI7XG5pbXBvcnQgeyBIVFRQVHJhbnNwb3J0IH0gZnJvbSBcIi4uL2xpYnMvVHJhbnNwb3J0XCI7XG5pbXBvcnQgeyBJQ2hhdFZpZXdNb2RlbCB9IGZyb20gXCIuLi9WaWV3TW9kZWwvQ2hhdFZpZXdNb2RlbFwiO1xuaW1wb3J0IHsgVklFV19NT0RFTCB9IGZyb20gXCIuLi9WaWV3TW9kZWxcIjtcbmltcG9ydCB7IENvbnRhaW5lciB9IGZyb20gXCIuLi9saWJzL0NvbnRhaW5lclwiO1xuaW1wb3J0IHsgSVVzZXJWaWV3TW9kZWwgfSBmcm9tIFwiLi4vVmlld01vZGVsL1VzZXJWaWV3TW9kZWxcIjtcblxuZXhwb3J0IGNvbnN0IFJvdXRlckluaXQgPSAoY29udGFpbmVyOiBDb250YWluZXIpOiBSb3V0ZXIgPT4ge1xuICByZXR1cm4gbmV3IFJvdXRlcihcIiNyb290XCIpXG4gICAgLnVzZShcIi9cIiwgTG9naW5MYXlvdXQsICgpID0+IHtcbiAgICAgIHJldHVybiBIVFRQVHJhbnNwb3J0LmdldEluc3RhbmNlKClcbiAgICAgICAgLkdFVChcIi9hdXRoL3VzZXJcIilcbiAgICAgICAgLnRoZW4oKHVzZXIpID0+IHtcbiAgICAgICAgICByZXR1cm4gSlNPTi5wYXJzZSh1c2VyLnJlc3BvbnNlKTtcbiAgICAgICAgfSk7XG4gICAgfSlcbiAgICAudXNlKFwiL3JlZ2lzdHJhdGlvblwiLCBSZWdpc3RyYXRpb25MYXlvdXQpXG4gICAgLnVzZShcIi9jaGF0XCIsIENoYXRMYXlvdXQsIGFzeW5jICgpID0+IHtcbiAgICAgIGNvbnN0IGNoYXRWaWV3TW9kZWwgPSBjb250YWluZXIuZ2V0PElDaGF0Vmlld01vZGVsPihWSUVXX01PREVMLkNIQVQpO1xuICAgICAgYXdhaXQgY2hhdFZpZXdNb2RlbC5nZXRDaGF0cygpO1xuICAgICAgcmV0dXJuIGNoYXRWaWV3TW9kZWwuY2hhdHM7XG4gICAgICByZXR1cm4gSFRUUFRyYW5zcG9ydC5nZXRJbnN0YW5jZSgpXG4gICAgICAgIC5HRVQoXCIvY2hhdHNcIilcbiAgICAgICAgLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHJlc3AgPSBKU09OLnBhcnNlKHJlc3VsdC5yZXNwb25zZSk7XG4gICAgICAgICAgcmV0dXJuIHJlc3A7XG4gICAgICAgIH0pO1xuICAgIH0pXG4gICAgLnVzZShcIi9wcm9maWxlXCIsIFByb2ZpbGVMYXlvdXQsICgpID0+IHtcbiAgICAgIHJldHVybiBIVFRQVHJhbnNwb3J0LmdldEluc3RhbmNlKClcbiAgICAgICAgLkdFVChcIi9hdXRoL3VzZXJcIilcbiAgICAgICAgLnRoZW4oKHJlc3VsdCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHJlc3AgPSBKU09OLnBhcnNlKHJlc3VsdC5yZXNwb25zZSk7XG4gICAgICAgICAgcmV0dXJuIHJlc3A7XG4gICAgICAgIH0pO1xuICAgIH0pXG4gICAgLnVzZShcIi9lZGl0cHJvZmlsZVwiLCBDaGFuZ2VQcm9maWxlLCBhc3luYyAoKSA9PiB7XG4gICAgICBjb25zdCB1c2VyVmlld01vZGVsID0gY29udGFpbmVyLmdldDxJVXNlclZpZXdNb2RlbD4oVklFV19NT0RFTC5VU0VSKTtcbiAgICAgIGF3YWl0IHVzZXJWaWV3TW9kZWwuZ2V0VXNlcigpO1xuICAgICAgcmV0dXJuIHVzZXJWaWV3TW9kZWwudXNlcjtcbiAgICB9KVxuICAgIC51c2UoXCIvZWRpdHBhc3N3b3JkXCIsIENoYW5nZVBhc3N3b3JkKVxuICAgIC5zdGFydCgpO1xufTtcbiIsImV4cG9ydCBmdW5jdGlvbiBtZW1vaXplKGZ1bmMsIHJlc29sdmVyKSB7XG4gIGlmIChcbiAgICB0eXBlb2YgZnVuYyAhPSBcImZ1bmN0aW9uXCIgfHxcbiAgICAocmVzb2x2ZXIgIT0gbnVsbCAmJiB0eXBlb2YgcmVzb2x2ZXIgIT0gXCJmdW5jdGlvblwiKVxuICApIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEZVTkNfRVJST1JfVEVYVCk7XG4gIH1cbiAgdmFyIG1lbW9pemVkID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBhcmdzID0gYXJndW1lbnRzLFxuICAgICAga2V5ID0gcmVzb2x2ZXIgPyByZXNvbHZlci5hcHBseSh0aGlzLCBhcmdzKSA6IGFyZ3NbMF0sXG4gICAgICBjYWNoZSA9IG1lbW9pemVkLmNhY2hlO1xuXG4gICAgaWYgKGNhY2hlLmhhcyhrZXkpKSB7XG4gICAgICByZXR1cm4gY2FjaGUuZ2V0KGtleSk7XG4gICAgfVxuICAgIHZhciByZXN1bHQgPSBmdW5jLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIG1lbW9pemVkLmNhY2hlID0gY2FjaGUuc2V0KGtleSwgcmVzdWx0KSB8fCBjYWNoZTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuICBtZW1vaXplZC5jYWNoZSA9IG5ldyAobWVtb2l6ZS5DYWNoZSB8fCBNYXBDYWNoZSkoKTtcbiAgcmV0dXJuIG1lbW9pemVkO1xufVxuXG5tZW1vaXplLkNhY2hlID0gTWFwO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0aWYoX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSkge1xuXHRcdHJldHVybiBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxuX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2luZGV4LnRzXCIpO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==