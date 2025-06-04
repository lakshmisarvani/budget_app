const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    // Only require password if googleId is not present
    required: function () {
      return !this.googleId;
    }
  },
  googleId: { // For Google OAuth support
    type: String,
    unique: true,
    sparse: true, // Only enforce uniqueness when the field is present
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  resetOTP: {
    type: String
  },
  otpExpiry: {
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);



// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     lowercase: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   googleId: { // <-- Added for Google OAuth support
//     type: String,
//     unique: true,
//     sparse: true, // Only enforce uniqueness when the field is present
//   },
//   role: {
//     type: String,
//     enum: ['user', 'admin'],
//     default: 'user'
//   },
//   resetOTP: {
//     type: String
//   },
//   otpExpiry: {
//     type: Date
//   }
// }, { timestamps: true });

// module.exports = mongoose.model('User', userSchema);

// // const mongoose = require('mongoose');

// // const userSchema = new mongoose.Schema({
// //   name: {
// //     type: String,
// //     required: true,
// //     trim: true,
// //   },
// //   email: {
// //     type: String,
// //     required: true,
// //     unique: true,
// //     lowercase: true,
// //   },
// //   password: {
// //     type: String,
// //     required: true,
// //   },
// //   role: {
// //     type: String,
// //     enum: ['user', 'admin'],
// //     default: 'user'
// //   },
// //   resetOTP: {
// //     type: String
// //   },
// //   otpExpiry :{
// //     type : Date
// //   }
// // }, { timestamps: true });

// // module.exports = mongoose.model('User', userSchema);
