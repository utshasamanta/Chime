import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";


import { connectDB } from "./lib/db.js";
import authRoute from "./routes/authRoute.js";
import messageRoute from "./routes/messageRoute.js";
import { app, server } from "./lib/socket.js";

dotenv.config();
const PORT = process.env.PORT;


app.use(express.json()); //lets us get the req body as a json
app.use(cookieParser()) // lets us see the cookie in requests
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));



app.get('/', (req, res) => {
    res.send("Hello World!")
});

app.use("/auth", authRoute);
app.use("/messages", messageRoute);

server.listen(PORT, () => {
    console.log(`Chime Listening on Port ${PORT}`);
    connectDB();
});

