const User = require('../models/User');

module.exports = {
  index: (req, res, next) => {
    User.findById(req.user.id)
      .then(user => res.json({ user }))
      .catch(err => next(err));
  }
}