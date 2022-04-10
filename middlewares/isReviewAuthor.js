const Review = require("../models/review");

const isReviewAuthor = async (req, res, next) =>{
    const { id: campId ,reviewId } = req.params;
    const review = await Review.findById(reviewId);

    // console.log("Inside isReviewAuthor", review.author.equals(req.user._id));
    if(review.author.equals(req.user._id)) return next();

    req.flash("error", "You are not authorized to do that!");
    return res.redirect(`/campgrounds/${campId}`);
}

module.exports = isReviewAuthor;