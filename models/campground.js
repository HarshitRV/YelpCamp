const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const campgroundSchema = new Schema({
    title: {
        type: String,
        trim: true
    },
    image: {
        type: String,
        trim: true
    },
    price: {
        type: Number
    },
    description: {
        type: String,
        trim: true
    },
    location: {
        type: String, 
        trim: true
    }
});

const Campground = mongoose.model('campground', campgroundSchema);

module.exports = Campground;