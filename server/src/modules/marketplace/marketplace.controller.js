const {
  getPublicProducts,
  getPublicProductById,
} = require("./marketplace.service");

const getProducts = async (req, res, next) => {
  try {
    const result = await getPublicProducts({
      page: req.query.page,
      limit: req.query.limit,
      search: req.query.search,
      categoryId: req.query.categoryId,
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice,
      available: req.query.available,
      sort: req.query.sort,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await getPublicProductById(
      Number(req.params.id)
    );

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
};