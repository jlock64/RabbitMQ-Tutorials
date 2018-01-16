#!/usr/bin/env node
// http://www.rabbitmq.com/tutorials/tutorial-four-javascript.html
// use with receive_logs_direct.js

var amqp = require("amqplib/callback_api");

amqp.connect("amqp://localhost", function(err, conn) {
  conn.createChannel(function(err, ch) {
    var ex = "direct_logs";
    var args = process.argv.slice(2);
    var msg = args.slice(1).join(" ") || "Hello World!";
    var severity = args.length > 0 ? args[0] : "info";

    ch.assertExchange(ex, "direct", { durable: false });
    ch.publish(ex, severity, new Buffer(msg));
    console.log(" [x] Sent %s: '%s'", severity, msg);
  });

  setTimeout(function() {
    conn.close();
    process.exit(0);
  }, 500);
});