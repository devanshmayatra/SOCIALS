const mongoose = require("mongoose");
const { Schema } = mongoose;

const announcementSchema = new Schema({
  announcementTitle: {
    type: String,
    required: true
  },
  announcementTopic: {
    type: String,
    required: true
  },
  announcementDescription:{
    type:String,
    required:true

  },
  author: {
    type: String,
    required: true
  },
  authorId:{
    type:String,
    required:true
  },
  noOfLikes:{
    type:Number,
    default:0
  }
}, {
  timestamps: true
}
);

const AnnouncementModel = mongoose.model('Announcement', announcementSchema);

module.exports = AnnouncementModel;

