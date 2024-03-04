import express from 'express';
import groupController from '../controllers/groupController.js';
const groupRoutes = express.Router();

groupRoutes
    .route('/groups')
    .get(groupController.getAllGroups);

export default groupRoutes;