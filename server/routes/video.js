const express = require('express');
const router = express.Router();
const { User } = require("../models/User");
const path = require('path');
const { auth } = require("../middleware/auth");
const multer = require("multer");
const { Video } = require("../models/Video");
const { Subscriber } = require("../models/Subscriber");

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

router.post('/uploadVideo', (req, res) => {
    
    // req.body를 하면 client에서 보낸 variables들이 모두 req.body안에 담겨있음 req.body.writer면 writer정보만
    const video = new Video(req.body);

    video.save((err, doc) => { 
        if (err) return res.json({ success: false, err });
        res.status(200).json({ success: true });
    })
})

router.post('/getVideoDetail', (req, res) => {
    
    Video.findOne({_id:req.body.videoId})
        .populate('writer')
        .exec((err, videoDetail) => {
            if (err) return res.status(400).send(err)
            return res.status(200).json({success:true, videoDetail})
        })
})

router.get('/getVideos', (req, res) => {
    
    // 비디오를 DB에서 갖고와서 client에 보낸다.

    Video.find()
        .populate('writer')
        .exec((err, videos) => {
            if (err) return res.status(400).send(err);
            res.status(200).json({success:true, videos})
        })
})



router.post('/getSubscriptionVideos', (req, res) => {
    
    Subscriber.find({'userFrom':req.body.userFrom})
        .exec((err, subscribers) => {
            if (err) return res.status(400).send(err);
            
            let subscriberUser = [];

            subscribers.map((subscriber, index) => {
                subscriberUser.push(subscriber.userTo);
            })

            // 원래 전에 하던것 처럼 writer : req.body.id로 할때는 한명만 찾을 때 얘기고
            // 두명 이상을 찾을 때는 위 방식이 안되기 때문에 몽고DB가 갖고있는 기능을 사용해야한다.
            // 그때 사용하는 방식이 $in 메소드인데
            // $in : subscriberUser을 할 경우 subscriberUser 배열에 두명 세명 이상이 있어도
            // 들어있는 모든 사람들의 id를 가지고 writer들을 찾을 수 있다.
            // 그리고 populate를 해줘야한다. 왜냐하면 지금 writer의 정보를 갖고싶은데
            // writer의 id밖에 없기 떄문에 writer의 이미지, 이름, 어떤 다른 데이터를 갖고싶기에 populate를 해줘야한다.

            Video.find({ writer: { $in: subscriberUser } })
                .populate('writer')
                .exec((err, videos) => {
                    if (err) return res.status(400).send(err);
                    return res.status(200).json({success: true, videos})
                })
        })
    
})

module.exports = router;
