const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String, 
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 7
    },
    profilePicture: {
        type: String,
        default: ""
    },
    gender: {
        type: String,
        required: true,
        enum: ["male", "female", "other", "rather not say"]
    },


})


module.exports = mongoose.model("User", UserSchema);