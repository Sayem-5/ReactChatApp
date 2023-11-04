const User = require('../models/user');
const Group = require('../models/group');
const GroupMessage = require('../models/groupMessage');
const { onlineUsers, partial } = require('../utils/globals');

module.exports.renderGroups = async(req, res) => { 
    const currentUser = req.user;
    console.log("User logged in:", currentUser);
        
    const user = await User.findById(currentUser._id).populate('groups');
    const groups = user.groups;

    const getMessagesForGroup = async (group) => {
        const messages = await GroupMessage.find({ groupId: group._id }).populate('sender');
        return messages;
    }
      
    // Iterate through the groups and fetch messages for each group
    for (const group of groups) {
        group.messages = await getMessagesForGroup(group);
        console.log(`Group: ${group.name}`);
        console.log("Messages:", group.messages);
    }
    
    console.log("Groups with Messages:", groups);

    //res.render('groups', { currentUser, groups });
    res.json({currentUser, groups})
};

module.exports.renderCreateGroup = async(req, res) => {
    const users = await User.find({});
    const currentUser = req.user;
    const u = req.session.userID;
    res.render('createGroup', { users, currentUser, u });
};

module.exports.createGroup = async(req, res) => {

    const name = req.body.name;
    const users = req.body.users;

    console.log("Users For Group:", users);
    const getUsers = await User.find({ _id: { $in: users } });
    const userIdsArray = getUsers.map(user => user._id);

    const group = new Group({ name, users: userIdsArray });
    await group.save();

    const groupId = group._id;
    const user = await User.updateMany({ id: { $in: users }, $push: { groups: groupId }});
    
    res.json({ group });
};

module.exports.leaveGroup = async(req, res) => {

    const { id } = req.body;
    const removeUser = req.user._id;
    const user = await User.findById(removeUser);
    //const currentUser = req.user;
    //console.log("LEAVE: ", group);
    console.log("User remove: ", user._id);
    await User.findByIdAndUpdate(user._id, { $pull: { groups: id } });
    const group = await Group.findByIdAndUpdate(id, { $pull: { users: user._id } });
    console.log("G Users: ", group.users);
    //Have to make post middleware to delete fromusers groups? If we want that or just keep the chat forthe user.
    res.status(200).json({ message: 'Group left successfully' });

};

module.exports.renderAGroup = async(req, res) => {

    const { id } = req.params;
    //var isAMember;
    //const u = req.session.userID;
    //const user = await User.findById(u);
    const currentUser = req.user;
    const group = await Group.findById(id).populate('users');
    const groupMessages = await GroupMessage.find({ groupId: group._id }).populate('sender');
    console.log(groupMessages);
    
    const membersArray = group.users;

    //isAMember = membersArray.some((member) => member._id.toString() === currentUser._id.toString());

    //console.log("msg:", id, req.session.userID, group);

    res.json({ currentUser, group, groupMessages });
};

module.exports.uploadGroupIcon = async(req, res) => {

    console.log(req.file);

    const { groupId } = req.body;

    console.log("Group Id: ", groupId);

    const url = req.file.path;

    if(url !== null || undefined){

        const group = await Group.findOneAndUpdate({ _id: groupId }, { $set: { icon: url } }, { new: true });

        console.log("File Upload Successful");
    
        return res.status(200).json({ message: 'File Uploaded!', url });

    }else{

        return res.status(500).json({ message: 'Upload Failed!', url });
        
    }

}