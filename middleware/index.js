// all the middleware goes here
var middlewareObj = {};
var DbComment = require("../models/comment");
var DbCampground = require("../models/campground");
middlewareObj.checkCampgroundOwnership = function (req, res, next) {
    //is user logged in?
    if (req.isAuthenticated()) {
        //does the user own the campground?
        DbCampground.findById(req.params.id, function (err, foundCampground) {
            if (err) {
                res.redirect("back");
            } else {
                if (foundCampground.author.id.equals(req.user._id)) {
                    next()
                    //if not
                } else {
                    res.redirect("back");
                }

            }
        });
    } else {
		req.flash("error", "You need to be logged in to perform that");
        res.redirect("back");
    }
}
middlewareObj.checkCommentOwnership = function (req, res , next) {
	//is user logged in?
	if (req.isAuthenticated()) {
		//does the user own the comment?
		DbComment.findById(req.params.comment_id, function (err, foundComment) {
			if (err) {
				res.redirect("back");
			} else {
				if (foundComment.author.id.equals(req.user._id)) {
					next()
					//if not
				} else {
					req.flash("error", "You don't have the right to perform this action")
					res.redirect("back");
				}

			}
		});
	} else {
		req.flash("error", "You need to be logged in to perform that");
		res.redirect("back");
	}
}
middlewareObj.isLoggedIn = function (req, res, next){ // next just lets the route continue to the standard
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You have to be logged in to perform that action"); //.flash comes from the connect-flash npm , it only shows up in the next page so it comes before redirecting
	res.redirect("/login");
};
module.exports = middlewareObj;