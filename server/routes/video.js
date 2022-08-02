const express = require('express');
const router = express.Router();
const { User } = require("../models/User");
const path = require('path');
const { auth } = require("../middleware/auth");
const multer = require("multer");

//=================================
//             Video
//=================================

let storage = multer.diskStorage({
    // destination은 우리가 파일을 올릴 때 어디에다가 이 파일을 저장할지 설명해주는 것임.
    // 우리가 파일을 올리면 모든 파일이 uploads 폴더에 저장될 것임.
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    // 어떤 file이름으로 저장할 것인지 2022~~ date 넣고, filename 넣고
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
    // 동영상만 받을것이므로 mp4만 될 수 있도록 구현한 코드임  
    // png나 다른 유형의 파일을 올리고 싶다면 if문 안에 || ext !== '.png 이런식으로 넣어주면 됨.
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'video/mp4') {
        cb(null, true);
    } else {
        cb({msg:'mp4 파일만 업로드 가능합니다.'}, false);
    }
}

// 위에 코드는 config 옵션임.

// 위를 multer에다가 넣은거고
// file은 우선 single 하나만
const upload = multer({ storage: storage, fileFilter:fileFilter }).single("file"); 

router.post('/uploadfiles', (req, res) => {
    // 비디오를 서버에 저장
    upload(req, res, err => {
        if (err) {
            return res.json({success:false, err})
        }
                                    // 밑에 url은 파일을 업로드하면 uploads 폴더에 들어가는데,
                                    // 그 경로를 client에다가 보내주는 것임
        return res.json({success:true, filePath: res.req.file.path, fileName: res.req.file.filename})
    })
})

module.exports = router;
