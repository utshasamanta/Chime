const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const generateTokenAndSetCookies = require("../utils/generateToken.js");


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

        const hashedPassword = await bcrypt.hash(password, 12); //hashed the password to store in the DB
        const newUser = new User({
            firstname, lastname, username, email, gender,
            password: hashedPassword,
            profilePicture: profilePicture || `https://avatar.iran.liara.run/username?username=${firstname}+${lastname}`
        });

        if (newUser) {

            generateTokenAndSetCookies(newUser._id, res); //Generates the JWT token
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                firstname: newUser.firstname,
                lastname: newUser.lastname,
                username: newUser.username,
                email: newUser.email,
                profilePicture: newUser.profilePicture
            })
        } else {
            return res.status(400).json({error: "Invalid user data"});
        }
        
        
    } catch (error) {
        console.log("Error in signup controller", error.message);
        return res.status(500).json({error: "Internal Server Error"});
    }
}

module.exports.login = async (req, res) => {
    try {
        const {username, password} = req.body;
        const user = await User.findOne({username});
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

        if (!user || !isPasswordCorrect) {
            return res.status(400).json({error: "Invalid username or password"});
        }

        generateTokenAndSetCookies(user._id, res);

        return res.status(200).json({
            firstname: user.firstname,
            lastname: user.lastname,
            username: user.username,
            profilePicture: user.profilePicture
        })
       
    } catch (error) {
        console.log("Error in login controller", error.message);
        return res.status(500).json({error: "Internal Server Error"});
    }
}

module.exports.logout = (req, res) => {
    try {
        res.cookie("jwt", "", {
            maxAge: 0,
            httpOnly: true
        })

        res.status(200).json({message: "Logged out successfully"});
    } catch (error) {
        console.log("Error in logout controller", error.message);
        return res.status(500).json({error: "Internal Server Error"});
    }
}

