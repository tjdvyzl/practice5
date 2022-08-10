import React, { useEffect, useState } from 'react'
import { Row, Col, List } from 'antd';
import { Avatar } from 'antd';
import axios from "axios";
import SideVideo from './Sections/SideVideo';
import Subscribe from './Sections/Subscribe';
import Comment from "./Sections/Comment";

function VideoDetailPage(props) {
    const [commentList, setCommentList] = useState([]);

    const videoId = props.match.params.videoId;

    const variables = {
        videoId: videoId
    }

    const [VideoDetail, setVideoDetail] = useState([]);
    
    useEffect(() => {
        axios.post('/api/video/getVideoDetail', variables)
            .then(response => {
                if (response.data.success) {
                    setVideoDetail(response.data.videoDetail);
                } else {
                    alert("getting video fail")
                }
            })

        axios.post('/api/comment/getComments', variables)
            .then(response => {
                if (response.data.success) {
                    setCommentList(response.data.comments);
                } else {
                    alert('fail');
                }
            })
            
    }, [])

    const updateComment = (newComments) => {
        setCommentList(commentList.concat(newComments));
    }

    if (VideoDetail.writer) {
        const subscriberButton = (VideoDetail.writer._id !== localStorage.getItem('userId')) &&<Subscribe userTo={VideoDetail.writer._id} userFrom={localStorage.getItem('userId')} />
        return (
            
                <Row gutter={[16, 16]}>
                    <Col lg={18} xs={24}>
                        <div style={{ width: '100%', padding: '3rem 4rem' }}>
                            <video style={{ width: '100%' }} src={`https://tjdvyzl-practice5-o79s44t6j0k.ws-us59.gitpod.io/${VideoDetail.filePath}`} controls></video>
                    
                            <List.Item
                                actions={[subscriberButton]}
                            >
                                <List.Item.Meta
                                    avatar={<Avatar src={VideoDetail.writer.image} />}
                                    title={VideoDetail.writer.name}
                                    description={VideoDetail.description}
                                />
                            </List.Item>

                            {/* Comments */}
                            <Comment  commentList={commentList} videoId={videoId} refreshFunction={updateComment}/>
                        </div>
                    </Col>
                    <Col lg={6} xs={24}>
                        <SideVideo/>
                    </Col>
                </Row>
            
        )
    }
    else {
        return (
            <div>
            ...Loading
            </div>
        )
    }
}

export default VideoDetailPage