const express = require('express');
const cors = require('cors');
const debug = require('debug')('serveur:main');

var app = express();
app.use(cors());

app.use(express.json());
app.use('/doc', express.static('./doc'));
require('./modules/route')(app);

app.listen(process.env.PORT || 4000, () =>
  debug(`Serveur lancé sur le port ${process.env.PORT || 4000}`)
);
