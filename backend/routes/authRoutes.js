const express = require("express");
const {login, logout, signup} = require("../controllers/authController.js")

const router = express.Router();

router.get("/login", login);
router.post("/signup", signup)
router.post("/logout", logout);


module.exports = router;
