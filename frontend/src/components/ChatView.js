import { useState, useEffect, useRef } from 'react';
import backgroundpattern from '../css/star.svg';
import ChatForm from './ChatForm';
import ChatOptions from './ChatOptions';
import Message from './Message';
import socket from "../socket";
import Notify from './Notify';
import ProfilePicture from './ProfilePicture';


const ChatView = (prop) => {

    const { currentUser, chatId, getData, toggleSetData, userFriends, updateData } = prop;
    const [ chat, setChat] = useState(null);
    const [ messages, setMessages] = useState(null);
    const [ participants, setParticipants ] = useState(null);
    const [ friend, setFriend ] = useState(null);
    const [ showView, setShowView] = useState(true);

    //const [ currentUser, setCurrentUser] = useState(null);
    const [newMessages, setNewMessages] = useState([]);
    //const [messageSent, setMessageSent] = useState("Initial Some State");
    const divRef = useRef(null);

    const [ notify, setNotify] = useState({});

    const [ notifyFriend, setNotifyFriend ] = useState(false);
    const [ notifyBlock, setNotifyBlock ] = useState(false);
    const [ notifyDelete, setNotifyDelete ] = useState(false);

    console.log("In view", getData);

    const toggleNotifyFriend = (message, error, success) => {
        console.log("NOTIFY: ", message, error, success);
        setNotify({message, error, success});
        setNotifyFriend(true);
    }

    const toggleNotifyBlock = (message, error, success) => {
        setNotify({message, error, success});
        setNotifyBlock(true);
    }

    const toggleNotifyDelete = (message, error, success) => {
        setNotify({message, error, success});
        setNotifyDelete(true);
    }

    const updateChatView = (chatDeleted) => {
        
        updateData();
        fetchChats();

        if(chatDeleted == true){
            setShowView(null)
        }

    }

    const hideNotify = () => {

        setNotify({});
        setNotifyFriend(false);
        setNotifyBlock(false);
        setNotifyDelete(false);
    }

    const scrollToMessage = () => {

        divRef.current?.scrollIntoView({
            behavior: 'smooth'
        });

    }

    //finding the guy user is chatting with 
    const findFriend = (friends) => {
        
        const userFriend = friends.find(friend => currentUser._id.toString() !== friend._id.toString());
        setFriend(userFriend);
        console.log("OOOOOOOOOOOOOOOOOO", userFriend)

    }

    const fetchChats = async() => {

        console.log("In fetchhhhhhhhhhhhhhh", getData);

        const data = await fetch(`/chat/${chatId}`)
        .then(res => res.json())
        .then(data => {
            //setComponentData(data.chat, data.messages, data.chat.participants);
            setChat(data.chat);
            setMessages(data.messages);
            setParticipants(data.chat.participants);
            console.log(data);

            findFriend(data.chat.participants);

        });

    }

    

    useEffect(() => {
        if(newMessages.length > 0){
            scrollToMessage();
        }
    }, [newMessages])

    useEffect(() => {

        setNewMessages([]);

        setShowView(true);

        if(getData === true){

            fetchChats().then(() => {
                scrollToMessage();
            });

            toggleSetData();

        }

        socket.on('chat message', (message) => {

            console.log("New Message!", message);
            // Handle the received message here
            setNewMessages(prevMessages => [...prevMessages, message]);

        });
        //Part of code that can be better but I'm lazy
        socket.on('my message', (message) => {

            console.log("My Message!", message);
            // Handle the received message here
            setNewMessages(prevMessages => [...prevMessages, message]);

        });
        //Part of code that can be better but I'm lazy

        return () => {
          // Clean up the event listener when the component unmounts
          socket.off('chat message');
          socket.off('my message');
        };
        
    }, [getData]);
    

    return (

        (showView && chatId) !== null ? (
            <div className="chatView w-[70%] h-[100vh] bg-[#0b141a] bg-opacity-100 bg-[url('../css/star.svg')] flex flex-col">
                <div className="w-full h-[60px] relative flex bg-[#202c33] flex-row items-center justify-between">
                    <div className="pl-5 flex items-start">
                        {console.log("Chats :", chat,"Messages: ", messages)}
                        <div className="">
                            <ProfilePicture pictureUrl={ friend && friend.profilePicture} width={40} height={40} />
                        </div>
                        <div className='text-[#e9edef] font-open text-md font-semibold tracking-wide pl-2'>
                            {/* {this whole block can be removed, use friend variable} */}
                            {participants && participants.map((participant) => {
                                return currentUser._id.toString() === participant._id.toString() ? (
                                    ""
                                ) : (
                                    <p key={participant._id} className=''>{participant.username}</p>
                                )
                            })}
                        </div>
                    </div>
                    <div className='pr-7 mt-1.5 flex flex-col justify-center items-center h-full'>
                        {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-8 h-8 fill-[#aebac1]">
                            <path fill-rule="evenodd" d="M10.5 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm0 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm0 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" clip-rule="evenodd" />
                        </svg> */}
                        
                        <div>

                            <ChatOptions chattingWith={friend} friends={userFriends}  chatId={chatId} toggleNotifyFriend={toggleNotifyFriend} toggleNotifyBlock={toggleNotifyBlock} toggleNotifyDelete={toggleNotifyDelete} updateChatView={updateChatView}/>

                        </div>
                    </div>
                </div>
                <div className='messages-container h-[82.34%] overflow-y-scroll scroll-smooth'>
                    <div className='w-full flex flex-col first:mt-5 '>
                        {messages && messages.map((message) => (
                            <Message key={message._id} message={message} currentUser={currentUser} />
                        ))}
                        {newMessages && newMessages.map((message) => (
                            <Message key={message._id} message={message} currentUser={currentUser} />
                        ))}
                        <div className='w-0 h-0' ref={divRef}></div>
                    </div>
                </div>
                { chat !== "None" ? (<ChatForm participants={participants} currentUser={currentUser}/>) : ( <div></div> )}

                { (notifyFriend || notifyBlock || notifyDelete) && <Notify message={notify && notify.message} error={notify && notify.error} success={notify && notify.success} hideNotify={hideNotify} /> }
                
            </div>
        ) : 
        (
            <div className="chatView w-[70%] h-[100vh] bg-[#0b141a] bg-opacity-100 bg-[url('../css/star.svg')] flex flex-col justify-center items-center">
                <div className='bg-[#202c33] h-16 w-56 -mt-5 rounded-xl flex flex-row justify-center items-center transition-all ease-in-out animate-startTalk'>
                    <div className='text-[#d1d7db] flex flex-row font-open font-light tracking-wide text-2xl'>
                        <p>Start talkin'</p>
                    </div>
                </div>
            </div>
        )

    )
}

export default ChatView;