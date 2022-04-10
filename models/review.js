const mongoose = require("mongoose")

const reviewSchema = new mongoose.Schema({
    body: {
        type: String,
        trim: true
    },
    rating: {
        type: Number,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }
})

const Review = mongoose.model("review", reviewSchema);

module.exports = Review;