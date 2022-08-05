import React, { useEffect, useState } from 'react'
import { Row, Col, List } from 'antd';
import { Avatar } from 'antd';
import axios from "axios";

function VideoDetailPage(props) {

    const videoId = props.match.params.videoId;

    const variables = {
        videoId: videoId
    }

    const [VideoDetail, setVideoDetail] = useState([]);
    
    useEffect(() => {
        axios.post('/api/video/getVideoDetail', variables)
            .then(response => {
                if (response.data.success) {
                    console.log(response.data);
                    setVideoDetail(response.data.videoDetail);
                } else {
                    alert("getting video fail")
                }
            })
    }, [])

    if (VideoDetail.writer) {
        return (
            <Row gutter={[16, 16]}>
                <Col lg={18} xs={24}>
                    <div style={{ width: '100%', padding: '3rem 4rem' }}>
                        <video style={{ width: '100%' }} src={`https://tjdvyzl-practice5-o79s44t6j0k.ws-us59.gitpod.io/${VideoDetail.filePath}`} controls></video>
                  
                        <List.Item
                            actions
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={VideoDetail.writer.image} />}
                                title={VideoDetail.writer.name}
                                description={VideoDetail.description}
                            />
                        </List.Item>

                        {/* Comments */}
                    </div>
                </Col>
                <Col lg={6} xs={24}>
                    Side Videos
                </Col>
            </Row>

        )
    }
    else {
        return(
        <div>
            ...Loading
            </div>
        )
    }
}

export default VideoDetailPage