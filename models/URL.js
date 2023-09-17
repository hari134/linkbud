const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  originalURL: {
    type: String,
    required: true,
  },
  shortURL: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expirationDate : {
    type : Date,
    default : null,
  },
  password : {
    type : String,
    default : null,
  }
});

module.exports = mongoose.model('URL', urlSchema);