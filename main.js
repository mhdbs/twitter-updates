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
    if (tweets.length) {
        res.send(tweets);
    } else {
        res.send("404 Server Error");
    }
});

app.get('/h/:user', async function (req, res) {
    const params = {
        q: '#' + req.params.user
    }
    let tweets = await hashTweets(params);
    if (tweets.length) {
        res.send(tweets);
    } else {
        res.send("404 Server Error");
    }

});

//getTweets function for getting the tweets from /h/:user, which is the user profile or id is given
function getTweets(params) {
    return new Promise(function (resolve, reject) {
        //client.get is a get api with 'search/tweets' of twitters and the params should be passed with the user check the line 30
        client.get('search/tweets', params, function (err, tweets, response) {
            if (err && !response.statusCode == 200) {
                console.log("error", response.statusCode);
                reject('error', null);
            } else {
                //try catch for the exception handline if the value contains tweets then it will resolve with data else returns empty array
                try {
                    let value = tweets.statuses;
                    let text;
                    let final = [];
                    for (let i = 0; i < value.length; i++) {
                        text = value[i]['text'];
                        final.push({
                            text: text
                        });
                    }
                    resolve(final);
                } catch (err) {
                    resolve([], null);
                }
            }
        });
    });
}

function hashTweets(params) {
    return new Promise(function (resolve, reject) {
        //client.get is a get api with 'search/tweets' of twitters and the params should be passed with the user check the line 45
        client.get('search/tweets', params, function (err, tweets, response) {
            if (err && !response.statusCode == 200) {
                console.log("error", response.statusCode);
                reject('error', null);
            } else {
                try {
                    let value = tweets.statuses;
                    let text;
                    let final = [];
                    for (let i = 0; i < value.length; i++) {
                        text = value[i]['text'];
                        final.push({
                            text: text
                        });
                    }
                    resolve(final);
                } catch (err) {
                    resolve([], null);
                }
            }
        });
    });
}