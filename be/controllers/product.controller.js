const Product = require('../model/Product');

const productController = {};

const PAGE_SIZE = 5;

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
    // $options : "i" = 대소문자 구별하지 않음
    const condition = name ? { name: { $regex: name, $options: 'i' } } : {};
    let query = Product.find({ condition });
    let res = { status: 'ok' };
    if (page) {
      // skip = 앞에서부터 해당 개수만큼 데이터를 스킵
      // limit = 보여줄 데이터 개수
      query.skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE);
      // count = 데이터의 개수만 리턴
      const totalItemNumber = await Product.find(condition).count();
      // Math.ceil = 올림
      const totalPageNumber = Math.ceil(totalItemNumber / PAGE_SIZE);
      res.totalPageNumber = totalPageNumber;
    }

    // query 실행
    const productList = await query.exec();
    res.data = productList;
    // const products = await Product.find({});
    res.status(200).json({ res });
  } catch (err) {
    res.status(400).json({ status: 'fail', error: err.message });
  }
};

productController.updateProduct = async (req, res) => {
  try {
    // 주소의 param 값 가져오기
    const productId = req.params.id;
    const { sku, name, size, image, price, description, category, stock, status } = req.body;
    const product = await Product.findByIdAndUpdate(
      { _id: productId },
      { sku, name, size, image, price, description, category, stock, status },
      // new: true 새로 변경된 값을 리턴
      { new: true }
    );
    if (!product) throw new Error("item doesn't exist");

    res.status(200).json({ status: 'ok', data: product });
  } catch (err) {
    res.status(400).json({ status: 'fail', error: err.message });
  }
};

productController.checkStock = async (item) => {
  const product = await Product.findById(item.productId);

  if (product.stock[item.size] < item.qty) {
    return { isVerify: false, message: `${product.name}의 ${item.size}재고가 부족합니다.` };
  }

  const newStock = { ...product.stock };
  newStock[item.size] -= item.qty;
  product.stock = newStock;

  await product.save();

  return { isVerify: true };
};

productController.checkItemListStock = async (itemList) => {
  // 재고 확인 로직
  const insufficientStockItems = []; // 재고가 불충분한 아이템을 저장

  // 비동기 병렬 처리
  await Promise.all(
    itemList.map(async (item) => {
      const stockCheck = await productController.checkStock(item);
      if (stockCheck.isVerify) {
        insufficientStockItems.push({ item, message: stockCheck.message });
      }
      return stockCheck;
    })
  );

  return insufficientStockItems;
};

module.exports = productController;
