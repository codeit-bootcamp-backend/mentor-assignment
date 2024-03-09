import express from 'express';
import postController from '../controllers/postController.js';
const postRoutes = express.Router();

postRoutes
    .route('/groups/:groupId/posts')
    .get(postController.getAllPostsInGroup);

postRoutes
    .route('/groups/:groupId/posts')
    .get(postController.createPostInGroup);    

postRoutes
    .route('/posts/:postId')
    .get(postController.getPostInfo);

postRoutes
    .route('/posts/:postId')
    .put(postController.changePostInfo)

postRoutes
    .route('/posts/:postId')
    .delete(postController.deletePostInfo);

postRoutes
    .route('/posts/:postId/like')
    .post(postController.increasePostLikes);

export default postRoutes;