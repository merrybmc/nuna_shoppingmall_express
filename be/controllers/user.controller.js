const User = require('../model/User');
const bcrypt = require('bcryptjs');

const userController = {};

userController.createUser = async (req, res) => {
  try {
    const { email, password, name, level } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      throw new Error('이미 존재하는 이메일입니다.');
    }

    const salt = await bcrypt.genSaltSync(10);
    const hash = await bcrypt.hash(password, salt);
    const newUser = new User({ email, password, name, level });

    await newUser.save();
    return res.status(200).json({ status: 'ok' });
  } catch (err) {
    res.status(400).json({ status: 'fail', error: err.message });
  }
};

userController.getUser = async (req, res) => {
  try {
    const { userId } = req;
    const user = await User.findById(userId);
    if (user) {
      res.status(200).json({ status: 'ok', user });
    }
    throw new Error('invalid token');
  } catch (err) {
    res.status(400).json({ status: 'fail', error: err.message });
  }
};

module.exports = userController;
