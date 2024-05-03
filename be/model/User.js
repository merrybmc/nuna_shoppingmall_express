const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
require('dotenv').config();

const userSchema = Schema(
  {
    email: {
      type: String,
      required: true, // 필수 값
      unique: true, // 중복 체크
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      default: 'customer', // 기본값 2types : customer, admin
    },
  },
  { timestamps: true }
);

userSchema.methods.toJSON = function () {
  const obj = this._doc;
  delete obj.password;
  delete obj.__v;
  delete obj.createAt;
  delete obj.updateAt;
  return obj;
};

// token create
userSchema.methods.generateToken = async function () {
  const token = await jwt.sign({ _id: this.id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
  return token;
};

// Schema model 정의
const User = mongoose.model('User', userSchema);
module.exports = User;
