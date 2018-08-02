const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = {
  createToken: (user) => {
    const payload = {
      id: user.id
    };
    const token = jwt.sign(
      payload,
      process.env.SECRET || config.secret,
      {
        expiresIn: '10h' // expires in 10 hours
      }
    );
    return token;
  },
  
  verify: (req, res, next) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.split('Bearer ')[1]
    const authenticated = jwt.verify(token, config.secret);
    if (authenticated) {
      req.user = jwt.decode(token);
      next();
    } else {
      res.status(403).json({ success: false, message: 'Forbidden' });
    }
  }
}