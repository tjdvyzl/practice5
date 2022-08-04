const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const moment = require("moment");
const Schema = mongoose.Schema;

const videoSchema = mongoose.Schema({
    writer: {
        // 밑에 type을 넣으면 User모델에 가서 모든 정보를 다 갖고온다고 했는데
        // 그냥 갖고올 수 있는게 아니라 getVideos에서 populate를 해줘야지
        // .populate('writer') 을 했을 때 모든 writer 정보를 갖고올 수 있는거임
        // populate를 해주지 않으면 write의 id만 갖고옴
        type: Schema.Types.ObjectId,
        ref:'User'
    },
    title: {
        type: String,
        maxlength:50
    },
    description: {
        type: String
    },
    privacy: {
        type: Number
    },
    filePath: {
        type: String
    },
    category: {
        type: String
    },
    views: {    
        type: Number,
        default:0
    },
    duration: {
        type: String
    }
},{timestamps:true})


const Video = mongoose.model('Video', videoSchema);

module.exports = { Video }