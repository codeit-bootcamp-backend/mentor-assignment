import express from 'express';
import PostController from '../controllers/postController.js';
import multer from 'multer';

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
    .route('/groups/:groupId/posts')
    .get(PostController.getAllPosts);

postRoutes
    .route('/groups/:groupId/posts')
    .post(upload.single('image'), PostController.createPost);    

postRoutes
    .route('/posts/:postId')
    .get(PostController.getPostInfo);

postRoutes
    .route('/posts/:postId')
    .put(upload.single('image'), PostController.updatePostInfo)

postRoutes
    .route('/posts/:postId')
    .delete(PostController.deletePostInfo);

postRoutes
    .route('/posts/:postId/like')
    .post(PostController.increasePostLikes);

postRoutes
    .route('/posts/:postId/verify-password')
    .post(PostController.verifyPostPassword);

postRoutes
    .route('/posts/:postId/is-public')
    .post(PostController.isPostPublic);

export default postRoutes;