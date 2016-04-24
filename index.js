var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());
var token = "CAACjWxNgVvoBANeQqSgormngorbs4OimsaNisCYi63jlbe8vZB5MkSd0830nuHI6Dvz8CfZAzLcZCMBIZA7ZAVfJbZBQa5uMJuTKRzi0N5KVRhK9WWdAOZATmJl24JrbmNgdNgkfZASdkvfE6ZAchNsa8YVfHZB5ijQ8EmuntNSDhTHiUhvkybKYIJ5VmcnfFzexh5KH6jTwLrZCwZDZD";

app.set('port', (process.env.PORT || 5000));
app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/webhook/', function (req, res) {
  if (req.query['hub.verify_token'] === 'baiifern') {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
})

app.post('/webhook/', function (req, res) {
  var messaging_events = req.body.entry[0].messaging;
  for (var i = 0; i < messaging_events.length; i++) {
    var event = req.body.entry[0].messaging[i];
    var sender = event.sender.id;
    if (event.message && event.message.text) {
      var text = event.message.text;
      sendTextMessage(sender, "Text received, echo: "+ text.substring(0, 200));
      // Handle a text message from this sender
      console.log(text);
    }
  }
  res.sendStatus(200);
});

function sendTextMessage(sender, text) {
  messageData = {
    text:text
  }
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
}

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});