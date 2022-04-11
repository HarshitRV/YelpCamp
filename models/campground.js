const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require("./review");

const ImageSchema = new Schema({
    url: {
        type: String,
        trim: true
    },
    fileName: {
        type: String,
        trim: true
    }

})

ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload', '/upload/w_200');
});

const campgroundSchema = new Schema({
    title: {
        type: String,
        trim: true
    },
    images: [ImageSchema],
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
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'review'
    }]
});

campgroundSchema.post('findOneAndDelete', async (deletedCamp) => {
    if (deletedCamp.reviews.length) {
        // basically concurrenly delete all the reviews as well
        // that is associated with the campground
        await Review.deleteMany({
            _id: {
                $in: deletedCamp.reviews
            }
        })
    }
})

const Campground = mongoose.model('campground', campgroundSchema);

module.exports = Campground;