import React, {useState,useEffect} from 'react'
import { Typography, Card, Button, Row, Col, Form, message, Input } from 'antd';
import { YoutubeOutlined} from '@ant-design/icons';
import { Avatar } from 'antd';
import Axios from 'axios';
import moment from 'moment';
const { Title } = Typography;
const { Meta } = Card;

function LandingPage() {

    const [Video, setVideo] = useState([])

    useEffect(() => {
        Axios.get('/api/video/getVideos')
            .then(response => {
                if (response.data.success) {
                    console.log(response.data);
                    setVideo(response.data.videos);
                } else {
                    alert('getting videos fail')
             }
        })
    },[])

    const renderCards = Video.map((video, index) => {
        var minutes = Math.floor(video.duration / 60)
        var seconds = Math.floor((video.duration * 60 - minutes))

        return <Col lg={6} md={8} xs={24} key={index}>
            <a href={`/video/${video._id}`}>
                <div style={{ position: 'relative' }}>
                    <YoutubeOutlined style={{ width: '200px', height: '200px', fontSize: '200px'}} />
                    <div className='duration'>
                        <span>{minutes} : {seconds}</span>
                    </div>
                </div>
            </a>
                    

            <br/>

            <Meta 
            avatar={<Avatar src={video.writer.image} />}
            title={video.title}
            description=""
            />
            <span>{video.writer.name}</span><br /> <span style={{ marginLeft: '3rem' }}>{video.views} views</span> - 
            <span>{ moment(video.createAt).format("MMM Do YY")}</span>
                </Col>
    })

    return (
        <div style={{width:'85%', margin:'3rem auto'}}>
            <Title level={2}> Recommanded </Title>
                <hr/>

                {/* gridcards 사이에 빈 공간을 넣고 싶다면 gutter을 쓰기 */}
            <Row gutter={[32, 16]}>
                
                {renderCards}
                
            </Row>
        </div>
    )
}

export default LandingPage
