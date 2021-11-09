import {container} from '../../..';
import {HYPO} from '../../../libs/HYPO/HYPO';
import {observer} from '../../../libs/Store';
import {VIEW_MODEL} from '../../../ViewModel';
import {IChatViewModel} from '../../../ViewModel/ChatViewModel';

interface IProps {
  chatId: number;
  message: string;
}

export const Messages = observer(({chatId, message}: IProps) => {
  const {counter, increment} = container.get<IChatViewModel>(VIEW_MODEL.CHAT);
  return new HYPO({
    templatePath: 'messages.template.html',
    data: {
      messages: message,
      counter,
    },
  }).afterRender(() => {
    document.getElementById('buttones')?.addEventListener('click', () => {
      increment();
    });
  });
});
