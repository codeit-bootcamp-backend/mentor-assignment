class BaseController {
    async _getSeveral(target) {
        try {
            const obj =  await target.findMany();

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

}

export default new BaseController();