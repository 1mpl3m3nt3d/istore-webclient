/* eslint-disable unicorn/prefer-module */

const express = require('express');
const cors = require('cors');
const path = require('node:path');
const fs = require('node:fs');

const app = express();

const PORT = process.env.PORT; // 8080 || '/tmp/nginx.socket'

const whitelist = new Set([
  process.env.REACT_APP_BASE_API_URL,
  process.env.REACT_APP_BASKET_API_URL,
  process.env.REACT_APP_CATALOG_API_URL,
  process.env.REACT_APP_IDENTITY_URL,
  process.env.PUBLIC_URL,
]);

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin
      if (!origin) {
        return callback(null, true);
      }

      if (!whitelist.has(origin)) {
        const message =
          "The CORS policy for this origin doesn't " +
          'allow access from the particular origin.';

        return callback(new Error(message), false);
      }

      return callback(null, true);
    },
  })
);

app.use(express.static(path.join(__dirname, '..', 'build')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});
app.get('/cart', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});
app.get('/cart/*', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});
app.get('/product', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});
app.get('/product/*', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});
app.get('/products', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});
app.get('/products/*', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});

const server = app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }

  fs.openSync('/tmp/app-initialized', 'w');

  const address = server.address().address;
  const port = server.address().port;

  console.log(
    `
    >>> -------------------------
    >>> Server is Running...
    >>> Address: [${address}]
    >>> Port: [${port}]
    >>> -------------------------
    `
  );
});

/*
app.enable('trust proxy');

app.use((request, response, next) => {
  if (process.env.NODE_ENV !== 'development' && !request.secure) {
    return response.redirect('https://' + request.headers.host + request.url);
  }

  return next();
});
*/

/*
app.use(function (req, res, next) {
  req.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Origin', '*');
  req.header(
    'Access-Control-Allow-Headers',
    'Accept, Content-Type, Origin, X-Requested-With'
  );
  res.header(
    'Access-Control-Allow-Headers',
    'Accept, Content-Type, Origin, X-Requested-With'
  );
  req.header(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );
  next();
});
*/
