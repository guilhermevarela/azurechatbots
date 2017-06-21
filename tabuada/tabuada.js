/*-----------------------------------------------------------------------------
v0.0 A simple "Hello World" bot that can be run from a console window.


v1.0 This Bot demonstrates how to use a waterfall to prompt the user with a series
of questions.

This example also shows the user of session.userData to persist information
about a specific user. 
SEE
https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-dialog-manage-conversation-flow

# RUN THE BOT:
    Run the bot from the command line using "node tabuada.js." and then type 
    "hello" to wake the bot up.
-----------------------------------------------------------------------------*/

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

// Receive messages from the user and respond by echoing each message back
var bot = new builder.UniversalBot(connector, [	
    function (session) {
        session.send("Oi eu sou o tabuada bot vamos fazer umas continhas?\nFaço soma,subtração,multiplicação e divisão. Qual delas vamos fazer primeiro?");
        builder.Prompts.choice(session, "Vamos começar com qual?", ["Soma", "Subtração", "Multiplicação", "Divisão"]);
    },
    function (session, results) {    	
        session.userData.operation = results.response.entity;        
        var	operationname = results.response.entity,
        	operationid = 0;
        	promptuser  = true;
        if (operationname.localeCompare('Soma')==0) {
        	operationname = 'Somar',
        	operationid   = 1;
        } else if (operationname.localeCompare('Subtração')==0) {
        	operationname = 'Subtrair',
        	operationid   = 2;
        } else if (operationname.localeCompare('Multiplicação')==0) {
        	operationname = 'Multiplicar',
        	operationid   = 3;
        } else if (operationname.localeCompare('Divisão')==0) {	
        	operationname = 'Dividir',
        	operationid   = 4;
        } else {
        	promptuser = false
			session.send("Desculpe eu não sei fazer " + String(operationname));       	
        }      
        if (promptuser) {
        	session.userData.operationid = operationid;
        	builder.Prompts.number(session, "Beleza vamos " + operationname + " então. Por favor entre com o primeiro número:"); 
    	}
    },
    function (session, results) {
        session.userData.n1 = results.response;
        var n1 = session.userData.n1;
        builder.Prompts.number(session, "O primeiro número foi " + String(n1) + ". Por favor entre com o segundo número:"); 
    },
    function (session, results) {
    	session.userData.n2 = results.response;
    	var operation = session.userData.operation,
    			   n2 = session.userData.n2,
    			   n1 = session.userData.n1,
    		operationid = session.userData.operationid,
    			   n3 = 0;
		if (operationid==1) {
        		n3 = n1 + n2 
        } else if (operationid==2) {
        		n3 = n1 - n2 
        } else if (operationid==3) {
        		n3 = n1 * n2 
        } else if (operationid==4) {	
        		n3 = n1 / n2 
    	}
    	builder.Prompts.number(session, "E o resultado é " + String(n3)); 
    }
]);


// var bot = new builder.UniversalBot(connector, function (session) {
// 	msg = session.message.text 
	
// 	if (msg.indexOf("+")>0 | msg.indexOf("-")>0 | msg.indexOf("*") >0 | msg.indexOf("/") >0 ) {
// 		var pos_sum = msg.indexOf("+");
// 		var pos_sub = msg.indexOf("-");
// 		var pos_mul = msg.indexOf("*");
// 		var pos_div = msg.indexOf("/");
// 		if (pos_sum > 0) {
// 			var n1  = Number(msg.substring(0,pos_sum-1));
// 			var n2  = Number(msg.substring(pos_sum+1,msg.length));
// 			var n3  = n1+n2;
// 		} else if (pos_sub > 0) {
// 			var n1  = Number(msg.substring(0,pos_sub-1));
// 			var n2  = Number(msg.substring(pos_sub+1,msg.length));
// 			var n3  = n1-n2;
// 		} else if (pos_mul > 0) {
// 			var n1  = Number(msg.substring(0,pos_mul-1));
// 			var n2  = Number(msg.substring(pos_mul+1,msg.length));
// 			var n3  = n1*n2;
// 		} else {
// 			var n1  = Number(msg.substring(0,pos_div-1));
// 			var n2  = Number(msg.substring(pos_div+1,msg.length));
// 			var n3  = n1/n2;
// 		}
// 		session.send("E a resposta é: %d", String(n3));
// 	} else {
// 		session.send("Por favor entre uma das operacoes validas: '+', '-', '*', '/'");	
// 	}
// });
