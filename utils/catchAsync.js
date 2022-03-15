// * Wrapper function to handle async errors.
const wrapAsync = (f) => {
    return function (req, res, next) {
      f(req, res, next).catch((err) => next(err));
    };
}

module.exports = wrapAsync;