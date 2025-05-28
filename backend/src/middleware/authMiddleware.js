import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No Token Provided"});
        }

        const decodedUser = await jwt.verify(token, process.env.JWT_SECRET);

        if (!decodedUser) {
            return res.status(401).json({ message: "Unauthorized - Invalid token"});
        }

        const user = await User.findById(decodedUser.userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found"});
        }

        req.user = user;
        next()       
    } catch (err) {
        console.log("Error in protectRoute middleware: ", err.message);
        return res.status(500).json({ message: "Internal Server Error"});
    }
}