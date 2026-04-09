const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("Connected to the database successfully");
    } catch (error) {
        console.log("Error on the database connection: ", error);
    }
}

module.exports = { connectDB }