var request = require('request');
var https = require('https');
var groupId = process.env.groupId;
var botName = process.env.botName;
var botId = process.env.botId;
var botIdAlt = process.env.botIdAlt;


//posts message
function postMessage(botResponse, botId) {
  if (botIdAlt !== null && sendingGroup !== groupId) {
    botId = botIdAlt;
  } else {
  botId = botId;
  }
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
