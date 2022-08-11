import React, { useEffect, useState } from 'react'
import SingleComment from './SingleComment'

function ReplyComment(props) {

    const [childCommentNumber, setChildCommentNumber] = useState(0);

    const [openReplyComment, setOpenReplyComment] = useState(false);

    useEffect(() => {
        let commentNumber = 0;

        props.commentList.map((comment) => {
            if (comment.responseTo === props.parentCommentId)
                commentNumber++;
        })

        setChildCommentNumber(commentNumber);
    },[props.commentList])

    const renderReplyComment = (parentCommentId) => {
        return(
            props.commentList.map((comment, index) => (
                <React.Fragment key={index}>
                    {comment.responseTo === parentCommentId &&
                        <div style={{ width: '80%', marginLeft: '40px' }}>
                            <SingleComment comment={comment} postId={props.postId} refreshFunction={props.refreshFunction} />
                            <ReplyComment commentList={props.commentList} parentCommentId={comment._id} postId={props.postId} refreshFunction={props.refreshFunction} />
                        </div>
                    }
                </React.Fragment>
            ))
        )
    }
    
    

    const onHandlerChange = () => {
        setOpenReplyComment(!openReplyComment);
    }

        return (
            <div>
                {childCommentNumber > 0 &&
                    <p style={{ fontSize: '14px', margin: 0, color: 'gray' }} onClick={onHandlerChange}>
                        View {childCommentNumber} more comment(s)
                    </p>
                }

                {openReplyComment &&
                    renderReplyComment(props.parentCommentId)
                }

            </div>
        )
}

export default ReplyComment