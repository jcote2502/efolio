const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: true,
  },
  lname: {
    type: String,
    required: true,
  },
  siteToken: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 12,
  },
  authToken: {
    type: String,
    unique: true,
  },
  phone:{
    type: String,
    required: false
  },
  location:{
    type: String,
    required:false
  },
  headshot:{
    type: String,
    required:false
  },
  title:{
    type: String,
    required:false
  },
  banner:{
    type: String,
    required:false
  }
});

// ensures no user can access another persons site
userSchema.index({siteToken:1, email:1}, {unique:true});

module.exports = mongoose.model('User', userSchema);