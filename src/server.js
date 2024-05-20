const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors({
  origin: 'http://127.0.0.1:3000/',
  methods: 'GET,POST',
  allowedHeaders: 'Content-Type,Authorization'
}));

let messages = [];

app.get('/mensajes', (req, res) => {
  res.send(messages);
});

app.get('/mensajes/:user', (req, res) => {
  const user = req.params.user;
  const userMessages = messages.filter(msg => msg.name === user);
  res.send(userMessages);
});

app.post('/mensajes', (req, res) => {
  const message = req.body;
  messages.push(message);

  // Simulate censorship
  if (message.message.includes('badword')) {
    messages = messages.filter(msg => msg.message !== 'badword');
  } else {
    io.emit('mensaje', message);
  }

  res.sendStatus(200);
  console.log('Message Posted');
});

io.on('connection', () => {
  console.log('a user is connected');
});

server.listen(3000, () => {
  console.log('server is running on port', server.address().port);
});