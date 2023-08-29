const express = require('express');
const { asyncWrapper } = require('login.dfe.express-error-handling');

const listServices = require('./listServices');
const getService = require('./getService');
const updateService = require('./updateService');
const createService = require('./createService');
const regenerateSecret = require('./regenerateSecret');
const inviteUser = require('./inviteUser');
const getUsersAccess = require('./getUsersAccess');
const deleteService = require('./deleteService');
const serviceGrants = require('./serviceGrants');
const serviceGrantTokens = require('./serviceGrantTokens');


const area = () => {
  const router = express.Router();
  /**
   * @openapi
   * /:
   *  get:
   *     tags:
   *     - Services
   *     description: Returns list of services
   *     responses:
   *       200:
   *         description: return list of services
   */
  router.get('/', asyncWrapper(listServices));
  /**
   * @openapi
   * /:
   *  get:
   *     tags:
   *     - Services
   *     description: Returns a services
   *     parameters:
    *       - name: clientid
    *         in: path
    *         description: identifier for client
    *         type: GUID
    *         required: true
   *     responses:
   *       200:
   *         description: return a service
   */
  router.get('/:clientid', asyncWrapper(getService));
  /**
   * @openapi
   * /:
   *  patch:
   *     tags:
   *     - Services
   *     description: Update a service
   *     parameters:
    *       - name: clientid
    *         in: path
    *         description: identifier for client
    *         type: GUID
    *         required: true
   *     responses:
   *       200:
   *         description: OK
   */
  router.patch('/:clientid', asyncWrapper(updateService));
   /**
 * @openapi
 * /:
 *  delete:
    *     tags:
    *     - Services
    *     description: Deletes a service
    *     parameters:
    *       - name: clientid
    *         in: path
    *         description: identifier for client
    *         type: GUID
    *         required: true
    *     responses:
    *       200:
    *         description: OK   
 */
  router.delete('/:clientid', asyncWrapper(deleteService));
  /**
 * @openapi
 * /:
 *  post:
    *     tags:
    *     - Services
    *     description: add a new service
    *     parameters:
    *       - name: clientid
    *         in: path
    *         description: identifier for client
    *         type: GUID
    *         required: true
    *     responses:
    *       200:
    *         description: OK   
 */
  router.post('/', asyncWrapper(createService));
  /**
 * @openapi
 * /:clientid/regenerate-secret:
 *  post:
    *     tags:
    *     - Services
    *     description: add a new service
    *     parameters:
    *       - name: clientid
    *         in: path
    *         description: identifier for client
    *         type: GUID
    *         required: true
    *     responses:
    *       200:
    *         description: OK   
 */
  router.post('/:clientid/regenerate-secret', asyncWrapper(regenerateSecret));
  /**
 * @openapi
 * /:sid/invitations:
 *  post:
    *     tags:
    *     - Services
    *     description: invite a user
    *     parameters:
    *       - name: sid
    *         in: path
    *         description: identifier for service
    *         type: GUID
    *         required: true
    *     responses:
    *       200:
    *         description: OK   
 */
  router.post('/:sid/invitations', asyncWrapper(inviteUser));
   /**
   * @openapi
   * /:sid/organisations/:oid/users/:uid:
   *  get:
   *     tags:
   *     - Services
   *     description: Returns users access information
   *     parameters:
    *       - name: sid
    *         in: path
    *         description: identifier for service
    *         type: GUID
    *         required: true
    *       - name: oid
    *         in: path
    *         description: identifier for organisation
    *         type: GUID
    *         required: true
    *       - name: uid
    *         in: path
    *         description: identifier for user
    *         type: GUID
    *         required: true
   *     responses:
   *       200:
   *         description: return a user access
   */
  router.get('/:sid/organisations/:oid/users/:uid', asyncWrapper(getUsersAccess));
  // router.get('/:sid/users/:uid', asyncWrapper(getUsersAccess)); // TODO: Allow this once users can be mapped without organisation
   /**
   * @openapi
   * /:sid/grants:
   *  get:
   *     tags:
   *     - Services
   *     description: adds access to service
   *     parameters:
    *       - name: sid
    *         in: path
    *         description: identifier for service
    *         type: GUID
    *         required: true
   *     responses:
   *       200:
   *         description: return a user access
   */
  router.get('/:sid/grants', asyncWrapper(serviceGrants));
    /**
   * @openapi
   * /:sid/grants/:grantId/tokens:
   *  get:
   *     tags:
   *     - Services
   *     description: Returns list of tokens
   *     parameters:
    *       - name: sid
    *         in: path
    *         description: identifier for service
    *         type: GUID
    *         required: true
    *       - name: grantId
    *         in: path
    *         description: identifier for tokens
    *         type: GUID
    *         required: true
   *     responses:
   *       200:
   *         description: return an array of tokens
   */
  router.get('/:sid/grants/:grantId/tokens', asyncWrapper(serviceGrantTokens));

  return router;
};

module.exports = area;
