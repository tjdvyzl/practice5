import Axios from 'axios';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import SingleComment from './SingleComment';
import ReplyComment from "./ReplyComment";

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

                    props.refreshFunction(response.data.result);

                    setCommentValue("");
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
      {props.commentList && props.commentList.map((comment, index) => (
              (!comment.responseTo && 
                // React에선 jsx를 사용하는데, div나 React.Fragment로 감싸줘야함.
                 <React.Fragment key={index}>
                    <SingleComment refreshFunction={props.refreshFunction} comment={comment} postId={props.postId} />
                  <ReplyComment refreshFunction={props.refreshFunction} parentCommentId={comment._id} postId={props.postId} commentList={props.commentList} />
                  </React.Fragment>
                )
              ))}
          
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