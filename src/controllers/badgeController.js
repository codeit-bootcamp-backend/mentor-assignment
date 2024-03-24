import { PrismaClient } from '@prisma/client';
import BaseController from './baseController.js';
import baseController from './baseController.js';

const prisma = new PrismaClient()

class BadgeController { 
    
        constructor() {
            this._getOneBadge = this._getOneBadge.bind(this);
            this.getBadgeInfo = this.getBadgeInfo.bind(this);
            this.deleteBadgeInfo = this.deleteBadgeInfo.bind(this);
            this.updateBadgeInfo = this.updateBadgeInfo.bind(this);
        }
    
        async _getOneBadge(id) {
            try {
                id = Number(id);
                const data = { id };
    
                const badge = await BaseController._getOne(prisma.badge, data);
    
                return badge;
    
            } catch (error) {
                console.log(error);
                return error;
    
            }
        }

        async getAllBadges(req, res, next) {
            try {
                const badges = await BaseController._getSeveral(prisma.badge);
                res.status(200).json(badges);
            } catch (error) {
                console.error(error);
                res.status(500).send('An error occurred while retrieving all Badges.');
            }
        }

        async getAllGroupBadges(req, res, next) {
            try {
                const badges = await BaseController._getSeveral(prisma.groupBadge);
                res.status(200).json(badges);
            } catch (error) {
                console.error(error);
                res.status(500).send('An error occurred while retrieving all Badges.');
            }
        }

    
        async getBadgeInfo(req, res, next) {
            try {
                const { id } = req.params;
                const badge = await this._getOneBadge(id);
                if (badge) {
                    res.status(200).json(badge);
                } else {
                    res.status(404).send('Badge not found');
                }
    
            } catch (error) {
                console.error(error);
                res.status(500).send('An error occurred while retrieving the Badge.');
            }
        }
    
        async deleteBadgeInfo(req, res, next) {
            try {
                const { id } = req.params;
                const badge = await this._getOneBadge(id);
                if (badge) {
                    await BaseController._deleteOne(prisma.badge, { id: Number(id) });
                    res.status(200).send('Badge deleted');
                } else {
                    res.status(404).send('Badge not found');
                }
    
            } catch (error) {
                console.error(error);
                res.status(500).send('An error occurred while deleting the Badge.');
            }
        }
    
        async updateBadgeInfo(req, res, next) {
            try {
                const { id } = req.params;
                const badge = await this._getOneBadge(id);
                if (badge) {
                    await BaseController._updateOne(prisma.badge, { id: Number(id) }, req.body);
                    res.status(200).send('Badge updated');
                } else {
                    res.status(404).send('Badge not found');
                }
    
            } catch (error) {
                console.error(error);
                res.status(500).send('An error occurred while updating the Badge.');
            }
        }

        async createBadge(req, res, next) {
            try {
                const { name, imageUrl } = req.body;
                const badge = await prisma.badge.create({
                    data: {
                        name,
                        imageUrl
                    }
                });
                res.status(201).json(badge);
            } catch (error) {
                console.error(error);
                res.status(500).send('An error occurred while creating the Badge.');
            }
        }

        async _addBadgeToGroup(obj) {
            if (obj.likeCount >= 2) {
                if (await this._checkGroupBadge(obj, 1)) {
                    const data = {
                        badgeId: 1,
                        groupId: obj.id
                    };
                    await baseController._createOne(prisma.groupBadge, data);
                }
            }
            
            if (await obj.postCount >= 2) {
                if (await this._checkGroupBadge(obj, 2)) {
                    const data = {
                        badgeId: 2,
                        groupId: obj.id
                    };
                    await baseController._createOne(prisma.groupBadge, data);
                }
            }
        }

        async _checkGroupBadge(obj, badge) {
            const groupBadgeCount = BaseController._getCount(prisma.groupBadge, {
                badgeId: badge,
                groupId: obj.id
            });

            if (groupBadgeCount > 0) {
                return true;
            }

            return false;
        }
}

export default new BadgeController();