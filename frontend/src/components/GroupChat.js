import GroupIcon from "./GroupIcon";

const GroupChat = (prop) => {

    const { group, messages, currentUser, groupIcon } = prop;
    //console.log("User: ", currentUser);
    const lastMessage = messages && messages.length ? messages[messages.length - 1] : "none";

    //Time to 12hrs
    function convertTo12HourFormat(time24hr) {
        const date = new Date(`2000-01-01T${time24hr}`);
        return date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }).toLowerCase()
        .replace(/\s/g, '');
    }

    //console.log("Chats: ", chat, "Msgs: ", messages);
    //console.log("Sender: ", lastMessage.sender, "User: ", currentUser.username )
    return(

        <div className="chat w-full px-5 font-open text-[#d1d7db] flex flex-row h-full items-center border-t border-[#8696a026]">
            <div className="pr-4">
                <GroupIcon iconUrl={groupIcon} width={52} height={44} />
            </div>
            <div className="flex flex-col justify-center overflow-hidden w-full h-full space-y-[2px]">
                <div className="text-md flex flex-row justify-between items-center">
                    <p className="tracking-wide">{ group && group.name}</p>
                    <p className="text-xs text-[#8696a0]">{ lastMessage == "none" ? "" : convertTo12HourFormat(lastMessage.time)}</p>
                </div>
                {lastMessage == "none" ? 
                
                    (<div className="flex flex-row w-full space-x-1 text-sm text-[#8696a0]">

                        <p className="truncate">Start the conversation</p>

                    </div>) : 
                    
                    (<div className="flex flex-row w-full space-x-1 text-sm text-[#8696a0]">

                        {lastMessage.sender.username === currentUser.username ? (
                            <p>You:</p>
                        ): (<p className="">{lastMessage.sender.username}:</p>)}

                        <p className="truncate">{lastMessage.content}</p>

                    </div>)}
                
            </div>
        </div>
    )
}

export default GroupChat;