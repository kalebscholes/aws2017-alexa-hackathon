var express = require('express')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

const fs = require('fs');

const AWS = require('aws-sdk')
AWS.config.update({region: 'us-east-1'});

const bluebird = require('bluebird')
const rk = bluebird.promisifyAll(new AWS.Rekognition());

const col = require('./src/collection')
const face = require('./src/face')(rk)

const collectionId = process.env.COLLECTION_ID || 'reinvent-2017-demo'


var globalSocket

app.use(express.static('static'))

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/take/picture', function(req, res){
  console.log('Asked To Take Picture');
  io.emit('take picture', 'smile');

  globalSocket.on('picture', async function(base64) {
    var response = { result: 'NO_PICTURE'};
    if(base64){
      console.log('GOT PICTURE')         
      base64 = base64.substr( base64.indexOf(',') + 1 )
      response.base64 = base64
      try { 
        const faceMatch = await face.findMatch(base64, collectionId)
        console.log('matches?', faceMatch)
      
        if( faceMatch && faceMatch.FaceMatches && faceMatch.FaceMatches.length > 0){
          response.result = 'MATCHED'
          response.matches = faceMatch.FaceMatches
        }else {
          response.result = 'NO_MATCH'
        }        
      }catch(e){
        response.result = 'ERROR'
        response.message = 'Error while trying to match face: ' + e.message
        response.error = e
      }
    }
    res.status(200).send(response)
  })

});


app.get('/register/:name', function(req, res){
  console.log('Asked To register');
  io.emit('take picture', 'smile');

  globalSocket.on('picture', async function(base64) {
    const name = req.params.name
    var response = { 
      result: 'NO_PICTURE',
      name: name
    };
    if(base64){
      console.log('GOT PICTURE')         
      base64 = base64.substr( base64.indexOf(',') + 1 )
      response.base64 = base64
      try { 

        const addResult = await face.add(name, base64, collectionId)  
        console.log('faceAdded?', addResult)

        response.result = 'ADDED'
        
      
        // if( faceMatch && faceMatch.FaceMatches && faceMatch.FaceMatches.length > 0){
        //   response.result = 'MATCHED'
        //   response.matches = faceMatch.FaceMatches
        // }else {
        //   response.result = 'NO_MATCH'
        // }        
      }catch(e){
        response.result = 'ERROR'
        response.message = 'Error while trying to match face: ' + e.message
        response.error = e
      }
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


async function run(){
  const setup = await col.setup(rk, collectionId)
  http.listen(3000, function(){
    console.log('listening on *:3000');
  });
}
run()