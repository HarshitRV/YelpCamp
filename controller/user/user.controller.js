/**
 * Model imports.
 */
const User = require("../../models/user");

/**
 * Render register page.
 */
module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

/**
 * Register a new user.
 */
module.exports.registerUser = async (req, res, next) => {
    try {
        const {
            email,
            username,
            password
        } = req.body;
        const user = new User({
            email,
            username
        });
      
        const registeredUser = await User.register(user, password);

        /**
         * Login the user after registration,
         * helper function provided by passport.
         */
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash("success", "Welcome to yelp camp");
            res.redirect("/campgrounds");
        })
    } catch (err) {
        req.flash("error", err.message);
    }
}

/**
 * Render login page.
 */
module.exports.renderLogin = (req, res) => {
    res.render("users/login")
}

/**
 * Login a user.
 */
module.exports.loginUser = (req, res) => {
    let redirectTo = req.session.redirectTo || '/campgrounds';
    // console.log(redirectTo);
    // Since the /reviews do not have get.
    if (redirectTo.includes("/reviews")) {
        redirectTo = redirectTo.slice(0, -8)
    }

    req.flash("success", "Welcome back 🎉");
    delete req.session.redirectTo;
    res.redirect(redirectTo);
}

/**
 * Logout a user.
 */
module.exports.logoutUser = (req, res) => {
    req.logout();
    req.flash("success", "Logged you out.");
    res.redirect('/campgrounds');
}