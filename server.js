const express = require('express');
// const serverless = require('serverless-http');
const app = express();

// app.use(express.static(__dirname + '/dist'));
// module.exports.handler = serverless(app);
app.use(express.static(__dirname + '/static'));
app.listen(process.env.PORT, () => {
  console.log(`server start on ${process.env.PORT} port`);
});
