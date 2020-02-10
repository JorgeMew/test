var express = require("express");
var router = express.Router({mergeParams: true}); // merge params from campgrounds and comments
var DbCampground = require("../models/campground");
var DbComment = require("../models/comment");
var middleware = require("../middleware")

//==========================
//COMMENTS ROUTES /campgrounds/:id/comments/
//==========================

//Comments New
router.get("/new", middleware.isLoggedIn, function (req, res) {
	DbCampground.findById(req.params.id, function (err, campground) {
		if (err) {
			console.log(err);
		} else {
			res.render("comments/new", {
				campground: campground
			});
		}
	})
});

//comments Create
router.post("/",middleware.isLoggedIn, function (req, res) {
	//lookup campground id
	DbCampground.findById(req.params.id, function (err, foundCampground) {
		if (err) {
			console.log(err);

		} else {
			DbComment.create(req.body.comment, function (err, comment) {
				if (err) {
					console.log(err);
				} else {
					// add username and id to comment
					console.log(req.user.username)
					comment.author.id = req.user._id; // this syntax comes from the comment schema
					comment.author.username = req.user.username;
					//save comment
					comment.save();
					//create new comment
					foundCampground.comments.push(comment);
					//connect new comment to campground
					foundCampground.save();
					//redirect to campground show page
					req.flash("success", "Succesfully posted!")
					res.redirect("/campgrounds/" + foundCampground._id);
				}
			})
		}
	})
});
//COMMENT EDIT ROUTE
router.get("/:comment_id/edit",middleware.checkCommentOwnership, function(req, res){
	DbComment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			res.redirect("back");
		}else{
			res.render("comments/edit",{
				campground_id: req.params.id,
				comment: foundComment
			});
		}
	})

});
//COMMENT UPDATE ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
DbComment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
if(err){
	res.redirect("back");
}else{
	res.redirect("/campgrounds/"+req.params.id)
}
});
});

//COMMENT DESTROY ROUTE
router.delete("/:comment_id",middleware.checkCommentOwnership, function(req,res){
DbComment.findByIdAndRemove(req.params.comment_id, function(err){
if(err){
	res.redirect("back");
} else{
	res.redirect("/campgrounds/"+req.params.id)
}
});
})


module.exports = router;