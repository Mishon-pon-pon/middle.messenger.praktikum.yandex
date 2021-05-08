import { HYPO } from "../../libs/HYPO/HYPO";

export const AttentionMessage = (): HYPO => {
  return new HYPO({
    templatePath: "attention.template.html",
    data: {
      message: "",
    },
    children: {},
  });
};
