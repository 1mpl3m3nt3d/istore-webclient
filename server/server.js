/* eslint-disable unicorn/prefer-module */

const cluster = require('node:cluster');
const cors = require('cors');
const express = require('express');
const fs = require('fs-extra');
const os = require('node:os');
const path = require('node:path');
const process = require('node:process');

const numCPUs = os.cpus().length;
const isDev = process.env.NODE_ENV !== 'production';

const PORT = process.env.USE_NGINX === 'true' ? '/tmp/nginx.socket' || process.env.PORT || 8080 : process.env.PORT || 8080;

const whitelist = new Set([
  process.env.REACT_APP_BASE_API_URL,
  process.env.REACT_APP_BASKET_API_URL,
  process.env.REACT_APP_CATALOG_API_URL,
  process.env.REACT_APP_IDENTITY_URL,
  process.env.PUBLIC_URL,
]);

const touch = async (file) => {
  await fs.ensureFile(file);
  const now = new Date();
  await fs.utimes(file, now, now);
}

const server = () => {
  const app = express();

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

  const listener = app.listen(PORT, (error) => {
    if (error) {
      throw error;
    }

    touch('/tmp/app-initialized');

    const pid = process.pid;
    const processPort = process.env.PORT;
    const listenerAddress = listener.address().address;
    const listenerPort = listener.address().port;

    console.error(
      `
      >>> -------------------------
      >>> Express Server is Running ...
      >>> Worker:           [ ${pid} ]
      >>> Process Port:     [ ${processPort} ]
      >>> Server Port:      [ ${PORT} ]
      >>> Listener Address: [ ${listenerAddress} ]
      >>> Listener Port:    [ ${listenerPort} ]
      >>> -------------------------
      `
    );
  });
}

//server();

// multi-process to utilize all CPU cores
if (!isDev && cluster.isPrimary) {
  console.error(`Primary node cluster [ ${process.pid} ] is running`);

  // fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('listening', (worker, address) => {
    console.error(`A worker node cluster is now connected to [ ${address.address}:${address.port} ]`);
  });

  cluster.on('exit', (worker, code, signal) => {
    console.error(`Worker node cluster [ ${worker.process.pid} ] exited: code [ ${code} ], signal [ ${signal} ]`);
  });
} else {
  server();
}

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
