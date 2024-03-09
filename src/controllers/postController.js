import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

class postController {
    async getAllPostsInGroup(req, res, next) {
        try {
            const { groupId } = req.params;

            const posts = await prisma.post.findMany({
                where: {
                    groupId
                }
            });

            res.status(200).json(posts);
        } catch (error) {
            console.error(error);
            res.status(500).send('An error occurred while retrieving all posts in group.');
        }
    };

    async createPostInGroup(req, res, next) {
        try {
            const { groupId } = req.params;
            const { nickname, title, password, content, tags, location, moment, isPublic } = req.body;

            const post = await prisma.post.create({
                data: {
                    groupId,
                    nickname,
                    title,
                    password,
                    content,
                    tags,
                    location,
                    moment,
                    isPublic
                }
            });

            res.status(200).json(post);
        } catch (error) {
            console.error(error);
            res.status(500).send('An error occurred while creating post.');
        }
    }

    async getPostInfo(req, res, next) {
        try {
            const { postId } = req.params;
            
            const post = await prisma.post.findUnique({
                where: {
                    id: Number(postId)
                }
            });
            
            res.status(200).json(post);
        } catch (error) {
            console.error(error);
            res.status(500).send('An error occurred while retrieving post info.');
        }
    };

    async changePostInfo(req, res, next) {
        try {
            const { postId } = req.params;
            const { nickname, title, password, content, tags, location, moment, isPublic } = req.body;

            const post = await prisma.post.update({
                where: {
                    id: Number(postId)
                },
                data: {
                    id: Number(postId),
                    nickname,
                    title,
                    password,
                    content,
                    tags,
                    location,
                    moment,
                    isPublic
                }
            })

            res.status(200).json(post);
        } catch (error) {
            console.error(error);
            res.status(500).send('An error occurred while updating post.');
        }
    }

    async deletePostInfo(req, res, next) {
        try {
            const { postId } = req.params;
            const { password } = req.body;

            const post = await prisma.post.findUnique({
                where: {
                    id: Number(postId)
                }
            });

            if (post.password == password) {
                const deletePost = await prisma.post.delete({
                    where: {
                        id: Number(postId)
                    }
                });

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
            res.status(500).send('An error occurred while deleting post.');
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
                    likes: { increment: 1}
                }
            });
            
            res.status(200).json(
                {
                    "message": "그룹 공감하기 성공"
                }
            )
        } catch (error) {
            console.error(error);
            res.status(500).send('An error occured while increasing post likes.');
        }
    }
}

export default new postController();