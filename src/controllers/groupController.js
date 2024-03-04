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
            console.log(error);
            res.status(500).send('An error occurred while creating group.');
        }
    }
}

export default new groupController();