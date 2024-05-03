const Order = require('../model/Order');
const { randomStringGenerator } = require('../utils/randomStringGenerator');
const productController = require('./product.controller');

const orderController = {};

orderController.createOrder = async (req, res) => {
  try {
    const { userId } = req;
    const { totalPrice, shipTo, contact, orderList } = req.body;

    // 상품 재고 확인 예외처리
    const insufficientStockItems = await productController.checkItemListStock();

    if (insufficientStockItems.length > 0) {
      const errorMsg = insufficientStockItems.reduce((total, item) => (total += item.message));
      throw new Error(errorMsg);
    }

    const newOrder = new Order({
      userId,
      totalPrice,
      shipTo,
      contact,
      item: orderList,
      orderNum: randomStringGenerator(),
    });

    await newOrder.save();

    res.status(200).json({ status: 'ok', orderNum: newOrder.orderNum });
  } catch (err) {
    res.status(400).json({ status: 'fail', error: err.message });
  }
};

module.exports = orderController;
