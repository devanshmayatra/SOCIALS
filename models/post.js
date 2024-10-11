const mongoose = require("mongoose");
const { Schema } = mongoose;

const postSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  noOfLikes:{
    type:Number,
    default:0
  }
}, {
  timestamps: true
}
);

const PostModel = mongoose.model('Post', postSchema);

module.exports = PostModel;

