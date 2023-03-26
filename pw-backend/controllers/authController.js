const { User } = require('../models');
const bcrypt = require('bcrypt');
const passport = require('passport');

const login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).json({ message: 'An error occurred during the authentication process.' });
    }

    if (!user) {
      return res.status(401).json({ message: info.message });
    }

    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ message: 'An error occurred during the login process.' });
      }

      return res.status(200).json({ message: 'Logged in successfully.', user });
    });
  })(req, res, next);
};

const logout = (req, res) => {
  req.logout();
  res.status(200).json({ message: 'Logged out successfully.' });
};

const checkSession = (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json({ isAuthenticated: true });
  } else {
    res.status(200).json({ isAuthenticated: false });
  }
};


const register = async (req, res) => {
  try {
    const existingUser = await User.findOne({ where: { email: req.body.email } });

    if (existingUser) {
      return res.status(409).json({ message: 'A user with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({ ...req.body, password: hashedPassword });

    res.status(201).json({ message: 'User registered successfully.', user });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'An error occurred while registering the user.' });
  }
};

module.exports = {
  login,
  logout,
  register,
  checkSession,
};