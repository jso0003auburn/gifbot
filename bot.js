var request = require('request');
var https = require('https');

//  https://dev.groupme.com/bots
// https://dashboard.heroku.com/apps/groupme-gif-bot/settings
// required variable is gifbot
var botName = process.env.botName;
var alphaVantageAPIKey = process.env.alphaVantageAPIKey;

// - MNBC
var mainGroupId = process.env.mainGroupId;
var mainGroupName = process.env.mainGroupName;
var mainBotId = process.env.mainBotId;
var mainRating = process.env.mainRating;

// - Wolfpack
var groupId2 = process.env.groupId2;
var groupName2 = process.env.groupName2;
var botId2 = process.env.botId2;
var rating2 = process.env.rating2;

// - Olson Family
var groupId3 = process.env.groupId3;
var groupName3 = process.env.groupName3;
var botId3 = process.env.botId3;
var rating3 = process.env.rating3;

// - processes incoming groupme posts
function respond() {
  var post = JSON.parse(this.req.chunks[0]);
  this.res.writeHead(200);
  botId = '1';
  groupName = '1';
  sendingGroup = post.group_id;
  sendingUser = post.name;
  message = post.text;
  messageTrimmed = message.substring(1).trim();
  spaceCount = (messageTrimmed.split(" ").length - 1);

  //From the main group?    
  if (sendingGroup == mainGroupId) {
    botId = mainBotId;
    groupName = mainGroupName;
    rating = mainRating;
  }
  
  //from the Test group? (Olson Test)
  if (sendingGroup == process.env.testGroupId) {
    botId = process.env.testBotId;
    groupName = process.env.testGroupName;
    rating = process.env.testRating;
  }

  //from the 2 group WOLFPACK?
  if (sendingGroup == groupId2) {
    botId = botId2;
    groupName = groupName2;
    rating = rating2;
  }

  //from the 3 group OLSON FAMILY?
  if (sendingGroup == groupId3) {
    botId = botId3;
    groupName = groupName3;
    rating = rating3;
  }

  //from an unrecognized group?
  if (botId == '1') {
    groupName = 'Invalid Group';
    console.log(message + ' sent without a valid group id from: ' + sendingGroup + groupName);
  }

  console.log('SENT to: ' + groupName + ' by ' + sendingUser + ': ' + message);

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
  log = 'gifbot tag' + message;
  botResponse = 'try #lol for a gif\ntry $bac for a stock price';
  postMessage(botResponse, botId, log);
}

//posts message
function gifTag(botId) {
  request('https://api.giphy.com/v1/gifs/translate?s=' + messageTrimmed + '&api_key=dc6zaTOxFJmzC&rating=' + rating, function (error, response, body) {
  parsedData = JSON.parse(body);
  downsized = parsedData.data.images.downsized.size;
  fixedWidth = parsedData.data.images.fixed_width.size;
  //did they use spaces?
  if (spaceCount < 1 && messageTrimmed.length > 8) {
    log = ('too long: ' + messageTrimmed + ' space count ' + spaceCount + ' message length: ' + messageTrimmed.length);
    botResponse = 'dont type:\n' + message + '\nuse spaces like this:\n#happy birthday';
    postMessage(botResponse, botId, log);
    response.statusCode = '1';
  }
  if (!error && response.statusCode == 200 && parsedData && parsedData.data.images) {
    botResponse = parsedData.data.images.fixed_width.url;
    log = ('GIPHY FIXED: ' + fixedWidth + ' DOWNSIZED : ' + downsized + ' RATING: ' + parsedData.data.rating);
    postMessage(botResponse, botId, log);
  } else {
  console.log(groupName + ' - ' + message + ' is invalid - response:' + response.statusCode);
  }
  });
}


function stockTag(botId) {
  request('https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=' + messageTrimmed + '&outputsize=compact&apikey=' + alphaVantageAPIKey, function (error, response, body) {
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
    postMessage(botResponse, botId);
  } else {
  console.log(groupName + ' - ' + message + ' is invalid');
  }
  });
}

//posts message
function postMessage(botResponse, botId, log) {
  
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
        console.log('POSTED to ' + groupName + ' - LOG - ' + messageTrimmed + ' - ' + res.statusCode);
        console.log(log);
      } else {
      console.log('Error posting to: ' + groupName + ' - LOG - Bad status code: ' + res.statusCode + ' messageTrimmed: ' + messageTrimmed);
      }
  });
  botReq.end(JSON.stringify(options));
}

exports.respond = respond;
