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
}

export default new groupController();