// Imports dependencies and set up http server
const
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json()); // creates express http server
const request = require('request');
// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));

app.get('/', (req,res) => {
    res.send("Hi I am a chatbot");
});

// Facebook

const token = "EAAelKjl2oDgBANHurTAbqZC4rjzeXVAqigPTErZCaMY4hiD3KqpM2urysjLQSZChqHnswpgTcVq9u5Sjt3XwsB6dzGZBSq5EzzZAvMjiKGnt5BvIrcZATZCc1Y8XiLBnwgQFlZCUIZByArIVqFNijFDWWve6jeUiH8xrthJMS13DNjwLd3vN94Mhm";

// Creates the endpoint for our webhook 
app.post('/webhook/', (req, res) => {  
    let messaging_events = req.body.entry[0].messaging;
    for (let i = 0; i< messaging_events.lenth; i++) {
        let event = messaging_events[i];
        let sender = event.sender.id;
        if (event.message && event.message.text) {
            let text = event.message.text;
            sendText(sender, "Text echo: "+ text.substring(0,100));
        }
    }
    res.status(200).send('request sent')
});

sendText = (sender, text) => {
    let messageData = {text};
    request({
        url: "https://graph.facebook.com/v2.6/me/messages",
        qs: {access_token: token},
        method: "POST",
        json: {
            receipient: {id: sender},
            message: messageData
        }
    }, (err, response, body) => {
        if (err) {
            console.log("sending erro");
        } else if (response.body.error) {
            console.log("Resposne body error")
        }
    })
}

  app.get('/webhook/', (req, res) => {

    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = "thitran"
      
    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];
      
    // Checks if a token and mode is in the query string of the request
    if (mode && token) {
    
      // Checks the mode and token sent is correct
      if (token === VERIFY_TOKEN) {
        
        // Responds with the challenge token from the request
        console.log('WEBHOOK_VERIFIED');
        res.status(200).send(challenge);
      
      } else {
        // Responds with '403 Forbidden' if verify tokens do not match
        res.sendStatus(403);      
      }
    }
  });