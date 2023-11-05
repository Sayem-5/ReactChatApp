if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');
const Group = require('./models/group');
const User = require('./models/user');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const Message = require('./models/message');
const ejsMate = require('ejs-mate');
const GroupMessage = require('./models/groupMessage');
const flash = require('connect-flash');
const catchAsync = require('./utils/catchAsync');
const Chat = require('./models/chat');
const methodOver = require('method-override');
const cors = require('cors');
const dbUrl = process.env.DB_CONNECT;
//const Friend = require('./models/friend');n
//'mongodb://127.0.0.1:27017/chatApp'
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const MongoStore = require('connect-mongo');

const chatsRouter = require('./routes/chats');
const groupsRouter = require('./routes/groups');
const friendsRouter = require('./routes/friends');
const usersRouter = require('./routes/users');

//npx tailwindcss -i ./public/css/input.css -o ./public/css/tailwind.css --watch

app.use(cors({ 
    origin: 'https://chat-app-ui-gcsq.onrender.com',
    credentials:  true,
 }));
app.set("trust proxy",1);

const port = 4000;

mongoose.connect(dbUrl)
  .then(() => console.log('Connected!'));

// const sessionConfig = {
//     name: 'session',
//     secret: 'secret',
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//         httpOnly: true,
//         //secure: true,
//         //expires: Date.now() + 1000 * 60 * 60 * 24,
//         maxAge: 1000 * 60 * 15 
//     }
// };

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
    name: 'session',
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        //expires: Date.now() + 1000 * 60 * 60 * 24,
        maxAge: 1000 * 60 * 15 
    },
    store: MongoStore.create({
      mongoUrl: dbUrl,
      secret:'secret',
      touchAfter: 24 * 60 * 60
    })
}));

app.use(express.static(path.join(__dirname, 'public'))); //For serving static files
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOver('_method'));
app.use(helmet());
//express.use(mongoSanatize());

app.use(
    mongoSanitize({
      replaceWith: '_',
    }),
);


app.use((req, res,next) => {
    res.locals.success = req.flash('success');
    res.locals.isBlocked = false;
    res.locals.navBar = true;
    next();
});

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use('/user', usersRouter);
app.use('/chat', chatsRouter);
app.use('/group', groupsRouter);
app.use('/friend', friendsRouter);


app.use((req, res) => {
    res.send('You are connected! Please visit the https://chat-app-ui-gcsq.onrender.com/');
});

io.on("connection", (socket) => {
    
    console.log("A User Connected! - - - ");

    socket.on('user', catchAsync(async(data, callback) => {

        const { user } = data;
        
        console.log("In Server...", socket.id);
        const statuss = "online";
        const storeID = await User.findByIdAndUpdate({ _id: user } , { connectionId: socket.id, statuss }, { new: true });
        
        // Send acknowledgment to the client with the updated connectionId
        callback({ connectionId: socket.id });

        //onlineUsers.push(user);
        //io.emit('online', onlineUsers);
        
    }));

    socket.on('chat message', catchAsync(async(messageData) => {

        //console.log("Socket.id:", socket.id);

        const { senderId, recipientId, content, date, time } = messageData;
    
        console.log(messageData, "MessageObj", "Socket.id:", socket.id);

        const saveMessage = new Message({ sender: senderId, receiver: recipientId, content, date, time });;
        await saveMessage.save();

        const recpUser = await User.findById(recipientId);
        const recipientSocketId = recpUser.connectionId;
        console.log("RecpID: ", recipientSocketId);
        const sendUser = await User.findById(senderId);
        const senderSocketId = sendUser.connectionId;
        const sender = sendUser;
        console.log("SendID: ", senderSocketId);

        //CreateChat---------------------------------------------------------
        const participants = [senderId, recipientId];

        //Check if chat exists?
        participants.sort();
  
        // Search for a chat where the 'members' array matches the specified order
        const existingChat = await Chat.findOne({
        participants: participants,
        });

        //console.log(existingChat);

        if (existingChat === null) {
            //console.log('No chat found.');
            const createChat = await new Chat({ participants: [senderId, recipientId] });
            createChat.messages.push(saveMessage);
            await createChat.save();
            //console.log('Chat created!');
        } else {
            //console.log('A chat already exists between the specified participants.');
            //console.log("Chat Details: ", existingChat);
            const chat = existingChat._id;
            const addMsgToChat = await Chat.findById(chat);
            addMsgToChat.messages.push(saveMessage);
            await addMsgToChat.save();
            //console.log('Message Added to Chat');
        }
        //END Chat---------------------------------------------------------------
       
        io.to(recipientSocketId).emit('chat message', {
           senderSocketId,
           content,
           time,
           sender
        });

        //Part of code that can be better but I'm lazy
        io.to(senderSocketId).emit('my message', await saveMessage.populate("sender"));

        io.to(recipientSocketId).emit('stop typing');      

    }));

    socket.on('JoinRoom', (data) => {
        socket.join(data);
        console.log('RoomJoined');
    });

    socket.on('group chat message', catchAsync(async(messageData) => {

        console.log("Socket.id:", socket.id);

        const { groupId, sender, receivers, content, date, time } = messageData;
    
        console.log(messageData, "MessageObj", "Socket.id:", socket.id);

        const getUsers = await User.find({ _id: { $in: receivers } });
        const userIdsArray = getUsers.map(user => user._id);

        const getGroup = await Group.findById(groupId);
        const groupID = getGroup._id;
        const sendUser = await User.findById(sender);
        const senderID = sendUser._id;
        const senderUsername = sendUser.username;
        const senderSocketId = sendUser.connectionId;

        const saveGroupMessage = new GroupMessage({ groupId: groupID, sender: senderID, receivers: userIdsArray, content, date, time });
        saveGroupMessage.save();

        console.log('Emitting to: ', groupId);

        io.to(groupId).emit('group chat message', {
           senderSocketId,
           content,
           senderUsername
         });

         //Part of code that can be better but I'm lazy
        io.to(senderSocketId).emit('my group message', await saveGroupMessage.populate("sender"));

    }));

    // socket.on('disconnect', catchAsync(async() => {

    //     console.log("User disconnected: ", socket.id);
    //     const user = await User.findOneAndUpdate({ connectionId: socket.id }, { status: "offline" }, { new: true });  

    //     var offline = null;

    //     for(let i = 0; i <= onlineUsers.length; i++){
    //         if(onlineUsers[i] == user._id ){
    //           offline = onlineUsers.pop(user._id);
    //           console.log('UserPopped:', user._id, offline);
    //         }
    //       }

    //       console.log(offline);
    //     io.emit('offline', offline );

    // }));

    socket.on('typing', catchAsync(async(showTo) => {
        const user = await User.findById(showTo);
        const userToShow = user.connectionId;

        io.to(userToShow).emit('typing');

    }));  
    
    socket.on('stop typing', catchAsync(async(showTo) => {
        const user = await User.findById(showTo);
        const userToShow = user.connectionId;

        io.to(userToShow).emit('stop typing');

    })); 

    socket.on("Hi", () =>{
        console.log("Got it");
    })

});

http.listen(port, () => {
    console.log('HTTP Serving...');
});