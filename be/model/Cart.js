const mongoose = require('mongoose');
const User = require('./User');
const Product = require('./Product');
const Schema = mongoose.Schema;

const cartSchema = Schema(
  {
    userId: { type: mongoose.ObjectId, ref: User }, // mongoose.ObjectId 외래키
    items: [
      {
        productId: { type: mongoose.ObjectId, ref: Product },
        size: { type: String, required: true },
        qty: { type: Number, required: true, default: 1 },
      },
    ],
  },
  { timestamps: true }
);

cartSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.__v;
  delete obj.createAt;
  delete obj.updateAt;
  return obj;
};

// Schema model 정의
const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;
