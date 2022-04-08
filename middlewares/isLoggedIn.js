const isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.redirectTo = req.originalUrl;
        req.flash("error", "You need to be logged in.");
        return res.redirect("/login");
    }
    next();
}

module.exports = isLoggedIn;