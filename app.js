/**
 * Imports
 */
process.env.NODE_ENV !== "production" && require('dotenv').config();
const express = require("express");
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const morgan = require("morgan");
const flash = require("connect-flash");
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

/**
 * Authentication Imports
 */
const session  = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");

/**
 * Utils imports.
 */
const AppError = require("./utils/AppError");
const { sessionConfig, SECRETS } = require('./configs/config');
const connectDB = require("./utils/connectDB");

/**
 * Model imports
 */
const User = require("./models/user");

/**
 * Routes Imports
 */
const CampRouter = require("./routes/campground/campground.router");
const ReviewRouter = require("./routes/review/review.router")
const UserRouter = require("./routes/user/user.router");

/**
 * Initialization
 */
const app = express();
const PORT = process.env.PORT || 3000;
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/**
 * Middlewares
 */
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(session(sessionConfig));
app.use(flash());
app.use(morgan("dev"));

/**
 * Security middlewares.
 */
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);
app.use(
  mongoSanitize({
    onSanitize: ({ req, key }) => {
      console.warn(`This request[${key}] is sanitized`, req);
    },
  }),
);

/**
 * app.session should be used before
 * passport.session.
 */
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
/**
 * Setting flash message globally
 */
app.use((req, res, next)=>{
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
})

/**
 * Server status Route
 */
app.route("/status").get((req, res)=>{
  return res.status(200).send({
    message: "Server is running."
  })
});

/**
 * Routing middlewares
 */
app.use('/campgrounds', CampRouter);
app.use('/campgrounds/:id/reviews', ReviewRouter);
app.use('/', UserRouter);

app.route("/").get((req, res) => {
  res.render("home");
});


app.all('*', (req, res, next)=>{
    next(new AppError('Page Not Found!', 404));
})

// * Custom error handling middleware
app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong !" } = err;
  res.status(status).render('error', {status, message, err});
});

/**
 * Starting the server.
 */
const startServer = async () => {
  try{
    await connectDB(SECRETS.MONGODB_CONNECTION_STRING);
    app.listen(PORT, () => {
      console.log(`Serving on port ${PORT}`);
    });
  }catch(err){
    console.log(err.message);
  }
}
startServer();