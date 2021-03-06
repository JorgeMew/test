var express = require("express");
var router = express.Router();
var passport = require("passport");
var DbUser = require("../models/user");


router.get("/", function (req, res) {
	res.render("landing");
	console.log("Connected to Landing Page")
});





//=========
//AUTH ROUTES
//=========

router.get("/register", function (req, res) {
	res.render("register");
});

//handle sign up logic	
router.post("/register", function (req, res) {
	var newUser = new DbUser({
		username: req.body.username
	}); //provided by the passport-local-mongoose
	DbUser.register(newUser, req.body.password, function (err, user) { // register will register the username and take the password and transform it and then store it with the user
		if (err) {
			req.flash("error", err.message )
			return res.redirect("register");
		}
		passport.authenticate("local")(req, res, function () {
			req.flash("success", "Welcome to YelpCamp " + user.username)
			res.redirect("/campgrounds");
		});
	});
});
//show login form
router.get("/login", function (req, res) {
	res.render("login"); 
})
//handling login logic
router.post("/login", passport.authenticate("local", {
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}),function (req, res) {
	if(err){
		console.log(err);
		res.redirect("login");
	}
});

//logic route
router.get("/logout", function(req, res){
	req.logout(); //logoout comes from passport
	req.flash("success", "Logged you out!");
	res.redirect("/campgrounds");
});

module.exports = router;