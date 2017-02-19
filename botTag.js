var request = require('request');
var https = require('https');
var post = require('./post');


//posts message
function botTag(botId) {
  botResponse = 'GIFS = # + (search keyword)\nStocks = $ + (ticker symbol)';
  post.postMessage(botResponse, sendingGroup);
}
//posts message
function botMention(botId) {
  botResponse = 'mention = # + (search keyword)\nStocks = $ + (ticker symbol)';
  post.postMessage(botResponse, sendingGroup);
}
exports.botTag = botTag;
exports.botMention = botMention;
