var http = require('http');
var fs = require('fs');
var protocole = {
	NEW_CON: 0,
	NEW_MSG: 1
};
var nbClient = 0;
var clients = [];

// Chargement du fichier index.html affiché au client
var server = http.createServer(function(req, res) {
	 fs.readFile('.' + req.url, 'utf-8', function(error, content) {
		 switch (req.url) {
	        case "/style.css" :
	            res.writeHead(200, {"Content-Type": "text/css"});
	            res.end(content);
	            break;
	        default :    
	            res.writeHead(200, {"Content-Type": "text/html"});
	            res.end(content);
	    };
    });
});

// Chargement de socket.io
var io = require('socket.io').listen(server);

// Quand un client se connecte, on le note dans la console
io.sockets.on('connection', function (socket) {
    var currentdate = new Date();
	var hours = currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();

    socket.broadcast.emit('chat', {type: protocole.NEW_CON, clientId: nbClient, date: hours, me: false});
    socket.emit('chat', {type: protocole.NEW_CON, myId: nbClient, clientId: nbClient, date: hours, me: true});
    clients.forEach(function(elem) {
    	socket.emit('chat', {type: protocole.NEW_CON, clientId: elem.clientId, date: elem.date, me: false});
    });
    clients.push({clientId: nbClient, date: hours});
    nbClient++;
    socket.on('message', function (message) {
    	var currentdate = new Date();
		var hours = currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();

        socket.broadcast.emit('message', {type: protocole.NEW_MSG, from: message.from, date: hours, message: message.message});
    });	
});


server.listen(8888);