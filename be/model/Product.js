const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = Schema(
  {
    sku: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: Array, require: true },
    description: { type: String, require: true },
    price: { type: Number, require: true },
    stock: { type: Object, require: true },
    status: { type: String, default: 'active' },
    isDelete: { type: Boolean, default: false },
  },
  { timestamps: true }
);

productSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.__v;
  delete obj.createAt;
  delete obj.updateAt;
  return obj;
};

// Schema model 정의
const Product = mongoose.model('Product', productSchema);
module.exports = Product;
