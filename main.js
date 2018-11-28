var express = require('express');
var Twitter = require('twitter');
var bodyParser = require('body-parser');
require('dotenv').config()
var app = express()

const PORT = process.env.PORT || 8080;
console.log("Port", PORT);

app.listen(PORT, function () {
    console.log("connection established");
});

app.use(express.static('dist'))

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
});

var client = new Twitter({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token_key: process.env.ACCESS_TOKEN_KEY,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

app.get('/u/:user', async function (req, res) {
    const params = {
        q: req.params.user,
        count: 10,
        result_type: 'recent',
        lang: 'en'
    }
    let tweets = await getTweets(params);
    res.send(tweets);
});

app.get('/h/:user', async function (req, res) {
    const params = {
        track: '#' + req.params.user,
        lang: 'en'
    }
    let tweets = await hashTweets(params);
    res.send(tweets);
});

function getTweets(params) {
    return new Promise(function (resolve, reject) {
        client.get('search/tweets', params, function (err, tweets, response) {
            if (err && !response.statusCode == 200) {
                console.log("error", response.statusCode);
                reject('error', null);
            } else {
                let value = tweets.statuses;
                let text;
                let name;
                let final = [];
                for (let i = 0; i < value.length; i++) {
                    text = value[i]['text']
                    name = value[i].user.profile_background_image_url;
                    final.push({
                        text: text,
                        name: name
                    });
                }
                resolve(final);
            }
        });
    });
}

function hashTweets(params) {
    return new Promise(function (resolve, reject) {
        var data_1 = [];

        client.stream('statuses/filter', params, function (stream) {
            stream.on('data', function (event) {
                data_1.push(event)
                if (data_1.length > 3) {
                    let text;
                    let name;
                    let final = [];
                    for (let i = 0; i < data_1.length; i++) {
                        text = data_1[i]['text']
                        name = data_1[i].user.profile_background_image_url;
                        final.push({
                            text: text,
                            name: name
                        });
                    }
                    resolve(final);
                }
            });
            stream.on('error', function (error) {
                console.log(">", error);
            });
        });

    });
}