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
    const { page, name } = req.body;
    // $regex = .includes
    // $options : "i" === 대소문자 구별하지 않음
    const condition = name ? { name: { $regex: name, $options: 'i' } } : {};
    let query = Product.find({ condition });

    // query 실행
    const productList = await query.exec();
    // const products = await Product.find({});
    res.status(200).json({ status: 'ok', data: productList });
  } catch (err) {
    res.status(400).json({ status: 'fail', error: err.message });
  }
};

module.exports = productController;
