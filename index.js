const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const httpServer = require("http").createServer(app);
const ioSocket = require("socket.io")(httpServer, {
  cors: {
    origin: ["http://localhost:4200", "https://natali0073.github.io"],
    credentials: true
  }
});
exports.io = ioSocket;

const PORT = process.env.API_PORT || 3000;

const corsOptions = {
  origin: ["http://localhost:4200", "https://natali0073.github.io"],
};

app.use(cors(corsOptions));
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.use(cookieParser());

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})
ioSocket.on('connection', (socket) => {
  socket.on('fromClient', (data) => {
  })
});
ioSocket.on("connect_error", (err) => {
  console.log(`connect_error due to ${err.message}`);
});

httpServer.listen(PORT, () => {
  console.log(`App running on port ${PORT}.`)
})

require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/mail-api.routes')(app);
require('./app/routes/chat.routes')(app);
require('./app/routes/admin.routes')(app);
