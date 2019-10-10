var request = require('request');
var https = require('https');
var mebots = require('mebots');

// https://dev.groupme.com/bots
// https://dashboard.heroku.com/apps/groupme-gif-bot/settings
//var alphaVantageAPIKey = process.env.alphaVantageAPIKey;
var giphyAPIKey = process.env.giphyAPIKey;
var bot = new mebots.Bot('gifbot', process.env.botToken);



// Process incoming groupme messages
function respond() {
    try {
        var message = JSON.parse(this.req.chunks[0]);
    } catch (e) {
        console.log('Invalid JSON passed.');
    }
    this.res.writeHead(200);

    console.log('@' + message.name + ': ' + message.text + ' in: ' + message.group_id);
    if (message.sender_type != 'bot') {
        tagCheck(message);
    }

    this.res.end("OK");
}


function trim(text) {
    return text.substring(1).trim();
}


function tagCheck(message) {
    // Was the bot tagged?
    if (message.text.toLowerCase().indexOf('@gifbot') >= 0) {
        botTag(message);
    }

    // GIF #
    if (message.text.substring(0,1) == '#') {
        gifTag(message);
    }
}


// If the bot was tagged
function botTag(message) {
    botResponse = 'try "#auburn basketball" for a gif\ntry "$bac" for a stock price';
    postMessage(botResponse, message.group_id);
}

// If a GIF was requested
function gifTag(message) {
    request('https://api.giphy.com/v1/gifs/translate?s=' + trim(message.text) + '&api_key=' + giphyAPIKey, function (error, response, body) {
        parsedData = JSON.parse(body);
        if (!error && response.statusCode == 200 && parsedData && parsedData.data.images) {
            
            //console.log('LOG: original URL : ' + parsedData.data.images.original.url);
            //console.log('LOG: original Size: ' + parseFloat(parsedData.data.images.original.size).toLocaleString('en'));          
            console.log('LOG: fixed_width Size: ' + parseFloat(parsedData.data.images.fixed_width.size).toLocaleString('en'));
            console.log('LOG: rating: ' + parsedData.data.rating);
            
            
            botResponse = parsedData.data.images.fixed_width.url;
            postMessage(botResponse, message.group_id);
        }
    });
}


// Post message
function postMessage(text, groupID) {
    bot.getInstance(groupID).then((instance) => {
        var options, botReq;
        options = {
            hostname: 'api.groupme.com',
            path: '/v3/bots/post',
            method: 'POST',
            'bot_id': instance.id,
            'text': text
        };

        botReq = https.request(options, function(res) {
            if(res.statusCode == 202) {
                console.log('LOG: GroupMe SUCCESS: ' + res.statusCode + ' in group: ' + groupID + ' - ' + text);
            } else {
                console.log('LOG: GroupMe ERROR: ' + res.statusCode + ' in group: ' + groupID + ' - ' + text);
            }
        });
        botReq.end(JSON.stringify(options));
    });
}

exports.respond = respond;
