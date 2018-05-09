require("dotenv").config();
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var flash = require("connect-flash");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var methodOverride = require("method-override");
var moment = require("moment");
var seedDB = require("./seeds");
var User = require("./models/user");
var Blog = require("./models/blog");

var userRoutes = require("./routes/users");
var authRoutes = require("./routes/auth");
var countryRoutes = require("./routes/countries");
// var commentsRoutes = require("./routes/comments");
// var campgroundRoutes = require("./routes/campgrounds");

// var userRoutes = require("./routes/users");
// var contactRoutes = require("./routes/contact");

var app = express();
mongoose.connect("mongodb://localhost/travel_maps");

// seedDB();

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = moment;

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Travel is living",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// REQUIRING ROUTES
app.use(userRoutes);
app.use(authRoutes);
app.use(countryRoutes);
// app.use(campgroundRoutes);
// app.use(commentsRoutes);
// app.use(userRoutes);
// app.use(contactRoutes);

app.listen(3000, function() {
    console.log("Server is listening...")
});