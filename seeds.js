var mongoose = require("mongoose");
var DbCampground = require("./models/campground");
var DbComment = require("./models/comment");

var data = [{
        name: "Cloud's Rest",
        image: "https://images.unsplash.com/photo-1571069756236-9d9322054086?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    {
        name: "Cloud's Rest",
        image: "https://images.unsplash.com/photo-1574105760686-1399492ce94b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    },
    {
        name: "Cloud's Rest",
        image: "https://images.unsplash.com/photo-1568576550491-185584b2145a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    }
]

function seedDB() {
    //remove all backgrounds
    DbCampground.deleteMany({}, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("removed campgrounds");
            data.forEach(function (seed) {
                DbCampground.create(seed, function (err, campground) {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log("added a campground");
                        DbComment.create({
                            text:"Too much water 9/10",
                            author:"Homer",
                        }, function(err, DbComment){
                            if(err){
                                console.log(err);
                            }else{
                                campground.comments.push(DbComment);
                                campground.save();
                                console.log("created a new comment");
                            }
                        });

                    }
                });

            });
        }
    });
    //create new campgrounds


}

module.exports = seedDB;