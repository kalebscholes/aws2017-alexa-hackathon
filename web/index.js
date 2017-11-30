var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var globalSocket

app.use(express.static('static'))

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
  });

app.get('/take/picture', function(req, res){
  console.log('Asked To Take Picture');
  io.emit('take picture', 'smile');

  globalSocket.on('picture', function(base64) {
    var response = {recognized: false};
    if(base64){
      console.log('GOT PICTURE')
      response = {recognized: true, name: 'kaleb'}
    }
    res.status(200).send(response)
  })

});

io.on('connection', function(socket){
  globalSocket = socket
  console.log('a user connected');

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});