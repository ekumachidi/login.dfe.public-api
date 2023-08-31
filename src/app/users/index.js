const express = require('express');
const { asyncWrapper } = require('login.dfe.express-error-handling');
const getServiceUsers = require('./getServiceUsers');

const getUserOrganisations = require('./getUsersOrganisations');
const getUserOrganisationsV2 = require('./getUsersOrganisationsV2');

const getApprovers = require('./getApprovers');

const area = () => {
  const router = express.Router();
 /**
   * @openapi
   * /users/{id}/organisations:
   *  get:
   *     tags:
   *     - Users
   *     description: Returns list of users organisations
   *     parameters:
    *       - name: id
    *         in: path
    *         description: identifier for User
    *         type: GUID
    *         required: true
   *     responses:
   *       200:
   *         description: return an array of users organisations
   */
  router.get('/:id/organisations', asyncWrapper(getUserOrganisations));
   /**
   * @openapi
   * /users/{id}/v2/organisations:
   *  get:
   *     tags:
   *     - Users
   *     description: Returns list of users organisations
   *     parameters:
    *       - name: id
    *         in: path
    *         description: identifier for User
    *         type: GUID
    *         required: true
   *     responses:
   *       200:
   *         description: return an array of users organisations
   */
  router.get('/:id/v2/organisations', asyncWrapper(getUserOrganisationsV2));
   /**
   * @openapi
   * /users/:
   *  get:
   *     tags:
   *     - Users
   *     description: Returns list of service users
   *     responses:
   *       200:
   *         description: return an array of service users
   */
  router.get('/', asyncWrapper(getServiceUsers));
     /**
   * @openapi
   * /users/approvers:
   *  get:
   *     tags:
   *     - Users
   *     description: Returns list of service approvers
   *     responses:
   *       200:
   *         description: return an array of users approvers
   */
  router.get('/approvers', asyncWrapper(getApprovers));

  return router;
};

module.exports = area;
