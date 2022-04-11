/**
 * Validation for creating new campground.
 */
const { campgroundSchema } = require("./schemas");
const AppError = require("../utils/AppError")
const  validateCampground = (req, res, next) => {

    // console.log(req.body);
    const { error  } = campgroundSchema.validate(req.body);

    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new AppError(msg, 400);
    } else {
        return next();
    }
}

module.exports = validateCampground;