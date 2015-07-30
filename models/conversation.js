var mongoose = require('mongoose');

var messageSchema = new mongoose.Schema({
  input: {
    type: String,
    required: true
  },
  _creator: {
    type: String,
    ref: 'User'
  },
  postedAt: {
    type: Date,
    required: true
  },
  recipients: []
});

var conversationSchema = new mongoose.Schema({
  title: {
    type: String
  },
  _creator: {
    type: String,
    ref: 'User'
  },
  postedAt: {
    type: Date,
    required: true
  },
  messages: [messageSchema],
  recipients: [],
  newMessages: {
    type: Number
  }
});


var Conversation = mongoose.model('conversation', conversationSchema);


module.exports = Conversation;
