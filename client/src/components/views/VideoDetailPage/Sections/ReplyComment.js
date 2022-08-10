import React from 'react'
import SingleComment from './SingleComment'

function ReplyComment(props) {

    const renderReplyComment = (parentCommentId) => {
        props.commentList.map((comment, index) => (
            <React.Fragment>
                {
                    comment.responseTo === parentCommentId && 
                    <div>
                        <SingleComment refreshFunction={props.refreshFunction} key={index} comment={comment} postId={props.videoId} />
                        <ReplyComment commentList={props.commentList} />
                    </div>
                }
            </React.Fragment>
        ))
    }

  return (
      <div>
          
          <p style={{fontSize:'14px', margin: 0, color:'gray'}}>
              View 1 more comment(s)
          </p>

          {renderReplyComment(props.parentCommentId)}
    </div>
  )
}

export default ReplyComment