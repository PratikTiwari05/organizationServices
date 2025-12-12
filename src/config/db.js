const { MongoClient } = require("mongodb");
require("dotenv").config();

const client = new MongoClient(process.env.MONGO_URI);

let db;

async function connectDB() {
    try {
        await client.connect();
        console.log("MongoDB Connected Successfully");

        db = client.db("master_db");  
        return db;

    } catch (error) {
        console.error("MongoDB Connection Error:", error);
        process.exit(1);
    }
}

function getDB() {
    if (!db) {
        throw new Error("Database not connected!");
    }
    return db;
}

module.exports = { connectDB, getDB };
