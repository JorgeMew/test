var mongoose = require("mongoose");

//SCHEMA SETUP For the campground template

var campgroundSchema = new mongoose.Schema({
	name: String,
	price:String,
	image: String,
	description: String,
	author: {
		id:{
			type: mongoose.Schema.Types.ObjectId,
			ref: "user"
		},
		username:String
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "DbComment"
		}
	]
});
module.exports = mongoose.model("DbCampground", campgroundSchema); //making the model so we can do campground.find() or remove