import { PrismaClient } from '@prisma/client';
import BaseController from './baseController.js';
import GroupController from './groupController.js';

const prisma = new PrismaClient()

class PostController {

    constructor() {
        this._getOnePost = this._getOnePost.bind(this);
        this.getPostInfo = this.getPostInfo.bind(this);
        this.deletePostInfo = this.deletePostInfo.bind(this);
        this.verifyPostPassword = this.verifyPostPassword.bind(this);
        this.isPostPublic = this.isPostPublic.bind(this);
        this.updatePostInfo = this.updatePostInfo.bind(this);
    }

    async _getOnePost(id) {
        try {
            id = Number(id);
            const data = { id };

            const post = await BaseController._getOne(prisma.post, data);

            return post;

        } catch (error) {
            console.log(error);
            return error;

        }
    }

    async getAllPosts(req, res, next) {
        try {
            const { page, pageSize, sortBy, keyword, isPublic } = req.query;
            const parsedPage = Number(page) || 1;
            const parsedPageSize = Number(pageSize) || 2;
            let parsedIsPublicQuery = isPublic || null;

            if (parsedIsPublicQuery != null) {
                if (parsedIsPublicQuery == 'true') {
                    parsedIsPublicQuery = true;
                } else {
                    parsedIsPublicQuery = false;
                }
            }

            const query = {};
            const pagination = {};

            pagination.take = parsedPageSize;
            pagination.skip = (parsedPage - 1) * parsedPageSize;

            if (sortBy !== undefined) {
                query.orderBy = {
                    [sortBy]: 'asc',
                };
            }

            if (keyword !== undefined) {
                query.OR = [
                    { title: { contains: keyword } },
                    { content: { contains: keyword } },
                    { location: { contains: keyword } },
                    { nickname: { contains: keyword } }
                ];
            }

            if (parsedIsPublicQuery !== null) {
                query.isPublic = parsedIsPublicQuery;
            }

            query.groupId = Number(req.params.groupId);

            const posts = await BaseController._getSeveral(prisma.post, query, pagination);
            console.log(posts);
            const modifiedPosts = await Promise.all(posts.map(async post => {
                const { groupId, password, content, groupPassword, postPassword, comments, ...rest } = post;
                const commentCount = await BaseController._getCount(prisma.comment, { postId: post.id });
                const postIsPublic = post.isPublic;
                rest.commentCount = commentCount;

                if (!postIsPublic) {
                    return {
                        ...rest,
                        location: null,
                        content: null,
                        image: null,
                        tags: null,
                        moment: null
                    };

                }

                return rest;
            }));
            
            const postCount = await BaseController._getCount(prisma.post, query);
            res.status(200).json(
                {
                    currentPage: parsedPage,
                    totalPages: Math.ceil(postCount / parsedPageSize),
                    totalItemCount: postCount,
                    data: modifiedPosts
                }
            );

        } catch (error) {
            console.error(error);
            res.status(500).send('An error occurred while retrieving all Posts.');

        }
    };

    async getPostInfo(req, res, next) {
        try {
            const post = await this._getOnePost(Number(req.params.postId));
            const commentCount = await BaseController._getCount(prisma.comment, { postId: post.id });
            
            if (post != null) {
                const { password, comments, ...modifiedPost } = post;
                modifiedPost.commentCount = commentCount;
                res.status(200).json(modifiedPost);
            } else {
                res.status(500).json({
                    "message": "해당하는 게시글이 없습니다"
                });
            }

        } catch (error) {
            console.error(error);
            res.status(500).send('An error occurred while retrieving Post info.');
            
        }
    };

    async createPost(req, res, next) {
        try {
            const group = await GroupController._getOneGroup(Number(req.params.groupId));

            if (group.password == req.body.groupPassword) {
                console.log(req.body.isPublic);
                req.body.isPublic = Boolean(req.body.isPublic);
                console.log(req.body.isPublic);
                req.body.group = {
                    connect : {
                        id : Number(req.params.groupId)
                    }
                }
                req.body.tags = JSON.parse(req.body.tags);
                req.body.moment = new Date(req.body.moment);
                req.body.password = req.body.postPassword;

                delete req.body.groupPassword;
                delete req.body.postPassword;


                const post = await BaseController._createOne(prisma.post, req.body);
            
                res.status(200).send(post);

            } else {
                res.status(403).json({
                    "message": "그룹 비밀번호가 틀렸습니다"
                });

            }

        } catch (error) {
            console.error(error);
            res.status(500).send('An error occurred while creating Post.');

        }
    }

    async updatePostInfo(req, res, next) {
        try {
            const post = await this._getOnePost(Number(req.params.postId));
            const groupId = post.groupId;

            if (post.password == req.body.postPassword) {
                req.body.isPublic = Boolean(req.body.isPublic);
                req.body.groupId = Number(groupId);
                req.body.tags = JSON.parse(req.body.tags);
                req.body.moment = new Date(req.body.moment);
                req.body.password = req.body.postPassword;

                delete req.body.postPassword;

                const id = Number(req.params.postId);
                const query = { id };
                console.log(query);
                const post = await BaseController._updateOne(prisma.post, query, req.body);

                res.status(200).json(post);

            } else {
                res.status(403).json({
                    "message": "포스트 비밀번호가 틀렸습니다"
                });

            }

        } catch (error) {
            console.error(error);
            res.status(500).send('An error occurred while updating Post.');

        }
    }

    async deletePostInfo(req, res, next) {
        try {
            const post = await this._getOnePost(Number(req.params.postId));

            if (post.password == req.body.postPassword) {
                delete post.tags;
                const deletePost = await BaseController._deleteOne(prisma.post, post);

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
            res.status(500).send('An error occurred while deleting Post.');

        }
    }

    async increasePostLikes(req, res, next) {
        try {
            const { postId } = req.params;
            
            const post = await prisma.post.update({
                where: {
                    id: Number(postId)
                },

                data: {
                    likeCount: { increment: 1 }
                }

            });
            
            res.status(200).json(
                {
                    "message": "게시글 공감하기 성공"
                }
            )

        } catch (error) {
            console.error(error);
            res.status(500).send('An error occured while increasing Post likes.');

        }
    }

    async verifyPostPassword(req, res, next) {
        try {
            const post = await this._getOnePost(Number(req.params.postId));

            if (post.password == req.body.password) {
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
            res.status(500).send('An error occured while verifying Post password.');

        }
    }

    async deleteAllPosts(req, res, next) {
        try {
            const post = await BaseController._deleteAll(prisma.post);

            res.status(200).json(post)

        } catch (error) {
            console.log(error);
            res.status(500).send('An error occured while delete all Post informations.');

        }
    }

    async isPostPublic(req, res, next) {
        try {
            const post = await this._getOnePost(Number(req.params.postId));

            res.status(200).send(JSON.parse(`
                {
                    "id": ${post.id},
                    "isPublic": ${post.isPublic}
                }
            `));

        } catch (error) {
            console.log(error);
            res.status(500).send('An error occured while checking Post public.')

        }
    }
}

export default new PostController();