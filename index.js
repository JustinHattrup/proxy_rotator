const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

// middware
app.use(cors());
app.use(bodyParser.json());

const apiRoute = require('./routes/api');

app.use('/api', apiRoute);

const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);
