import Axios from 'axios';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';

function Comment(props) {
    const user = useSelector(state => state.user);
    const [commentValue, setCommentValue] = useState("");

    const handleClick = (event) => {
        setCommentValue(event.currentTarget.value);
    }

    const onSubmit = (e) => {
        e.preventDefault();

        let variables = {
            content: commentValue,
            writer: user.userData._id,
            postId: props.videoId
        }



        Axios.post('/api/comment/saveComment', variables)
            .then(response => {
                if (response.data.success)
                {
                    console.log(response.data.result);   
                }else {
                    alert('fail')
                }
            })
    }

  return (
    <div>
          <br />
          <p>Replies</p>
          <hr/>

          {/* Comment Lists */}

          {/* Root Comment Form */}

          <form style={{display:'flex'}} onSubmit={onSubmit}>
              <textarea
                  style={{ width: '100%', borderRadius: '5px' }}
                  onChange={handleClick}
                  value={commentValue}
                  placesholder="Enter a comment"
              />
              <br />
              <button style={{width:'20%', height:'52px'}}  onClick={onSubmit}>Submit</button>
          </form>
          
    </div>
  )
}

export default Comment