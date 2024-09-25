const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const ConversationSchema = new Schema({
    participants: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    message: [{
        type: Schema.Types.ObjectId,
        ref: "Message",
        default: []
    }]
}, {timestamps: true})

module.exports = mongoose.model("Conversation", ConversationSchema);