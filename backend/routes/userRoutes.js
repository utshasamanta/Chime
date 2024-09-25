const express = require("express");
const isLoggedIn = require("../middleware/isLoggedIn");
const Conversation = require("../models/conversation.js");
const router = express.Router();

router.get("/:userId", isLoggedIn, async (req, res) => {
    const {userId} = req.params;

    const conversation = await Conversation.find({
        participants: {$all: [userId]}
    }).populate('participants');

    res.send(conversation);
})



module.exports = router;