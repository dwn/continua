////////////////////////////////////////////
// Dan Nielsen
////////////////////////////////////////////
'use strict';
const fs = require('fs');
const path = require('path');
const cfg = JSON.parse(fs.readFileSync('cfg.json', 'utf8'));
const PORT = cfg['PORT'];
const CLOUD_BUCKET = cfg['CLOUD_BUCKET'];
const {Storage} = require('@google-cloud/storage');
const storage = new Storage();
const bucket = storage.bucket(CLOUD_BUCKET);
//
// const firebase = require("firebase");
// require("firebase/firestore");
// firebase.initializeApp({
//   apiKey: '### FIREBASE API KEY ###',
//   authDomain: '### FIREBASE AUTH DOMAIN ###',
//   projectId: cfg['PROJECT_ID']
// });
// var db = firebase.firestore();
//
const express = require('express');
const app = express();
const server = require('http').Server(app);
const request = require('request');
//
const io = require('socket.io')(server);
//
const ulid = require('ulid');
////////////////////////////////////////////
// Setup
////////////////////////////////////////////
app.disable('etag');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('trust proxy', true);
app.use(express.static(path.join(__dirname, 'public')));
////////////////////////////////////////////
var arrLang;
request.get('https://dwn.github.io/common/lang/list', function (error, response, body) {
  if (!error && response.statusCode === 200) {
    arrLang = body.split('\n').filter(function (el) { return el !== null && el !== ''; });
  }
});
////////////////////////////////////////////
// Chat
////////////////////////////////////////////
var dicFontBasename = {};
////////////////////////////////////////////
var connections = new Set();
io.on('connection', (socket) => {
  connections.add(socket);
  for(var user in dicFontBasename) {
    socket.emit('chat font', user+':'+dicFontBasename[user]);
  }
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
    console.log('MSG.'+msg);
  });
  socket.on('chat font', (msg) => {
    io.emit('chat font', msg);
    console.log('FONT.'+msg);
  });
  socket.once('disconnect', function () {
    connections.delete(socket);
    console.log('DESOCKET.'+socket.id);
  });
});
////////////////////////////////////////////
function connectChat(username,fontBasename,isMe=false) {
  io.emit('chat message', '_connected:'+username+':'+fontBasename);
  dicFontBasename[username] = fontBasename;
}
////////////////////////////////////////////
app.get('/lang-file-url/:langFilename', (req, res) => {
  let langFilename = req.params.langFilename;
  if (langFilename.match(/\d{4}[-]\d{2}[-]\d{2}[_]\d{2}[_]\d{2}[_]\d{2}[_]\d{3}[_]/)) {
    res.send(`https://storage.googleapis.com/${CLOUD_BUCKET}/${langFilename}`);
  } else {
    res.send(`https://dwn.github.io/common/lang/${langFilename}`);
  }
});
////////////////////////////////////////////
// CRUD
////////////////////////////////////////////
// app.post('/username', (req, res)) {
//   req.on('username', function(username) {
//     db.collection('users').doc(username).set({'test':'testing'});
//   });
// }
////////////////////////////////////////////
// Main
////////////////////////////////////////////
const SVG_TO_OTF_SERVICE_URL = cfg['SVG_TO_OTF_SERVICE_URL'];
function svgToOTF(filename, string) {
  if (path.extname(filename) !== '.svg') {
    console.log(`Exiting: not .svg file`);
    return;
  }
  const serviceAddr = `${SVG_TO_OTF_SERVICE_URL}/` + filename;
  console.log(serviceAddr);
  request(serviceAddr,{ json: true }, (err, res, body) => {
      if (err) { return console.log(err); }
  });
}
////////////////////////////////////////////
app.post('/upload-file-to-cloud', (req, res) => {
  var string = '';
  req.on('data', function(data) {
    string += data;
  });
  req.on('end', function() {
    //Upload to Google Cloud file storage
    var dat = string.split("<desc>");
    dat = dat[1].split("</desc>")[0];
    var json = JSON.parse(dat);
    var filename = json["name"]+".svg";
    const file = bucket.file(filename);
    console.log('Uploading file to cloud');
    file.save(string).then(function() {
      console.log('Done uploading');
      svgToOTF(filename, string);
      setTimeout(function() {
        res.end('{"success" : "Updated successfully", "status" : 200}');
      }, 9000);
    });
  });
});
////////////////////////////////////////////
app.get('/', (req, res) => { //Redirect root
  res.render('continua.pug', { arrLang : arrLang });
});
////////////////////////////////////////////
// Server
////////////////////////////////////////////
app.use((req, res) => { //Basic 404 handler
  res.status(404).send('Not found');
});
////////////////////////////////////////////
app.use((err, req, res) => { //Basic error handler
  console.error(err);
  res.status(500).send(err.response || 'Something broke!');
});
////////////////////////////////////////////
if (module === require.main) {
  server.listen(process.env.PORT || PORT, () => {
    const port = server.address().port;
    console.log(`App listening on port ${port}`);
  });
}
module.exports = app;
