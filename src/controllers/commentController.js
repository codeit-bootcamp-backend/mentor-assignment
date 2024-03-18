import { PrismaClient } from '@prisma/client';
import BaseController from './baseController.js';
import PostController from './postController.js';
import baseController from './baseController.js';

const prisma = new PrismaClient()

class CommentController {

    constructor() {
        this._getOneComment = this._getOneComment.bind(this);
        this.deleteCommentInfo = this.deleteCommentInfo.bind(this);
        this.verifyCommentPassword = this.verifyCommentPassword.bind(this);
        this.isCommentPublic = this.isCommentPublic.bind(this);
        this.updateCommentInfo = this.updateCommentInfo.bind(this);
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
            const comments = await baseController._getSeveral(prisma.comment, query, pagination);
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
            // const modifiedComment = {
            //     password,
            //     ...comment
            // }

            res.status(200).send(comment);

        } catch (error) {
            console.error(error);
            res.status(500).send('An error occurred while creating Comment.');

        }
    }

    async updateCommentInfo(req, res, next) {
        try {
            const comment = await this._getOneComment(Number(req.params.commentId));
            const groupId = Comment.groupId;

            if (Comment.password == req.body.CommentPassword) {
                if (req.file != undefined) {
                    req.body.image = req.file.path;
    
                }
                
                console.log(req.body)

                req.body.isPublic = Boolean(req.body.isPublic);
                req.body.groupId = Number(groupId);
                req.body.tags = JSON.parse(req.body.tags);
                req.body.moment = new Date(req.body.moment);
                req.body.password = req.body.CommentPassword;

                delete req.body.CommentPassword;

                const id = Number(req.params.commentId);
                const query = { id };
                console.log(query);
                const comment = await BaseController._updateOne(prisma.comment, query, req.body);

                res.status(200).json(comment);

            } else {
                res.status(403).json({
                    "message": "포스트 비밀번호가 틀렸습니다"
                });

            }

        } catch (error) {
            console.error(error);
            res.status(500).send('An error occurred while updating Comment.');

        }
    }

    async deleteCommentInfo(req, res, next) {
        try {
            const comment = await this._getOneComment(Number(req.params.commentId));

            if (Comment.password == req.body.CommentPassword) {
                delete Comment.tags;
                const deleteComment = await BaseController._deleteOne(prisma.comment, Comment);

                res.status(200).json(
                    {
                        "message": "게시글 삭제 성공"
                    }
                )

            } else {
                res.status(403).json(
                    {
                        "message": "비밀번호가 틀렸습니다"
                    }
                )
            
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('An error occurred while deleting Comment.');

        }
    }

    async increaseCommentLikes(req, res, next) {
        try {
            const { CommentId } = req.params;
            
            const comment = await prisma.comment.update({
                where: {
                    id: Number(CommentId)
                },

                data: {
                    likes: { increment: 1 }
                }

            });
            
            res.status(200).json(
                {
                    "message": "게시글 공감하기 성공"
                }
            )

        } catch (error) {
            console.error(error);
            res.status(500).send('An error occured while increasing Comment likes.');

        }
    }

    async verifyCommentPassword(req, res, next) {
        try {
            const comment = await this._getOneComment(Number(req.params.commentId));

            if (Comment.password == req.body.password) {
                res.status(200).json(
                    {
                        "message": "비밀번호가 확인되었습니다"
                    }
                );

            } else {
                res.status(401).json(
                    {
                        "message": "비밀번호가 틀렸습니다"
                    }
                );

            }
        } catch (error) {
            console.log(error);
            res.status(500).send('An error occured while verifying Comment password.');

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

    async isCommentPublic(req, res, next) {
        try {
            const comment = await this._getOneComment(Number(req.params.commentId));

            if (Comment.isPublic) {
                res.status(200).send(JSON.parse(`
                    {
                        "id": ${Comment.id},
                        "isPublic": ${Comment.isPublic}
                    }
                `));

            }

        } catch (error) {
            console.log(error);
            res.status(500).send('An error occured while checking Comment public.')

        }
    }
}

export default new CommentController();