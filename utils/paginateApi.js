const paginatedResults = (model) => async (req, res, next) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const skip = (page - 1) * limit;
    const total = await model.countDocuments();
    const results = await model.find().skip(skip).limit(limit);
    res.pagination = {};
    if (skip > 0) {
        res.pagination.previous = {
            page: page - 1,
            limit
        };
    }
    if (skip + limit < total) {
        res.pagination.next = {
            page: page + 1,
            limit
        };
    }
    res.pagination.total = total;
    res.pagination.limit = limit;
    res.pagination.page = page;
    res.pagination.pages = Math.ceil(total / limit);
    res.pagination.results = results;
    next();
};

module.exports = paginatedResults;