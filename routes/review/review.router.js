/**
 * Module imports.
 */
const express = require("express");

/**
 * Router imports.
 */
const router = express.Router({
  mergeParams: true
});

/**
 * Util imports.
 */
const catchAsync = require("../../utils/catchAsync");

/**
 * Validators imports.
 */
const validateReview = require("../../validators/review.validate");

/**
 * Middlewares
 */
const isLoggedIn = require("../../middlewares/isLoggedIn");
const isReviewAuthor = require("../../middlewares/isReviewAuthor");

/**
 * Controller imports.
 */
const {
  addReview,
  deleteReview
} = require("../../controller/review/review.contoller")

router.route("/")
  .post(isLoggedIn, validateReview, catchAsync(addReview))

///campgrounds/:id/reviews
router.route("/:reviewId")
  .delete(isLoggedIn, isReviewAuthor, catchAsync(deleteReview));

module.exports = router;