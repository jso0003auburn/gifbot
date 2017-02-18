var request = require('request');
var https = require('https');
var botResponseTag = 'GIFS = # + (search keyword)\nStocks = $ + (ticker symbol)';
var post = require('./post');


//posts message
function botTag() {
  botResponse = botResponseTag;
  post.postMessage(botResponse, botId);
}

exports.botTag = botTag;
