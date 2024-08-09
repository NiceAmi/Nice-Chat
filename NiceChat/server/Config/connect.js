const mongoose = require('mongoose');

const connectToDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to the database");
    } catch (error) {
        console.error("Failed to connect to the database:", error);
        process.exit(1);
    }
};

module.exports = connectToDb;
