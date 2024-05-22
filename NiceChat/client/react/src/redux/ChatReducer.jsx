const initialState = {
  _id: '',
  userId: '',
  receiver_name: '',
  messages: [],
  token: '',
  selectedUser: null,
  selectedUserName: '',
  icon: '',
};

export const chatReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'USER_LOGIN_SUCCESS':
      const { token, userId, userName, icon, receiverName: loginReceiverName } = action.payload;
      return { ...state, token, icon, userId, userName, receiver_name: loginReceiverName };

    case 'SELECTED_USER_CHAT':
      const { selectedUser, selectedChat } = action.payload;
      const newMessages = selectedChat.filter(message => !state.messages.find(msg => msg._id === message._id));
      return { ...state, selectedUser, messages: [...state.messages, ...newMessages], selectedUserName: selectedUser.userName, icon: selectedUser.icon };

    case 'SAVE_MESSAGES':
      const { newMessage } = action.payload;
      if (newMessage) {
        return { ...state, messages: [...state.messages, { content: [newMessage] }] };
      } else {
        return state;
      }
    default:
      return state;
  }
};