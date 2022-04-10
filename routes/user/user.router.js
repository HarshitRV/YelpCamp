const { Router } = require("express");
const catchAsync = require("../../utils/catchAsync")
const User = require("../../models/user")
const passport = require("passport")

const router = Router();

router.route('/register')
    .get((req, res)=>{
        res.render('users/register');
    })
    .post(catchAsync(async (req, res, next)=>{
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
    }))

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