class BaseController {
    async _getSeveral(target, query=NaN, page=NaN) {
        try {
            const obj = query ? await target.findMany(
                {
                    skip: page.skip,
                    take: page.take,
                    where: query
                }

            ) : await target.findMany(
                {
                    skip: page.skip,
                    take: page.take
                }

            );
            obj.forEach(item => {
                this._formatDate(item);
            });
            return obj;

        } catch (error) {
            console.log(error);
            return error;
            
        }
    }

    async _getOne(target, query=NaN) {
        try {
            const obj = await target.findUnique({
                where: query
            })
            this._formatDate(obj);
            return obj;

        } catch (error) {
            console.log(error);
            return error;

        }
    }

    async _createOne(target, data) {
        try {
            const obj = await target.create({
                data: data
            });
            this._formatDate(obj);
            return obj;

        } catch (error) {
            console.log(error);
            return error;

        }
    }

    async _updateOne(target, query, data) {
        try {
            const obj = await target.update({
                where: query,
                data: data
            });
            this._formatDate(obj);
            return obj;

        } catch (error) {
            console.log(error);
            return error;

        }
    }

    async _deleteOne(target, query) {
        try {
            const obj = await target.delete({
                where: query
            });
            this._formatDate(obj);
            return obj;

        } catch (error) {
            console.log(error);
            return error;
        }
    }

    async _deleteAll(target) {
        try {
            const obj = await target.deleteMany({});

            return obj;

        } catch (error) {
            console.log(error);
            return error;

        }
    }

    async uploadImage(req, res) {
        const baseUrl = `${req.protocol}://${req.get('host')}/`;
        try {
            if (req.file != undefined) {
                res.status(200).json({
                    imageUrl: baseUrl + req.file.path
                });

            } else {
                res.status(200).json({
                    imageUrl: null
                });

            }

        } catch (error) {
            console.log(error);
            res.status(500).json({
                error: 'An error occurred while uploading image.'
            });
        }
    }

    async _getCount(target, query=NaN) {
        try {
            const count = query ? await target.count({
                where: query
            }) : await target.count();

            return count;

        } catch (error) {
            console.log(error);
            return error;

        }
    }

    _formatDate(obj) {
        if (obj && obj.createdAt && obj.updatedAt) {
            obj.createdAt = obj.createdAt.toISOString().split('T')[0];
            obj.updatedAt = obj.updatedAt.toISOString().split('T')[0];
        }
        if (obj && obj.moment) {
            obj.moment = obj.moment.toISOString().split('T')[0];
        }
    }
}

export default new BaseController();