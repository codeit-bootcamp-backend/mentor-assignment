import express from 'express';
import groupController from '../controllers/groupController.js';
const groupRoutes = express.Router();

groupRoutes
    .route('/groups')
    .get(groupController.getAllGroups);

groupRoutes
    .route('/groups/:groupId')
    .get(groupController.getGroupInfo);

groupRoutes
    .route('/groups')
    .post(groupController.createGroup);

groupRoutes
    .route('/groups/:groupId')
    .put(groupController.changeGroupInfo)

groupRoutes
    .route('/groups/:groupId')
    .delete(groupController.deleteGroupInfo);

groupRoutes
    .route('/groups/:groupId/like')
    .post(groupController.increaseGroupLikes);

groupRoutes
    .route('/groups/:groupId/verify-password')
    .post(groupController.verifyGroupPassword);

export default groupRoutes;