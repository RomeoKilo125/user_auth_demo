const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const hashPassword = (password, finishedHashingPasswordCallback) => {
  if (!password) {
    // return error for not giving password
    return finishedHashingPasswordCallback(new Error('No Password Supplied!'));
  }
  // generate the salt - look at npm bcrypt for more detail
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return finishedHashingPasswordCallback(new Error('Error generating salt for password!'));
    }
    // use salt to generate hashed password - bcrypt npm
    bcrypt.hash(password, salt, (err, hashedPassword) => {
      if (err) {
        return finishedHashingPasswordCallback(new Error('Error hasing password'));
      }
      // call the callback with no error and a hashed password
      finishedHashingPasswordCallback(null, hashedPassword);
    });
  });
}

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  },
  password: {
    type: String,
    required: true
  }
});

// setup custom method to not exposed even the hashed password
UserSchema.set('toJSON', {
  transform: function(doc, json) {
    return {
      id: json._id,
      email: json.email,
    }
  }
});

UserSchema.pre('save', function (next) {
  const userToSave = this;
  hashPassword(userToSave.password, (err, hashedPassword) => {
    if (err) {
      return next(err);
    }
    userToSave.password = hashedPassword;
    next();
  });
});

module.exports = mongoose.model('User', UserSchema);
