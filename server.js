require('./db/connection');
const express = require('express');
const bodyParser = require('body-parser');
const routesFilm = require('./routes/film');
const routesSession = require('./routes/session');
const PORT = 4000;

var app = express();
app.use(bodyParser.json())
routesFilm(app);
routesSession(app);
app.listen(PORT, () => console.log(`Server on ${PORT}...`));