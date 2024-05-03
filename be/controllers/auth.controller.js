const authController = {};
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { OAuth2Client } = require('google-auth-library');
const User = require('../model/User');
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

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

authController.loginWithGoogle = async (req, res) => {
  try {
    const { credential } = req.body;
    const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

    // 구글 토큰인지 검증
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });

    // 암호화된 정보 읽어오기
    const { email, name } = ticket.getPayload();

    let user = await User.findOne({ email });

    // 신규 회원가입
    if (!user) {
      const randomPassword = '' + Math.floor(Math.random() * 1000000);
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(randomPassword, salt);

      user = new User({
        name,
        email,
        password: hash,
      });

      user.save();
    }

    // 토큰 발행 리턴
    const sessionToken = await user.generateToken();
    res.status(200).json({ status: 'ok', user, token: sessionToken });
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
