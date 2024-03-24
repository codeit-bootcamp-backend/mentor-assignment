import express from 'express';
import multer from 'multer';
import BaseController from '../controllers/baseController.js';
import BadgeController from '../controllers/badgeController.js';
import uuid4 from 'uuid4';

const baseRoutes = express.Router();
const upload = multer({
    storage: multer.diskStorage({
        filename(req, file, done) {
            const randomId = uuid4();
            const ext = file.originalname.split('.').pop();
            done(null, `${randomId}.${ext}`);
        },

        destination(req, file, done) {
            done(null, 'uploads/');
        },

    }),
});

baseRoutes
    .route('/image')
    .post(upload.single('image'), BaseController.uploadImage);

baseRoutes
    .route('/badges')
    .post(BadgeController.createBadge);

baseRoutes
    .route('/badges')
    .get(BadgeController.getAllBadges);

baseRoutes
    .route('/groupBadges')
    .get(BadgeController.getAllGroupBadges);

export default baseRoutes;