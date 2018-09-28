var request = require('request');
var https = require('https');
var botName = process.env.botName;
var groupIdMain = process.env.groupIdMain;
var botIdMain = process.env.botIdMain;
var groupIdAlt = process.env.groupIdAlt;
var botIdAlt = process.env.botIdAlt;


//processes incoming groupme posts
function respond() {
  var post = JSON.parse(this.req.chunks[0]);
  this.res.writeHead(200);
  botId = '1';
  sendingGroup = post.group_id;
  sendingUser = post.name;
  message = post.text;
  console.log(sendingUser + ' : ' + message);

  //From the main group?    
  if (sendingGroup == groupIdMain) {
    botId = botIdMain;
  }
  
  //from the alt group?
  if (sendingGroup == groupIdAlt) {
    botId = botIdAlt;
  }
  
  //from an unrecognized group?
  if (botId == '1') {
    console.log(message + ' sent without a valid group id from: ' + sendingGroup);
  }

  //Was the bot tagged?
  if (message.indexOf('@' + botName) >= 0 && botId !== '1') {
    botTag(botId);
  }

  //GIF #
  if (message.substring(0,1) == '#' && botId !== '1') {
    gifTag(botId);
  }
  //Stock $
  if (message.substring(0,1) == '$' && botId !== '1') {
    stockTag(botId);
  }
  //MLB %
  if (message.substring(0,1) == '%' && botId !== '1') {
    mlbTag(botId);
  }
}

//if @gifbot was tagged this will post a help message
function botTag(botId) {
  botResponse = 'https://www.mlb.com/braves/scores';
  postMessage(botResponse, botId);
}

//posts message
function gifTag(botId) {
  request('https://api.giphy.com/v1/gifs/translate?s=' + message.substring(1).trim() + '&api_key=dc6zaTOxFJmzC&rating=r', function (error, response, body) {
  parsedData = JSON.parse(body);
  
  if (!error && response.statusCode == 200 && parsedData && parsedData.data.images) {
    botResponse = parsedData.data.images.downsized.url;
    postMessage(botResponse, botId);
  } else {
  console.log(message + ' is invalid');
  }
  });
}

function stockTag(botId) {
  request('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=' + message.substring(1).trim() + '&outputsize=compact&apikey=528P3B6Q2EW4I7B3', function (error, response, body) {
  parsedData = JSON.parse(body, function (key, value) {
    if (key == "4. close") {
      console.log(value);
      value = value[1];
      console.log(value);
    } else {
      //console.log('error parsing');
    }});
  if (!error && response.statusCode == 200) {
    //botResponse = (companyName.substring(0,20) + '\n$' + lastPrice + ' | ' + change + 'pct\n' + 'www.finance.yahoo.com/quote/' + message.substring(1).trim());
    console.log(message);
    //console.log(String(botResponse));
    //postMessage(botResponse, botId);
  } else {
  console.log(message + ' is invalid');
  } 
  }); 
}
//posts message
function mlbTag(botId) {
  request('https://api.giphy.com/v1/gifs/translate?s=' + message.substring(1).trim() + '&api_key=dc6zaTOxFJmzC&rating=r', function (error, response, body) {
  parsedData = JSON.parse(body);
  
  if (!error && response.statusCode == 200 && parsedData && parsedData.data.images) {
    //botResponse = parsedData.data.images.downsized.url;
    //postMessage(botResponse, botId);
    console.log(message);
    console.log(String(parsedData.data.images.downsized.url));
    console.log('gif size: ' + String(Math.ceil(parsedData.data.images.downsized.size/1000)).replace(/(.)(?=(\d{3})+$)/g,'$1,') + 'kB');
  } else {
  console.log(message + ' is invalid');
  }
  });
}
//posts message
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
        console.log('LOG - SUCCESS: ' + res.statusCode);
      } else {
      console.log('LOG - Bad status code: ' + res.statusCode);
      }
  });
  botReq.end(JSON.stringify(options));
}

exports.respond = respond;
