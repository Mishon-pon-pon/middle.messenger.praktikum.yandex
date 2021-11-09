import {HYPO} from '../../../libs/HYPO/HYPO';
import {ChatItem, IChatDTO} from '../../Components/ChatItem';
import {container, router} from '../../..';
import {Button} from '../../Components/Button';
import {Empty} from '../../Components/Empty';
import {CreateChatModal} from '../../Components/CreateChatModal';
import {MenuButton} from '../../Components/MenuButton';
import {observer} from '../../../libs/Store';
import {IChatViewModel} from '../../../ViewModel/ChatViewModel';
import {VIEW_MODEL} from '../../../ViewModel';
import {IMessageViewModel} from '../../../ViewModel/MessageViewModel';
import {Messages} from '../../Components/Messages';

export const ChatLayout = observer((result: IChatDTO[]) => {
  const ChatItemList: HYPO[] = [];
  if (Array.isArray(result)) {
    result.forEach((item: any) => {
      ChatItemList.push(ChatItem({...item}));
    });
  } else {
    ChatItemList.push(Empty());
  }

  const {counter, arr, push, increment} = container.get<IChatViewModel>(
    VIEW_MODEL.CHAT
  );
  const {pushMessage, messages} = container.get<IMessageViewModel>(
    VIEW_MODEL.MESSAGES
  );

  messages[0];

  return new HYPO({
    renderTo: document.getElementById('root') || document.body,
    templatePath: 'chat.template.html',
    data: {counter, messages: JSON.stringify(arr)},
    children: {
      ProfileLink: Button({
        title: 'Profile',
        className: 'profile-link__button',
        onClick: (e: Event) => {
          router.go('/profile');
        },
      }),
      'menu-button': MenuButton({menuId: 'chatMenu'}),
      chatItem: ChatItemList,
      createChatModal: CreateChatModal(),
      createChatButton: Button({
        title: '+',
        className: 'navigation__createChatButton',
        onClick: () => {
          document
            .getElementsByClassName('c-c-modal')[0]
            .classList.remove('hidden');
        },
      }),
      messages: arr.map((message) => {
        return Messages({chatId: 1, message: message});
      }),
    },
  }).afterRender(() => {
    document
      .getElementsByClassName('controls__send')[0]
      .addEventListener('click', () => {
        // Store.store.messages = [...Store.store.messages, 'New message'];
        // increment();
        push();
      });
  });
});
