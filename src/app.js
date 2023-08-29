const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const config = require('./infrastructure/config');
const { requestCorrelation } = require('./app/utils');
const mountRoutes = require('./routes');

const app = express();
// swagger definition
const swaggerDefinition =  {
  openapi: '3.0.1', // YOU NEED THIS
  info: {
    title: 'Dfe Signin Public-Api',
    version: '1.0.0',
    description: 'Dfe Signin Public-Api'
  },
  basePath: '/',
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      }
    }
  },
  security: [{
    bearerAuth: []
  }]
};

// options for the swagger docs
const options = {
  // import swaggerDefinitions
  swaggerDefinition,
  // path to the API docs
  apis: ['./*/routes.js', './*/index.js', './*/*/*/index.js', './*/*/*/routes.js'],
};

// initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(options);
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
