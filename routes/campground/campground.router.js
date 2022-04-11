/**
 * Module imports.
 */
const express = require("express");
const router = express.Router();
const multer  = require('multer')
const { storage } = require("../../utils/cloudinaryUpload");
const upload = multer({ storage })

/**
 * Util imports.
 */
const catchAsync = require("../../utils/catchAsync");

/**
 * Validator imports
 */
const validateCampground = require("../../validators/campground.validate");

/**
 * Middleware imports
 */
const isLoggedIn = require("../../middlewares/isLoggedIn")
const isAuthor = require("../../middlewares/isAuthor");

/**
 * Controller imports.
 */
const { 
  getAllCampgrounds,
  addNewCampground,
  getOneCampground,
  updateOneCampground,
  deleteOneCampground,
  renderEditCampground,
  renderAddCampground
} = require("../../controller/campground/campground.controller");

router
  .route("/")
  .get(
    catchAsync(getAllCampgrounds)
  )
  .post(
    isLoggedIn,
    upload.array('image', 3),
    validateCampground,
    catchAsync(addNewCampground)
  );

router.route("/new").get(isLoggedIn, renderAddCampground);

router
  .route("/:id")
  .get(
    catchAsync(getOneCampground)
  )
  .put(
    isLoggedIn,
    isAuthor,
    validateCampground,
    catchAsync(updateOneCampground)
  )
  .delete(
    isLoggedIn,
    isAuthor,
    catchAsync(deleteOneCampground)
  );

router.route("/:id/edit").get(
  isLoggedIn,
  isAuthor,
  catchAsync(renderEditCampground)
);

module.exports = router;