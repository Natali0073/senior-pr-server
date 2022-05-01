const express = require('express');
const path = require('path');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require("cors");;
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

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}.`)
})

require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
