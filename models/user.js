const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  fullName:{
    type:String,
    default:""
  },
  username: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    // enum:["mentor","student"],
    default:""
  },
  profilePicture: {
    type: String,
    default: "default.jpg"
  },
  bio: {
    type: String,
    default: ""
  },
  age: {
    type: Number,
    default: 0
  },
  dob: {
    type: Date,
    default: Date()
  },
  gender: {
    type: String,
    default: ""
  },
  noOfFollowers: {
    type: Number,
    default: 0
  },
  followers: {
    type: Array,
    default: []
  },
  noOfFollowing: {
    type: Number,
    default: 0
  },
  following: {
    type: Array,
    default: []
  },
  posts: {
    type: Array,
    default: []
    }
},{timestamps:true})

const UserModel = mongoose.model('User', userSchema );

module.exports = UserModel;