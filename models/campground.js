const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require("./review");

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
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'review'
        }
    ]
});

campgroundSchema.post('findOneAndDelete', async (deletedCamp)=>{
    if(deletedCamp.reviews.length){
        // basically concurrenly delete all the reviews as well
        // that is associated with the campground
        await Review.deleteMany({ _id: { $in : deletedCamp.reviews } })
    }
})

const Campground = mongoose.model('campground', campgroundSchema);

module.exports = Campground;