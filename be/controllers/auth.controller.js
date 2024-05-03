const authController = {};
const bcrypt = require('bcryptjs');

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

module.exports = authController;
