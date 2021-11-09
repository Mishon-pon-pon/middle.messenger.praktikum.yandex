import {container} from '../../..';
import {ChatLayout} from '../../Layouts/Chat';
import {HYPO} from '../../../libs/HYPO/HYPO';
import {Delete} from '../Delete';
import {VIEW_MODEL} from '../../../ViewModel';
import {IChatViewModel} from '../../../ViewModel/ChatViewModel';
import QueryUtils from '../../../libs/QueryParams';
import {Messages} from '../Messages';

export interface IChatDTO {
  title: string;
  avatar: string | null;
  created_by: number;
  id: number;
}

interface IProps extends IChatDTO {
  className?: string;
}

export const ChatItem = (props: IChatDTO) => {
  const key = `key-${props.id}`;

  const {increment} = container.get<IChatViewModel>(VIEW_MODEL.CHAT);

  return new HYPO({
    templatePath: 'chatItem.template.html',
    data: {
      ChatName: props.title,
      lastTime: props.created_by || '10:22',
      lastMessage: props.id || 'Hi, how are you?',
      notificationCount: props.avatar || 3,
      key: key,
    },
    children: {
      delete: Delete({
        id: `deleteItem${props.id}`,
        onClick: () => {
          const chatViewModel = container.get<IChatViewModel>(VIEW_MODEL.CHAT);
          chatViewModel.deleteChat(String(props.id)).then(() => {
            ChatLayout(chatViewModel.chats).render();
          });
        },
      }),
      messages: Messages({chatId: 0, message: ''}),
    },
  }).afterRender(() => {
    document.getElementById(key)?.addEventListener('click', () => {
      const queryUtils = new QueryUtils();
      queryUtils.setQueryParamsObj({chat: props.id});
      increment();
    });
  });
};
