const Campground = require("../models/campground");

const isAuthor = async (req, res, next) => {
    const { id } = req.params;
    // Finding camp with the given id.
    const camp = await Campground.findById(id);

    // Cheking if the camp belongs to the logged in user.
    if(camp.author.equals(req.user._id)) return next();

    req.flash("error", "You are not authorized to do that!!");
    return res.redirect(`/campgrounds/${id}`);
}

module.exports = isAuthor;