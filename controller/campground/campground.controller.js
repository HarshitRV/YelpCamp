/**
 * Module Imports.
 */
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

/**
 * Config Imports.
 */
const { SECRETS } = require("../../configs/config")

/**
 * Model imports
 */
const Campground = require("../../models/campground");
const { cloudinary } = require("../../utils/cloudinaryUpload");

/**
 * Initialize mapbox.
 */
const geocoder = mbxGeocoding({ accessToken: SECRETS.MAPBOX_TOKEN });

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

  const geoData = await geocoder.forwardGeocode({
    query: req.body.campground.location,
    limit: 1
  }).send();

   

  const newCamp = new Campground(req.body.campground);

  newCamp.images = req.files.map(image => ({ url: image.path, fileName: image.filename }));
  // Associating the author with the campground.
  newCamp.author = req.user._id;
  newCamp.geometry = geoData.body.features[0].geometry;

  const savedCamp = await newCamp.save();
  // console.log(savedCamp)
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

  // console.log(req.body);
  const camp = await Campground.findByIdAndUpdate(req.params.id,{ ...req.body.campground });
  const images = req.files.map(image => ({ url: image.path, fileName: image.filename }));
  camp.images.push(...images);
  
   

  await camp.save();

  if(req.body.deleteImages){
    const { deleteImages } = req.body;

    // Running multiple query in parallel.
    await Promise.all(deleteImages.map(filename => (cloudinary.uploader.destroy(filename))))
     // Pull from the images array where the fileName matches with any of the fileName in deleteImages array.
    await camp.updateOne({ $pull: { images: { fileName: { $in: deleteImages } } } });
  }

  req.flash("success", "Changes saved successfully.");

  res.redirect(`/campgrounds/${req.params.id}`);
}

/**
 * Delete one campground
 */
module.exports.deleteOneCampground = async (req, res) => {
  const camp = await Campground.findByIdAndDelete(req.params.id);
  try{
    await Promise.all(camp.images.map(filename => (cloudinary.uploader.destroy(filename.fileName))));
  }catch(e){
    return res.redirect("/campgrounds");
  }
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