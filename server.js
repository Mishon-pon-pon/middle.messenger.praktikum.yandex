const express = require("express");
// const serverless = require('serverless-http');
const app = express();

const Port = 3002;

// app.use(express.static(__dirname + '/dist'));
// module.exports.handler = serverless(app);
app.use(express.static(__dirname + "/static"));
app.listen(Port, () => {
  console.log(`server start on ${Port} port`);
});
