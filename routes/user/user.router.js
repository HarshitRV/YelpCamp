/**
 * Module imports.
 */
const {
    Router
} = require("express");
const passport = require("passport")

/**
 * Util imports.
 */
const catchAsync = require("../../utils/catchAsync")

/**
 * Router imports.
 */
const router = Router();

/**
 * Controller imports.
 */
const {
    renderRegister,
    registerUser,
    renderLogin,
    loginUser,
    logoutUser
} = require("../../controller/user/user.controller")

router.route('/register')
    .get(renderRegister)
    .post(catchAsync(registerUser))

router.route("/login")
    .get(renderLogin)
    .post(passport.authenticate('local', {
        failureFlash: true,
        failureRedirect: '/login'
    }), loginUser)

router.route('/logout')
    .get(logoutUser)

module.exports = router;