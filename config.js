export default {
    port: process.env.PORT || 5000,
    mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/auth',
    jwtSecret: process.env.JWT_SECRET || 'jwtsecret',
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET || 'refreshtokensecret',
  };
  