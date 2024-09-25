const User = require("../models/user.js");
const Message = require("../models/message.js");
const Conversation = require("../models/conversation.js");


module.exports.sendMessage = async (req, res) => {
    try {
        const {receiverId} = req.params;
        const {message} = req.body;
        const senderId = req.user._id;

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId]}
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants:[senderId, receiverId],
            });
        }

        const newMessage = new Message({
            sender: senderId,
            receiver: receiverId,
            message
        })

        if (newMessage) {
            conversation.message.push(newMessage._id);
        }    
        await Promise.all([conversation.save(), newMessage.save()]);
        res.status(201).json(newMessage);

    } catch (error) {
        console.log("Error in sendMessage controller", error.message);
        return res.status(500).json({error: "Internal Server Error"});
    }
}

module.exports.getMessage = async (req, res) => {
    try {
        const {receiverId} = req.params;
        const senderId = req.user._id;

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId]}
        }).populate('message');

        if (!conversation) {
            return res.status(200).json([]);
        }

        res.status(200).json(conversation.message);

    } catch (error) {
        console.log("Error in getMessage controller", error.message);
        return res.status(500).json({error: "Internal Server Error"});
    }
}