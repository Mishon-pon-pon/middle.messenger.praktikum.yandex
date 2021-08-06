import 'regenerator-runtime/runtime'
import { BootStrap } from "./Bootstrap";
import { RouterInit } from "./router";

const InitApp = () => {
  const { container } = new BootStrap();
  const router = RouterInit(container);
  return { router, container };
};

export const { router, container } = InitApp();
