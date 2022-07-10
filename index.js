const express = require('express');
const path = require('path');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require("cors");
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");
const app = express();

const PORT = process.env.API_PORT || 3000;

const db = require('./app/models');

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
// app.use(
//   cookieSession({
//     name: "natalia-session",
//     secret: process.env.JWT_SECRET,
//     httpOnly: true
//   })
// );

app.use(cookieParser());

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}.`)
})

// run only if need to recreete users table
// db.user.sync({ force: true });

require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
