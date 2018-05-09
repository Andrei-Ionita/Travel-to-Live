var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var request = require("request");

// THE REGISTER ROUTE
router.get("/register", function(req, res) {
    res.render("register");
});

// THE REGISTER LOGIC
router.post("/register", function(req, res) {
    const captcha = req.body["g-recaptcha-response"];
    if(!captcha) {
        alert("Please select captcha");
        return res.redirect("/register");
    }
    var secretKey = process.env.CAPTCHA;
    var verifyURL = "https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captcha}&remoteip=${req.connection.remoteAddress";
    // Make request to Verify URL
    request.get(verifyURL, function(err, response, body) {
        // if not successful
        if (body.success !== undefined && !body.success) {
          alert("Captcha Failed");
          return res.redirect("/register");
        }
    });
    var newUser = new User({username: req.body.username, firstName: req.body.firstName, lastName: req.body.lastName, avatar: req.body.avatar, email: req.body.email, description: req.body.description});
  
    if(req.body.adminCode === process.env.ADMIN_CODE) {
        newUser.isAdmin = true;
    };
  
    User.register(newUser, req.body.password, function(err, user) {
        if(err) {
          return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function() {
            req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/mytravelmap");
        });
    });
});

// THE LOGIN ROUTE
router.get("/login", function(req,res) {
    res.render("login");
});

// THE LOGIN LOGIC ROUTE
router.post("/login", passport.authenticate("local", {
    successRedirect: "/mytravelmap",
    failureRedirect: "/login"
    }), function(req, res) {
});

// THE LOGOUT ROUTE
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Succesfully logged out");
    res.redirect("/");
});

module.exports = router;
