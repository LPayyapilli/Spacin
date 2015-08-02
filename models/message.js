var mongoose = require('mongoose');

var messageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  body: {
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
  recipient: {
    type: String,
    ref: 'User'
  }
});


var Message = mongoose.model('message', messageSchema);


module.exports = Message;
