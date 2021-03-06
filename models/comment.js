var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
    text:String,
    author:{
        id: {
            type:mongoose.Schema.Types.ObjectId,
            ref: "User0"
        },
        username: String
    }

});

module.exports = mongoose.model("DbComment", commentSchema);