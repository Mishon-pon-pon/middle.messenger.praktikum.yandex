import { HYPO } from "../../libs/HYPO/HYPO";

interface IProps {
  id: string;
  onClick: () => void;
}
export const Delete = (props: IProps) => {
  return new HYPO({
    templatePath: "delete.template.html",
    data: {
      path: "/media/Vector.svg",
      id: props.id,
    },
    children: {},
  }).afterRender(() => {
    document.getElementById(props.id)?.addEventListener("click", () => {
      props.onClick();
    });
  });
};
