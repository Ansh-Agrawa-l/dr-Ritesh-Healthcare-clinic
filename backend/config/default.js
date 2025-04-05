require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/healthcare-clinic',
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expire: process.env.JWT_EXPIRE || '30d',
  },
  upload: {
    dir: process.env.UPLOAD_DIR || 'uploads',
    maxFileSize: process.env.MAX_FILE_SIZE || 5000000,
  },
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  },
};
  