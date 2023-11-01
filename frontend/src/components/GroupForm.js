import { useRef } from "react";
import socket from "../socket";

const GroupForm = (prop) => {

    const { participants, currentUser, groupId } = prop;
    const inputRef = useRef(null);
    //TempCode
    const user = currentUser && currentUser._id;

    const sender = participants && participants.find(participant => participant._id.toString() === currentUser._id.toString());
    const receiver = participants && participants.filter(participant => participant._id.toString() !== currentUser._id.toString());
    //console.log("Receivers: ", receiver);

    const receivers = receiver && receiver.map(receiver => receiver._id);

    console.log("Receivers: ", receivers);

    //Temp Code
    const data = {
        user: user
    }

    console.log("User: ", user);
    socket.emit('user', data, (response) => {
        // This callback function is called when the server responds
        const { connectionId } = response;
        console.log("My Socket: ", socket.id);
        console.log("Connection ID: ", connectionId);

    });
    
    async function handleSubmit(event) {

        event.preventDefault();

        const message = inputRef.current.value.trim();

        if (message !== '') {   
            // Prepare the message object 
            const messageObject = {
            groupId,
            sender: sender._id,
            receivers,
            content: message,
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString('en-US', { hour12: false, 
                                            hour: "numeric", 
                                            minute: "numeric"})
            };
            
            console.log('--------- Send Group Msg Data -------- ', messageObject);
            // Send the message to the server
            socket.emit('group chat message', messageObject);

            inputRef.current.value = "";
            console.log("My SockedID: ", socket.id);

            //onMessageSend(messageObject);

            // let typingTimer;
            // const typingTimeout = 2000;
        
            // document.getElementById('message-input').addEventListener('input', () => {
            //     clearTimeout(typingTimer);
            
            //     const showTypingTo = '<%= user._id %>';
            
            //     socket.emit('typing', showTypingTo);
            
            //     typingTimer = setTimeout(() => {
            //         socket.emit('stop typing', showTypingTo);
            //     }, typingTimeout);
        
            // });

        }
}

    return (
        <div className="px-4 border-l w-full h-[62px] border-[#8696a026] py-1.5 bg-[#202c33]">
            <div>
                <form method="POST" onSubmit={handleSubmit} className="w-full font-open text-sm px-2 flex flex-row space-x-3">
                    <input ref={inputRef} type="text" className="px-4 py-3 bg-[#2a3942] border border-[#2a3942] rounded-lg w-full focus:ring-0 focus:outline-none focus:border-[#2a3942] placeholder-[#8696a0] caret-[#8696a0] text-[#d1d7db]" placeholder=" Type a message"/>
                    <button type="submit" className="px-2 rounded-full bg-[#2a3942]">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-8 h-8 text-[#00a884]">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    )
}

export default GroupForm;