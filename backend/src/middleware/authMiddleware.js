import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookie.jwt;

        if (!cookie) {
            res.status(401).json({ message: "Unauthorize - No Token Provided"});
        }

        const decodedUser = await jwt.verify(token, process.env.JWT_SECRET);
        const user = User.findById(decodedUser.userId).select("-password");

        if (!user) {
            res.status(404).json({ message: "User not found"});
        }

        req.user = user;
        next()       
    } catch (err) {
        console.log("Error in protectRoute middleware: ", err.message);
        res.status(500).json({ message: "Internal Server Error"});
    }
}