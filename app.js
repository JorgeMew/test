var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	passport = require("passport"),
	flash = require("connect-flash"),
	LocalStrategy = require("passport-local"),
	methodOverride = require("method-override"),
	DbCampground = require("./models/campground"),
	DbComment = require("./models/comment"),
	DbUser = require("./models/user"),
	seedDB = require("./seeds")

var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index"); // defining our routes , app.js will get the exports from those files


var port = process.env.PORT || 5000;



mongoose.connect("mongodb+srv://jorgemew:h2iCJkUfgLlzA1il@cluster0-nidbs.mongodb.net/test?retryWrites=true&w=majority", {
	useNewUrlParser: true,
	useUnifiedTopology: true
});




app.use(bodyParser.urlencoded({
	extended: true
})); // part of the body-parser npm 
app.set("view engine", "ejs"); // make ejs our default file type

app.use(methodOverride("_method"));

app.use(flash());

//passport configuration
app.use(require("express-session")({
	secret: "Hey now im a rockstar",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(DbUser.authenticate())); // authenticate comes from passport-local-mongoose
passport.serializeUser(DbUser.serializeUser());
passport.deserializeUser(DbUser.deserializeUser());

app.use(function (req, res, next) { // this will run in every route
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error"); // the variable here error comes from the isLoggedIn middleware function that's gonna pass this req.flash("error") if the user needed to be logged in to perform an action. if there is no req.flash being passed through this does nothing.
	res.locals.success = req.flash("success");
	next();
});

app.use(express.static(__dirname + "/public")) //__dirname is a node.js feature that returns the current directory of the folder


app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes); // "/campgrounds" adds /campgrounds to every route inside so then instead of /campgrounds/new it's just /new
app.use("/campgrounds/:id/comments",commentRoutes); // tells our app.js to use the routes defined before


// required for the server
app.listen(port, process.env.IP, function () {
	console.log("---------Yelp Camp server has started----------");
});

