var request = require('request');
var https = require('https');
var groupId = process.env.groupId;
var botName = process.env.botName;
var botId = process.env.botId;
var botIdAlt = process.env.botIdAlt;
var botResponseTag = 'GIFS = # + (search keyword)\nStocks = $ + (ticker symbol)';
var post = require('./post');


//posts message
function botTag() {
  botResponse = botResponseTag;
  post.postMessage(botResponse);
}

exports.botTag = botTag;
