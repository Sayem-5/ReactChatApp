import { Menu, Transition } from '@headlessui/react';
import { Fragment, useEffect, useRef, useState } from 'react';

function ChatOptions(prop) {

  const { chatId, chattingWith, friends, toggleNotifyDelete, toggleNotifyBlock, toggleNotifyFriend, updateChatView } = prop;

  console.log("Chatting", chattingWith, "friends", friends);

  const isFriend = () => {
    return friends.some(friend => (
      chattingWith._id.toString() === friend.friendId._id.toString()
    ))
  }

  const addFriend = async(friend) => {

    const data = { addUser: friend._id }

    try {
      const response = await fetch('/friend/add', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
      });

      if (response.ok) {
        console.log('Friend Added');
        toggleNotifyFriend("Friend Added!", false, true);
        updateChatView();
      } else {
        console.log('Addition failed');
        toggleNotifyFriend("Could Not Remove Friend", true, false);
      }

    } catch (error) {
        console.error('Error during friend removal: ', error);
    }

  }

  const removeFriend = async(friend) => {

    const data = { removeUser: friend._id }

    try {
      const response = await fetch('/friend/remove', {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
      });

      if (response.ok) {
        console.log('Friend Removed');
        toggleNotifyFriend("Friend Removed!", false, true);
        updateChatView();
      } else {
        console.log('Removal failed');
        toggleNotifyFriend("Could Not Remove Friend", true, false);
      }

    } catch (error) {
        console.error('Error during friend removal: ', error);
    }

  }

  const blockFriend = async(friend) => {

    const data = { blockFriend: friend._id }
    
    try {
    
      const response = await fetch('/friend/block', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
      });

      if (response.ok) {
        console.log('Friend Blocked');
        toggleNotifyBlock("Friend Blocked!", false, true);
        updateChatView();
      } else {
        console.log('Blocking failed');
        toggleNotifyBlock("Could Not Block, are you sure you are Friends?", true, false);
      }

    } catch (error) {
        console.error('Error during blocking: ', error);
    }

  }

  const deleteChat = async() => {

    console.log("ChatID: ", chatId);

    const data = { id: chatId }

    try {

      const response = await fetch('/chat/delete', {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
      });

      console.log("DELETE: ", response);

      if (response.ok) {
        console.log('Chat deleted');
        //toggleNotifyBlock("Chat Deleted!", false, true);
        updateChatView(true);
      } else {
          console.log('Chat could not be deleted');
      }

    } catch (error) {
      console.error('Error during chat deletion: ', error);
    }

  }

  return (
    <Menu>
      <Menu.Button>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-8 h-8 fill-[#aebac1]">
          <path fill-rule="evenodd" d="M10.5 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm0 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm0 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" clip-rule="evenodd" />
        </svg>
      </Menu.Button>
      <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
      { chattingWith && friends && isFriend() == false ? 
      (
        <Menu.Items className="absolute right-5 w-56 origin-top-right shadow-lg focus:outline-none z-10 bg-[#233138]">
        <div className='flex flex-col py-3 w-56 '>
            <div className='bg-transparent hover:bg-[#182229] hover:cursor-pointer flex flex-col h-10 justify-center w-full pl-6 pr-14 text-[#D1D7DB] text-[14.5px] font-open'>
              <Menu.Item as={Fragment}>
                <div className='' onClick={() => addFriend(chattingWith)}>
                  <p>Add Friend</p>
                </div>
              </Menu.Item>
            </div>
            <div className='bg-transparent hover:bg-[#182229] hover:cursor-pointer flex flex-col h-10 justify-center w-full pl-6 pr-14 text-[#D1D7DB] text-[14.5px] font-open'>
              <Menu.Item as={Fragment}>
                <div className='' onClick={() => deleteChat(chattingWith)}>
                  <p>Delete Chat</p>
                </div>
              </Menu.Item>
            </div>
        </div>
        </Menu.Items>
      ) :
      (
        <Menu.Items className="absolute right-5 w-56 origin-top-right shadow-lg focus:outline-none z-10 bg-[#233138]">
        <div className='flex flex-col py-3 w-56 '>
            <div className='bg-transparent hover:bg-[#182229] hover:cursor-pointer flex flex-col h-10 justify-center w-full pl-6 pr-14 text-[#D1D7DB] text-[14.5px] font-open'>
              <Menu.Item as={Fragment}>
                <div className='' onClick={() => removeFriend(chattingWith)}>
                  <p>Unfriend</p>
                </div>
              </Menu.Item>
            </div>
            <div className="bg-transparent hover:bg-[#182229] hover:cursor-pointer flex flex-col h-10 justify-center w-full pl-6 pr-14 text-[#D1D7DB] text-[14.5px] font-open">
              <Menu.Item as={Fragment}>
                <div className='' onClick={() => blockFriend(chattingWith)}>
                  <p>Block</p>
                </div>
              </Menu.Item>
            </div>
            <div className='bg-transparent hover:bg-[#182229] hover:cursor-pointer flex flex-col h-10 justify-center w-full pl-6 pr-14 text-[#D1D7DB] text-[14.5px] font-open'>
              <Menu.Item as={Fragment}>
                <div className='' onClick={() => deleteChat(chattingWith)}>
                  <p>Delete Chat</p>
                </div>
              </Menu.Item>
            </div>
        </div>
        </Menu.Items>
      ) }

      </Transition>
    </Menu>
  )
}

export default ChatOptions;