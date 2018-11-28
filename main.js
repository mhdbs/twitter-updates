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
        q: '#' + req.params.user
        // lang: 'en'
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
                    text = value[i]['text'];
                    final.push({
                        text: text
                    });
                }
                resolve(final);
            }
        });
    });
}

function hashTweets(params) {
    return new Promise(function (resolve, reject) {
        client.get('search/tweets', params, function (err, tweets, response) {
            console.log("tweet: " + JSON.stringify(tweets.statuses))
            if (err && !response.statusCode == 200) {
                console.log("error", response.statusCode);
                reject('error', null);
            } else {
                let value = tweets.statuses;
                let text;
                let name;
                let final = [];
                for (let i = 0; i < value.length; i++) {
                    text = value[i]['text'];
                    final.push({
                        text: text
                    });
                }
                resolve(final);
            }
        });
    });
}