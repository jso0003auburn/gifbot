var request = require('request');
var https = require('https');
var botName = process.env.botName;
var gifbotTag = '@';
var gifPostTag = '#';
var stockPostTag = '$';
var post = require('./post');
var botTag = require('./botTag');
var gifTag = require('./gifTag');
var stockTag = require('./stockTag');



//processes incoming groupme posts
function respond() {
  var post = JSON.parse(this.req.chunks[0]);
  this.res.writeHead(200);
  sendingGroup = post.group_id;
  sendingUser = post.name;
  message = post.text;
  console.log(message + ' : ' + sendingUser);
  scanMessage();
  this.res.end();
}

//checks posts to see if gifbot should respond
function scanMessage() {
  
  //Was @gifbot tagged?
  if (message.indexOf(gifbotTag + botName) >= 0) {
    botTag.botTag();
  }

  //GIF #
  if (message.substring(0,1) == gifPostTag) {
    gifTag.gifTag();
  }

  //STOCK TICKER $
  if (message.substring(0,1) == stockPostTag) {
    stockTag.stockTag();
  }

}


exports.respond = respond;
