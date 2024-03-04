import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

class groupController {
    async getAllGroups(req, res, next) {
        try {
            const groups = await prisma.group.findMany();
            res.status(200).json(groups);
        } catch (error) {
            console.error(error);
            res.status(500).send('An error occurred while retrieving all groups.');
        }
    };

    async getGroupInfo(req, res, next) {
        try {
            const { groupId } = req.params;
            
            const group = await prisma.group.findUnique({
                where: {
                    id: Number(groupId)
                }
            });
            
            res.status(200).json(group);
        } catch (error) {
            console.error(error);
            res.status(500).send('An error occurred while retrieving group info.');
        }
    };

    async createGroup(req, res, next) {
        try {
            const { name, password, isPublic, introduction } = req.body;

            const group = await prisma.group.create({
                data: {
                    name,
                    password,
                    isPublic,
                    introduction
                }
            });

            const groups = await prisma.group.findMany();
            res.status(200).json(groups);
        } catch (error) {
            console.error(error);
            res.status(500).send('An error occurred while creating group.');
        }
    }

    async changeGroupInfo(req, res, next) {
        try {
            const { groupId } = req.params;
            const { name, password, isPublic, introduction } = req.body;

            const group = await prisma.group.update({
                where: {
                    id: Number(groupId)
                },
                data: {
                    id: Number(groupId),
                    name,
                    password,
                    isPublic,
                    likeCount,
                    postCount,
                    badgeCount,
                    createdAt,
                    introduction
                }
            })

            res.status(200).json(group);
        } catch (error) {
            console.error(error);
            res.status(500).send('An error occurred while updating group.');
        }
    }

    async deleteGroupInfo(req, res, next) {
        try {
            const { groupId } = req.params;
            const { password } = req.body;

            const group = await prisma.group.findUnique({
                where: {
                    id: Number(groupId)
                }
            });

            if (group.password == password) {
                const deleteGroup = await prisma.group.delete({
                    where: {
                        id: Number(groupId)
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
            res.status(500).send('An error occurred while deleting group.');
        }
    }
}

export default new groupController();