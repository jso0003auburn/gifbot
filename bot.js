var request = require('request');
var https = require('https');

//  https://dev.groupme.com/bots
// https://dashboard.heroku.com/apps/groupme-gif-bot/settings
// required variable is gifbot
var botName = process.env.botName;
var alphaVantageAPIKey = process.env.alphaVantageAPIKey;

// - processes incoming groupme posts
function respond() {
  var post = JSON.parse(this.req.chunks[0]);
  this.res.writeHead(200);
  botId = '1';
  groupName = '1';
  postLog = '1';
  logType = '1';
  sendingGroup = post.group_id;
  sendingUser = post.name;
  message = post.text;
  messageTrimmed = message.substring(1).trim();

  //From the main group?    
  if (sendingGroup == process.env.mainGroupId) {
    botId = process.env.mainBotId;
    groupName = process.env.mainGroupName;
    rating = process.env.mainRating;
  }
  
  //from the Test group? (Olson Test)
  if (sendingGroup == process.env.testGroupId) {
    botId = process.env.testBotId;
    groupName = process.env.testGroupName;
    rating = process.env.testRating;
  }

  //from the 2 group WOLFPACK?
  if (sendingGroup == process.env.group2Id) {
    botId = process.env.group2BotId;
    groupName = process.env.group2Name;
    rating = process.env.group2Rating;
  }

  //from the 3 group OLSON FAMILY?
  if (sendingGroup == process.env.group3Id) {
    botId = process.env.group3BotId;
    groupName = process.env.group3Name;
    rating = process.env.group3Rating;
  }

  //from an unrecognized group?
  if (botId == '1') {
    console.log(message + ' sent without a valid group id: ' + sendingGroup);
  }

  logMessages();

  //Was the bot tagged?
  if (message.indexOf('@' + botName) >= 0 && botId !== '1') {
    logType = 'botTag';
    botResponse = 'try #lol for a gif\ntry $bac for a stock price';
    //specificLog = 'gifbot tag' + message;
    postMessage(botResponse, botId);
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

function logMessages(res) {
  if (logType == 'botTag') {
    specificLog = 'gifbot tag' + message;
  }
  if (logType == 'gifTagTooLong') {
    specificLog = ('too long: ' + messageTrimmed + ' space count ' + spaceCount + ' message length: ' + messageTrimmed.length + ' ' + parsedData.data.images.fixed_width.url);
  }
  if (logType == 'gifTag') {
    specificLog = ('FIXED: ' + fixedWidth + ' DOWNSIZED : ' + downsized + ' RATING: ' + parsedData.data.rating);
  }
  if (sendingUser !== botName && postLog == '1') {
    console.log(sendingUser.substring(0,10).padEnd(11) + 'SENT: ' + message.substring(0,50).padEnd(53," . ") + ' IN: ' + groupName + ' via LM');
  }
  if (sendingUser == botName && postLog == '1') {
    console.log(sendingUser.substring(0,10).padEnd(11) + 'SENT: ' + 'something'.padEnd(53," . ") + ' IN: ' + groupName + ' via LM');
  }
  if (postLog == '202') {
    console.log(botName.substring(0,10).padEnd(11) + 'POSTED: ' + specificLog.substring(0,48).padEnd(51," . ") + ' IN: ' + groupName + ' - STATUS: ' + res.statusCode + ' via LM')
  }
  if (postLog == 'fail') {
    console.log('Error posting to: ' + groupName + ' - LOG - Bad status code: ' + res.statusCode + ' messageTrimmed: ' + messageTrimmed);
  }
}

//posts message
function gifTag(botId) {
  request('https://api.giphy.com/v1/gifs/translate?s=' + messageTrimmed + '&api_key=dc6zaTOxFJmzC&rating=' + rating, function (error, response, body) {
  parsedData = JSON.parse(body);
  fixedWidth = parseFloat(parsedData.data.images.fixed_width.size).toLocaleString('en');
  downsized = parseFloat(parsedData.data.images.downsized.size).toLocaleString('en');


  //did they use spaces?
  spaceCount = (message.split(" ").length - 1);
  if (spaceCount < 1 && messageTrimmed.length > 10) {
    botResponse = 'use spaces like this:\n# happy birthday';
    logType = 'gifTagTooLong';
    //specificLog = ('too long: ' + messageTrimmed + ' space count ' + spaceCount + ' message length: ' + messageTrimmed.length + ' ' + parsedData.data.images.fixed_width.url);
    postMessage(botResponse, botId);
    response.statusCode = '1';
  }

  if (!error && response.statusCode == 200 && parsedData && parsedData.data.images) {
    botResponse = parsedData.data.images.fixed_width.url;
    logType = 'gifTag';
    //specificLog = ('FIXED: ' + fixedWidth + ' DOWNSIZED : ' + downsized + ' RATING: ' + parsedData.data.rating);
    postMessage(botResponse, botId);
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

    botResponse = ('$' + price + '\n' + change + 'pct\n' + 'https://finance.yahoo.com/quote/' + messageTrimmed);
    specificLog = (messageTrimmed + ' ' + price + ' ' + change);
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
        postLog = '202';
        logMessages(res);
        //console.log(botName.substring(0,10).padEnd(11) + 'POSTED: ' + specificLog.substring(0,48).padEnd(51," . ") + ' IN: ' + groupName + ' - STATUS: ' + res.statusCode);
      } else {
      postLog = 'fail';
      logMessages(res);
      //console.log('Error posting to: ' + groupName + ' - LOG - Bad status code: ' + res.statusCode + ' messageTrimmed: ' + messageTrimmed);
      }
  });
  botReq.end(JSON.stringify(options));
}

exports.respond = respond;
