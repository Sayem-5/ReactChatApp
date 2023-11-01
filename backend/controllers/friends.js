const User = require('../models/user');

module.exports.addFriend = async(req, res) => {
    const { addUser } = req.body;
    console.log(addUser);
    const id = req.user._id;
    //const user = await User.findById(id);
    //
    const currentUser = await User.findById(id);
    const otherUser = await User.findById(addUser);
    //
    console.log(currentUser);
    const existingFriend = currentUser.friends.find((friend) => friend.friendId.toString() === addUser);
    if (existingFriend) {
      console.log('Friend already exists.');
      return res.status(400).json({ message: 'Friend already exist' });
    }else{
        await currentUser.friends.push({ friendId: addUser });
        await currentUser.save();
        await otherUser.friends.push({ friendId: id });
        await otherUser.save();
        console.log('Friend Added');
        return res.status(200).json({ message: 'Friend added successfully' });

    }
    
};

module.exports.removeFriend = async(req, res) => {

    const { removeUser } = req.body;
    //console.log(addUser);
    const id = req.user._id;
    const currentUser = await User.findById(id);
    const otherUser = await User.findById(removeUser);
    // const [currentUser, otherUser] = await User.find({
    //   $and: [{ _id: { $ne: id } }, { _id: addUser }],
    // }).populate('friends.friendId');
    //console.log(user);
    const existingFriend = currentUser.friends.find((friend) => friend.friendId.toString() === removeUser);
    console.log(currentUser);
    if (existingFriend) {
      console.log('Friend exists.');
      //await user.friends.pull({ friendId: removeUser });
      await currentUser.friends.pull({ friendId: removeUser });
      await currentUser.save();
      await otherUser.friends.pull({ friendId: id });
      await otherUser.save();
      console.log('Friend removed');
      //await user.save();
      return res.status(200).json({ message: 'Friend removed successfully' });
    }
    else{
      console.log("Friend does not exist!");
      return res.status(400).json({ message: 'Could not remove friend' });
    }
}

module.exports.blockFriend = async(req, res) => {

    const { blockFriend } = req.body;
    //console.log(addUser);
    const id = req.user._id;
    const user = await User.findById(id);
    console.log(user);
    const existingFriend = user.friends.find((friend) => friend.friendId.toString() === blockFriend);
    if (existingFriend) {
      console.log('Friend exists.');
      existingFriend.blocked = true;
      console.log('Friend blocked');
      await user.save();
      return res.status(200).json({ message: 'Friend blocked successfully' });
    }
    else{
      console.log("Friend does not exist!");
      return res.status(400).json({ message: 'Friend could not be blocked' });
    }
};
