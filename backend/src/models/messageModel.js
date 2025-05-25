import mongoose from "mongoose";

const messageModel = new mongoose.Schema({
    senderId: String,
    receiverId: String,
    message: String,
    media: String
});