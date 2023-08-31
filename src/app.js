const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { swaggerSpec, options } = require('./infrastructure/swaggerConfig');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const config = require('./infrastructure/config');
const { requestCorrelation } = require('./app/utils');
const mountRoutes = require('./routes');

const app = express();

if (config.hostingEnvironment.hstsMaxAge) {
  app.use(helmet({
    noCache: true,
    frameguard: {
      action: 'deny',
    },
    hsts: {
      maxAge: config.hostingEnvironment.hstsMaxAge,
      preload: true,
    },
  }));
} else {
  app.use(helmet({
    noCache: true,
    frameguard: {
      action: 'deny',
    },
  }));
}

if (config.hostingEnvironment.env !== 'dev') {
  app.set('trust proxy', 1);
}
// serve swagger
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});
const specs = swaggerJsdoc(options);
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(specs),
);
app.use(requestCorrelation());
app.use(bodyParser.json());

mountRoutes(app);

module.exports = { app };
