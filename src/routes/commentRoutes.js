import express from 'express';
import CommentController from '../controllers/commentController.js';

const commentRoutes = express.Router();

commentRoutes
    .route('/posts/:postId/comments')
    .get(CommentController.getAllComments);

commentRoutes
    .route('/posts/:postId/comments')
    .post(CommentController.createComment);

// commentRoutes
//     .route('/comments/:commentId')
//     .put(CommentController.updateComment);

commentRoutes
    .route('/comments/:commentId')
    // .delete(CommentController.deleteComment);

export default commentRoutes;