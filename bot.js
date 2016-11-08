var request = require('request');
var https = require('https');

var botIdProd = process.env.botIdProd;
var botIdTest = process.env.botIdTest;
var groupIdProd = process.env.groupIdProd;
var groupIdTest = process.env.groupIdTest;

//git push -f heroku
//scan messages
function respond() {
  this.res.writeHead(200);
  var request = JSON.parse(this.req.chunks[0]);
  this.res.end();

  trigger = request.text.substring(0,1);
  searchTerm = request.text.substring(1).trim();
  groupId = request.group_id;
  message = request.text;
  sender = request.name;
  gifbotCheck = request.text.indexOf('@gifbot');
  botID = botIdTest;
  console.log(sender + ': ' + message);

  //@gifbot?
  if (gifbotCheck >= 0) {
    requestHelp();
  }

  //Group check
  if (groupId == groupIdProd) {
    botID = botIdProd;
  }

  //HELP ?
  if (trigger == '?') {
    this.res.writeHead(200);
    requestHelp();
    this.res.end();
  }
  //GIF #
  if (trigger == '#') {
    this.res.writeHead(200);
    requestGif(searchTerm);
    this.res.end();
  }
  //STOCK TICKER $
  if (trigger == '$') {
    this.res.writeHead(200);
    requestTicker(searchTerm);
    this.res.end();
  }
  //WEATHER !
  if (trigger == '!') {
    this.res.writeHead(200);
    requestWeather(searchTerm);
    this.res.end();
  }
}

//? for help
function requestHelp() {
  postMessage('Here are some tips:\nStocks = $ + (ticker symbol)\nWeather = ! + (city or zip)\nGIFS = # + (search keyword)', botID);
}

//# + search term // to post a gif
function requestGif() {
  request('https://api.giphy.com/v1/gifs/translate?s=' + searchTerm + '&api_key=dc6zaTOxFJmzC&rating=r', function (error, response, body) {
  parsedData = JSON.parse(body);
  if (!error && response.statusCode == 200 && parsedData && parsedData.data.images) {
    postMessage(parsedData.data.images.downsized.url, botID);
  } else {
  postMessage('No gifs for: ' + searchTerm + '\nType ? for help', botID, searchTerm);
  }
  });
}

//$ + stock ticker // for current price, day change, and a link to the chart
function requestTicker() {
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
    postMessage(name.substring(0,23) + '\n$' + last + ' | ' + change + 'pct\n' + 'www.finance.yahoo.com/quote/' + searchTerm, botID);
  } else {
  postMessage('"'  + searchTerm + '"' + ' is an invalid ticker.\nType ? for help', botID);
  } 
  }); 
}

//! + zip code OR city // for current temp, high low temps, and forecast
function requestWeather() {
  request('https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22' + searchTerm + '%22)&format=json', function (error, response, body) {
  parsedData = JSON.parse(body);
  city = parsedData.query.results.channel.location.city;
  region = (parsedData.query.results.channel.title).substring(17,40);
  temp = parsedData.query.results.channel.item.condition.temp + '°';
  high = parsedData.query.results.channel.item.forecast[0].high + '°';
  low = parsedData.query.results.channel.item.forecast[0].low + '°';
  forecast = parsedData.query.results.channel.item.forecast[0].text;
  if (!error && response.statusCode == 200 && parsedData.query.results != null) {
    postMessage(temp + ' in ' + region + '\nToday: ' + low + ' - ' + high + '\nForecast: ' + forecast, botID);
  } 
  }); 
}

//Post message
function postMessage(botResponse, botID) {
  var options, body, botReq;
  options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

  body = {
    "bot_id" : botID,
    "text" : botResponse 
  };

  botReq = https.request(options, function(res) {
      if(res.statusCode == 202) {
        //console.log('Success');
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