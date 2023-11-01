const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const groupSchema = new Schema({
    name: {
        type: String
    },
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    messages: [{
        type: Schema.Types.ObjectId,
        ref: 'GroupMessage'
    }],
    icon: {
        type: String,
        default: "https://res.cloudinary.com/dlljkfw1r/image/upload/v1697689890/chatApp/ofbqphporwbuyceyj1me.png"
    }
});

module.exports = mongoose.model('Group', groupSchema);