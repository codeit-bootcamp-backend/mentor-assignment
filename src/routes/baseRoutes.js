import express from 'express';
import multer from 'multer';
import BaseController from '../controllers/baseController.js';

const postRoutes = express.Router();
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

postRoutes
    .route('/image')
    .post(upload.single('image'), BaseController.uploadImage);

export default postRoutes;