import { HYPO } from "../../../libs/HYPO/HYPO";

interface IProps {
  label: string;
  value: string;
  id: string;
  onChage: (e: { value: string }) => void;
}
export const ProfileInput = ({ label, value, id, onChage }: IProps) => {
  return new HYPO({
    templatePath: "profileInput.template.html",
    data: {
      label: label,
      value: value,
      id: id,
    },
  }).afterRender(() => {
    const input = document.getElementById(id) as HTMLInputElement;
    input?.addEventListener("blur", () => {
      onChage({ value: input.value });
    });
  });
};
