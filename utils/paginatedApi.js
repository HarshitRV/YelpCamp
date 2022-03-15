/**
 * 
 * 
 * @param {*} model Document
 * @returns {async function} 
 */
const paginatedResults = (model) =>

   
    async (req, res, next) => {
        console.log(`Paginating`)

        // Extracting the page and limit from the query.
        let { page, limit } = req.query;

        // If page not found setting a default value.
        if(!page){
            req.query.page = 1;
        }
        if(!limit){
            req.query.limit=3;
        }

        // Extracting the default values.
        ({ page, limit } = req.query);

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const results = {} // results object

        if(endIndex < await model.countDocuments().exec()) {
            results.next = {
                page: page + 1,
                limit: limit
            }
        }

        if(startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit: limit
            }
        }

        try{
            /**
             * results = {
             *  next: {},
             *  results: {
             *   documents,
             *   doucments,
             *    .
             *    .
             * }
             * }
             */
            results.results = await model.find().limit(limit).skip(startIndex).exec()
            // console.log(results.results);

            /**
             * res = {
             *  paginatedResults:  results 
             * }
             * res.paginatedResutls.results = doucmet
             */
            res.paginatedResults = results
            // console.log(res.paginatedResults);
           
        } catch (e) {
            res.status(500).send({ message: e.message})
        }

        // res.paginatedResults = results
        next()
    }


module.exports = paginatedResults;