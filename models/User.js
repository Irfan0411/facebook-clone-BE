const mongoose = require("mongoose")
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 3,
        max: 20,
        unique: true
    },
    email: {
        type: String,
        required: true,
        max: 50,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 6
    },
    profilePicture: {
        type: String,
        default: "noPicture.png"
    },
    coverPicture: {
        type: String,
        default: ""
    },
    desc: {
        type: String,
        default: "no bio"
    },
    friends: {
        type: Array,
        default: []
    },
    friendSendReq: {
        type: Array,
        default: []
    },
    friendReceiveReq: {
        type: Array,
        default: []
    }
}, {timestamps: true})

module.exports = mongoose.model("User", UserSchema)