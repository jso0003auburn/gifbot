var request = require('request');
var https = require('https');
var groupId = process.env.groupId;
var botIdMain = process.env.botId;
var botIdAlt = process.env.botIdAlt;


//posts message
function postMessage(botResponse, sendingGroup) {
  
  //From the main group?
  if (sendingGroup == groupId) {
    botId = botIdMain;
  }
  
  //not from the main group?
  if (sendingGroup !== groupId && botIdAlt !== null) {
    botId = botIdAlt;
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