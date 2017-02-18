var http, director, bot, router, server, port;
var request = require('request');

http        = require('http');
director    = require('director');
bot         = require('./bot.js');

router = new director.http.Router({
  '/' : {
    post: index.respond,
    get: ping
  }
});

server = http.createServer(function (req, res) {
  req.chunks = [];
  req.on('data', function (chunk) {
    req.chunks.push(chunk.toString());
  });

  router.dispatch(req, res, function(err) {
    res.writeHead(err.status, {"Content-Type": "text/plain"});
    res.end(err.message);
  });
});

port = Number(process.env.PORT || 5000);
server.listen(port);

//processes incoming groupme posts
function respond() {
  var post = JSON.parse(this.req.chunks[0]);
  this.res.writeHead(200);
  sendingGroup = post.group_id;
  sendingUser = post.name;
  message = post.text;
  console.log(message + ' : ' + sendingUser);
  bot.scanMessage();
  this.res.end();
}

function ping() {
  this.res.writeHead(200);
  this.res.end("I am, gifbot");
}