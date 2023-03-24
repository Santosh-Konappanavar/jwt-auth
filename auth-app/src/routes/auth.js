import express from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';
import User from '../models/User';
import auth from '../middleware/auth';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, config.jwtSecret, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: user._id }, config.refreshTokenSecret, {
      expiresIn: '30d',
    });

    res.json({ token, refreshToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token missing' });
  }

  try {
    const decodedToken = jwt.verify(refreshToken, config.refreshTokenSecret);
    const user = await User.findById(decodedToken.id);
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const accessToken = jwt.sign({ id: user._id }, config.jwtSecret, { expiresIn: '1h' });

    res.json({ token: accessToken });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
