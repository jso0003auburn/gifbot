var request = require('request');
var https = require('https');

//  https://dev.groupme.com/bots
// https://dashboard.heroku.com/apps/groupme-gif-bot/settings
// required variable
var botName = process.env.botName;
	
// - MNBC
var groupIdMain = process.env.groupIdMain;
var botIdMain = process.env.botIdMain;

// - Olson Test
var groupIdAlt = process.env.groupIdAlt;
var botIdAlt = process.env.botIdAlt;

// - Wolfpack
var groupId2 = process.env.groupId2;
var botId2 = process.env.botId2;

// - Olson Family
var groupId3 = process.env.groupId3;
var botId3 = process.env.botId3;

// - processes incoming groupme posts
function respond() {
  var post = JSON.parse(this.req.chunks[0]);
  this.res.writeHead(200);
  botId = '1';
  groupName = '1';
  sendingGroup = post.group_id;
  sendingUser = post.name;
  message = post.text;
  //console.log(sendingUser + ' : ' + message);

  //From the main group?    
  if (sendingGroup == groupIdMain) {
    botId = botIdMain;
    groupName = 'MNBC       ';
    rating = 'r'
  }
  
  //from the alt group?
  if (sendingGroup == groupIdAlt) {
    botId = botIdAlt;
    groupName = 'Olson Test ';
    rating = 'g';
  }

  //from the 2 group WOLFPACK?
  if (sendingGroup == groupId2) {
    botId = botId2;
    groupName = 'Wolfpack   ';
    rating = 'r';
  }

  //from the 3 group OLSON FAMILY?
  if (sendingGroup == groupId3) {
    botId = botId3;
    groupName = 'Olson Family ';
    rating = 'pg';
  }

  //from an unrecognized group?
  if (botId == '1') {
    groupName = 'Invalid Group';
    console.log(message + ' sent without a valid group id from: ' + sendingGroup + groupName);
  }

  console.log(groupName + ' - ' + sendingUser + ' - ' + message);

  //Was the bot tagged?
  if (message.indexOf('@' + botName) >= 0 && botId !== '1') {
    botTag(botId);
  }

  //GIF #
  if (message.substring(0,1) == '#' && botId !== '1') {
    gifTag(botId);
  }
  //Stock $
  if (message.substring(0,1) == '$' && botId !== '1' && post.name !== 'gifbot') {
    stockTag(botId);
  }
}


//if @gifbot was tagged this will post a help message
function botTag(botId) {
  log = '1';
  botResponse = 'try #lol for a gif\ntry $bac for a stock price';
  postMessage(botResponse, botId);
}

//posts message
function gifTag(botId) {
  request('https://api.giphy.com/v1/gifs/translate?s=' + message.substring(1).trim() + '&api_key=dc6zaTOxFJmzC&rating=' + rating, function (error, response, body) {
  parsedData = JSON.parse(body);
  downsized = parsedData.data.images.downsized.size;
  fixedWidth = parsedData.data.images.fixed_width.size;
  
  if (!error && response.statusCode == 200 && parsedData && parsedData.data.images) {
    //console.log('downsized: ' + parsedData.data.images.downsized.size + ' / fixed: ' + parsedData.data.images.fixed_width.size);
    botResponse = parsedData.data.images.fixed_width.url;
    log = groupName + ' - FIXED - ' + fixedWidth + ' - DOWNSIZED - ' + downsized ;
    postMessage(botResponse, botId);
  } else {
  console.log(groupName + ' - ' + message + ' is invalid');
  }
  });
}


function stockTag(botId) {
  request('https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=' + message.substring(1).trim() + '&outputsize=compact&apikey=528P3B6Q2EW4I7B3', function (error, response, body) {
  quoteObj = JSON.parse(body);
  if (!error && quoteObj && Number(quoteObj['Global Quote']['05. price']) == Number(quoteObj['Global Quote']['05. price'])) {


    open = Number(quoteObj['Global Quote']['02. open']);
    price = Number(quoteObj['Global Quote']['05. price']);
    lastRefreshed = quoteObj['Global Quote']['07. latest trading day'];
    change = quoteObj['Global Quote']['10. change percent'].slice(0,-3);
    change = Number(change);
    if (quoteObj['Global Quote']['10. change percent'].substring(0,1) == '-') {
     //change = change;
    } else {
    change = '+' + change;
    }
    response = '$' + price + '\n' + change + 'pct\n' + 'https://finance.yahoo.com/quote/' + message.substring(1);
    botResponse = (response);
    log = message.substring(1);
    postMessage(botResponse, botId);
  } else {
  console.log(groupName + ' - ' + message + ' is invalid');
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
        console.log(groupName + ' - LOG - ' + log + ' - ' + res.statusCode);
      } else {
      console.log(groupName + ' - LOG - Bad status code: ' + res.statusCode);
      }
  });
  botReq.end(JSON.stringify(options));
}

exports.respond = respond;
