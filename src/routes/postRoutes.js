import express from 'express';
import PostController from '../controllers/postController.js';
const postRoutes = express.Router();

postRoutes
    .route('/groups/:groupId/posts')
    .get(PostController.getAllPosts);

postRoutes
    .route('/groups/:groupId/posts')
    .post(PostController.createPost);    

postRoutes
    .route('/posts/:postId')
    .get(PostController.getPostInfo);

postRoutes
    .route('/posts/:postId')
    .put(PostController.updatePostInfo)

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
    .route('/posts/:postId/verify-password')
    .post(PostController.isPostPublic);

export default postRoutes;