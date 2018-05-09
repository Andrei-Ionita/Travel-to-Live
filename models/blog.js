var mongoose = require("mongoose");

var blogSchema = new mongoose.Schema({
    traveler: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    posts: [
        {
            title: String,
            body: String,
            image: String
        }
    ]
});

module.exports = mongoose.model("Blog", blogSchema);