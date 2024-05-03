const authController = {};
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

authController.loginWithEmail = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        // token create
        const token = await user.generateToken();

        return res.status(200).json({ status: 'ok', user, token });
      }
    }
    throw new Error('invalid email or password');
  } catch (err) {
    res.status(400).json({ status: 'fail', error: err.message });
  }
};

authController.authenticate = (req, res, next) => {
  try {
    const tokenString = req.headers.authorization;
    if (!tokenString) throw new Error('Token not found');
    const token = tokenString.replace('Bearer ', '');
    jwt.verify(token, process.env.JWT_SECRET_KEY, (error, payload) => {
      if (error) throw new Error('invalid token');
      req.userId = payload._id;
    });
    next();
  } catch (err) {
    res.status(400).json({ status: 'fail', error: err.message });
  }
};

authController.checkAdminPermission = async (req, res, next) => {
  try {
    const { userId } = req;
    jwt.verify = await User.findById(userId);
    if (user.level !== 'admin') throw new Error('no permission');
    next();
  } catch (err) {
    res.status(400).json({ status: 'fail', error: err.message });
  }
};

module.exports = authController;
