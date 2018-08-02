
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
// const csrf = require('csurf');

const app = express();

// const csrfMiddleware = csrf({
//   cookie: {
//     secure: false, // should be true in production
//     httpOnly: true,
//     maxAge: 1000*60*60*24,
//   },
// });

const config = require('./config');

mongoose.connect(
  process.env.MONGO_URI || config.mongoURI,
  { useNewUrlParser: true }
); // connect to database

const apiRoutes = require('./routes/api');

// setup express to parse cookies
// app.use(cookieParser());
// protect against cross site request forgery --- GOOGLE IT!
// app.use(csrfMiddleware);

// // set csrf token in cookie
// app.use((req, res, next) => {
//   res.cookie('csrf-token', req.csrfToken());
//   next();
// });

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Put all API endpoints under '/api'
app.use('/api', apiRoutes);

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const handleUnexpectedError = (err, req, res, next) => {
  console.log('Unexpected error: ' + JSON.stringify(err));
  res.sendStatus(500);
}

app.use(handleUnexpectedError);

module.exports = app;

