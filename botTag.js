var request = require('request');
var https = require('https');
var post = require('./post');


//posts message
function botTag(sendingGroup) {
  botResponse = 'GIFS = # + (search keyword)\nStocks = $ + (ticker symbol)';
  post.postMessage(botResponse, sendingGroup);
}
//posts message
function botMention(sendingGroup) {
  botResponse = 'mention = # + (search keyword)\nStocks = $ + (ticker symbol)';
  post.postMessage(botResponse, sendingGroup);
}

//posts message
function gifTag(sendingGroup) {
  request('https://api.giphy.com/v1/gifs/translate?s=' + message.substring(1).trim() + '&api_key=dc6zaTOxFJmzC&rating=r', function (error, response, body) {
  parsedData = JSON.parse(body);
  
  if (!error && response.statusCode == 200 && parsedData && parsedData.data.images) {
	botResponse = parsedData.data.images.downsized.url;
	post.postMessage(botResponse, sendingGroup);
  } else {
  console.log(message + ' is invalid');
  }
  });
}

exports.gifTag = gifTag;
exports.botTag = botTag;
exports.botMention = botMention;
