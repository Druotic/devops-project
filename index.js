var app = require('express')();
var http = require('http').Server(app);
var redis = require('redis');
var bodyParser = require('body-parser');
var AlchemyAPI = require('alchemy-api');
var alchemy = new AlchemyAPI(process.env.ALCHEMYAPI_KEY);
var client = redis.createClient('6379', '127.0.0.1', {});
// var io = require('socket.io')(http);

app.use(bodyParser.urlencoded({ extended: false }));

var prefix = "devops-course-";

app.post('/snippet', function(req, res){
  var code = req.body.code;
  storeKeywords(code);
  res.send("Snippet Received!");
});

app.get('/', function(req, res){
  var code = "Hello Carl.  How was your day today? Carl, Hi there. Hi Carl.";
  storeKeywords(code);
  res.send("Snippet Received!");
});

function storeKeywords(code) {
  alchemy.entities(code, {outputMode: 'json'}, function(err, res) {
    console.log(JSON.stringify(res.entities[0].text));
    for(var idx=0; idx<res.entities.length; idx++) {
      var text = prefix + res.entities[idx].text;
      var count = res.entities[idx].count;
      console.log("Storing entity:");
      console.log("Text: "+text);
      console.log("Count: "+count);
      client.get(text, function (err, val) {
        val = (val) ? parseInt(val)+parseInt(count) : count;
        client.set(text, val);
      });
    }
  });
}

// io.on('connection', function(socket){
//   socket.on('chat message', function(msg){
//     io.emit('chat message', msg);
//   });
// });

http.listen(3007, function(){
  console.log('listening on *:3007');
});

