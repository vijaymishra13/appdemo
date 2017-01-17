var express = require('express')
  , http = process.env.HTTPS == 'on' ? require('https') : require('http')
  , builder = require('botbuilder');

var path = require('path');
var app = express()
  , server = http.createServer(app)
  , port = process.env.port || 3000
  , config = { appId: 'a3616594-f309-4ca0-8af1-94880a7114cb', appPassword: 'VGKr5wnsUjG4GF7MwkjRAFk' }
  , connector = new builder.ChatConnector(config)
  , bot = new builder.UniversalBot(connector);


// respond to basic HTTP GET
app.get('/', function(req, res) {
    res.send('Hello! I am your friendly App Support Bot. Talk to me via Skype!');
  })

// start the server
server.listen(port, function() {
  console.log('Listening on %s', port);
});

var bot = require('./app/bot');
app.post('/api/messages', bot.listen());
