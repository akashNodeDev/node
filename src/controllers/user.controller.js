const User = require("../schema/user.schema");

module.exports.getUsersWithPostCount = async (req, res) => {
  try {
    //TODO: Implement this API
    let { page, skip } = req.query;
    page = page ? parseInt(page) : 1;
    skip = skip ? parseInt(skip) : 1;

    let userData = await User.aggregate([
      {
        $lookup: {
          from: "posts",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [{ $eq: ["$userId", "$$userId"] }],
                },
              },
            },
          ],
          as: "user_data",
        },
      },

      {
        $project: {
          _id: 1,
          name: 1,
          post: { $size: "$user_data" }
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $skip: skip,
      },
      {
        $limit: 5,
      },
    ]);

    res.status(200).json({ data: userData });
  } catch (error) {
    res.send({ error: error.message });
  }
};
