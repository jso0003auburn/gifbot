var request = require('request');
var https = require('https');
var botTag = require('./botTag');
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

  //GIF #
  if (message.substring(0,1) == '#') {
    botTag.gifTag(sendingGroup);
  }

  //STOCK TICKER $
  if (message.substring(0,1) == '$') {
    botTag.stockTag(sendingGroup);
  }  
  
  this.res.end();
}


exports.respond = respond;
