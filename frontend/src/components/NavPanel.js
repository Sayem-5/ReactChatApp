import { useEffect, useState, useRef } from "react";
import { Tab } from '@headlessui/react';
import Chat from "./Chat";
import ChatView from "./ChatView";
import { useNavigate } from 'react-router-dom';
import socket from "../socket";
import GroupChat from "./GroupChat";
import GroupView from "./GroupView";
import UserOptions from "./UserOptions";
import ProfilePicture from "./ProfilePicture";
import Notify from "./Notify";


const NavPanel = () => {

    const [ chats, setChats ] = useState(null);
    const [ allUsers, setAllUsers ] = useState(null);
    const [ groupChats, setGroupChats ] = useState(null);
    const [ getData, setGetData ] = useState(false);
    const [ getGroupData, setGetGroupData ] = useState(false);
    const [ groupChatToggle, setGroupChatToggle ] = useState(false);
    const [ currentUser, setCurrentUser ] = useState(null);
    const [ newGroupParticipants, setNewGroupParticipants ] = useState([]);
    const [ profilePicture, setProfilePicture ] = useState([]);

    //const [ selectedChatView, setSelectedChatView ] = useState("None");
    const [ chatId, setChatId] = useState(null);
    const [ groupId, setGroupId] = useState(null);
    const [friends , setFriends] = useState([]);
    const [friendsFound, setFriendsFound] = useState([]);
    const [ showNotify, setShowNotify ] = useState(false);
    const [ notify, setNotify] = useState({});
    // const [ hideNotify, setHideNotify ] = useState(false);

    const navigate = useNavigate();

    const userSearchInput = useRef(null);
    const groupName = useRef(null);
    const imgRef = useRef(null);

    const [ fileSize, setFileSize] = useState(null);
    const [ imgSubmit, setImgSubmit ] = useState(false);
    const [ file, setFile ] = useState(null);

    const updateChats = () => {
        fetchChats();
    }

    const updateGroups = () => {
        fetchGroupChats();
    }

    const notifyUser = (message, error, success) => {

        setNotify({message, error, success});
        setShowNotify(true);

    }

    const hideNotify = () => {
        setNotify({});
        setShowNotify(false);
    }

    const toggleSetData = () => {
        setGetData(false);
    }

    const toggleSetGroupData = () => {
        setGetGroupData(false);
    }

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }

    const searchFriend = () => {
        
        const search = userSearchInput.current.value;

        const friendsArray = friends && friends.map(friend => friend.friendId);
        console.log("FFFFFFFFFFFFFFFf", friendsArray);

        const result = friendsArray.filter(friend => friend.username.toLowerCase().includes(search.toLowerCase()));
        console.log();
        setFriendsFound(result);

        if(search == ""){
            setFriendsFound([]);
        }

    }

    const searchUser = () => {
        
        const search = userSearchInput.current.value;

        // const usersArray = allUsers.map(user => user._id);
        // console.log(usersArray);

        // const result = allUsers.filter(user => user.username.toLowerCase().includes(search.toLowerCase()) && user.username.toLowerCase() !== currentUser.username.toLowerCase());
        const result = allUsers.filter(user => 
            user.username && currentUser.username && // Check if username properties exist
            user.username.toLowerCase().includes(search.toLowerCase()) && 
            user.username.toLowerCase() !== currentUser.username.toLowerCase()
            );
        console.log();
        setFriendsFound(result);

        if(search == ""){
            setFriendsFound([]);
        }

    }

    const fetchChats = async() => {

        const response = await fetch('https://chat-app-p7p1.onrender.com/chat', 
        {
            method: 'GET',
            credentials: 'include',
            headers: { "Content-Type": "application/json" }
        });
        console.log(response);

        if(response.url.includes("/user/login")){
            navigate("/login");
        }
        const json = await response.json();
        
        if(response.ok){

            console.log("In Chats");
            setChats(json.chats);
            setCurrentUser(json.currentUser);
            setFriends(json.friends);
            setAllUsers(json.allUsers);
            setProfilePicture(json.currentUser.profilePicture);
            console.log("ALLLLLLLLLLLLLLLLLLLL: ", json.currentUser.profilePicture);
            console.log("Current User: ", json.currentUser);

        }
        // else if(json.currentUser === null)
        // {
        //     navigate("/login");
        // }
        

    }

    const fetchGroupChats =  async() => {

        const response = await fetch('https://chat-app-p7p1.onrender.com/group', 
        {
            method: 'GET',
            credentials: 'include',
            headers: { "Content-Type": "application/json" }
        });
        console.log(response);

        if(response.url.includes("/user/login")){
            navigate("/login");
        }
        const json = await response.json();
        
        if(response.ok){
            console.log("In Groups");
            setGroupChats(json.groups);
            setCurrentUser(json.currentUser);
            console.log("CurrentUser: ", json.currentUser)
        }
        // else if(json.currentUser === null)
        // {
        //     navigate("/login");
        // }
        

    }

    const addFriend = async(friend) => {

        const data = { addUser: friend._id }

        console.log("Friend", friend._id, "CurrentUser", currentUser.username)
    
        try {
          const response = await fetch('https://chat-app-p7p1.onrender.com/friend/add', {
              method: 'POST',
              credentials: 'include',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(data)
          });
    
          if (response.ok) {

            console.log('Friend Added');
            notifyUser("Friend Added", false, true);

            updateChats();
            updateGroups();
    
          } else {

            console.log('Addition failed');
            notifyUser("Error: Could not Add Friend", true, false);

          }
    
        } catch (error) {
            console.error('Error during friend removal: ', error);
        }
    
      }

    useEffect(() => {

        socket.connect();

        fetchChats();

        currentUser && console.log("Current User: ", currentUser);

    }, [])

    const handleChatClick = (chat, id) => {
        
        console.log("Clicked");
        //setSelectedChatView(chat);
        setGroupChatToggle(false);
        setChatId(id);
        setGetData(true);
        
    }

    const newChatView = async (friend) => {

        if(friend === null){
            return console.log("Not Logged In or No Data", friend, currentUser);
        }

        try{
            const response = await fetch('https://chat-app-p7p1.onrender.com/chat/new', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({friend})
            });

            console.log(response);

            const json = await response.json();
            console.log(json);

            setChatId(json.chat._id);
            setGetData(true);
            setGroupChatToggle(false);

        }
        catch(error){
            console.log(error);
        }

    }

    const addParticipant = (friend) => {

        if(newGroupParticipants.some(participant => participant._id == friend._id)){
            console.log("Already Added!");
            return;
        }
        else{
            setNewGroupParticipants(prevParticipants => [...prevParticipants, friend]);
        }

        userSearchInput.current.value = "";
        setFriendsFound([]);


    }

    const clearSearch = () => {
        setFriendsFound([]);
    }

    const removeParticipant = (remove) => {
        if(newGroupParticipants.some(participant => participant._id == remove._id)){
            
            const updatedParticipants = newGroupParticipants.filter(participant => participant._id !== remove._id)

            console.log("Removed and Updated ", updatedParticipants);

            setNewGroupParticipants(updatedParticipants);

            return;
        }
    }

    const handelGroupChatClick = (group, id) => {
        
        console.log("Clicked");
        //setSelectedChatView(chat);
        setGroupChatToggle(true);
        setGroupId(id);
        setGetGroupData(true);

    }

    const createGroup = async() => {

        console.log("Group Participants", newGroupParticipants);

        const users = newGroupParticipants.map(participant => participant._id);

        users.push(currentUser._id);

        console.log("Group", users);

        const name = groupName.current.value;

        try{
            const response = await fetch('https://chat-app-p7p1.onrender.com/group/new', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ users, name })
            });

            //console.log(response);

            //const json = await response.json();
            //console.log(json);

            if(response.ok){
                notifyUser("Group Created", false, true);
                updateGroups();
                updateChats();

                setNewGroupParticipants([])

            }else{
                notifyUser("Could not Create Group", true, false);
            }

        }
        catch(error){
            console.log(error);
        }

        groupName.current.value = "";

    }

    const uploadFile = async() => {

        if (file) {
            const formData = new FormData();
            formData.append('profilePicture', file);
      
            fetch('https://chat-app-p7p1.onrender.com/user/profile', {
              method: 'POST',
              credentials: 'include',
              body: formData,
            })
              .then((response) => {
                if (response.ok) {
                  // File upload was successful
                  console.log('File uploaded successfully');
                  setFile(null);
                  setFileSize(null);
                  setImgSubmit(false);

                  notifyUser("Profile Picture Set!", false, true);

                  updateChats();

                } else {
                  // Handle errors
                  console.error('File upload failed');
                  setFile(null);
                  setFileSize(null);
                  setImgSubmit(false);

                  notifyUser("Failed to Set Profile Picture", true, false);

                }
              })
              .catch((error) => {
                console.error('Error:', error);
              });
          } else {
            console.error('Please select a file before uploading.');
          }

    }

    const checkSize = (e) => {

        if(e.target.files){
            const file = e.target.files[0];
            setFile(e.target.files[0]);
            const size = (file.size / (1024 * 1024)).toFixed(2)
            console.log("File Size: ", size);
            if(size > 0){
                setFileSize(size);
                setImgSubmit(true);
            }
        }

    }

    return (
        <div className="classList min-h-screen flex flex-col">
            <div className="flex flex-row w-full">
                <div className="w-[30%] h-[100vh]">
                    <Tab.Group defaultIndex={1}>
                        <Tab.List className="w-[full] h-[59px] bg-[#202c33] border-r border-[#8696a026] flex flex-row justify-end pr-3.5" >
                            <Tab className={({ selected }) =>
                                classNames(
                                'flex flex-row h-full w-full items-center px-4',
                                'focus:outline-none focus:ring-none',
                                selected
                                    ? ''
                                    : ''
                                )
                            }>
                                <ProfilePicture pictureUrl={ profilePicture && profilePicture } width={42} height={42} />
                            </Tab>
                            <Tab className={({ selected }) =>
                                classNames(
                                '',
                                'focus:outline-none focus:ring-none',
                                selected
                                    ? ''
                                    : 'hover:'
                                )
                            } onClick={fetchChats} >
                                <div className="relative w-12 h-12 flex items-center justify-center rounded-3xl group">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" className="w-5 h-5 fill-[#aebac1]">
                                        <path fill-rule="evenodd" d="M3.43 2.524A41.29 41.29 0 0110 2c2.236 0 4.43.18 6.57.524 1.437.231 2.43 1.49 2.43 2.902v5.148c0 1.413-.993 2.67-2.43 2.902a41.202 41.202 0 01-5.183.501.78.78 0 00-.528.224l-3.579 3.58A.75.75 0 016 17.25v-3.443a41.033 41.033 0 01-2.57-.33C1.993 13.244 1 11.986 1 10.573V5.426c0-1.413.993-2.67 2.43-2.902z" clip-rule="evenodd" />
                                    </svg>
                                </div>
                            </Tab>
                            <Tab className={({ selected }) =>
                                classNames(
                                '',
                                'focus:outline-none focus:ring-none',
                                selected
                                    ? ''
                                    : 'hover:'
                                )
                            } onClick={fetchGroupChats} >
                                <div className="relative w-12 h-12 flex items-center justify-center rounded-3xl group">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" className="w-5 h-5 fill-[#aebac1]">
                                            <path d="M3.505 2.365A41.369 41.369 0 019 2c1.863 0 3.697.124 5.495.365 1.247.167 2.18 1.108 2.435 2.268a4.45 4.45 0 00-.577-.069 43.141 43.141 0 00-4.706 0C9.229 4.696 7.5 6.727 7.5 8.998v2.24c0 1.413.67 2.735 1.76 3.562l-2.98 2.98A.75.75 0 015 17.25v-3.443c-.501-.048-1-.106-1.495-.172C2.033 13.438 1 12.162 1 10.72V5.28c0-1.441 1.033-2.717 2.505-2.914z" />
                                            <path d="M14 6c-.762 0-1.52.02-2.271.062C10.157 6.148 9 7.472 9 8.998v2.24c0 1.519 1.147 2.839 2.71 2.935.214.013.428.024.642.034.2.009.385.09.518.224l2.35 2.35a.75.75 0 001.28-.531v-2.07c1.453-.195 2.5-1.463 2.5-2.915V8.998c0-1.526-1.157-2.85-2.729-2.936A41.645 41.645 0 0014 6z" />
                                    </svg> 
                                </div>
                            </Tab>
                            <Tab className={({ selected }) =>
                                classNames(
                                '',
                                'focus:outline-none focus:ring-none',
                                selected
                                    ? ''
                                    : 'hover:'
                                )
                            } onClick={clearSearch}>
                                <div className="relative w-12 h-12 flex items-center justify-center rounded-3xl group">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#aebac1" className="w-5 h-5">
                                        <path fillRule="evenodd" d="M3.43 2.524A41.29 41.29 0 0110 2c2.236 0 4.43.18 6.57.524 1.437.231 2.43 1.49 2.43 2.902v5.148c0 1.413-.993 2.67-2.43 2.902a41.102 41.102 0 01-3.55.414c-.28.02-.521.18-.643.413l-1.712 3.293a.75.75 0 01-1.33 0l-1.713-3.293a.783.783 0 00-.642-.413 41.108 41.108 0 01-3.55-.414C1.993 13.245 1 11.986 1 10.574V5.426c0-1.413.993-2.67 2.43-2.902z" clipRule="evenodd" />
                                    </svg> 
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#202c33" className="absolute -mt-1 w-3.5 h-3.5 rounded-full">
                                        <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                                    </svg> 
                                </div>
                            </Tab>
                            <Tab className={({ selected }) =>
                                classNames(
                                '',
                                'focus:outline-none focus:ring-none',
                                selected
                                    ? ''
                                    : 'hover:'
                                )
                            } onClick={clearSearch}>
                                <div className="relative w-12 h-12 flex items-center justify-center rounded-3xl group">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="w-5 h-5 fill-[#aebac1]">
                                        <path d="M10 9a3 3 0 100-6 3 3 0 000 6zM6 8a2 2 0 11-4 0 2 2 0 014 0zM1.49 15.326a.78.78 0 01-.358-.442 3 3 0 014.308-3.516 6.484 6.484 0 00-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 01-2.07-.655zM16.44 15.98a4.97 4.97 0 002.07-.654.78.78 0 00.357-.442 3 3 0 00-4.308-3.517 6.484 6.484 0 011.907 3.96 2.32 2.32 0 01-.026.654zM18 8a2 2 0 11-4 0 2 2 0 014 0zM5.304 16.19a.844.844 0 01-.277-.71 5 5 0 019.947 0 .843.843 0 01-.277.71A6.975 6.975 0 0110 18a6.974 6.974 0 01-4.696-1.81z" />
                                    </svg>
                                </div>
                            </Tab>
                            <Tab className={({ selected }) =>
                                classNames(
                                '',
                                'focus:outline-none focus:ring-none',
                                selected
                                    ? ''
                                    : 'hover:'
                                )
                            } onClick={clearSearch}>
                                <div className="relative w-12 h-12 flex items-center justify-center rounded-3xl group">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" className="w-5 h-5 fill-[#aebac1]">
                                        <path fill-rule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clip-rule="evenodd" />
                                    </svg>
                                </div>
                            </Tab>
                            <UserOptions currentUser={currentUser}/>
                        </Tab.List>
                        <Tab.Panels className="bg-[#111b21] h-[calc(100%-59px)] border-r border-[#8696a026]">
                            <Tab.Panel>
                                <div className="w-full flex flex-col items-center justify-center">
                                    <div className="max-w-[200px] max-h-[200px] mt-8">
                                        <ProfilePicture pictureUrl={ profilePicture && profilePicture} width={200} height={200} />
                                    </div>
                                    <div className="flex flex-row w-full mt-4 items-center justify-center font-open">
                                        <input type="file" id="file" name="profilePicture" ref={imgRef} onChange={checkSize} class="hidden" accept=".jpg, .png, .jpeg"/>
                                        { imgSubmit === false ? (
                                            <label htmlFor="file" className="py-3 px-3 rounded-full font-semibold text-xs tracking-wide bg-[#202c33] hover:cursor-pointer">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 fill-[#008069]">
                                                    <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" />
                                                </svg>
                                            </label>
                                        ) : (
                                            fileSize < 1 ? (
                                                <button className="py-3 px-3 rounded-full font-semibold text-xs tracking-wide bg-[#202c33] hover:cursor-pointer" onClick={uploadFile}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-5 h-5 fill-[#008069]">
                                                        <path fill-rule="evenodd" className="stroke-2" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clip-rule="evenodd" />
                                                    </svg>
                                                </button>
                                            ) : 
                                            (
                                                <div className="flex flex-col items-center justify-center">
                                                    <label htmlFor="file" className="py-3 px-3 rounded-full font-semibold text-xs tracking-wide bg-[#202c33] hover:cursor-pointer">
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-5 h-5 fill-red-vivid-500">
                                                            <path fill-rule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clip-rule="evenodd" />
                                                        </svg>
                                                    </label>
                                                    <p className="text-red-vivid-600 font-open tracking-wide text-xs font-semibold p-2">File size is greater than 1Mb.</p>
                                                </div>
                                            )
                                        ) }
                                        
                                    </div>
                                    <div className="flex w-full flex-col mt-14 px-8 font-open tracking-wide">
                                        <p className="text-[#008069] text-sm">Your username</p>
                                        <p className="pt-3 text-[#D1D7DB] text-base indent-1">{currentUser && currentUser.username}</p>

                                        <p className="text-[#008069] text-sm mt-16">Your email</p>
                                        <p className="pt-3 text-[#D1D7DB] text-base indent-1">{currentUser && currentUser.email}</p>
                                    </div>
                                </div>
                            </Tab.Panel>
                            <Tab.Panel>
                                {chats && chats.map((chat) => (
                                    <div className="chat w-full bg-transparent hover:bg-[#2a3942] h-[72px] px-3 flex flex-row first:border-0" onClick={ () => handleChatClick(chat, chat._id)}>
                                        <Chat key={chat._id} chat={chat} messages={chat.messages} currentUser={currentUser}/>
                                    </div>
                                ))}
                            </Tab.Panel>
                            <Tab.Panel>
                                {groupChats && groupChats.map((group) => (
                                    <div className="chat w-full bg-transparent hover:bg-[#2a3942] h-[72px] px-3 flex flex-row first:border-0" onClick={ () => handelGroupChatClick(group, group._id) }>
                                        {console.log("GROUPPPPPPPPPPPPPPPPPPPPPPP", group.messages)}
                                        <GroupChat key={group._id} group={group} messages={group.messages} currentUser={currentUser} groupIcon={group.icon}/>
                                    </div>
                                ))}
                            </Tab.Panel>
                            <Tab.Panel className="">
                                <div className="font-open px-4 py-3 w-full">
                                    <input type="text" className="px-3 py-1.5 bg-[#202c33] border border-[#2a3942] rounded-lg focus:ring-0 focus:outline-none w-full focus:border-[#2a3942] placeholder-[#8696a0] caret-[#8696a0] text-[#d1d7db] placeholder:text-sm " placeholder="Search a friend to start a chat with..." onChange={searchFriend} ref={userSearchInput} />
                                </div>
                                <div>
                                    {friendsFound && friendsFound.map(friend => (
                                        <div key={friend._id} className="chat w-full bg-transparent hover:bg-[#2a3942] h-[72px] px-3 flex flex-row">
                                            <div className="chat w-full px-5 font-open font-light text-[#d1d7db] flex flex-row h-full items-center border-b border-[#8696a026]">
                                            <div className="pr-4">
                                                <ProfilePicture pictureUrl={friend.profilePicture} width={52} height={44} />
                                            </div>
                                            <div className="flex flex-col justify-center overflow-hidden w-full h-full space-y-[2px]">
                                                <div className="text-md flex flex-row justify-between items-center">
                                                    <p className="tracking-wide">{friend.username}</p>
                                                    {/* <p className="text-xs text-[#8696a0]">Hi</p> */}
                                                    <div className="flex flex-col bg-[#202c33] py-3 px-3 rounded-full items-center justify-center hover:cursor-pointer" onClick={() => newChatView(friend._id)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#aebac1" className="w-5 h-5">
                                                            <path fillRule="evenodd" d="M3.43 2.524A41.29 41.29 0 0110 2c2.236 0 4.43.18 6.57.524 1.437.231 2.43 1.49 2.43 2.902v5.148c0 1.413-.993 2.67-2.43 2.902a41.102 41.102 0 01-3.55.414c-.28.02-.521.18-.643.413l-1.712 3.293a.75.75 0 01-1.33 0l-1.713-3.293a.783.783 0 00-.642-.413 41.108 41.108 0 01-3.55-.414C1.993 13.245 1 11.986 1 10.574V5.426c0-1.413.993-2.67 2.43-2.902z" clipRule="evenodd" />
                                                        </svg> 
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#202c33" className="absolute -mt-1 w-3.5 h-3.5 rounded-full">
                                                            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                                                        </svg> 
                                                    </div>
                                                </div>
                                            </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Tab.Panel>
                            <Tab.Panel className="">
                                <div className="font-open px-4 py-3 w-full">
                                    <input type="text" className="px-3 py-1.5 bg-[#202c33] border border-[#2a3942] rounded-lg focus:ring-0 focus:outline-none w-full focus:border-[#2a3942] placeholder-[#8696a0] caret-[#8696a0] text-[#d1d7db] placeholder:text-sm " placeholder="Search friends to add..." onChange={searchFriend} ref={userSearchInput} />
                                </div>
                                <div className="flex flex-col font-open p-1.5 space-y-7 items-center">
                                    <p className="text-center text-[#00a884] font-light uppercase tracking-wider">Group Participants</p>
                                    {newGroupParticipants.length < 1 ? (
                                        <div className="">
                                            <p className="text-center px-2.5 py-[4px] text-sm rounded-full bg-[#2a3942] text-[#d1d7db] tracking-wider" >none selected</p>
                                        </div>
                                    ) : (<p className="hidden"></p>)}
                                </div>
                                <div className="font-open flex flex-wrap px-8 py-3 w-full items-center justify-center min-h-full max-h-28 overflow-y-scroll border-b border-[#8696a026]">
                                    {newGroupParticipants && newGroupParticipants.map(participant => ( 
                                        <div key={participant._id} className="bg-[#2a3942] mt-1.5 mb-[1.1rem] ml-1 px-2 py-[0.4rem]  flex flex-row items-center rounded-full">
                                            <div className="pr-2">
                                                <ProfilePicture pictureUrl={participant.profilePicture} width={20} height={20} />
                                            </div>
                                            <div className="text-[#d1d7db] text-xs">
                                                {participant.username}
                                            </div>
                                            <div className="pl-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#aebac1" class="w-5 h-5 hover:fill-red-vivid-400 hover:cursor-pointer" onClick={() => removeParticipant(participant)}>
                                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
                                                </svg>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="">
                                    {friendsFound && friendsFound.map(friend => (
                                        <div key={friend._id} className="chat w-full bg-transparent hover:bg-[#2a3942] h-[72px] px-3 flex flex-row">
                                            <div className="chat w-full px-5 font-open font-light text-[#d1d7db] flex flex-row h-full items-center border-b border-[#8696a026]">
                                                <div className="pr-4">
                                                    <ProfilePicture pictureUrl={friend.profilePicture} width={52} height={44} />
                                                </div>
                                                <div className="flex flex-col justify-center overflow-hidden w-full h-full space-y-[2px]">
                                                    <div className="text-md flex flex-row justify-between items-center">
                                                        <p className="tracking-wide">{friend.username}</p>
                                                        {/* <p className="text-xs text-[#8696a0]">Hi</p> */}
                                                        <div className="flex flex-col bg-[#202c33] py-3 px-3 rounded-full items-center justify-center hover:cursor-pointer" onClick={() => addParticipant(friend)}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="#aebac1" className="w-5 h-5 rounded-full">
                                                                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                                                            </svg> 
                                                        </div>
                                                    </div>
                                                    {/* <div className="flex flex-row w-full space-x-1 text-sm text-[#8696a0]">

                                                        Hi

                                                    </div> */}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                { newGroupParticipants.length > 0 ? (<div className="w-full flex flex-row justify-center items-center">
                                    <div className="py-5 pl-6 w-[80%]">
                                        <input type="text" className="px-3 py-2 bg-[#202c33] border-[#2a3942] border-t-0 rounded-b-lg focus:ring-0 focus:outline-none w-full focus:border-[#2a3942] placeholder-[#8696a0] caret-[#8696a0] text-[#d1d7db] placeholder:text-sm text-sm" placeholder="Group name..." ref={groupName} />
                                    </div>
                                    <div className="px-4 hover:cursor-pointer" onClick={createGroup}>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#00a884" class="w-10 h-10">
                                            <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clip-rule="evenodd" />
                                        </svg>
                                    </div>
                                </div>) : ("")}
                            </Tab.Panel>
                            <Tab.Panel className="">
                                <div className="font-open px-4 py-3 w-full">
                                    <input type="text" className="px-3 py-1.5 bg-[#202c33] border border-[#2a3942] rounded-lg focus:ring-0 focus:outline-none w-full focus:border-[#2a3942] placeholder-[#8696a0] caret-[#8696a0] text-[#d1d7db] placeholder:text-sm " placeholder="Search and make some friends..." onChange={searchUser} ref={userSearchInput} />
                                </div>
                                <div>
                                    {friendsFound && friendsFound.map(friend => (
                                        <div key={friend._id} className="chat w-full bg-transparent hover:bg-[#2a3942] h-[72px] px-3 flex flex-row">
                                            <div className="chat w-full px-5 font-open font-light text-[#d1d7db] flex flex-row h-full items-center border-b border-[#8696a026]">
                                            <div className="pr-4">
                                                <ProfilePicture pictureUrl={friend.profilePicture} width={48} height={40} />
                                            </div>
                                            <div className="flex flex-col justify-center overflow-hidden w-full h-full space-y-[2px]">
                                                <div className="text-md flex flex-row justify-between items-center">
                                                    <p className="tracking-wide">{friend.username}</p>
                                                    {console.log("Friend: ", friend.username, "CurrentUser: ", currentUser.username)}
                                                    {/* <p className="text-xs text-[#8696a0]">Hi</p> */}
                                                    <div className="flex flex-col bg-[#202c33] py-3 px-3 rounded-full items-center justify-center hover:cursor-pointer" onClick={() => addFriend(friend)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                                                            <path d="M11 5a3 3 0 11-6 0 3 3 0 016 0zM2.615 16.428a1.224 1.224 0 01-.569-1.175 6.002 6.002 0 0111.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 018 18a9.953 9.953 0 01-5.385-1.572zM16.25 5.75a.75.75 0 00-1.5 0v2h-2a.75.75 0 000 1.5h2v2a.75.75 0 001.5 0v-2h2a.75.75 0 000-1.5h-2v-2z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                {/* <div className="flex flex-row w-full space-x-1 text-sm text-[#8696a0]">

                                                    Hi

                                                </div> */}
                                            </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Tab.Panel>
                        </Tab.Panels>
                    </Tab.Group>
                    {/* <div className="w-[full] h-[59px] bg-[#202c33] border-r border-[#8696a026]">
                    </div> */}
                    {/* <div className="bg-[#111b21] h-[calc(100%-59px)] border-r border-[#8696a026] first:border-0">
                        {chats && chats?.map((chat) => (
                            <div className="chat w-full bg-transparent hover:bg-[#2a3942] h-[72px] px-3 flex flex-row" onClick={ () => handleChatClick(chat, chat._id)}>
                                {/* <Chat key={chat._id} chat={chat} messages={chat.messages} currentUser={currentUser}/> */}
                            {/* </div> */}
                        {/* ))} */}
                    {/* </div> */} 
                </div>
                
                { groupChatToggle == false ? <ChatView getData={getData} currentUser={currentUser} chatId={chatId} toggleSetData={toggleSetData} userFriends={friends} updateData={updateChats}/>
                 : <GroupView getGroupData={getGroupData} currentUser={currentUser} groupId={groupId} toggleSetGroupData={toggleSetGroupData} updateData={updateGroups}/> }

                { showNotify && <Notify message={notify && notify.message} error={notify && notify.error} success={notify && notify.success} hideNotify={hideNotify} /> }

            </div>
        </div>
    )
};

export default NavPanel;

{/* <div className="chats">
                {console.log(chats)}
                {chats && chats.map((chat) => (
                    <div>
                        <p key={chat._id}>{chat.participants[1].username}</p>
                        <p key={chat.messages[chat.messages.length - 1]._id} >{chat.messages[chat.messages.length - 1].sender.username} : {chat.messages[chat.messages.length - 1].content}</p>
                    </div>
                ))}
            </div> */}
