const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('register', { navBar: false });
};

module.exports.createUser = async(req, res, next) =>{
    console.log(req.body);
    const { username, password, email } = req.body;
    const userExists = await User.findOne({ email: email });
    if(userExists == null || undefined){
        const user = new User({ email, username });
        const newUser = await User.register(user, password);
        //const createFriendList = new Friend({ user: user._id });
        //await createFriendList.save();
        req.login(newUser, err => {
            if(err) return next(err);
            console.log("New User: ", newUser);
            res.json({ newUser });
        });
    }else{
        res.status(409).json({ message: "User Already Exists" });
    }
    

};

module.exports.renderLogin = (req, res) => {
    res.render('login', { navBar: false });
};

module.exports.userLogin = async(req, res) =>{

    console.log("in login");

    console.log(user);

    //req.flash('success', 'LoggedIn');

    const currentUser = req.user;

    if(currentUser != null){
        res.json({currentUser});
    }else{
        res.status(500).json({ message: "Success" });
    }

   
};

module.exports.userLogout = async(req, res) =>{

    console.log("Logged Out");

    req.logout(function(err) {
        if (err) { return next(err); }
        return res.status(200).json({ message: 'User Logged Out' });
      });

};

module.exports.userSearch = async(req, res) => {
    const currentUser = req.user;
    const users = await User.find({}).populate('friends.friendId');
    //const friends = users.friends.populate('friendId');
    res.render('search', { users, currentUser });
};

module.exports.uploadProfilePicture = async(req, res) => {

    console.log(req.file);

    const url = req.file.path;

    if(url !== null || undefined){

        const user = await User.findOneAndUpdate({ _id: req.user._id }, { $set: { profilePicture: url } }, { new: true});

        console.log("File Upload Successful");
    
        return res.status(200).json({ message: 'File Uploaded!', url });

    }else{
        return res.status(500).json({ message: 'Upload Failed!', url });
    }

}

// module.exports.test = async(req, res) => {
//     res.json("Hi Baby");
// }