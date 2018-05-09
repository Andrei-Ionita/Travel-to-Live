var express = require("express");
var router = express.Router();
var User = require("../models/user");
var Country = require("../models/country");
var Blog = require("../models/blog");
var request = require("request");
var middleware = require("../middleware");


// INDEX ROUTE NO USER
router.get("/", function(req, res) {
    var query = req.query.name;
    if(query) {
        var url = "https://restcountries.eu/rest/v2/name/" + query;
        var photos = "https://api.unsplash.com/search/photos/?client_id=bc1280762b689d12a623bd7b0985faeca02e94dafdd44bfb8a0d2c5aa1624eca&query=" + query;
        var results = [];
        request(url, function(error, response, body) {
            if(!error && response.statusCode == 200) {
                var data = JSON.parse(body);
                results.push(data);
            }
            request(photos, function(error, response, body) {
                if(!error && response.statusCode == 200) {
                    var images = JSON.parse(body);
                    results.push(images);
                    res.render("index", {data: results[0], images: results[1]});
                }
            })
        })
    }
    else {
        res.render("index");
    }
});

// THE SHOW SELECTED COUNTRY INFO
router.get("/mytravelmap/country", function(req, res) {
    User.findById(req.user._id, function(err, traveler) {
        if(err) {
            req.flash("error", err.message);
            res.redirect("back");
        }
        else {
            var query = req.query.name;
            if(query) {
                var url = "https://restcountries.eu/rest/v2/name/" + query;
                request(url, function(error, response, body) {
                    if(!error && response.statusCode == 200) {
                        var data = JSON.parse(body);
                        res.render("index", {data: data, visitedCountries: traveler.visitedCountries, visitedCountriesId: traveler.visitedCountriesId});
                        console.log(data);
                    }   
                });
            }
        }
    })
});

// THE TRAVEL MAP SHOW ROUTE
router.get("/mytravelmap", function(req, res) {
    User.findById(req.user._id, function(err, traveler) {
        if(err) {
            console.log(err);
            res.render("index");
        }
        else {
            res.render("index", {visitedCountries: traveler.visitedCountries, visitedCountriesId: traveler.visitedCountriesId});
        }
    })
});

// THE NEW VISITED COUNTRIES ROUTE
router.post("/mytravelmap", middleware.isLoggedIn, function(req, res) {
    var newCountries = req.body.name.split(",");
    var newCountriesID = req.body.id.split(",");
    for(i = 0; i < newCountries.length; i++) {
        Country.create({name: newCountries[i], id: newCountriesID[i]}, function(err, addedCountry) {
            if(err) {
                console.log(err);
                res.redirect("back");
            }
            User.findById(req.user._id, function(err, user) {
                if(err) {
                    console.log(err);
                    req.flash("error", "Something went wrong!");
                    res.redirect("/");
                }
                else {
                    user.visitedCountries.push(addedCountry.name);
                    user.visitedCountriesId.push(addedCountry.id);
                    user.save();
                }
            })
        })
    }
    res.redirect("/mytravelmap");
});

// THE DELETE VISITED COUNTRIES ROUTE
router.put("/mytravelmap", middleware.isLoggedIn, function(req, res) {
    var removedCountries = req.body.name.split(",");
    var removedCountriesId = req.body.id.split(",");
    var updatedVisitedCountries = [];
    var updatedVisitedCountriesId = [];
    User.findById(req.user._id, function(err, traveler) {
        if(err) {
            req.flash("error", err.message);
            return res.redirect("/mytravelmap");
        }
        else {
            for(i = 0; i < removedCountries.length; i++){
                updatedVisitedCountries = traveler.visitedCountries.filter(function(val) {
                    return removedCountries.indexOf(val) == -1;
                });
                updatedVisitedCountriesId = traveler.visitedCountriesId.filter(function(val) {
                    return removedCountriesId.indexOf(val) == -1;
                });
            }
            traveler.visitedCountries = updatedVisitedCountries;
            traveler.visitedCountriesId = updatedVisitedCountriesId;
            traveler.save();
        }
    })
    res.redirect("/mytravelmap");
})

// THE BLOG SHOW ROUTE
router.get("/mytravelmap/blog", middleware.isLoggedIn, function(req, res) {
    Blog.find({"traveler.id": req.user._id}, function(err, foundBlog) {
        if(err) {
            console.log(err);
            req.flash("error", err.message);
            res.redirect("back");
        }
        else{
            res.render("blog/show", {posts: foundBlog.posts});
        }
    })
})


router.get("/mytravelmap/:id/CreateBlog", middleware.isLoggedIn, function(req, res) {
    var traveler = {id: req.params.id, username: req.user.username};
    var posts = [];
    var newBlog = {traveler: traveler, posts: posts};
    Blog.create(newBlog, function(err, newBlog) {
        if(err) {
            req.flash("error", err.message);
            res.redirect("back");
        }
        else {
            req.flash("success", "Blog Created");
            res.redirect("/mytravelmap/blog");
        }
    })
});

// // THE NEW POST ROUTE
// router.get("/mytravelmap/:id/blog/post", function(req, res) {
//     res.render("blog/new");
// })

// // THE NEW POST ROUTE LOGIC
// router.post("/mytravelmap/:id/blog", function(req, res) {
//     var title = req.body.title;
//     var body = req.body.body;
//     var image = req.body.image;

//     Blog.findOne({traveler.id: req.params.id}, function(err, blog) {
//         if(err) {
//             console.log(err);
//         }
//         else {
//             req.flash("success", "Succesufully Created");
//             blog.posts.push({title: title, body: body, image: image})
//             res.redirect("/mytravelmap/" + req.user._id + "/blog");
//         }
//     })
// })

module.exports = router;