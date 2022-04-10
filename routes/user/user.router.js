/**
 * Module imports.
 */
const { Router } = require("express");
const passport = require("passport")

/**
 * Util imports.
 */
const catchAsync = require("../../utils/catchAsync")

/**
 * Model imports
 */
const User = require("../../models/user")

/**
 * Router imports.
 */
const router = Router();

/**
 * Controller imports.
 */
const{
    renderRegister,
    registerUser
} = require("../../controller/user/user.controller")

router.route('/register')
    .get(renderRegister)
    .post(catchAsync(registerUser))

router.route("/login")
    .get((req, res)=>{
        res.render("users/login")
    })
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res)=>{
        let redirectTo = req.session.redirectTo || '/campgrounds';
        // console.log(redirectTo);
        // Since the /reviews do not have get.
        if(redirectTo.includes("/reviews")){
            redirectTo = redirectTo.slice(0, -8)
        }
        
        req.flash("success", "Welcome back 🎉");
        delete req.session.redirectTo;
        res.redirect(redirectTo);
    })

router.route('/logout')
    .get((req, res)=>{
        req.logout();
        req.flash("success", "Logged you out.");
        res.redirect('/campgrounds');
    })

module.exports = router;