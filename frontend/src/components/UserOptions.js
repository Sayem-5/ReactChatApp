import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';

function UserOptions(prop) {

  const { currentUser } = prop;

  const navigate = useNavigate();

  const logout = async() => {

    console.log("Logging Out ", currentUser);

    try {

      const response = await fetch('https://chat-app-p7p1.onrender.com/user/logout', {
          method: 'POST',
          credentials: 'include',
          headers: {
              'Content-Type': 'application/json'
          }
      });

      if (response.ok) {
        // Authentication successful, handle accordingly
        
        const navigateToLogin = () => {
            navigate('/login');
        }

        navigateToLogin();

        } else {
        // Authentication failed, handle accordingly
        console.log('Authentication failed');
        }

    } catch (error) {
        console.error('Error during chat deletion: ', error);
    }

  }

  return (
    <Menu>
      <Menu.Button>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="w-5 h-5 fill-[#aebac1]">
            <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM11.5 15.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
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
      <Menu.Items className="absolute left-44 top-12 w-56 origin-top-right shadow-lg focus:outline-none z-10 bg-[#233138]">
        <div className='flex flex-col py-3 w-56 '>
            <div className='bg-transparent hover:bg-[#182229] hover:cursor-pointer flex flex-col h-10 justify-center w-full pl-6 pr-14 text-[#D1D7DB] text-[14.5px] font-open'>
              <Menu.Item as={Fragment}>
                <div className='' onClick={logout}>
                  <p>Logout</p>
                </div>
              </Menu.Item>
            </div>
        </div>
      </Menu.Items>
      </Transition>
    </Menu>
  )
}

export default UserOptions;