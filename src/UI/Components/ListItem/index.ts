import { HYPO } from "../../../libs/HYPO/HYPO";
import { uuidv4 } from "../../../libs/utils";

interface IProps {
  text: string;
  onClick: () => void;
}

export const ListItem = ({ text, onClick }: IProps) => {
  const key = uuidv4();
  return new HYPO({
    templatePath: "listitem.template.html",
    data: { text: text, key: key },
  }).afterRender(() => {
    document.getElementById(key)?.addEventListener("click", onClick);
  });
};
