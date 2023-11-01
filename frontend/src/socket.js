import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = 'http://localhost:4000';
//process.env.NODE_ENV === 'production' ? undefined : 

const socket = io(URL, {
    autoConnect: false, transports: ['websocket', 'polling', 'flashsocket']
});

const connect = () => {
    try {
        socket.connect();
        console.log("Socket connected!");
    } catch (error) {
        console.error("Socket connection error:", error);
    }
}

export default socket;