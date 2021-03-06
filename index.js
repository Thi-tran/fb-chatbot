const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')

const app = express()

app.set('port', (process.env.PORT || 5000))

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get('/', function(req, res) {
	res.send("The chatbot is working!")
})

// Add you Page Access Token
let token = "";


app.get('/webhook/', function(req, res) {
  const tokenServer= req.query['hub.verify_token'],
      myToken = "thitran";
	if (tokenServer === myToken) {
		res.send(req.query['hub.challenge'])
	}
	res.send("Please input another token ")
})

app.post('/webhook/', function(req, res) {
	let messaging_events = req.body.entry[0].messaging
	for (let i = 0; i < messaging_events.length; i++) {
		let event = messaging_events[i]
		let sender = event.sender.id
		if (event.message && event.message.text) {
      let text = event.message.text;
      operatingText(sender, text);
		}
	}
	res.sendStatus(200)
})

operatingText = (sender, text) => {
  if (text === "I'm sad") {
    sendText(sender, "How can I help you?");
  }
}


sendText = (sender, text) => {
	let messageData = {text: text}
	request({
		url: "https://graph.facebook.com/v2.6/me/messages",
		qs : {access_token: token},
		method: "POST",
		json: {
			recipient: {id: sender},
			message : messageData,
		}
	}, function(error, response, body) {
		if (error) {
			console.log("sending error")
		} else if (response.body.error) {
			console.log("response body error")
		}
	})
}

app.listen(app.get('port'), function() {
	console.log("running: port")
})


