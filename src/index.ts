import "regenerator-runtime/runtime";
import { BootStrap } from "./Bootstrap";
import { AppInit } from "./router";

const InitApp = () => {
  const { container } = new BootStrap();
  // Инициализация рендера происходит в RouterInit
  const router = AppInit(container);
  return { router, container };
};

export const { router, container } = InitApp();
