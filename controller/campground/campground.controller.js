/**
 * Model imports
 */
const Campground = require("../../models/campground");

/**
 * Get all campgrounds
 */
module.exports.getAllCampgrounds = async (req, res) => {
  const camps = await Campground.find({});
  res.render("campgrounds/index", {
    camps
  });
}

/**
 * Post new campground
 */
module.exports.addNewCampground = async (req, res) => {

  const newCamp = new Campground(req.body.campground);

  // Associating the author with the campground.
  newCamp.author = req.user._id;

  const savedCamp = await newCamp.save();
  req.flash("success", "Added a new campground.")

  res.redirect(`/campgrounds/${savedCamp._id}`);
}

/**
 * Get one campground
 */
module.exports.getOneCampground = async (req, res) => {
  const {
    id
  } = req.params;
  const camp = await Campground.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author"
      }
    }) // nested population
    .populate("author");
  // console.log(camp);
  if (!camp) {
    req.flash("error", "No campground exists with that id.")
    return res.redirect('/campgrounds');
  }

  res.render("campgrounds/details", {
    camp
  });
}

/**
 * Update one campground
 */
module.exports.updateOneCampground = async (req, res, next) => {

  await Campground.findByIdAndUpdate(
    req.params.id,
    req.body.campground, {
      new: true,
      runValidators: true,
    }
  );

  req.flash("success", "Changes saved successfully.");

  res.redirect(`/campgrounds/${req.params.id}`);
}

/**
 * Delete one campground
 */
module.exports.deleteOneCampground = async (req, res) => {
  await Campground.findByIdAndDelete(req.params.id);
  req.flash("success", "Successfully deleted the campground.")
  res.redirect("/campgrounds");
}

/**
 * Render edit campground page
 * if user is authorized.
 */
module.exports.renderEditCampground = async (req, res, next) => {
  const camp = await Campground.findById(req.params.id);
  if (!camp) {
    req.flash("error", "Campground doesn't exists.")
    return res.redirect('/campgrounds');
  }
  return res.render("campgrounds/edit", {
    camp
  });
}

/**
 * Render add new campground page
 * if user is logged in
 */
module.exports.renderAddCampground = (req, res) => {
  res.render("campgrounds/new");
}