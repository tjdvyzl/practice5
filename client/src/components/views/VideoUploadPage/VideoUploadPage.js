import React, {useState} from 'react'
import { Typography, Button, Form, message, Input, Icon } from 'antd';
import Dropzone from 'react-dropzone';
import Item from 'antd/lib/list/Item';
import axios from "axios";
import { useSelector } from 'react-redux';
const { Title } = Typography;
const { TextArea } = Input;

const PrivateOptions = [
    { value: 0, label: 'Priavte' },
    { value: 1, label: 'Public' }
]

const CategoryOptions = [
    { value: 0, label: "Film & Animation" },
    { value: 1, label: "Autos & Vehicles" },
    { value: 2, label: "Music" },
    { value: 3, label: "Pets & Animals" }
]

function VideoUploadPage(props) {
    const [VideoTitle, setVideoTitle] = useState("");
    const [Description, setDescription] = useState("");
    const [Private, setPrivate] = useState(0);
    const [FilePath, serFilePath] = useState("");
    const [Category, setCategory] = useState("Film & Animation");
    const [Duration, setDuration] = useState("");

    /*
        useSelector는 리덕스에서 정보를 뽑아올 때 사용
        밑의 코드를 보면 state를 갖고오는데 state에서 state.user를 통해
        user의 모든 정보들이 user변수에 담겨있게됨.
    */
    const user = useSelector(state => state.user);

    const onTitleChange = (e) => {
        setVideoTitle(e.currentTarget.value);
    }

    const onDescriptionChange = (e) => {
        setDescription(e.currentTarget.value);
    }

    const onPrivateChange = (e) => {
        setPrivate(e.currentTarget.value);
    }

    const onCategoryChange = (e) => {
        setCategory(e.currentTarget.value);
    }

    const onDrop = (files) => {
        let formData = new FormData;
        const config = {
            header: {'content-type': 'multipart/form-data'}
        }
        formData.append('file', files[0]);

        //이걸 한 이유
        // 우리가 서버에다가 request를 보내는데 이때 axios를 사용한다.(jquery나 이런거 쓸땐 AJAX)
        // axois.post()할때 위의 코드들을 보내주지 않으면 파일을 보낼때 오류가 생긴다.
        //그래서 헤더에 콘텐트 타입을 해줘야한다.

        axios.post('/api/video/uploadfiles', formData, config)
            .then(response => {
                if (response.data.success) {
                    console.log(response);
                } else {
                    alert('비디오 업로드 실패')
                }
            })
    }

    const onSubmit = (e) => {
        e.preventDefault();

        let variables = {
            writer: user.userData._id,
            title: VideoTitle,
            description: Description,
            privacy: Private,
            filePath: FilePath,
            category: Category,
            duration: Duration,
        }

        axios.post('/api/video/uploadVideo', variables)
            .then(response => {
                if(response.data.success){
                    message.success("upload success");

                    setTimeout(() => {
                        props.history.push('/');
                    }, 3000)
                }
                else {
                    alert("video upload fail")
                }
            })
    }

  return (
      <div style={{maxWidth:'700px', margin:'2rem auto'}}>
          <div style={{textAlign:'center', marginBottom:'2rem'}}>
              <Title level={2}>Upload Video</Title>
          </div>
          <Form onSubmit={onSubmit}>
              <div style={{display:'flex', justifyContent:'space-between'}}>
                {/* Drop zone */}

                  <Dropzone
                    onDrop={onDrop}
                    // multiple은 한번에 파일을 많이 올릴건지 false면 하나
                      multiple={false}
                    //maxsize 조정
                    maxsize={100000000}
                  >
                      {({ getRootProps, getInputProps }) => (
                          <div style={{
                              width: '300px', height: '240px', border: '1px solid lightgray', display: 'flex',
                            alignItems:'center', justifyContent:'center'
                          }}{...getRootProps()}>
                              <input {...getInputProps()} />
                              <Icon type="plus" style={{fontSize:'3rem'}} />
                          </div>
                      )}
                     
                      
                  </Dropzone>
                  
                  {/* Thumnail  */}
                  <div>
                      {/* <img src alt/> */}
                  </div>
              </div>

              <br />
              <br />
              <label>Title</label>
              <Input
                  onChange = {onTitleChange}
                  value = {VideoTitle}
              />
              <br />
              <br />
              <label>Description</label>
              <TextArea
                  onChange = {onDescriptionChange}
                  value = {Description}
              />

              <br />
              <br />

              <select onChange={onPrivateChange}>
                  {
                      PrivateOptions.map((item, index) => (
                          <option key={index} value={item.value}>{item.label}</option>
                      ))
                  }
              </select>

              <br />
              <br />

              <select onChange={onCategoryChange}>
                  {
                      CategoryOptions.map((item, index) => (
                          <option key={index} value={item.value}>{item.label}</option>
                      ))
                  }
              </select>

              <br />
              <br />

              <Button type="primary" size="large" onClick={onSubmit}>
                  Submit
              </Button>
          </Form>
    </div>
  )
}

export default VideoUploadPage