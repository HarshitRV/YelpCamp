const express = require("express");
const router = express.Router();
const catchAsync = require("../../utils/catchAsync");
const Campground = require("../../models/campground");
const validateCampground = require("./campground.auth");
const isLoggedIn = require("../../middlewares/isLoggedIn")
const isAuthor = require("../../middlewares/isAuthor");

router
  .route("/")
  .get(
    catchAsync(async (req, res) => {
      const camps = await Campground.find({});
      res.render("campgrounds/index", { camps });
    })
  )
  .post(
    isLoggedIn,
    validateCampground,
    catchAsync(async (req, res) => {

      const newCamp = new Campground(req.body.campground);

      // Associating the author with the campground.
      newCamp.author = req.user._id;

      const savedCamp = await newCamp.save();
      req.flash("success", "Added a new campground.")

      res.redirect(`/campgrounds/${savedCamp._id}`);
    })
  );

router.route("/new").get(isLoggedIn,(req, res) => {
  res.render("campgrounds/new");
});

router
  .route("/:id")
  .get(
    catchAsync(async (req, res, next) => {
      const { id } = req.params;
      const camp = await Campground.findById(id).populate("reviews").populate("author");
     
      if (!camp) {
        req.flash("error", "No campground exists with that id.")
        return res.redirect('/campgrounds');
      }

      res.render("campgrounds/details", { camp });
    })
  )
  .put(
    isLoggedIn,
    isAuthor,
    validateCampground,
    catchAsync(async (req, res, next) => {

      await Campground.findByIdAndUpdate(
        req.params.id,
        req.body.campground,
        {
          new: true,
          runValidators: true,
        }
      );

      req.flash("success", "Changes saved successfully.");

      res.redirect(`/campgrounds/${req.params.id}`);
    })
  )
  .delete(
    isLoggedIn,
    isAuthor,
    catchAsync(async (req, res) => {
      await Campground.findByIdAndDelete(req.params.id);
      req.flash("success", "Successfully deleted the campground.")
      res.redirect("/campgrounds");
    })
  );

router.route("/:id/edit").get(
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res, next) => {
    const camp = await Campground.findById(req.params.id);
    if (!camp) {
      req.flash("error", "Campground doesn't exists.")
      return res.redirect('/campgrounds');
    }
    return res.render("campgrounds/edit", { camp });
  })
);

module.exports = router;