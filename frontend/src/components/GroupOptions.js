import { Menu, Transition } from '@headlessui/react';
import { Fragment, useEffect, useRef, useState } from 'react';

function GroupOptions(prop) {

  const { groupId, toggleNotifyLeft, updateGroup } = prop;

  const leaveGroup = async() => {

    console.log("groupId: ", groupId);

    const data = { id: groupId }

    try {

      const response = await fetch('https://chat-app-p7p1.onrender.com/group/delete', {
          method: 'DELETE',
          credentials: 'include',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
      });

      if (response.ok) {
        console.log('Left Group');
        toggleNotifyLeft("You Left the Group!", false, true);
        updateGroup();
        
      } else {
        console.log('Error leaving group');
        toggleNotifyLeft("Could Not Leave the Group", true, false);
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
      <Menu.Items className="absolute right-5 w-56 origin-top-right shadow-lg focus:outline-none z-10 bg-[#233138]">
        <div className='flex flex-col py-3 w-56 '>
            <div className='bg-transparent hover:bg-[#182229] hover:cursor-pointer flex flex-col h-10 justify-center w-full pl-6 pr-14 text-[#D1D7DB] text-[14.5px] font-open'>
              <Menu.Item as={Fragment}>
                <div className='' onClick={leaveGroup}>
                  <p>Leave Group</p>
                </div>
              </Menu.Item>
            </div>
        </div>
      </Menu.Items>
      </Transition>
    </Menu>
  )
}

export default GroupOptions;