import { PrismaClient } from '@prisma/client';
import BaseController from './baseController.js';
import BadgeController from './badgeController.js';
import { query } from 'express';

const prisma = new PrismaClient()

class GroupController {

    constructor() {
        this._getOneGroup = this._getOneGroup.bind(this);
        this.getGroupInfo = this.getGroupInfo.bind(this);
        this.deleteGroupInfo = this.deleteGroupInfo.bind(this);
        this.verifyGroupPassword = this.verifyGroupPassword.bind(this);
        this.isGroupPublic = this.isGroupPublic.bind(this);
        this.updateGroupInfo = this.updateGroupInfo.bind(this);
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
                    { name: {contains: keyword } },
                    { introduction: {contains: keyword } }
                ];
            }

            if (parsedIsPublicQuery !== null) {
                query.isPublic = parsedIsPublicQuery;
            }

            const groups = await BaseController._getSeveral(prisma.group, query, pagination);

            const modifiedGroups = await Promise.all(groups.map(async group => {
                const { password, ...rest } = group;
                const postCount = await BaseController._getCount(prisma.post, { groupId: group.id });
                rest.postCount = postCount;

                if (!group.isPublic) {
                    return {
                        ...rest,
                        introduction: null,
                        imageUrl: null,
                        badgeCount: null,
                        likeCount: null,
                        postCount: null
                    };

                }
                BadgeController._addBadgeToGroup(rest);

                const groupBadges = await BaseController._getSeveral(prisma.groupBadge, { groupId: rest.id });
                
                if (groupBadges.length > 0) {
                    rest.badges = groupBadges.map(groupBadge => groupBadge.badgeId);
                } else {
                    rest.badges = null;
                }
                
                return rest;

            }));

            const groupCount = await BaseController._getCount(prisma.group, query);
            res.status(200).json(
                {
                    currentPage: parsedPage,
                    totalPages: Math.ceil(groupCount / parsedPageSize),
                    totalItemCount: groupCount,
                    data: modifiedGroups
                }
            );

        } catch (error) {
            console.error(error);
            res.status(500).send('An error occurred while retrieving all groups.');

        }
    };

    async getGroupInfo(req, res, next) {
        try {
            const group = await this._getOneGroup(Number(req.params.groupId));
            console.log(group)
            if (group != null) {
                BadgeController._addBadgeToGroup(group);
                const modifiedGroup = {
                    ...group
                };

                const groupBadges = await BaseController._getSeveral(prisma.groupBadge, { groupId: group.id });
                
                if (groupBadges.length > 0) {
                    modifiedGroup.badges = groupBadges.map(groupBadge => groupBadge.badgeId);
                } else {
                    modifiedGroup.badges = null;
                }

                res.status(200).json(modifiedGroup);

            } else {
                res.status(500).json({
                    message: "Invalid group id"
                });

            }
        } catch (error) {
            console.error(error);
            res.status(500).send('An error occurred while retrieving group info.');
            
        }
    };

    async createGroup(req, res, next) {
        try {
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
                    likeCount: { increment: 1 }
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

            res.status(200).send(JSON.parse(`
                {
                    "id": ${group.id},
                    "isPublic": ${group.isPublic}
                }
            `));

        } catch (error) {
            console.log(error);
            res.status(500).send('An error occured while checking group public.')

        }
    }
}

export default new GroupController();