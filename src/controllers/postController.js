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
            const posts = await BaseController._getSeveral(prisma.post);

            res.status(200).json(posts);

        } catch (error) {
            console.error(error);
            res.status(500).send('An error occurred while retrieving all Posts.');

        }
    };

    async getPostInfo(req, res, next) {
        try {
            const post = await this._getOnePost(Number(req.params.postId));
            
            res.status(200).json(post);

        } catch (error) {
            console.error(error);
            res.status(500).send('An error occurred while retrieving Post info.');
            
        }
    };

    async createPost(req, res, next) {
        try {
            const group = await GroupController._getOneGroup(Number(req.params.groupId));

            if (group.password == req.body.groupPassword) {
                if (req.file != undefined) {
                    req.body.image = req.file.path;
    
                }

                req.body.isPublic = Boolean(req.body.isPublic);
                req.body.groupId = Number(req.params.groupId);
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
                if (req.file != undefined) {
                    req.body.image = req.file.path;
    
                }
                
                console.log(req.body)

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

            if (post.isPublic) {
                res.status(200).send(JSON.parse(`
                    {
                        "id": ${post.id},
                        "isPublic": ${post.isPublic}
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