var request = require('request');
var https = require('https');
var mebots = require('mebots');

// https://dev.groupme.com/bots
// https://dashboard.heroku.com/apps/groupme-gif-bot/settings
var alphaVantageAPIKey = process.env.alphaVantageAPIKey;
var giphyAPIKey = process.env.giphyAPIKey;
var groupMeAppToken = process.env.groupMeAppToken;
var bot = new mebots.Bot('gifbot', process.env.botToken);

// Process incoming groupme messages
function respond() {
    try {
        var message = JSON.parse(this.req.chunks[0]);
    } catch (e) {
        console.log('Invalid JSON passed.');
    }
    this.res.writeHead(200);

    console.log(message.group_id + ' @' + message.name + ': ' + message.text);
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

    // Stock $
    if (message.text.substring(0,1) == '$') {
        stockTag(message);
    }

    // MLB ^
    if (message.text.substring(0,1) == '^') {
        mlbTag(message);
    }
}


// If the bot was tagged
function botTag(message) {
    request('https://braves-groupme.appspot.com/CHECK?groupName=' + message.group_id + '&teamKey=ATL', function (error, response, body) {
        if (response.statusCode == 201) {
            botTagResponse = 'try #auburn basketball for a gif\ntry $bac for a stock price';
            botTagResponseLog = 'I was tagged by: ' + sendingUser;
            botResponse = botTagResponse;
            specificLog = botTagResponseLog;
            postMessage(botResponse, message.group_id);
        }
    });
}

// If a GIF was requested
function gifTag(message) {
    request('https://api.giphy.com/v1/gifs/translate?s=' + trim(message.text) + '&api_key=' + giphyAPIKey, function (error, response, body) {
        parsedData = JSON.parse(body);

        if (!error && response.statusCode == 200 && parsedData && parsedData.data.images) {
            botResponse = parsedData.data.images.fixed_width.url;
            //downsized = parseFloat(parsedData.data.images.downsized.size).toLocaleString('en');
            specificLog = ('Fixed Size: ' + parseFloat(parsedData.data.images.fixed_width.size).toLocaleString('en') + ' Rating: ' + parsedData.data.rating + ' Giphy Status: ' + response.statusCode);
            postMessage(botResponse, message.group_id);
        }
    });
}


// Stock quote
function stockTag(message) {
    request('https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=' + trim(message.text) + '&outputsize=compact&apikey=' + alphaVantageAPIKey, function (error, response, body) {
        quoteObj = JSON.parse(body);
        if (!error && quoteObj && Number(quoteObj['Global Quote']['05. price']) == Number(quoteObj['Global Quote']['05. price'])) {
            open = Number(quoteObj['Global Quote']['02. open']);
            price = Number(quoteObj['Global Quote']['05. price']);
            lastRefreshed = quoteObj['Global Quote']['07. latest trading day'];
            change = quoteObj['Global Quote']['10. change percent'].slice(0,-3);
            change = Number(change);
            if (quoteObj['Global Quote']['10. change percent'].substring(0,1) == '-') {
                //change = change;
            } else {
                change = '+' + change;
            }

            botResponse = ('$' + price + '\n' + change + 'pct\n' + 'https://finance.yahoo.com/quote/' + trim(message.text));
            specificLog = (trim(message.text) + ' ' + price + ' ' + change + ' alphavantage status: ' + response.statusCode);
            postMessage(botResponse, message.group_id);
        } else {
            console.log(message.group_id + ' - ' + message.text + ' is invalid');
        }
    });
}

// Was the bot tagged with an MLB team?
function mlbTag(message) {
    messageTrimmed = trim(message.text).toUpperCase();
    request('https://braves-groupme.appspot.com/CHECK?groupName=' + message.group_id + '&teamKey=' + messageTrimmed, function (error, response, body) {
        console.log(response.statusCode);
        if (response.statusCode == 500) {
            botTagResponse = 'https://braves-groupme.appspot.com/';
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
            //'token' : groupMeAppToken,
            'bot_id': instance.id,
            'text': text
        };

        botReq = https.request(options, function(res) {
            if(res.statusCode == 202) {
                console.log(groupID.padEnd(15,', POSTED -') + 'POSTED: ' + text);
            } else {
                console.log('Error posting to: ' + groupID + ' - LOG - Bad status code: ' + res.statusCode + ' message: ' + text + ' bot_id: ' + instance.id);
            }
        });
        botReq.end(JSON.stringify(options));
    });
}

exports.respond = respond;
