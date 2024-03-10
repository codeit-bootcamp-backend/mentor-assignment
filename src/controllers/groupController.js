import { PrismaClient } from '@prisma/client';
import BaseController from './baseController.js';

const prisma = new PrismaClient()

class GroupController {

    constructor() {
        this._getOneGroup = this._getOneGroup.bind(this);
        this.getGroupInfo = this.getGroupInfo.bind(this);
        this.deleteGroupInfo = this.deleteGroupInfo.bind(this);
        this.verifyGroupPassword = this.verifyGroupPassword.bind(this);
        this.isGroupPublic = this.isGroupPublic.bind(this);
    }

    async _getOneGroup(id) {
        try {
            id = Number(id);
            const data = { id };

            const group = await BaseController._getOne(prisma.group, data);

            return group;

        } catch (error) {
            console.log(error);
            return error;

        }
    }

    async getAllGroups(req, res, next) {
        try {
            const groups = await BaseController._getSeveral(prisma.group);

            res.status(200).json(groups);

        } catch (error) {
            console.error(error);
            res.status(500).send('An error occurred while retrieving all groups.');

        }
    };

    async getGroupInfo(req, res, next) {
        try {
            const group = await this._getOneGroup(Number(req.params.groupId));
            
            res.status(200).json(group);

        } catch (error) {
            console.error(error);
            res.status(500).send('An error occurred while retrieving group info.');
            
        }
    };

    async createGroup(req, res, next) {
        try {
            if (req.file != undefined) {
                req.body.image = req.file.path;

            }
            req.body.isPublic = Boolean(req.body.isPublic);

            const group = await BaseController._createOne(prisma.group, req.body);
            
            res.status(200).send(group);

        } catch (error) {
            console.error(error);
            res.status(500).send('An error occurred while creating group.');

        }
    }

    async updateGroupInfo(req, res, next) {
        try {
            const group = await this._getOneGroup(Number(req.params.groupId));

            if (group.password == req.body.password) {
                if (req.file != undefined) {
                    req.body.image = req.file.path;
    
                }
                req.body.isPublic = Boolean(req.body.isPublic);
    
                const id = Number(req.params.groupId);
                const query = { id };
    
                const updateGroup = await BaseController._updateOne(prisma.group, query, req.body);
    
                res.status(200).json(updateGroup);

            } else {
                res.status(403).json(
                    {
                        "message": "비밀번호가 틀렸습니다"
                    }
                )
                
            }

        } catch (error) {
            console.error(error);
            res.status(500).send('An error occurred while updating group.');

        }
    }

    async deleteGroupInfo(req, res, next) {
        try {
            const group = await this._getOneGroup(Number(req.params.groupId));

            if (group.password == req.body.password) {
                const deleteGroup = await BaseController._deleteOne(prisma.group, group);

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

    async increaseGroupLikes(req, res, next) {
        try {
            const { groupId } = req.params;
            
            const group = await prisma.group.update({
                where: {
                    id: Number(groupId)
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
            res.status(500).send('An error occured while increasing group likes.');

        }
    }

    async verifyGroupPassword(req, res, next) {
        try {
            const group = await this._getOneGroup(Number(req.params.groupId));

            if (group.password == req.body.password) {
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
            res.status(500).send('An error occured while verifying group password.');

        }
    }

    async deleteAllGroups(req, res, next) {
        try {
            const group = await BaseController._deleteAll(prisma.group);

            res.status(200).json(group)

        } catch (error) {
            console.log(error);
            res.status(500).send('An error occured while delete all group informations.');

        }
    }

    async isGroupPublic(req, res, next) {
        try {
            const group = await this._getOneGroup(Number(req.params.groupId));

            if (group.isPublic) {
                res.status(200).send(JSON.parse(`
                    {
                        "id": ${group.id},
                        "isPublic": ${group.isPublic}
                    }
                `));

            }

        } catch (error) {
            console.log(error);
            res.status(500).send('An error occured while checking group public.')

        }
    }
}

export default new GroupController();