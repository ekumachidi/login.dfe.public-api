const express = require('express');
const { asyncWrapper } = require('login.dfe.express-error-handling');
const { body } = require('express-validator');
const getOrganisatiobByTypeAndIdentifier = require('./getOrganisatiobByTypeAndIdentifier');
const upsertAnnouncement = require('./upsertAnnouncement');
const deleteAnnouncement = require('./deleteAnnouncement');
const getUsersByRoles = require('./getUsersByRoles');
const getUserOverview = require('./getUserOverview');

const area = () => {
  const router = express.Router();
 /**
 * @openapi
 * /organisations/find-by-type/{type}/{identifier}:
 *  get:
 *     tags:
 *     - Organisations
 *     description: Returns organisation
 *     parameters:
 *       - name: Type
 *         in: path
 *         description: org type
 *         type: integer
 *         required: true
 *       - name: Identifier
 *         in: path
 *         description: org Id
 *         type: GUid
 *         required: true
 *     responses:
 *       200:
 *         description: object returned
 *    
 */
  router.get('/find-by-type/:type/:identifier', asyncWrapper(getOrganisatiobByTypeAndIdentifier));
 /**
 * @openapi
 * /organisations/announcements:
 *  post:
 *     tags:
 *     - Organisations
 *     description: Returns organisation
 *     parameters:
 *       - in: body
 *         name: messageId
 *         description: message id is UUID.
 *       - in: body
 *         name: urn
 *         description: urn is numeric.
 *       - in: body
 *         name: uid
 *         description: uid is UUID.
 *       - in: body
 *         name: type
 *         description: type is integer.
 *       - in: body
 *         name: title
 *         description: not more than 255 characters.
 *       - in: body
 *         name: summary
 *         description: not more than 340 characters.
 *       - in: body
 *         name: body
 *         description: not more than 500 characters.
 *       - in: body
 *         name: publishedAt
 *         description: publishAt is valid ISO8601 format.
 *       - in: body
 *         name: expiresAt
 *         description: expiresAt is valid ISO8601 format.
 *     responses:
 *       200:
 *         description: OK
 *    
 */
  router.post('/announcements',
    body('messageId', 'messageId must be a valid UUID').isUUID(),
    body('urn', 'urn must be numeric type').if(body('uid').isEmpty()).isNumeric(),
    body('uid', 'uid must be a valid UUID').if(body('urn').isEmpty()).isUUID(),
    body('type', 'type must be an integer').isInt(),
    body('title', 'title field cannot be more than 255 characters').isLength({ max: 255 }).escape(),
    body('summary', 'summary field cannot be more than 340 characters').isLength({ max: 340 }).escape(),
    body('body', 'body field cannot be more than 5000 characters').isLength({ max: 5000 }).escape(),
    body('publishedAt', 'publishedAt is not a valid ISO8601 format').isISO8601(),
    body('expiresAt', 'expiresAt is not a valid ISO8601 format').optional({ checkFalsy: true, nullable: true }).isISO8601(),
    asyncWrapper(upsertAnnouncement));
  /**
 * @openapi
 * /organisations/announcements/{messageId}:
 *  delete:
    *     tags:
    *     - Organisations
    *     description: Deletes a anouncement message
    *     parameters:
    *       - name: messageId
    *         in: path
    *         description: identifier for anoucement
    *         type: GUID
    *         required: true
    *     responses:
    *       200:
    *         description: OK   
 */
  router.delete('/announcements/:messageId', asyncWrapper(deleteAnnouncement));
  /**
 * @swagger
 * /organisations/{id}/users:
 *   get:
 *     tags:
 *       - Organisations
 *     description: Returns all users by role
  *     parameters:
  *       - name: id
  *         in: path
  *         description: UKPRN indentifier for organisation
  *         type: integer
  *         required: true
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An Array of Users
 *         schema:
 *           $ref: '#/definitions/users'
 */
  router.get('/:id/users', asyncWrapper(getUsersByRoles));
    /**
 * @swagger
 * /organisations/user-overview/{id}:
 *   get:
 *     tags:
 *       - Organisations
 *     description: Returns all users as an overview
  *     parameters:
  *       - name: id
  *         in: path
  *         description: identifier for User
  *         type: GUID
  *         required: true
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Returns list of user information
 *         schema:
 *           $ref: '#/definitions/user-overview'
 */
  router.get('/user-overview/:id', asyncWrapper(getUserOverview));

  return router;
};

module.exports = area;
