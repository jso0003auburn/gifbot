var request = require('request');
var https = require('https');
var gifbotTag = '@';
var gifPostTag = '#';
var stockPostTag = '$';
var botTag = require('./botTag');
var gifTag = require('./gifTag');
var stockTag = require('./stockTag');
var groupId = process.env.groupId;
var botName = process.env.botName;
var botIdMain = process.env.botId;
var botIdAlt = process.env.botIdAlt;


//processes incoming groupme posts
function respond() {
  var post = JSON.parse(this.req.chunks[0]);
  this.res.writeHead(200);
  
  sendingGroup = post.group_id;
  sendingUser = post.name;
  message = post.text;
  console.log(message + ' : ' + sendingUser);
  
  //From the main group?
  if (sendingGroup == groupId) {
    botId = botIdMain;
  }
  
  //not from the main group?
  if (sendingGroup !== groupId) {
    botId = botIdAlt;
  }
  
  //Was @gifbot tagged?
  if (message.indexOf(gifbotTag + botName) >= 0) {
    botTag.botTag(botId);
  }

  //GIF #
  if (message.substring(0,1) == gifPostTag) {
    gifTag.gifTag(botId);
  }

  //STOCK TICKER $
  if (message.substring(0,1) == stockPostTag) {
    stockTag.stockTag(botId);
  }  
  
  this.res.end();
}


exports.respond = respond;
