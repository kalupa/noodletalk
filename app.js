"use strict";
var express = require('express');
var configurations = module.exports;
var app = express.createServer();
var settings = require('./settings')(app, configurations, express);
var recentMessages = [];

// jcw: If we don't construct our userlist as an object it won't
// be passed by reference and won't be in-common between routes:
var userList = new Array();

var io = require('socket.io').listen(app);

// Only using long-polling for now because heroku hates websockets
io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});

// routes
require("./routes")(app);
require("./routes/message")(app, io, userList, recentMessages);
require("./routes/auth")(app, settings, io, userList);

app.listen(process.env.PORT || settings.options.port);
