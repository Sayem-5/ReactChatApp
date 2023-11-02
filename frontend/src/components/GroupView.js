import { useState, useEffect, useRef } from 'react';
import backgroundpattern from '../css/star.svg';
import GroupForm from './GroupForm';
//import groupOptions from './groupOptions';
import socket from "../socket";
import GroupMessage from './GroupMessage';
import GroupOptions from './GroupOptions';
import Vibrant from 'node-vibrant'
import GroupIcon from './GroupIcon';
import Notify from './Notify';


const GroupView = (prop) => {

    const { currentUser, groupId, getGroupData, toggleSetGroupData, updateData } = prop;
    const [ group, setGroup] = useState(null);
    const [ groupIcon, setGroupIcon] = useState(null);
    const [ messages, setMessages] = useState(null);
    const [ participants, setParticipants ] = useState(null);
    const [ colors4Participants, setColors4Participants ] = useState(null);
    //const [ currentUser, setCurrentUser] = useState(null);
    const [newMessages, setNewMessages] = useState([]);
    const [groupInfo, setGroupInfo] = useState(false);
    //const [messageSent, setMessageSent] = useState("Initial Some State");
    const divRef = useRef(null);
    const iconRef = useRef(null);

    const [ fileSize, setFileSize] = useState(null);
    const [ imgSubmit, setImgSubmit ] = useState(false);
    const [ file, setFile ] = useState(null);

    const [ notify, setNotify] = useState({});

    const [ notifyLeft, setNotifyLeft ] = useState(false);
    const [ showGroup, setShowGroup ] = useState(true);

    console.log("In GroupView", getGroupData);

    const updateGroup = () => {
        updateData();
        setTimeout(() => {
            setShowGroup(false);
        }, 6000)
        
    }

    const toggleNotifyLeft = (message, error, success) => {
        console.log("NOTIFY: ", message, error, success);
        setNotify({ message, error, success });
        setNotifyLeft(true);
    }

    const hideNotify = () => {

        setNotify({});
        setNotifyLeft(false);
    }

    const groupInfoToggle = () => {
        setGroupInfo(!groupInfo);
    }

    const scrollToMessage = () => {

        divRef.current?.scrollIntoView({
            behavior: 'smooth'
        });

    }

    const getColor = async(url) => {

        try {
            const palette = await Vibrant.from(url.profilePicture).getPalette();
            const color = palette.Vibrant.hex;
            return color;
          } catch (error) {
            console.error(error);
            return null; // or handle the error in some way
          }
          

    }

    const addColorToParticipants = async (participants) => {
        const participantsWithColor = await Promise.all(
          participants.map(async (participant) => {
            const color = await getColor(participant);
            return { ...participant, color };
          })
        );
      
        return participantsWithColor;
      };

    useEffect(() => {

        setShowGroup(true);

        if(newMessages.length > 0){
            scrollToMessage();
        }
    }, [newMessages])

    useEffect(() => {

        setNewMessages([]);

        setGroupInfo(false);

        console.log("In Group Effect", getGroupData);

        const fetchGroupChat = async() => {

            console.log("In Group Fetch", getGroupData);
            //no need to use await
            try{
                const data = await fetch(`https://chat-app-p7p1.onrender.com/group/${groupId}`, 
                {
                    method: 'GET',
                    credentials: 'include',
                    headers: { "Content-Type": "application/json" }
                }).then(res => res.json())
                .then(data => {
                    //setComponentData(data.group, data.messages, data.group.participants);
                    setGroup(data.group);
                    setMessages(data.groupMessages);
                    setParticipants(data.group.users);
                    setGroupIcon(data.group.icon);
                    console.log("Users:___________________________- ", data.group.users);

                    addColorToParticipants(data.group.users)
                        .then((participantsWithColor) => {
                            setColors4Participants(participantsWithColor);
                            console.log(participantsWithColor);
                        })
                        .catch((error) => {
                            console.error(`Error: ${error}`);
                        });

                });
            }catch(error){
                console.log("Fetch Error: ", error);
            }
    
        }

        if(getGroupData === true){

            fetchGroupChat().then(() => {
                scrollToMessage();
            });

            console.log("Group Fetched");

            toggleSetGroupData();

        }

        socket.on('group chat message', (message) => {

            console.log("New Message!", message);
            // Handle the received message here
            setNewMessages(prevMessages => [...prevMessages, message]);

        });
        //Part of code that can be better but I'm lazy
        socket.on('my group message', (message) => {

            console.log("My Message!", message);
            // Handle the received message here
            setNewMessages(prevMessages => [...prevMessages, message]);

        });
        //Part of code that can be better but I'm lazy

        return () => {
          // Clean up the event listener when the component unmounts
          socket.off('group chat message');
          socket.off('my group message');
        };
        
    }, [getGroupData]);

    const uploadFile = async() => {

        if (file) {
            const formData = new FormData();
            formData.append('groupIcon', file);
            formData.append('groupId', group._id);
      
            fetch('https://chat-app-p7p1.onrender.com/group/icon', {
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

                } else {
                  // Handle errors
                  console.error('File upload failed');
                  setFile(null);
                  setFileSize(null);
                  setImgSubmit(false);

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

        showGroup ? (
            <div className="w-[70%] h-[100vh] bg-[#0b141a] bg-opacity-100 bg-[url('../css/star.svg')] flex flex-col">
            <div className="h-[60px] relative flex bg-[#202c33] flex-row items-center justify-between hover:cursor-pointer">
                <div className="pl-5 flex items-start" onClick={groupInfoToggle}>
                <div className="">
                    <GroupIcon iconUrl={groupIcon} width={40} height={40} />
                </div>
                    <div className='text-[#e9edef] font-open pl-2'>
                        <div className='text-md font-semibold tracking-wide'>
                        {group && group.name}
                        </div>
                        <div className='text-[#8696a0] w-[40rem] font-normal text-xs flex flex-row tracking-wide group truncate'>
                            {participants && participants.map((participant, index) => <p className=''>{participant.username}{index !== participants.length - 1 ? (<span>,&nbsp;</span>) : ""}</p>)}
                        </div>
                    </div>
                </div>
                <div className='pr-7 mt-1.5 flex flex-col justify-center items-center h-full'>
                    {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-8 h-8 fill-[#aebac1]">
                        <path fill-rule="evenodd" d="M10.5 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm0 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm0 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" clip-rule="evenodd" />
                    </svg> */}
                    
                    <div>
                        <GroupOptions groupId={groupId} toggleNotifyLeft={toggleNotifyLeft} updateGroup={updateGroup}/>
                    </div>
                </div>
            </div>
            <div className='messages-container h-[82.34%] overflow-y-scroll scroll-smooth'>
                {/* <div className='flex flex-row w-full items-center justify-center'>
                    
                </div> */}
                <div className='w-full flex flex-col first:mt-5 '>
                    {messages && messages.map((message, index) => (
                        <GroupMessage 
                            key={message._id} 
                            message={message} 
                            currentUser={currentUser} 
                            prevMessageSender={index > 0 ? messages[index - 1].sender : null} 
                            senderColor={colors4Participants && colors4Participants.find(participant => participant._id.toString() == message.sender._id.toString())}
                        />
                    ))}
                    {newMessages && newMessages.map((message, index) => (
                        <GroupMessage 
                            key={message._id} 
                            message={message} 
                            currentUser={currentUser} 
                            prevMessageSender={index > 0 ? newMessages[index - 1].sender : null}
                            senderColor={colors4Participants && colors4Participants.find(participant => participant._id.toString() == message.sender._id.toString())}
                        />
                    ))}
                    <div className='w-0 h-0' ref={divRef}></div>
                </div>
            </div>
            { (group !== "None") || participants.find( participant => participant._id.toString() === currentUser._id.toString()) ? (<GroupForm participants={participants} currentUser={currentUser} groupId={groupId} />) : ( <div></div> )}
            <div className={`${ groupInfo ? "right-0" : "-right-96" } transition-all ease-in-out duration-200 absolute h-[100vh] w-[25%] bg-[#0b141a] bg-opacity-40 backdrop-blur-3xl`}>
                <div className='flex flex-col h-full w-full'>
                    <div className='h-[59px] flex bg-[#202c33] border-l border-[#8696a026]'>

                    </div>
                    <div className='h-[92%] border-l border-[#8696a026] w-full font-open'>
                        <div className="w-full flex flex-col items-center justify-center">
                            <div className="max-w-[200px] max-h-[200px] mt-8">
                                <GroupIcon iconUrl={groupIcon} width={200} height={200} />
                            </div>
                            <div className="flex flex-row w-full mt-4 items-center justify-center font-open">
                                <input type="file" id="groupIcon" name="groupIcon" ref={iconRef} onChange={checkSize} class="hidden" accept=".jpg, .png, .jpeg"/>
                                { imgSubmit === false ? (
                                    <label htmlFor="groupIcon" className="py-3 px-3 rounded-full font-semibold text-xs tracking-wide bg-[#202c33] hover:cursor-pointer">
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
                            <div className='w-full flex flex-row items-center justify-center mt-7'>
                                    <p className="text-[#D1D7DB] text-2xl tracking-wider">{ group && group.name }</p>
                            </div>
                            <div className="flex w-full flex-col mt-10 px-8 font-open tracking-wide hover:cursor-default">
                                <p className="text-[#008069] text-base font-normal tracking-wider align-middle">Group participants <span className='font-open font-bold'>·</span> <span className='font-medium'>{ participants && participants.length }</span>  </p>
                                <div className='w-full h-40 overflow-y-scroll'>
                                    { participants && participants.map( participant => (<p className="pt-3 text-[#D1D7DB] text-base indent-1">{participant.username}</p>) ) }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            { notifyLeft && <Notify message={notify && notify.message} error={notify && notify.error} success={notify && notify.success} hideNotify={hideNotify} /> }
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

export default GroupView;