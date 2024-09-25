const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const MessageSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    receiver: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    message: {
        type: String,
        required: true
    }
}, {timestamps: true})

module.exports = mongoose.model("Message", MessageSchema);