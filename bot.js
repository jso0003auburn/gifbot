var request = require('request');
var https = require('https');
var botTag = require('./botTag');
var botName = process.env.botName;
var groupIdMain = process.env.groupId;
var groupIdAlt = process.env.groupIdAlt;
var botIdMain = process.env.botId;
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
  
  //not from the main group?
  if (sendingGroup == groupIdAlt) {
    botId = botIdAlt;
  }
  
  if(botId == '1') {
    process.exit(1);
  }
  
  //Was the bot tagged?
  if (message.indexOf('@' + botName) >= 0) {
    botTag.botTag(botId);
  }

  //GIF #
  if (message.substring(0,1) == '#') {
    botTag.gifTag(botId);
  }

  //STOCK TICKER $
  if (message.substring(0,1) == '$') {
    botTag.stockTag(botId);
  }  
  
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
