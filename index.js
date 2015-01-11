var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));

// cors
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//----------------------------------

var flag = false;

app.get('/', function(request, response) {
  response.send('Hello World!');
});

app.get('/flag', function(request, response) {
	response.send(flag);
});

app.get('/flagset', function(request, response) { 
	flag = true;
	response.send(flag);
	// send pubnub, this will cause phone and watch to blinking red
	var message = {"alert": "alert"};
	sendPubnub(message);
});

app.get('/flagclear', function(request, response) {
	flag = false;
	response.send(flag);
	// send pubnub, phone and watch will not blink red
	var message = {"fine": "fine"};
	sendPubnub(message);
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});


function sendPubnub(message) {

	var pubnub = require("pubnub")({
	    ssl           : true,  // <- enable TLS Tunneling over TCP
	    publish_key   : "demo",
	    subscribe_key : "demo"
	});

	/* ---------------------------------------------------------------------------
	Publish Messages
	--------------------------------------------------------------------------- */
	//var message = { "alert" : "alert" };
	pubnub.publish({ 
	    channel   : 'bmwwatchalert',
	    message   : message,
	    callback  : function(e) { console.log( "SUCCESS!", e ); },
	    error     : function(e) { console.log( "FAILED! RETRY PUBLISH!", e ); }
	});

}