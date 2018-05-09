var mongoose = require("mongoose");

var countrySchema = new mongoose.Schema( {
    name: String,
    id: String,
    traveler: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("Country", countrySchema);
