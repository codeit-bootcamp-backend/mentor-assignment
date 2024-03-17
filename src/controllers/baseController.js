class BaseController {
    async _getSeveral(target, query=NaN) {
        try {

            const obj = query ? await target.findMany({ where: query }) : await target.findMany();

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
        try {
            if (req.file != undefined) {
                res.status(200).json({
                    imageUrl: req.file.path
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
}

export default new BaseController();