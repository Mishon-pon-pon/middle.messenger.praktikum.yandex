import { HYPO } from "../../libs/HYPO/HYPO";
import { Empty } from "../Empty";

interface IProps {
  label: string;
  type: string;
  name: string;
  id: string;
  className: string;
  ChildAttention?: HYPO;
  onFocus?: (e: Event) => void;
  onBlur?: (e: Event) => void;
}

//@todo: прикрутить уникальность каждого элемента

export const Input = (props: IProps) => {
  
  return new HYPO({
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
      Attention: props.ChildAttention || Empty(),
    },
  }).afterRender(() => {
    document
      .getElementById(props.id)
      ?.addEventListener("focus", (e: FocusEvent) => {
        const input = e.target as HTMLInputElement;
        const inputLabel = input.parentElement?.parentElement?.querySelector(
          ".form-input__label"
        );
        inputLabel?.classList.add("form-input__label_select");
        props.onFocus?.(e);
      });
    document.getElementById(props.id)?.addEventListener("blur", (e: Event) => {
      const input = e.target as HTMLInputElement;
      const inputLabel = input.parentElement?.parentElement?.querySelector(
        ".form-input__label"
      );
      if (!input.value) {
        inputLabel?.classList.remove("form-input__label_select");
      }
      props.onBlur?.(e);
    });
  });
};
