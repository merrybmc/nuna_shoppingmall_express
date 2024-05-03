const productController = {};

productController.createProduct = async (req, res) => {
  try {
    const { sku, name, size, image, category, description, price, stock, status } = req.body;

    const product = { sku, name, size, image, category, description, price, stock, status };

    await product.save();

    res.status(200).json({ status: 'ok', product });
  } catch (err) {
    res.status(400).json({ status: 'fail', error: err.message });
  }
};

productController.getProduct = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({ status: 'ok', data: products });
  } catch (err) {
    res.status(400).json({ status: 'fail', error: err.message });
  }
};

module.exports = productController;
