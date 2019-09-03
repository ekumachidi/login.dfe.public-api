const express = require('express');
const { asyncWrapper } = require('login.dfe.express-error-handling');
const getServiceUsers = require('./getServiceUsers');

const getUserOrganisations = require('./getUsersOrganisations');

const area = () => {
  const router = express.Router();

  router.get('/:id/organisations', asyncWrapper(getUserOrganisations));
  router.get('/', asyncWrapper(getServiceUsers));
  return router;
};

module.exports = area;
