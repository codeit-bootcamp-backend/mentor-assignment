import { PrismaClient } from '@prisma/client';
import BaseController from './baseController.js';

const prisma = new PrismaClient()

class PostController {

    constructor() {
        this._getOnePost = this._getOnePost.bind(this);
        this.getPostInfo = this.getPostInfo.bind(this);
        this.deletePostInfo = this.deletePostInfo.bind(this);
        this.verifyPostPassword = this.verifyPostPassword.bind(this);
        this.isPostPublic = this.isPostPublic.bind(this);
    }

    async _getOnePost(id) {
        try {
            id = Number(id);
            const data = { id };

            const Post = await BaseController._getOne(prisma.post, data);

            return Post;

        } catch (error) {
            console.log(error);
            return error;

        }
    }

    async getAllPosts(req, res, next) {
        try {
            const Posts = await BaseController._getSeveral(prisma.post);

            res.status(200).json(Posts);

        } catch (error) {
            console.error(error);
            res.status(500).send('An error occurred while retrieving all Posts.');

        }
    };

    async getPostInfo(req, res, next) {
        try {
            const Post = await this._getOnePost(Number(req.params.postId));
            
            res.status(200).json(Post);

        } catch (error) {
            console.error(error);
            res.status(500).send('An error occurred while retrieving Post info.');
            
        }
    };

    async createPost(req, res, next) {
        try {
            const Post = await BaseController._createOne(prisma.post, req.body);
            
            res.status(200).send(Post);

        } catch (error) {
            console.error(error);
            res.status(500).send('An error occurred while creating Post.');

        }
    }

    async updatePostInfo(req, res, next) {
        try {
            const id = Number(req.params.postId);
            const query = { id };

            const Post = await BaseController._updateOne(prisma.post, query, req.body);

            res.status(200).json(Post);

        } catch (error) {
            console.error(error);
            res.status(500).send('An error occurred while updating Post.');

        }
    }

    async deletePostInfo(req, res, next) {
        try {
            const Post = await this._getOnePost(Number(req.params.postId));

            if (Post.password == req.body.password) {
                const deletePost = await BaseController._deleteOne(prisma.post, Post);

                res.status(200).json(
                    {
                        "message": "그룹 삭제 성공"
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
            const { PostId } = req.params;
            
            const Post = await prisma.post.update({
                where: {
                    id: Number(PostId)
                },

                data: {
                    likes: { increment: 1 }
                }

            });
            
            res.status(200).json(
                {
                    "message": "그룹 공감하기 성공"
                }
            )

        } catch (error) {
            console.error(error);
            res.status(500).send('An error occured while increasing Post likes.');

        }
    }

    async verifyPostPassword(req, res, next) {
        try {
            const Post = await this._getOnePost(Number(req.params.postId));

            if (Post.password == req.body.password) {
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
            const Post = await BaseController._deleteAll(prisma.post);

            res.status(200).json(Post)

        } catch (error) {
            console.log(error);
            res.status(500).send('An error occured while delete all Post informations.');

        }
    }

    async isPostPublic(req, res, next) {
        try {
            const Post = await this._getOnePost(Number(req.params.postId));

            if (Post.isPublic) {
                res.status(200).send(JSON.parse(`
                {
                    "id": ${Post.id},
                    "isPublic": ${Post.isPublic}
                }
            `));

            }

        } catch (error) {
            console.log(error);
            res.status(500).send('An error occured while checking Post public.')

        }
    }
}

export default new PostController();