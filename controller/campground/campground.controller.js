const getAllCamps = async (req, res)=>{
    const camps = res.pagination.results;
    console.log(camps);
    res.render("campgrounds/index", { camps })
}

module.exports = getAllCamps;