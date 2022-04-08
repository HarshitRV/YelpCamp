const express = require("express");
const router = express.Router({
  mergeParams: true
});
const catchAsync = require("../../utils/catchAsync")
const validateReview = require("./review.auth")
const Campground = require("../../models/campground")
const Review = require("../../models/review")
const isLoggedIn = require("../../middlewares/isLoggedIn")

router.route("/")
  .post(isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);

    const newReview = new Review(req.body.review);
    campground.reviews.push(newReview);

    await newReview.save();
    await campground.save();
    req.flash("success", "Review added. Thanks for you valuable contribution.");
    res.redirect(`/campgrounds/${campground._id}`);
  }))

///campgrounds/:id/reviews
router.route("/:reviewId")
  .delete(catchAsync(async (req, res) => {
    console.log("Inside delete");
    const {
      id: campId,
      reviewId
    } = req.params;
    // console.log(campId, reviewId);

    // remove the review id from reviews array from the camp with given campId
    // basically update the reviews array in camp with the remaining actual reviews
    await Campground.findByIdAndUpdate(campId, {
      $pull: {
        reviews: reviewId
      }
    })
    await Review.findByIdAndDelete(reviewId);
    console.log(campId);
    return res.redirect(`/campgrounds/${campId}`);
  }));

module.exports = router;