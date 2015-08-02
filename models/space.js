var mongoose = require('mongoose');

var addressSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: true
  },
  street: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  zip: {
    type: String,
    required: true
  }
});
var pictureSchema = new mongoose.Schema({
  caption: {
    type: String
  },
  src: {
    data: Buffer,
    type: String
  },
  _creator: {
    type: String,
    ref: 'User'
  },
  postedAt: {
    type: Date,
    required: true
  }
});

var spaceSchema = new mongoose.Schema({
  caption: {
    type: String
  },
  name: {
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
  zip: {
    type: String,
    required: true
  },
  pictures: [pictureSchema],
  address: [addressSchema],
  category: {
    type: String,
    required: true,
    enum:['Bar', 'Cafe', 'Work/Office', 'Home/Residential']
},
  messages: [messageSchema]
});
var Space = mongoose.model('space', spaceSchema);

module.exports = Space;
