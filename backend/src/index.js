import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";

dotenv.config()
const app = express();
const PORT = process.env.PORT;

import authRoute from "./routes/authRoute.js";

app.get('/', (req, res) => {
    res.send("Hello World!")
});

app.use("/auth", authRoute);

app.listen(PORT, () => {
    console.log(`Chime Listening on Port ${PORT}`);
    connectDB();
});

