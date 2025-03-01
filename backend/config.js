require("dotenv").config(); // Load .env file

module.exports = {
    MONGO_URI: process.env.MONGO_URI,  
    JWT_SECRET: process.env.JWT_SECRET, 
    PORT: process.env.PORT || 3000,
};