const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

const app = express();


const authRoutes = require("./routes/authRoutes.js");
const messageRoutes = require("./routes/messageRoutes.js");
const userRoutes = require("./routes/userRoutes.js")
const connectMongo = require("./db/mongoConnection.js");

dotenv.config();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());



app.get("/", (req, res) => {
    res.send("HELLO WORLD FROM PROXIMITY!")
})

app.use("/", authRoutes);
app.use("/messages", messageRoutes)
app.use("/users", userRoutes);


app.listen(PORT , () => {
    connectMongo();
    console.log(`Listening on port ${PORT}`);
})