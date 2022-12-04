const express = require('express');
global.express = express;

const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const error_handler = require('./lib/handlers/error.handler');

require('./database/index');

const origin = [
  'http://localhost:3000/',
  'http://localhost:3000',
  'https://pikmi-client.vercel.app/',
  'https://pikmi-client.vercel.app',
];

const app = express();

//* Security middleware
app.use(helmet());
app.use(
  rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 1000,
  })
);
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

//* to add cookies if CORS
app.use(
  cors({
    origin,
    credentials: true,
  })
);

//*  Express Middleware

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // ? Middleware to show req and res details.
}

app.use(cookieParser());
app.use(
  express.json({
    limit: '5mb',
  })
);
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(compression());

//* Serving Documentation HTML file
app.use(express.static(`${__dirname}/public`));

const producer = producerInit();

module.exports.producer = producer;

//* Routes handling
app.use('/api/v1/', require('./routes'));

//* Error handling middleware
app.use(error_handler);

app.all('*', async (req, res, next) => {
  // await errorSaver(req, 'client');
  next(new _Error(`Can't find ${req.path} :(`, 404));
});

module.exports = app;
