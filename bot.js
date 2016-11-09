var request = require('request');
var https = require('https');

var botIdProd= process.env.botIdProd;
var groupIdProd = process.env.groupIdProd;
var groupEnvProd = 'PROD';
var botIdTest = process.env.botIdTest;
var groupIdTest = process.env.groupIdTest;
var groupEnvTest = 'TEST';
var botName = process.env.botName;

//scan messages
function respond() {
  this.res.writeHead(200);
  var request = JSON.parse(this.req.chunks[0]);
  
  sender = request.name;
  message = request.text;

  trigger = message.substring(0,1);
  searchTerm = message.substring(1).trim();

  senderGroupId = request.group_id;
  botNameTagCheck = message.indexOf('@' + botName);
  
  this.res.end();
  if (senderGroupId == groupIdProd) {
    botId = botIdProd;
    groupEnv = groupEnvProd;
  } else if (senderGroupId == groupIdTest) {
  botId = botIdTest;
  groupEnv = groupEnvTest;
  }
  console.log(groupEnv + ' : ' + sender + ' : ' + message);
  checkMessage(trigger, botNameTagCheck, searchTerm, botId);
}

function checkMessage() {
  //HELP ?
  if (trigger == '?' || botNameTagCheck >= 0 || trigger == '/') {
    searchTerm = '?';
    requestHelp(searchTerm, botId);
  }

  //GIF #
  if (trigger == '#') {
	request('https://api.giphy.com/v1/gifs/translate?s=' + searchTerm + '&api_key=dc6zaTOxFJmzC&rating=r', function (error, response, body) {
	parsedData = JSON.parse(body);
	if (!error && response.statusCode == 200 && parsedData && parsedData.data.images) {
	postMessage(parsedData.data.images.downsized.url, botId);
	} else {
	requestHelp(searchTerm);
	}
	});
  }

  //STOCK TICKER $
  if (trigger == '$') {
	  request('https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22' + searchTerm + '%22)%0A%09%09&env=http%3A%2F%2Fdatatables.org%2Falltables.env&format=json', function (error, response, body) {
	  parsedData = JSON.parse(body);   
	  last = parseFloat(parsedData.query.results.quote.LastTradePriceOnly);
	  last = Number((last).toFixed(2));   
	  change = parseFloat(parsedData.query.results.quote.ChangeinPercent);
	  change = Number((change).toFixed(2));
	  name = String(parsedData.query.results.quote.Name);
	  if (change > 0) {
		change = String('+' + change);
	  }
	  if (!error && response.statusCode == 200 && name !== 'null' && name !== 'undefined') {
		postMessage(name.substring(0,23) + '\n$' + last + ' | ' + change + 'pct\n' + 'www.finance.yahoo.com/quote/' + searchTerm, botId);
	  } else {
	  requestHelp(searchTerm);
	  } 
	  }); 
  }

  //WEATHER !
  if (trigger == '!') {
    request('https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22' + searchTerm + '%22)&format=json', function (error, response, body) {
    parsedData = JSON.parse(body);
    if (!error && response.statusCode == 200 && parsedData.query.results != null) {
      city = parsedData.query.results.channel.location.city;
	  region = (parsedData.query.results.channel.title).substring(17,40);
	  temp = parsedData.query.results.channel.item.condition.temp + '°';
	  high = parsedData.query.results.channel.item.forecast[0].high + '°';
	  low = parsedData.query.results.channel.item.forecast[0].low + '°';
	  forecast = parsedData.query.results.channel.item.forecast[0].text;
      postMessage(temp + ' in ' + region + '\nToday: ' + low + ' - ' + high + '\nForecast: ' + forecast, botId);
    } else {
    requestHelp(searchTerm);
    }  
    }); 
  }

}

//? for help
function requestHelp() {
  if (searchTerm == '?') {
    postMessage('Need help?\nStocks = $ + (ticker symbol)\nWeather = ! + (city or zip)\nGIFS = # + (search keyword)\nTag me to see this again', botId);
  } else {
  postMessage('"' + searchTerm + '" is invalid\nNeed help?\nStocks = $ + (ticker symbol)\nWeather = ! + (city or zip)\nGIFS = # + (search keyword)\nTag me to see this again', botId);
  }
}

//Post message
function postMessage(botResponse, botId) {
  var options, body, botReq;
  options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

  body = {
    "bot_id" : botId,
    "text" : botResponse 
  };

  botReq = https.request(options, function(res) {
      if(res.statusCode == 202) {
        //cool
      } else {
      console.log('Bad status code ' + res.statusCode);
      }
  });
  botReq.on('error', function(err) {
    console.log('error posting message '  + JSON.stringify(err));
  });
  botReq.on('timeout', function(err) {
    console.log('timeout posting message '  + JSON.stringify(err));
  });
  botReq.end(JSON.stringify(body));
}

exports.respond = respond;