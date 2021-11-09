import { HYPO } from "../../../libs/HYPO/HYPO";
import { uuidv4 } from "../../../libs/utils";

interface IProps {
  id?: string;
  title: string;
  className: string;
  onClick: (e: Event) => void;
}

export const Button = (props: IProps) => {
  const id = props.id || uuidv4();
  return new HYPO({
    templatePath: "button.template.html",
    data: {
      id: id,
      title: props.title,
      className: props.className,
    },
  }).afterRender(() => {
    document.getElementById(id)?.addEventListener("click", (e) => {
      props.onClick(e);
    });
  });
};
