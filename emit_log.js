#!/usr/bin/env node
// http://www.rabbitmq.com/tutorials/tutorial-three-javascript.html
// use with receive_logs.js

var amqp = require("amqplib/callback_api");

amqp.connect("amqp://localhost", function(err, conn) {
  conn.createChannel(function(err, ch) {
    var ex = "logs";
    var msg = process.argv.slice(2).join(" ") || "Hello World!";

    ch.assertExchange(ex, "fanout", { durable: false });
    ch.publish(ex, "", new Buffer(msg));
    console.log(" [x] Sent %s", msg);
  });

  setTimeout(function() {
    conn.close();
    process.exit(0);
  }, 500);
});