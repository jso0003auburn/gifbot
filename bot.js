var request = require('request');
var https = require('https');
var groupId = process.env.groupId;
var botName = process.env.botName;
var botId = process.env.botId;
var botIdAlt = process.env.botIdAlt;

//processes incoming groupme posts
function respond() {
  var post = JSON.parse(this.req.chunks[0]);
  sendingGroup = post.group_id;
  sendingUser = post.name;
  message = post.text;
  console.log(message);
}

exports.respond = respond;