const Chat = require('../models/chat');
const User = require('../models/user');
const Message = require('../models/message');
const { onlineUsers, partial } = require('../utils/globals');

module.exports.index = async(req, res) => {

    const currentUser = req.user;
    //console.log("User logged in:", currentUser);
    const allChats = await Chat.find({ participants: currentUser._id }).populate('participants').populate('messages').populate({
        path: 'messages',
        populate: {
            path: 'sender',
            model: 'User'
        } 
    });

    // const deleteChat = async (chat) => {
        
    //     if(!chat.messages.length){
    //         console.log("Empty Chat: ", chat._id);
    //         await Chat.findByIdAndDelete({ _id: chat._id});
    //         console.log("Chat Deleted!", chat._id);
    //         return false;
    //     }else{
    //         console.log("Not Empty: ", chat._id);
    //         return true;
    //     }
    // }

    const chats = await allChats.filter(chat => {
        if(!chat.messages.length){
            console.log("Empty Chat: ", chat._id);
            return false;
        }else{
            return true;
        }
    });
    //console.log("These are the chats -----------------------------", chats);

    // chats.forEach(chat => {
    //     console.log("Data", chat.participants); // Access participants property for each chat
    // });

    //const participantsList = chats.map(chat => chat.participants);
        
    const user = await User.findById(currentUser._id).populate('groups').populate({
        path: 'friends.friendId'
      });
    const msg = `Logged in ^_^ ${user.username}`;
    const groups = user.groups;
    const friends = user.friends;
    const users = await User.find({ _id: { $ne: currentUser._id } });
    //console.log("Frineds", friends);
    //res.json({ currentUser, users, msg, onlineUsers, groups, friends, chats })
    //res.render('testIndex');

    const getFriendIds = friends.map(friend => friend.friendId._id);

    const allUsers = await User.find({ _id: { $nin: getFriendIds } });

    console.log("Users:", user);
    

    res.json({friends, currentUser, chats, allUsers});

}

module.exports.renderNewChat = async(req, res) => {

    const user = await User.findById(req.user._id).populate('groups').populate({
        path: 'friends.friendId'
      });

    const friends = user.friends;
    res.render('createChat', { friends });

}

module.exports.createNewChat = async(req, res) => {

    const { friend } = req.body;
    const currentUser = req.user;
    const participants = [friend, currentUser._id];

    //Check if chat exists?
    participants.sort();

    // Search for a chat where the 'members' array matches the specified order
    const existingChat = await Chat.findOne({
    participants: participants,
    });

    console.log(existingChat);

    if (existingChat === null) {
        console.log('No chat found.');
        const createChat = new Chat({ participants: participants });
        await createChat.save();
        console.log('Chat created!');
        //return res.redirect(`/chat/${createChat._id}`);
        const chat = await createChat;
        return res.json({chat});
    } else {
        console.log('A chat already exists between the specified participants.');
        const chat = await existingChat;
        return res.json({chat});
        //return res.redirect(`/chat/${existingChat._id}`);
    }

}

module.exports.renderChat = async(req, res) => {

    const { id } = req.params;
    const chat = await Chat.findById(id).populate('participants').populate('messages').populate({
        path: 'messages',
        populate: {
            path: 'sender',
            model: 'User'
        } 
      });;
    const participants = chat.participants;
    //console.log("PART", participants);
    const currentUserId = req.user._id;
    //the user the currentUser is chattingto
    const userArray = participants.filter(participant => participant._id.toString() !== currentUserId.toString());
    const user = userArray[0];
    //console.log("USER--------------------------------", user);
    const otherUserId = user._id;
    // const userFriends = await User.findById(currentusUser._id).populate({
    //     path: 'friends.friendId'
    //     //match:{ blocked: true }
    // });
    const [currentUser, otherUser] = await Promise.all([
        User.findById(currentUserId).populate('friends.friendId'),
        User.findById(otherUserId).populate('friends.friendId'),
      ]);
    const myFriends = currentUser.friends;
    const otherFriends = otherUser.friends;
    //console.log("--------------------------Friends----------------------------", myFriends);
    const myBlockedFriends = myFriends.filter((friend) => friend.blocked === true);
    const otherBlockedFriends = otherFriends.filter((friend) => friend.blocked === true);
    //console.log("------------------Blocked-------------------", myBlockedFriends);
    for(let friend of otherBlockedFriends){
        if(friend.friendId._id.toString() === currentUserId.toString()){
            res.locals.isBlocked = true;
            break;
        }else{
            res.locals.isBlocked = false;
        }
    }
    //const messages = await Message.find({ $or: [{ sender: currentUser._id, receiver: user._id }, {  receiver: currentUser._id, sender: user._id}] });
    //console.log("msg:", id, req.session.userID);
    const messages = chat.messages
    //console.log("In chat route", messages);
    res.json({user, currentUser, messages, chat});

    // const { id } = req.params;
    // const user = await User.findById(id);
    // const u = req.session.userID;
    // const currentUser = req.user;
    // const messages = await Message.find({ $or: [{ sender: id, receiver: u }, {  receiver: id, sender: u}] });
    // console.log("msg:", id, req.session.userID);
    
    // console.log("In chat route", messages);
    // res.render('chat', { user, currentUser, messages, u });
}

module.exports.deteleChat = async (req, res) => {
    try {
      console.log("In Chat Delete");
      const { id } = req.body;
      //console.log("Chat to deleteeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", id);
      const deleteChat = await Chat.findByIdAndDelete(id);
  
      if (deleteChat) {
        console.log("Chat Deleted!");
        res.status(200).json({ message: 'Chat deleted successfully' });
      } else {
        res.status(404).json({ message: 'Chat not found' });
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
    
  };