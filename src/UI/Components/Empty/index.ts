import { HYPO } from "../../../libs/HYPO/HYPO";

export const Empty = () => {
  return new HYPO({
    templatePath: "empty.template.html",
    data: {},
  });
};
