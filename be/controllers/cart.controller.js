const { populate } = require('dotenv');

const cartController = {};

cartController.addToCaret = async (req, res) => {
  try {
    const { userId } = req; // middleware에서 받아올 수 있는 정보
    const { productId, size, qty } = req.body;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // userId로 된 cart 생성 및 저장
      cart = new Cart({ userId });
      await cart.save();
    }

    // 이미 카트에 들어가있는 상품인지 확인
    // id가 같은지 확인 && 개수가 같은지 확인
    // productId같은 mongoose.ObjectId 타입인 경우 String이 아니라서 equals()를 사용해야됨.
    const existItem = cart.items.find((item) => item.productId.equals() && item.size === size);

    if (existItem) {
      throw new Error('아이템이 이미 카트에 담겨 있습니다.');
    }

    // 카트 상품 추가
    cart.items = [...cart.items, { productId, size, qty }];
    await cart.save();

    res.status(200).json({ status: 'ok', data: cart });
  } catch (err) {
    res.status(400).json({ status: 'fail', err: error.message });
  }
};

cartController.getCart = async (req, res) => {
  try {
    const { userId } = req; // middleware에서 받아올 수 있는 정보
    const cart = await Cart.findOne({ userId }).populate({
      path: 'items', // cart.items 하위의 데이터들을 가져옴
      populate: {
        path: 'productId', // productId 값을 기준
        model: 'Product', // 가지고 올 모델
      },
    });

    res.status(200).json({ status: 'ok', data: cart.items });
  } catch (err) {
    res.status(400).json({ status: 'fail', err: error.message });
  }
};

module.exports = cartController;
