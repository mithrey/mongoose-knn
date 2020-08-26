const debug = require('debug')('test:app.js');
const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
require('./app_api/models/db');


const app = express();
const expressWs = require('express-ws')(app);



app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



/**
 * HTTP routing -- begin
 */



const transactionApi = require('./app_api/routes/point');
app.use('/api', transactionApi);



app.use('/', express.static(path.join(__dirname, 'app_client/dist')));


/**
 * HTTP routing -- end
 */

module.exports = app;
