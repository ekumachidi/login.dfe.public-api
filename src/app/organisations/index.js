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
 * /find-by-type:
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
 * /announcements:
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
 * /:id/users:
 *   get:
 *     tags:
 *       - Organisations
 *     description: Returns all users by role
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An Array of Users
 *         schema:
 *           $ref: '#/definitions/user-overview'
 */
  router.get('/:id/users', asyncWrapper(getUsersByRoles));
  router.get('/user-overview/:id', asyncWrapper(getUserOverview));

  return router;
};

module.exports = area;
