import React, { useEffect, useState } from 'react'
import { YoutubeOutlined} from '@ant-design/icons';
import Axios from "axios";

function SideVideo() {
    const [SideVideos, setSideVideos] = useState([])

    useEffect(() => {
        Axios.get('/api/video/getVideos')
            .then(response => {
                if (response.data.success) {
                    setSideVideos(response.data.videos);
                } else {
                    alert('getting videos fail')
             }
        })
    },[])

    const sideVideoItem = SideVideos.map(( video, index) => {

        var minutes = Math.floor(video.duration / 60);
        var seconds = Math.floor(video.duration - minutes * 60);

        return <div style={{ display: 'flex', marginTop: '1rem', padding: '0 2rem' }} key={index}>
                    <div style={{ width:'40%', marginRight:'1rem' }}>
                        <a href={`/video/${video._id}`}  style={{ color:'gray' }}>
                            <YoutubeOutlined style={{ fontSize: '100px'}} />
                        </a>
                    </div>

                    <div style={{ width:'50%' }}>
                        <a href={`/video/${video._id}`} style={{ color:'gray' }}>
                            <span style={{ fontSize: '1rem', color: 'black' }}>{video.title}  </span><br />
                            <span>{video.writer.name}</span><br />
                            <span>{video.views}</span><br />
                            <span>{minutes} : {seconds}</span><br />
                        </a>
                    </div>
                </div>
    })
  return (
    <React.Fragment>
        
          {sideVideoItem}
          
    </React.Fragment>
  )
}

export default SideVideo