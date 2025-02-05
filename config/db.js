const mongoose = require ("mongoose");

const connectDB = async () => {
    try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connect to DataBase successfully!`);
    } catch (error) {
        console.error("DataBase connection error:", error);
    }
}

module.exports = connectDB;