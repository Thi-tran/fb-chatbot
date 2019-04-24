const express = require('express');
const bodyParser  = require('body-parser');
const request = require('request');

// hosting set up 
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.listen(port, () => {
    console.log('Server is up on port ' + port);
})

app.get('/', (req,res) => {
    res.send("Hi I am a chatbot");
});

// Facebook

app.get('/webhook/', (req,res) => {
    if (req.query['hub.verify_token'] === "thitran") {
        res.send(req.query['hub.challenge'])
    } 
    res.send("Wrong token")
})

