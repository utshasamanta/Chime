const mongoose = require("mongoose");
dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/Proximity";

async function connectMongo() {
    mongoose.connect(dbUrl)
    .then(() => {
        console.log("Mongo Connection Open");
    })
    .catch((err) => {
        console.log("Mongo Connection Failed");
        console.log(err);
    })
    
}

module.exports = connectMongo;