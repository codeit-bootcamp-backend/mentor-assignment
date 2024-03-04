import express from 'express';
import groupController from '../controllers/groupController.js';
const groupRoutes = express.Router();

groupRoutes
    .route('/groups')
    .get(groupController.getAllGroups);

groupRoutes
    .route('/groups/:groupId')
    .get(groupController.getGroupInfo);

export default groupRoutes;