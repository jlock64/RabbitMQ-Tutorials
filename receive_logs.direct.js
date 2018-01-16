#!/usr/bin/env node
// http://www.rabbitmq.com/tutorials/tutorial-four-javascript.html
// use with emit_log_direct.js

var amqp = require("amqplib/callback_api");

var args = process.argv.slice(2);

if (args.length == 0) {
  console.log("Usage: receive_logs_direct.js [info] [warning] [error]");
  process.exit(1);
}

amqp.connect("amqp://localhost", function(err, conn) {
  conn.createChannel(function(err, ch) {
    var ex = "direct_logs";

    ch.assertExchange(ex, "direct", { durable: false });

    ch.assertQueue("", { exclusive: true }, function(err, q) {
      console.log(" [*] Waiting for logs. To exit press CTRL+C");

      args.forEach(function(severity) {
        ch.bindQueue(q.queue, ex, severity);
      });

      ch.consume(q.queue, function(msg) {
          console.log(" [x] %s: '%s'", msg.fields.routingKey, msg.content.toString());
        }, { noAck: true }
      );
    });
  });
});