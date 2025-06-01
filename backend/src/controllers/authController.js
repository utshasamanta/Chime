import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import s3Client from "../lib/s3.js";
import { DeleteObjectCommand, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { generateToken, generateFileName } from "../lib/utils.js";


export const signup = async (req, res) => {
    const {name, email, password} = req.body;

    try {
        if (!name || !email || !password) {
            res.status(400).json({ message: "All fields are required."});
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters."});
        };
    
        const user = await User.findOne({email});
    
        if (user) {
            return res.status(400).json({ message: "Email already exists."});
        };
    
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);
    
        const newUser = new User({
            name,
            email,
            password: hashedPass,
        });
    
        if (newUser) {
            generateToken(newUser._id, res);
            await newUser.save();
            res.status(201).json({ 
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                profilePic: newUser.profilePic
            });
        } else {
            return res.status(400).json({ message: "Invalid user data."})
        }

    } catch (err) {
        console.log("Error in signup controller: ", err.message);
        return res.status(500).json({ message: "Internal Server Error"});
    }
};

export const logout = (req, res) => {
    try {
        res.clearCookie("jwt");
        return res.status(200).json({ message: "Logged out"});

    } catch (err) {
        console.log("Error in logout controller: ", err.message);
        return res.status(500).json({ message: "Internal Server Error"});
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try{
        if (!email || !password) {
            return res.status(400).json({ message: "All fields required"});
        }

        const user = await User.findOne({email});

        if (!user) {
            return res.status(400).json({ message: "Email or Password is incorrect"});
        }

        const hashedPass = user.password;
        const correct = await bcrypt.compare(password, hashedPass);

        if (!correct) {
            return res.status(400).json({ message: "Email or Password is incorrect"});
        } else {
            generateToken(user._id, res);
            const userObj = user.toObject();
            delete userObj.password;
            console.log("Logged In")
            return res.status(200).json(userObj);
        }

    } catch (err) {
        console.log("Error in login controller: ", err.message);
        return res.status(500).json({ message: "Internal Server Error"});
    }

};

export const updateProfilePic = async (req, res) => {
    const userId = req.user._id;
    const file = req.file;

    try {
        if (!file) {
            return res.status(400).json({ message: "Profile picture is required"});
        }

        const prevUser = await User.findById(userId);

        if (!prevUser) {
            return res.status(400).json({ message: "User not found"});
        }

        const prevFilename = prevUser.profilePic;

        if (prevFilename !== "") { 
            const deleteParam = {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: prevFilename
            }

            const command = new DeleteObjectCommand(deleteParam);
            await s3Client.send(command);
        }

        const ext = file.originalname.split('.').pop();
        let fileName = generateFileName();
        fileName = `profile-pics/${prevUser.email}/${fileName}.${ext}`;
        const uploadParam = {
            Bucket: process.env.S3_BUCKET_NAME,
            Body: file.buffer,
            Key: fileName,
            ContentType: file.mimetype
        };

        await s3Client.send(new PutObjectCommand(uploadParam));

        const getObjectParam = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: fileName
        };
                        
        const getCommand = new GetObjectCommand(getObjectParam);
        const signedUrl = await getSignedUrl(s3Client, getCommand, {expiresIn:864000});

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: fileName, profilePicUrl: signedUrl},
            { new: true }
        ).select("-password");

        if (updatedUser) {
           return res.status(200).json(updatedUser)
        }
    } catch (err) {
        console.log(`Error in update profile picture controller: ${err.message}`);
        res.status(500).json({ message: "Internal Server Error"});
    }
}

export const checkAuth = (req, res) => {
    try {
        return res.status(200).json(req.user);
    } catch (err) {
        console.log(`Error in checkAuth Controller: ${err.message}`);
        return res.status(500).json({ message: "Internal Server Error"});
    }
}