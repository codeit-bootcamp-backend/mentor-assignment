import express from 'express';
import multer from 'multer';
import BaseController from '../controllers/baseController.js';
import uuid4 from 'uuid4';

const postRoutes = express.Router();
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

postRoutes
    .route('/image')
    .post(upload.single('image'), BaseController.uploadImage);

export default postRoutes;