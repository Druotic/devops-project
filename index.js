var app = require('express')();
var http = require('http').Server(app);
var redis = require('redis');
var bodyParser = require('body-parser');
var AlchemyAPI = require('alchemy-api');
var alchemy = new AlchemyAPI(process.env.ALCHEMYAPI_KEY);
var client = redis.createClient('6379', '127.0.0.1', {});
var exec = require('child_process').exec;

app.use(bodyParser.urlencoded({ extended: false }));

var prefix = "devops-course-";

app.post('/snippet', function(req, res){
  console.log("/snippet: "+req.body.code);
  storeKeywords(req);
  res.send("Snippet Received!");
});

app.get('/', function(req, res){
  var code = "Hello Carl.  How was your day today? Carl, Hi there. Hi Carl.";
  storeKeywords(code);
  res.send("Snippet Received!");
});

app.get('/graph', function(req, res){
  exec('python helpers/graph.py ' + prefix, function(err, stdout, stderr) {
    if(err)
      throw err;
    console.log("Graph stdout: " + stdout);
    console.log("Graph stderr: " + stderr);
    res.redirect(stdout);
  });
});

function storeKeywords(req) {
  var code = req.body.code;
  var language = req.body.language;
  alchemy.entities(code, {outputMode: 'json'}, function(err, res) {
    if(res.entities.length > 0)
      console.log("storeKeywords: "+JSON.stringify(res.entities[0].text));
    for(var idx=0; idx<res.entities.length; idx++) {
      var key = prefix + language + "-" + res.entities[idx].text;
      var count = res.entities[idx].count;
      console.log("Storing entity:");
      console.log("Key: "+key);
      console.log("Count: "+count);
      client.incrby(key, count, function (err) {
        if(err)
            throw err;
      });
    }
  });
}

http.listen(3007, function(){
  console.log('listening on *:3007');
});
