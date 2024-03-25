import { PrismaClient } from '@prisma/client';
import BaseController from './baseController.js';

const prisma = new PrismaClient()

class CommentController {

    constructor() {
        this._getOneComment = this._getOneComment.bind(this);
        this.getAllComment = this.getAllComments.bind(this);
        this.deleteComment = this.deleteComment.bind(this);
        this.updateComment = this.updateComment.bind(this);
    }

    async _getOneComment(id) {
        try {
            id = Number(id);
            const data = { id };

            const comment = await BaseController._getOne(prisma.comment, data);

            return comment;

        } catch (error) {
            console.log(error);
            return error;

        }
    }

    async getAllComments(req, res, next) {
        try {
            const { page, pageSize, commentId } = req.query;
            const parsedPage = Number(page) || 1;
            const parsedPageSize = Number(pageSize) || 2;
            const parsedCommentId = Number(commentId) || null;

            const query = {};
            const pagination = {};

            pagination.take = parsedPageSize;
            pagination.skip = (parsedPage - 1) * parsedPageSize;
            
            if (parsedCommentId !== null) {
                query.id = parsedCommentId;
            }
            
            query.postId = Number(req.params.postId);
            console.log(query);
            const comments = await BaseController._getSeveral(prisma.comment, query, pagination);
            const modifiedComments = comments.map((comment) => {
                const { password, postId, ...rest } = comment;
                return rest;
            });

            const commentCount = await BaseController._getCount(prisma.comment, query);
            res.status(200).json(
                {
                    currentPage: parsedPage,
                    totalPages: Math.ceil(commentCount / parsedPageSize),
                    totalItemCount: commentCount,
                    data: modifiedComments
                }
            );

        } catch (error) {
            console.error(error);
            res.status(500).send('An error occurred while retrieving all Comments.');

        }
    };

    async createComment(req, res, next) {
        try {
            req.body.post = {
                connect: {
                    id: Number(req.params.postId)
                }
            }

            const comment = await BaseController._createOne(prisma.comment, req.body);
            delete comment.password;
            delete comment.postId;
            delete comment.updatedAt;

            res.status(200).send(comment);

        } catch (error) {
            console.error(error);
            res.status(500).send('An error occurred while creating Comment.');

        }
    }

    async updateComment(req, res, next) {
        try {
            const comment = await this._getOneComment(Number(req.params.commentId));
            const postId = comment.postId;

            if (comment != null) {
                if (req.body.password == comment.password) {
                    const id = Number(req.params.commentId);
                    const query = { id };
                    const updatedComment = await BaseController._updateOne(prisma.comment, query, req.body);
                    delete updatedComment.password;
                    delete updatedComment.postId;
                    delete updatedComment.updatedAt;
                    delete updatedComment.createdAt;
    
                    res.status(200).json(updatedComment);       
                } else {
                    res.status(403).json({
                        message: "비밀번호가 틀렸습니다."
                    });
                }
            } else {
                res.status(404).json({
                    message: "존재하지 않습니다"
                });
            }

        } catch (error) {
            console.error(error);
            res.status(500).send('An error occurred while updating Comment.');

        }
    }

    async deleteComment(req, res, next) {
        try {
            const comment = await this._getOneComment(Number(req.params.commentId));
            if(comment != null){
                if (comment.password == req.body.password) {
                    const query = { id: Number(req.params.commentId) };
                    const deleteComment = await BaseController._deleteOne(prisma.comment, query);

                    res.status(200).json(
                        {
                            "message": "답글 삭제 성공"
                        }
                    )

                } else {
                    res.status(403).json(
                        {
                            "message": "비밀번호가 틀렸습니다"
                        }
                    )
                
                }

            } else {
                res.status(404).json({
                    message: "존재하지 않습니다"
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('An error occurred while deleting Comment.');

        }
    }

    async deleteAllComments(req, res, next) {
        try {
            const comment = await BaseController._deleteAll(prisma.comment);

            res.status(200).json(comment)

        } catch (error) {
            console.log(error);
            res.status(500).send('An error occured while delete all Comment informations.');

        }
    }
}

export default new CommentController();