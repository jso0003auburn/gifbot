var request = require('request');
var https = require('https');

//scan messages
function respond() {
  var post = JSON.parse(this.req.chunks[0]);

  //check if your posting in your main group
  if (post.group_id == process.env.groupId) {
    this.res.writeHead(200);
    botId = process.env.botId;
    checkMessage(botId, post);
    this.res.end();
  } else if (process.env.botIdAlt !== null) {
  this.res.writeHead(200);
  botId = process.env.botIdAlt;
  checkMessage(botId, post);
  this.res.end();
  }

}

//check for triggers
function checkMessage(botId, post) {
  searchTerm = post.text.substring(1).trim();
  console.log(post.name + ' : ' + post.text);

  //HELP ?
  if (message.indexOf('@' + process.env.botName) >= 0) {
    postMessage('GIFS = # + (search keyword)\nStocks = $ + (ticker symbol)', botId);
  }

  //GIF #
  if (message.substring(0,1) == '#') {
	request('https://api.giphy.com/v1/gifs/translate?s=' + searchTerm + '&api_key=dc6zaTOxFJmzC&rating=r', function (error, response, body) {
	parsedData = JSON.parse(body);
	if (!error && response.statusCode == 200 && parsedData && parsedData.data.images) {
	  postMessage(parsedData.data.images.downsized.url, botId);
	} else {
	postMessage('"' + searchTerm + '" is invalid', botId);
	}
	});
  }

  //STOCK TICKER $
  if (message.substring(0,1) == '$') {
    request('https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22' + searchTerm + '%22)%0A%09%09&env=http%3A%2F%2Fdatatables.org%2Falltables.env&format=json', function (error, response, body) {
    parsedData = JSON.parse(body); 
    if (!error && response.statusCode == 200 && String(parsedData.query.results.quote.Name) !== 'null' && String(parsedData.query.results.quote.Name) !== 'undefined') {
      change = Number((parseFloat(parsedData.query.results.quote.ChangeinPercent)).toFixed(2));
      if (change > 0) {
	    change = String('+' + change);
      }
	  postMessage(String(parsedData.query.results.quote.Name).substring(0,20) + '\n$' +  Number((parseFloat(parsedData.query.results.quote.LastTradePriceOnly)).toFixed(2)) + ' | ' + change + 'pct\n' + 'www.finance.yahoo.com/quote/' + searchTerm, botId);
    } else {
    postMessage('"' + searchTerm + '" is invalid', botId);
    } 
    }); 
  }
}

//Post message
function postMessage(botResponse, botId) {
  var options, botReq;
  options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST',
    "bot_id" : botId,
    "text" : botResponse 
  };

  botReq = https.request(options, function(res) {
      if(res.statusCode == 202) {
        console.log('Post success: ' + res.statusCode);
      } else {
      console.log('Bad status code: ' + res.statusCode);
      }
  });
  botReq.end(JSON.stringify(options));
}

exports.respond = respond;