const mongoose = require("mongoose")

const connectDB = (url="mongodb://localhost:27017/yelp-camp") => {
    return mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
}

module.exports = connectDB;