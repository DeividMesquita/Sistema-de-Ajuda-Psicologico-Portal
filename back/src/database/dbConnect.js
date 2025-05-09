const DATABASE_URI = process.env.DATABASE_URI;
const mongoose = require("mongoose");
mongoose.set('strictQuery', true);

const connect = async () => {
    if (!DATABASE_URI) {
        console.error("DATABASE_URI não está definida no arquivo .env.");
        return;
    }

    try {
        await mongoose.connect(DATABASE_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Database connected");
    } catch (error) {
        console.log("Error connecting to database:", error);
    }
};

module.exports = { connect };
