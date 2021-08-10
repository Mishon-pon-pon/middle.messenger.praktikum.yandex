import { HYPO } from "../../../libs/HYPO/HYPO";
import Store, { observer } from "../../../libs/Store";

interface IProps {
  chatId: string;
}

export const Messages = observer(({ chatId }: IProps) => {
  return new HYPO({
    templatePath: "messages.template.html",
    data: {
      messages: Store.store.messages,
    },
  });
});
