var restify = require('restify');
var builder = require('botbuilder');
require('dotenv').config()
// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, function (session) {
	msg = session.message.text 
	// session.send(msg);
	// msg.split("+")
	var pos = msg.indexOf("+")
	session.send(pos);
	var n1  = Number(msg.substring(0,pos-1))
	var n2  = Number(msg.substring(pos+1,len(msg)))
	// var ans = String(n1+n2)
    session.send("The answer You're looking for is: %d", n1 + n2);
});
