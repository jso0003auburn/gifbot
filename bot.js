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
        // Was EOR tagged
        if (message.text.toLowerCase().indexOf('riches') >= 0 || message.text.toLowerCase().indexOf('eor') >= 0) {
            customTag(message);
        } else {    
            gifTag(message);
        }
    }
}


// EOR
function customTag(message) {
    myArray = [
        'https://images-na.ssl-images-amazon.com/images/I/61QLymbWvCL._SX364_BO1,204,203,200_.jpg', 
        'https://media.tenor.com/images/bc962c5ecaf73c213cafc1ec56b86ebb/tenor.gif',
        'https://media2.giphy.com/media/YZGJc1WmUZPi0/200.gif',
        'https://i.gifer.com/KhZT.gif',
        'https://media1.tenor.com/images/e31ac0918c235d2618bdfea962e33167/tenor.gif?itemid=5178207',
        'https://i.pinimg.com/originals/f6/ff/d5/f6ffd5fb41b2d43bd7ca7e499d8c1695.gif'
        ];
    botResponse = myArray[Math.floor(Math.random()*myArray.length)]; 
    postMessage(botResponse, message.group_id);
}

// If the bot was tagged
function botTag(message) {
    botResponse = 'try one of these:\n#auburn basketball\n#lol\n#godzilla\nhttps://mebotsco.herokuapp.com/bot/gifbot';
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
