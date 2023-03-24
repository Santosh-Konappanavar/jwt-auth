import axios from 'axios';
import { getToken, setToken, removeToken } from './TokenService';

const refreshToken = async () => {
  const token = getToken();
  const refreshToken = localStorage.getItem('refreshToken');

  try {
    const response = await axios.post('http://localhost:5000/api/auth/refresh-token', { token, refreshToken });
    const newToken = response.data.token;
    setToken(newToken);
    return newToken;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const authMiddleware = async (req, res, next) => {
  const token = getToken();
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const response = await axios.get('http://localhost:5000/api/auth/validate-token', { headers: { Authorization: token } });
    const { isValid } = response.data;
    if (isValid) {
      return next();
    } else {
      const newToken = await refreshToken();
      if (newToken) {
        req.headers.authorization = newToken;
        return next();
      } else {
        removeToken();
        return res.status(401).json({ message: 'Unauthorized' });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export default authMiddleware;
