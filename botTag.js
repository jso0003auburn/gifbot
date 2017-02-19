var request = require('request');
var https = require('https');
var post = require('./post');


//if @gifbot was tagged this will post a help message
function botTag(sendingGroup) {
  botResponse = 'GIFS = # + (search keyword)\nStocks = $ + (ticker symbol)';
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

//posts message
function stockTag(sendingGroup) {
  request('https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22' + message.substring(1).trim() + '%22)&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=', function (error, response, body) {
  parsedData = JSON.parse(body);
  console.log(parsedData.query.results.quote.Name);
  if (!error && response.statusCode == 200) {
	companyName = String(parsedData.query.results.quote.Name);
	lastPrice = Number((parseFloat(parsedData.query.results.quote.LastTradePriceOnly)).toFixed(2));
	change = Number((parseFloat(parsedData.query.results.quote.ChangeinPercent)).toFixed(2));
	if (change > 0) {
	  change = String('+' + change);
	}
	botResponse = (companyName.substring(0,20) + '\n$' + lastPrice + ' | ' + change + 'pct\n' + 'www.finance.yahoo.com/quote/' + message.substring(1).trim());
	post.postMessage(botResponse, sendingGroup);
  } else {
  console.log(message + ' is invalid');
  } 
  }); 
}

exports.stockTag = stockTag;
exports.gifTag = gifTag;
exports.botTag = botTag;
