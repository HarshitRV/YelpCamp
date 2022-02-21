const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const morgan = require("morgan");

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(morgan("tiny"));

const PORT = process.env.PORT || 3000;

// * My imports.
const Campground = require("./models/campground");
const AppError = require("./utils/AppError");
const { campgroundSchema } = require('./schemas')

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("connected to db");
});

// * Wrapper function to handle async errors.
const wrapAsync = (f) => {
  return function (req, res, next) {
    f(req, res, next).catch((err) => next(err));
  };
}

// * Function to check data validation.
const  validateCampground = (req, res, next) => {

    const { error  } = campgroundSchema.validate(req.body);

    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new AppError(msg, 400);
    } else {
        next();
    }

}

app.route("/").get((req, res) => {
  res.render("home");
});

app
  .route("/campgrounds")
  .get(async (req, res) => {
    const camps = await Campground.find({});
    res.render("campgrounds/index", { camps });
  })
  .post(
    validateCampground,
    wrapAsync(async (req, res, next) => {
        
        const { title, location, image, price, description } = req.body.campground;
        console.log(`Data from form`);
        console.log(title, location, image, price, description);

        const newCamp = new Campground(req.body.campground);
        const savedCamp = await newCamp.save();
        console.log(`Data that was saved: ${savedCamp}`);

        res.redirect(`/campgrounds/${savedCamp._id}`);
    })
  );

app.route("/campgrounds/new").get((req, res) => {
  res.render("campgrounds/new");
});

app
  .route("/campgrounds/:id")
  .get(
    wrapAsync(async (req, res, next) => {
    
        const { id } = req.params;
        const camp = await Campground.findById(id);
        console.log(camp);

        if(!camp){
            throw new AppError("Not Found", 404)
        }

        res.render("campgrounds/details", { camp });
      
    })
  )
  .put(
    wrapAsync(async (req, res, next) => {
      console.log("Data from form:");
      console.log(req.body);

      const prevData = await Campground.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );
      // * This method updates the object with new data and returns the new object data.

      console.log(`Updated data : ${prevData}`);

      res.redirect(`/campgrounds/${req.params.id}`);
    })
  )
  .delete(
    wrapAsync(async (req, res) => {
      const deletedData = await Campground.findByIdAndDelete(req.params.id);
      console.log(`Deleted Data: ${deletedData}`);

      res.redirect("/campgrounds");
    })
  );

app.route("/campgrounds/:id/edit").get(
  wrapAsync(async (req, res, next) => {
    const camp = await Campground.findById(req.params.id);
    if (!camp) {
      throw new AppError("Not Found", 404);
    }
    res.render("campgrounds/edit", { camp });
  })
);

app.all('*', (req, res, next)=>{
    next(new AppError('Page Not Found!', 404));
})

// * Custom error handling middleware
app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong !" } = err;
  res.status(status).render('error', {status, message, err});
});

app.listen(PORT, () => {
  console.log(`Serving on port ${PORT}`);
});
