var mongoose = require("mongoose");
var Country = require("./models/country");

var data = [
    {
        name: "France",
        id: "FR"
    },
    {
        name: "Romania",
        id: "RO"
    }
];

function seedDB() {
    data.forEach(function(seed) {
        Country.remove({}, function(err) {
            if(err) {
                console.log(err);
            }
            console.log("Countries deleted");
            Country.create(seed, function(err, countries) {
                if(err) {
                    console.log(err);
                }
                else {
                    console.log("New Country added to the list");
                }
            })
        })
    })
};

module.exports = seedDB;