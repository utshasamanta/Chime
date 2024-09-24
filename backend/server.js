const express = require("express");
const dotenv = require("dotenv");

const app = express();

dotenv.config();
const PORT = process.env.PORT || 5000;


const authRoutes = require("./routes/authRoutes.js");
const connectMongo = require("./db/mongoConnection.js");

app.get("/", (req, res) => {
    res.send("HELLO WORLD FROM PROXIMITY!")
})

app.use("/", authRoutes);


app.listen(PORT , () => {
    connectMongo();
    console.log(`Listening on port ${PORT}`);
})