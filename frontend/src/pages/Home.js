import { useEffect, useState} from "react";
import { Link } from "react-router-dom";
import NavPanel from "../components/NavPanel";

const Home = () => {

    return (
        <div className="home">

            <NavPanel />

        </div>
    )
};

export default Home;

{/* <div className="chats">
                {console.log(chats)}
                {chats && chats.map((chat) => (
                    <div>
                        <p key={chat._id}>{chat.participants[1].username}</p>
                        <p key={chat.messages[chat.messages.length - 1]._id} >{chat.messages[chat.messages.length - 1].sender.username} : {chat.messages[chat.messages.length - 1].content}</p>
                    </div>
                ))}
            </div> */}