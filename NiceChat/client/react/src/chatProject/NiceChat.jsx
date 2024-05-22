import React from 'react';
import { ChatListComp } from './ChatList';
import { UserDetailsComp } from './UserDetails';
import { ChatRoomComp } from './ChatRoom';

export const NiceChatComp = () => {
  return (
    <div className='nice'>
      <ChatRoomComp />
      <UserDetailsComp />
      <ChatListComp />
    </div>
  );
}
