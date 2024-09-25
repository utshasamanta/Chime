const express = require("express");
const router = express.Router();
const { sendMessage, getMessage } = require("../controllers/messageControllers.js")
const isLoggedIn = require("../middleware/isLoggedIn.js");

router.get("/:receiverId", isLoggedIn, getMessage);
router.post("/:receiverId", isLoggedIn, sendMessage)

module.exports = router;