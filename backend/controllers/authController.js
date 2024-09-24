const User = require("../models/user.js");
const bcrypt = require("bcrypt");

module.exports.login = (req, res) => {
    console.log("login");
    res.send("Login");
}

module.exports.logout = (req, res) => {
    console.log("Logout");
    res.send("Logout");
}

module.exports.signup = async (req, res) => {
    try {
        const {firstname, lastname, username, email, password, confirmPassword, gender, profilePicture} = req.body;
        
        if (password !== confirmPassword) {
            return res.status(400).json({error: "Passwords don't match"});
        }
        const user = await User.findOne({username});
        if (user) return res.status(400).json({error: "Username already taken"});
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ error: "Email already in use" });
        }

        const newUser = new User({
            firstname, lastname, username, email, gender,
            profilePicture: profilePicture || `https://avatar.iran.liara.run/username?username=${firstname}+${lastname}`;
        });

        const hashedPassword = await bcrypt.hash(password, 12); //hashed the password to store in the DB
        newUser.password = hashedPassword;
        await newUser.save();
        
    } catch (error) {
        
    }
}

