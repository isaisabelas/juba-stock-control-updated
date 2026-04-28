require('dotenv').config();

const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '10', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL,
  minPasswordLength: 6,
  defaultMinQuantity: 10,
};

// Fail fast if JWT_SECRET is not set
if (!config.jwtSecret) {
  console.error('FATAL: JWT_SECRET environment variable is required. Set it in server/.env');
  process.exit(1);
}

module.exports = config;
