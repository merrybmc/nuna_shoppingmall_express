const express = require('express');
const userController = require('../controllers/user.controller');
const authController = require('../controllers/auth.controller');
const router = express.Router();

// 회원가입
router.post('/', userController.createUser);

// 유저정보 조회
// middleware chain use
router.get('/', authController.authenticate, userController, getUser); // 토큰이 valid한 토큰이면 token을 가지고 유저 정보를 찾아서 return

module.exports = router;
