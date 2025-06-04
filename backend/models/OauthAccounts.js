const mongoose = require('mongoose');

const oauthAccountSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  provider: { 
    type: String, 
    enum: ['google', 'github'], 
    required: true 
  },
  providerAccountId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now, 
    required: true 
  }
});

module.exports = mongoose.model('OauthAccounts', oauthAccountSchema);