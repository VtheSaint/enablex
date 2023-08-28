const express = require('express');
const https = require('https');
const fs = require('fs');
const bodyParser = require('body-parser');
const ConfigOptions = require('./config');
const vcxroom = require('./vcxroom');

const app = express();

const server = https.createServer({
    key: ConfigOptions.key,
    cert: ConfigOptions.cert
}, app);
const port = ConfigOptions.port || 3000;

app.set('port', port);
server.listen(port);


// Exception Handler Function
function onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }
  
    const bind = typeof port === 'string'
      ? `Pipe ${port}`
      : `Port ${port}`;
    switch (error.code) {
      case 'EACCES':
        logger.error(`${bind} requires elevated privileges`);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        logger.error(`${bind} is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
    }
}

// Function: To confirm Service is listening on the configured Port
function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? `pipe ${addr}`
        : `port ${addr.port}`;
    console.log(`Listening on ${bind}`);
}

// logger.info(`Server started. Listening on Port ${port}`);
server.on('error', onError);
server.on('listening', onListening);



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true,
}));

app.use(express.static('./client'));


// Application Server Route Definitions - These functions communicate with EnableX Server API
// Route: To get liist of all Rooms in your Application
app.get('/api/get-all-rooms', (req, res) => {
    vcxroom.getAllRooms((data) => {
      res.status(200);
      res.send(data);
    });
});

// Application Server Route Definitions - These functions communicate with EnableX Server API
// Route: To get information of a given room.
app.get('/api/get-room/:roomName', (req, res) => {
    const { roomName } = req.params;
    vcxroom.getRoom(roomName, (status, data) => {
        res.status(200);
        res.send(data);
    });
});

// Route: To get Token for a Room
app.post('/api/create-token/', (req, res) => {
    vcxroom.getToken(req.body, (status, data) => {
        res.status(200);
        res.send(data);
    });
});

// Route: To create a Room (1to1)
app.post('/api/create-room/', (req, res) => {
    vcxroom.createRoom((status, data) => {
        res.send(data);
        res.status(200);
    });
});

// Route: To create a Room (multiparty)
app.post('/api/room/multi/', (req, res) => {
    vcxroom.createRoomMulti((status, data) => {
        res.send(data);
        res.status(200);
    });
});
