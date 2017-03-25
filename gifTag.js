//posts message
function gifTag(botId) {
  request('https://api.giphy.com/v1/gifs/translate?s=' + message.substring(1).trim() + '&api_key=dc6zaTOxFJmzC&rating=r', function (error, response, body) {
  parsedData = JSON.parse(body);
  
  if (!error && response.statusCode == 200 && parsedData && parsedData.data.images) {
	botResponse = parsedData.data.images.downsized.url;
	//console.log('GIF size: ' + parsedData.data.images.downsized.size);
	postMessage(botResponse, botId);
  } else {
  console.log(message + ' is invalid');
  }
  });
}
exports.gifTag = gifTag;
