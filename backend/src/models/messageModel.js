import mongoose, { mongo } from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        requred: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    text: {
        type: String
    },
    media: {
        type: String
    },
    mediaUrl: {
        type: String,
        default: ""
    }
}, {timestamps: true});

const Message = mongoose.model("Message", messageSchema);
export default Message;