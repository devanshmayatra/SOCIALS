const mongoose = require("mongoose");
const { Schema } = mongoose;

const followerSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  followerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
},{
  timestamps: true
}
);

const FollowerModel = mongoose.model('Follower', followerSchema);

module.exports = FollowerModel;

