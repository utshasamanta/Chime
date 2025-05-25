import jwt from "jsonwebtoken";
import crypto from "crypto";


export const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString("hex");

export const generateToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    });

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: true,
        secure: process.env.NODE_ENV !== "development",
    });

    return token;
} 