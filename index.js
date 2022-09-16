const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const Server = require('socket.io');
const app = express();
// const httpServer = new http.Server(app);
// const io = new Server(httpServer, { cors: { origin: '*' } });
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST", "PUT"]
  }
});

const PORT = process.env.API_PORT || 3000;

const corsOptions = {
  origin: "http://localhost:4200"
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
io.on('connection', (socket) => {
  console.log('a user connected');
});
io.on("connect_error", (err) => {
  console.log(`connect_error due to ${err.message}`);
});

httpServer.listen(PORT, () => {
  console.log(`App running on port ${PORT}.`)
})

// app.listen(PORT, () => {
//   console.log(`App running on port ${PORT}.`)
// })

// run only if need to recreete users table
// const db = require("./app/models");
// db.user.sync({ force: true });

require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/mail-api.routes')(app);
