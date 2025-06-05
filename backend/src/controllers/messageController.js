import Message from "../models/messageModel.js";
import User from "../models/userModel.js";
import s3Client from "../lib/s3.js";
import { generateFileName } from "../lib/utils.js";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getReceiverSocketId, io } from "../lib/socket.js";


export const getUserForSidebar = async (req, res) => {
    const currentUserId = req.user._id;
    try {
        const filteredUsers = await User.find({_id: {$ne: currentUserId}}).select("-password");
        return res.status(200).json(filteredUsers);
    } catch (err) {
        console.log("Error in getUsersForSidebar controller: ", err.message);
        res.status(500).json({ message: "Internal Server Error"});
    }
}


export const getMessages = async (req, res) => {
    const currentUserId = req.user._id;
    const { receiverId } = req.params;
    try {
        const messages = await Message.find({
            $or: [
                {senderId: currentUserId, receiverId: receiverId},
                {senderId: receiverId, receiverId: currentUserId}
            ]
        });

        for (let msg of messages) {
            if (msg.media) {
                const getObjectParam = {
                    Bucket: process.env.S3_BUCKET_NAME,
                    Key: msg.media
                };
                
                const command = new GetObjectCommand(getObjectParam);
                const url = await getSignedUrl(s3Client, command, {expiresIn:604799});
                msg.mediaUrl = url;
            }
        }

        return res.status(200).json(messages);
    } catch (err) {
        console.log("Error in getMessages controller: ", err.message);
        res.status(500).json({ message: "Internal Server Error"});
    }
}

export const sendMessage = async (req, res) => {
    const senderId = req.user._id;
    const { receiverId } = req.params;
    const { text } = req.body;
    const file = req.file;
    try {
        if (!text) {
            return res.status(400).json({ message: "Text is required"});
        }

        let filename = "";
        let imgUrl = "";
        if (file) {
            filename = `messages/${req.user.email}/${generateFileName()}`;
            const uploadParam = {
                Bucket: process.env.S3_BUCKET_NAME,
                Body: file.buffer,
                Key: filename,
                ContentType: file.mimetype
            };

            await s3Client.send(new PutObjectCommand(uploadParam));

            const getObjectParam = {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: filename
            };
                
            const command = new GetObjectCommand(getObjectParam);
            imgUrl = await getSignedUrl(s3Client, command, {expiresIn:604799});
        }

        const newMessage = new Message({
            senderId: senderId,
            receiverId: receiverId,
            text: text,
            media: filename,
            mediaUrl: imgUrl
        })

        await newMessage.save();

        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverId){
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        
        return res.status(201).json(newMessage);
    } catch (err) {
        console.log("Error in sendMessage controller: ", err.message);
        return res.status(500).json({ error: "Internal server error" });
    }
}