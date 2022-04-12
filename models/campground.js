const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require("./review");

const opts = { toJSON: { virtuals: true } }

const ImageSchema = new Schema({
    url: {
        type: String,
        trim: true
    },
    fileName: {
        type: String,
        trim: true
    }

}, opts)

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
    geometry: {
        type: {
          type: String, 
          enum: ['Point'],
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
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
}, opts);

/**
 * Virtual properties, campground.
 */
campgroundSchema.virtual('properties.popUpHTML').get(function(){
    return `<h3>
                <a href="/campgrounds/${this._id}">
                    ${this.title}
                </a>
            </h3>`;
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