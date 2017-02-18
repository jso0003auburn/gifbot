var request = require('request');
var https = require('https');
var post = require('./post');


//posts message
function botTag(botId) {
  botResponse = 'GIFS = # + (search keyword)\nStocks = $ + (ticker symbol)';
  post.postMessage(botResponse, botId);
}

exports.botTag = botTag;
