exports.getAllGroup = async(req, res, next) => {
    try {
        res.status(200).json(
            [
                {
                    "currentPage": 1,
                    "totalPages": 5,
                    "totalItemCount": 50,
                    "data": [
                        {
                            "id": 1,
                            "name": "string",
                            "imageUrl": "string",
                            "isPublic": true,
                            "likeCount": 0,
                            "badgeCount": 0,
                            "postCount": 0,
                            "createdAt": "2024-02-22T07:47:49.803Z",
                            "introduction": "string"
                        },
                        {
                            "id": 2,
                            "name": "string",
                            "imageUrl": "string",
                            "isPublic": true,
                            "likeCount": 0,
                            "badgeCount": 0,
                            "postCount": 0,
                            "createdAt": "2024-02-22T07:47:49.803Z",
                            "introduction": "string"
                        }
                    ],
                }
            ]
        )
    } catch(error) {
        next(error);
    }
};