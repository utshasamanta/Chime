import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";


import { connectDB } from "./lib/db.js";
import authRoute from "./routes/authRoute.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT;
app.use(express.json()); //lets us get the req body as a json
app.use(cookieParser()) // lets us see the cookie in requests



app.get('/', (req, res) => {
    res.send("Hello World!")
});

app.use("/auth", authRoute);

app.listen(PORT, () => {
    console.log(`Chime Listening on Port ${PORT}`);
    connectDB();
});

