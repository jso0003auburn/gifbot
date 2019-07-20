var request = require('request');
var https = require('https');

// https://dev.groupme.com/bots
// https://dashboard.heroku.com/apps/groupme-gif-bot/settings
var botName = process.env.botName;
var alphaVantageAPIKey = process.env.alphaVantageAPIKey;
var groupMeAppToken = process.env.groupMeAppToken;
var botId = '1';

// - processes incoming groupme posts
function respond() {
  var post = JSON.parse(this.req.chunks[0]);
  this.res.writeHead(200);

  sendingGroup = post.group_id;
  sendingUser = post.name;
  message = post.text;
  messageTrimmed = message.substring(1).trim();

  //From the main group?
  mainGroupId = process.env.mainGroupId;
  if (sendingGroup == mainGroupId) {
    botId = process.env.mainBotId;
    groupName = process.env.mainGroupName;
    rating = process.env.mainRating;
  }



  //from the Test group? (Olson Test)
  testGroupId = process.env.testGroupId;
  if (sendingGroup == testGroupId) {
    botId = process.env.testBotId;
    groupName = process.env.testGroupName;
    rating = process.env.testRating;
  }



  //from the 2 group WOLFPACK?
  group2Id = process.env.group2Id;
  if (sendingGroup == group2Id) {
    botId = process.env.group2BotId;
    groupName = process.env.group2Name;
    rating = process.env.group2Rating;
  }



  //from the 3 group OLSON FAMILY?
  group3Id = process.env.group3Id;
  if (sendingGroup == group3Id) {
    botId = process.env.group3BotId;
    groupName = process.env.group3Name;
    rating = process.env.group3Rating;
  }



  // LOGGING
  //from an unrecognized group?
  if (botId == '1') {
    console.log(message + ' sent without a valid group id: ' + sendingGroup);
    return;
  }

  //sent from the bot?
  if (sendingUser == botName) {
    console.log(groupName.padEnd(15," -") + sendingUser.substring(0,10).padEnd(15," -") + 'SENT: something');
    return;
  }

  //sent from not the bot
  if (sendingUser !== botName) {
    //console.log(sendingUser.substring(0,10).padEnd(11) + 'SENT: ' + message.substring(0,50).padEnd(53," . ") + ' IN: ' + groupName);
    console.log(groupName.padEnd(15," -") + sendingUser.substring(0,10).padEnd(15," -") + 'SENT: ' + message);
    tagCheck(botId);
  }


}




function tagCheck(botId) {


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
}




//was the bot tagged
function botTag(botId) {

    request('https://braves-groupme.appspot.com/CHECK?environment=test&groupName=' + groupName, function (error, response, body) {
    console.log(response.statusCode);
    if (response.statusCode == 201) {
        botTagResponse = 'try #auburn basketball for a gif\ntry $bac for a stock price';
        botTagResponseLog = 'I was tagged by: ' + sendingUser;
        botResponse = botTagResponse;
        specificLog = botTagResponseLog;
        postMessage(botResponse, botId);
    }      
    });
}

//posts message
function gifTag(botId) {
  request('https://api.giphy.com/v1/gifs/translate?s=' + messageTrimmed + '&api_key=nUPvLMDC26cn0c4heIYSx6bW8pZY9Gmh&rating=' + rating, function (error, response, body) {
  parsedData = JSON.parse(body);
  //did they use spaces?
  spaceCount = (message.split(" ").length - 1);
  if (spaceCount < 1 && messageTrimmed.length > 12) {
    console.log('too long - space count ' + spaceCount + ' message length: ' + messageTrimmed.length + ' status: ' + response.statusCode);
  }



  if (!error && response.statusCode == 200 && parsedData && parsedData.data.images) {
    botResponse = parsedData.data.images.fixed_width.url;
    //downsized = parseFloat(parsedData.data.images.downsized.size).toLocaleString('en');
    specificLog = ('Fixed Size: ' + parseFloat(parsedData.data.images.fixed_width.size).toLocaleString('en') + ' Rating: ' + parsedData.data.rating + ' Giphy Status: ' + response.statusCode);
    postMessage(botResponse, botId);
  }
  });
}


//stock quote
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
    specificLog = (messageTrimmed + ' ' + price + ' ' + change + ' alphavantage status: ' + response.statusCode);
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
    "token" : groupMeAppToken,
    "bot_id" : botId,
    "text" : botResponse 
  };

  botReq = https.request(options, function(res) {
      if(res.statusCode == 202) {
        console.log(groupName.padEnd(15," -") + botName.substring(0,10).padEnd(15," -") + 'POSTED: ' + specificLog.substring(0,48) + ' GroupMe Status: ' + res.statusCode);
        //console.log(botName.substring(0,10).padEnd(11) + 'POSTED: ' + specificLog.substring(0,48).padEnd(51," . ") + ' IN: ' + groupName + ' - STATUS: ' + res.statusCode);
      } else {
      console.log('Error posting to: ' + groupName + ' - LOG - Bad status code: ' + res.statusCode + ' messageTrimmed: ' + messageTrimmed);
      }
  });
  botReq.end(JSON.stringify(options));
}

exports.respond = respond;
