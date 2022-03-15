const { reviewSchema } = require('../../schemas')

const validateReview = (req, res, next) => {
    const { error  } = reviewSchema.validate(req.body);
  
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new AppError(msg, 400);
    } else {
        next();
    }
  
}

module.exports = validateReview;