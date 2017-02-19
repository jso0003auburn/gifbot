var request = require('request');
var https = require('https');
var botTag = require('./botTag');
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
  
  //From the main group?
  if (sendingGroup == groupIdMain) {
    botId = botIdMain;
  }
  
  //not from the main group?
  if (sendingGroup == groupIdAlt) {
    botId = botIdAlt;
  }
  
    //not from the main group?
  if (botId == '1') {
    console.log(message + ' sent without a group');
  }

  //Was the bot tagged?
  if (message.indexOf('@' + botName) >= 0 && botId !== '1') {
    botTag.botTag(botId);
  }

  //GIF #
  if (message.substring(0,1) == '#' && botId !== '1') {
    botTag.gifTag(botId);
  }

  //STOCK TICKER $
  if (message.substring(0,1) == '$' && botId !== '1') {
    botTag.stockTag(botId);
  }  
  console.log(sendingUser + ' : ' + message);
  this.res.end();
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
        console.log('Post success: ' + res.statusCode);
      } else {
      console.log('Bad status code: ' + res.statusCode);
      }
  });
  botReq.end(JSON.stringify(options));
}

exports.postMessage = postMessage;
exports.respond = respond;
