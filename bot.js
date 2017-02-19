var request = require('request');
var https = require('https');
var botTag = require('./botTag');
var gifTag = require('./gifTag');
var stockTag = require('./stockTag');
var botName = process.env.botName;



//processes incoming groupme posts
function respond() {
  var post = JSON.parse(this.req.chunks[0]);
  this.res.writeHead(200);
  
  sendingGroup = post.group_id;
  sendingUser = post.name;
  message = post.text;
  console.log(sendingUser + ' : ' + message);
 
  //Was the bot tagged?
  if (message.indexOf('@' + botName) >= 0) {
    botTag.botTag(sendingGroup);
  }
  
  //Was the bot mentioned?
  if (message.indexOf('xyz') >= 0) {
    botTag.botMention(sendingGroup);
  }

  //GIF #
  if (message.substring(0,1) == '#') {
    botTag.gifTag(sendingGroup);
  }

  //STOCK TICKER $
  if (message.substring(0,1) == '$') {
    stockTag.stockTag(sendingGroup);
  }  
  
  this.res.end();
}


exports.respond = respond;
