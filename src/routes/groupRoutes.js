import express from 'express';
import GroupController from '../controllers/groupController.js';
import multer from 'multer';

const groupRoutes = express.Router();
const upload = multer({
    storage: multer.diskStorage({
        filename(req, file, done) {
            done(null, file.originalname);
        },

        destination(req, file, done) {
            done(null, 'uploads/');
        },

    }),
});

groupRoutes
    .route('/groups')
    .get(GroupController.getAllGroups);

groupRoutes
    .route('/groups/:groupId')
    .get(GroupController.getGroupInfo);

groupRoutes
    .route('/groups')
    .post(upload.single('image'), GroupController.createGroup);

groupRoutes
    .route('/groups/:groupId')
    .put(upload.single('image'), GroupController.updateGroupInfo)

groupRoutes
    .route('/groups/:groupId')
    .delete(GroupController.deleteGroupInfo);

groupRoutes
    .route('/groups/:groupId/like')
    .post(GroupController.increaseGroupLikes);

groupRoutes
    .route('/groups/:groupId/verify-password')
    .post(GroupController.verifyGroupPassword);

groupRoutes
    .route('/groups/:groupId/is-public')
    .get(GroupController.isGroupPublic);

groupRoutes
    .route('/groups/test/delete')
    .get(GroupController.deleteAllGroups);

export default groupRoutes;