/**
 * Model imports.
 */
const User = require("../../models/user");

/**
 * Render register page.
 */
module.exports.renderRegister = (req, res)=>{
    res.render('users/register');
}

/**
 * Register a new user.
 */
module.exports.registerUser = async (req, res, next)=>{
    try{
        const { email, username, password } = req.body.user;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);

        /**
         * Login the user after registration,
         * helper function provided by passport.
         */
        req.login(registeredUser, err =>{
            if(err) return next(err);
            req.flash("success", "Welcome to yelp camp");
            res.redirect("/campgrounds");
        })
    }catch(err){
        req.flash("error", err.message);
    }   
}