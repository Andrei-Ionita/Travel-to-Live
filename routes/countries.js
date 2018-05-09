var express = require("express");
var router = express.Router();
var request = require("request");

// THE SHOW COUNTRY INFO
router.get("/countries/:name", function(req, res) {
    function randomPic() {
        var pic= Math.floor(Math.random() * 20);
        return pic
    }
    var query = req.params.name;
    if(query) {
        var url = "https://restcountries.eu/rest/v2/name/" + query;
        var photos = "https://api.unsplash.com/search/photos/?client_id=bc1280762b689d12a623bd7b0985faeca02e94dafdd44bfb8a0d2c5aa1624eca&query=" + query;
        var wiki = "https://en.wikipedia.org/api/rest_v1/page/summary/" + query;
        var wikiFull = "https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&explaintext&titles=" + query;
        var results = [];
        request(url, function(error, response, body) {
            if(!error && response.statusCode == 200) {
                var data = JSON.parse(body);
                results.push(data);
            }
            request(photos, function(error, response, body) {
                if(!error && response.statusCode == 200) {
                    var images = JSON.parse(body);
                    results.push(images);
                }
                request(wiki, function(error, response, body) {
                    if(!error && response.statusCode == 200) {
                        var info = JSON.parse(body);
                        results.push(info);
                    }
                    request(wikiFull, function(error, response, body) {
                        if(!error && response.statusCode == 200) {
                            var moreInfo = JSON.parse(body);
                            var text = moreInfo.query.pages[Object.keys(moreInfo.query.pages)[0]].extract
                            results.push(text);
                            res.render("countries/show", {data: results[0], images: results[1], photo: randomPic(), info: results[2], wikipedia: results[3]});
                        }
                    })
                })
            })
        })
    }
});

module.exports = router;