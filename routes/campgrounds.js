var express = require("express");
var router = express.Router();
var middleware = require("../middleware") //this will auto choose index coz it knows because its called index that it is the main file
var DbCampground = require("../models/campground");
var DbComment = require("../models/comment");
// =============
//CAMPGROUND ROUTES /campgrounds/
// =============



//INDEX: show the campgrounds in /campgrounds
router.get("/", function (req, res) {
	//Get all campgrounds from DB
	DbCampground.find({}, function (err, allCampgrounds) {
		if (err) {
			console.log(err);
		} else {
			res.render("campgrounds/index", {
				campgrounds: allCampgrounds,

			}) //pass our campgrounds variable to the ejs folder 
		}
	});

	console.log("Connected to /campgrounds");
});

//CREATE: Where you POST for /campgrounds 
router.post("/", middleware.isLoggedIn, function (req, res) { // add new campgrounds
	//get data from form and add to campgrounds array
	var name = req.body.campground.name; //used to get the name from the input inside the body
	var image = req.body.campground.image;
	var desc = req.body.campground.description;
	var price = req.body.campground.price;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newCampground = {
		name: name,
		price: price,
		image: image,
		description: desc,
		author: author
	};
	console.log(req.user);
	// Create a new DbCampground and save to DB
	DbCampground.create(newCampground, function (err, newlyCreated) {
		if (err) {
			console.log(err);

		} else {
			console.log(newlyCreated);
			console.log("Posted to /campgrounds")
			//redirect back to campgrounds page
			res.redirect("/campgrounds");
		}
	});
});

//NEW: add a new DbCampground in /campgrounds
router.get("/new", middleware.isLoggedIn, function (req, res) {
	res.render("campgrounds/new");
	console.log("Connected to /campgrounds/new")

});

// SHOW - shows more info about one DbCampground
router.get("/:id", function (req, res) {
	//find the DbCampground with providedID
	DbCampground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
		if (err) {
			console.log(err)
		} else {

			res.render("campgrounds/show", {
				campground: foundCampground
			});
		}
	}); 
	console.log("connected to campgrounds/show")
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit",middleware.checkCampgroundOwnership, function(req, res) {
	DbCampground.findById(req.params.id, function (err, foundCampground) {

		res.render("campgrounds/edit", {
			campground: foundCampground
		});

	});
	console.log("campgrounds/:id/edit")
});

//UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function (req, res) {
	//find and update the correct campground~
	DbCampground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCampground) {
		if (err) {
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
	//redirect to the show page
});

//DESTROY CAMPGROUND ROUTE

router.delete("/:id",middleware.checkCampgroundOwnership, function (req, res) {
	DbCampground.findByIdAndRemove(req.params.id, function (err) {
		if (err) {
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds");
		}
	});
});

function isLoggedIn(req, res, next) { // next just lets the route continue to the standard
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
};


module.exports = router;