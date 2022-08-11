import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { Avatar, Comment, Input } from 'antd';
import Axios from 'axios';
import LikeDislike from './LikeDislike';

const { TextArea } = Input;

function SingleComment(props) {

    const user = useSelector(state => state.user);

    const [openReply, setOpenReply] = useState(false);

    const [commentValue, setCommentValue] = useState("");

    const onClickReply = () => {
        setOpenReply(!openReply);
    }

    const onChangeHandler = (event) => { 
        setCommentValue(event.currentTarget.value);
    }

    const onSubmit = (event) => {
      event.preventDefault();

      let variables = {
          content: commentValue,
          writer: user.userData._id,
          postId: props.postId,
          // replyTo 할 때 이 댓글의 답글이 되는 것이므로 responseTo 프로퍼티가 있어야함
        responseTo: props.comment._id
      }


      if (user.userData._id) {
        Axios.post('/api/comment/saveComment', variables)
          .then(response => {
            if (response.data.success) {
              console.log(response.data.result);

              props.refreshFunction(response.data.result);

              setCommentValue("");

              setOpenReply(false);
            } else {
              alert('fail')
            }
          })
      }
      else {
        alert('please login')
      }
    }

  const onClickDelete = () => {

    alert('delete!');
    //   let variables = {
    //       content: commentValue,
    //       writer: user.userData._id,
    //       postId: props.postId,
    //       // replyTo 할 때 이 댓글의 답글이 되는 것이므로 responseTo 프로퍼티가 있어야함
    //     responseTo: props.comment._id
    //   }

    //   Axios.post("/api/comment/deleteComment", variables)
    //     .then(response => {
    //       if (response.data.success) {
            
    //       }
    //       else {
    //         alert('delete fail!');
    //       }
    //     })
  }

  const actions = [
    <LikeDislike commentId={props.comment._id} userId={localStorage.getItem('userId')} />,
      <span onClick={onClickReply} key="comment-basic-reply-to">Reply to</span>,
      <span onClick={onClickDelete}>Delete</span>
    ]

    return (
      <div>
        <Comment
          actions={actions}
          author={props.comment.writer.name}
          avatar={<Avatar src={props.comment.writer.image} />}
          content={<p>{props.comment.content}</p>}
        />
        {
          openReply &&
          <form style={{ display: 'flex' }} onSubmit={onSubmit}>
            <TextArea
              style={{ width: '100%', borderRadius: '5px' }}
              onChange={onChangeHandler}
              value={commentValue}
              placesholder="Enter a comment"
            />
            <br />
            <button style={{ width: '20%', height: '52px' }} onClick={onSubmit} >Submit</button>
          </form>
        }

      </div>
    )
   
  
}

export default SingleComment