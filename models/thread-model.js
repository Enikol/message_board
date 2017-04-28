var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
//var Reply = require('./reply-model');
var Reply = new Schema({
  text: {type: String, required: true},
  delete_password: {type: String, required: true},
  created_on: Date,
  reported: Boolean
});
var Thread = new Schema({
  text: {type: String, required: true},
  delete_password: {type: String, required: true},
  created_on: Date,
  bumped_on: Date,
  reported: Boolean,
  replies: [Reply],
  replycount: Number,
  board: String
  
});

module.exports = mongoose.model('Thread', Thread);