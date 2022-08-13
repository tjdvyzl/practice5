import React, { useEffect, useState } from 'react'
import { Tooltip, Icon } from 'antd';
import Axios from 'axios';

function LikeDislike(props) {

    const [likes, setLikes] = useState(0);

    const [dislikes, setDislikes] = useState(0);

    const [likeAction, setLikeAction] = useState(null);

    const [dislikeAction, setDislikeAction] = useState(null);

    let variable = {}

    if (props.video) {
        variable = {postId: props.postId, userId: props.userId}
    }
    else {
        variable = {commentId: props.commentId, userId: props.userId}
    }

    useEffect(() => {
        Axios.post('/api/like/getLikes', variable)
            .then(response => {
                if (response.data.success) {
                    setLikes(response.data.likes.length);

                    response.data.likes.map(like => {
                        if (like.userId === props.userId) { 
                            setLikeAction("liked");
                        }
                    })
                } else {
                    alert('getting like data fail')
                }
            })

        Axios.post('/api/like/getDisLikes', variable)
            .then(response => {
                if (response.data.success) {
                    setDislikes(response.data.dislikes.length);

                    response.data.dislikes.map(dislike => {
                        if (dislike.userId === props.userId) { 
                            setDislikeAction("disliked");
                        }
                    })
                } else {
                    alert('getting dislike data fail')
                }
            })
    })

    const onClickLike = () => {
        if (likeAction === null) {
            Axios.post('/api/like/setLike', variable)
                .then(response => {
                    if (response.data.success) {
                        setLikeAction("liked");
                        setLikes(likes + 1);

                        if (dislikeAction !== null) {
                            setDislikes(dislikes - 1);
                            setDislikeAction(null);
                        }

                    } else {
                        alert('like fail');
                    }
                })
        } else {
            Axios.post('/api/like/unLike', variable)
                .then(response => {
                    if (response.data.success) {
                        setLikeAction(null);
                        setLikes(likes - 1);
                    } else {
                        alert('unlike fail')
                    }
                })
        }
    
    }

    const onClickDislike = () => {
        if (dislikeAction === null) {
            Axios.post('/api/like/setDislike', variable)
                .then(response => {
                    if (response.data.success) {
                        setDislikeAction("disliked");
                        setDislikes(dislikes + 1);

                        if (likeAction !== null) {
                            setLikes(likes - 1);
                            setLikeAction(null);
                        }

                    } else {
                        alert('dislike fail');
                    }
                })
        } else {
            Axios.post('/api/like/unDislike', variable)
                .then(response => {
                    if (response.data.success) {
                        setDislikeAction(null);
                        setDislikes(dislikes - 1);
                    } else {
                        alert('undislike fail')
                    }
                })
        }
    }

  return (
      <div>
          <span key="comment-basic-like">
              <Tooltip title="Like">
                  <Icon type="like"
                      theme={likeAction === "liked" ? "filled" : "outlined"}
                      onClick={onClickLike}
                  />
              </Tooltip>
              <span style={{ paddingRight: '8px', cursor: 'auto' }}>{likes}</span>
          </span>
          <span key="comment-basic-dislike">
              <Tooltip title="DisLike">
                  <Icon type="dislike"
                      theme={dislikeAction === "disliked" ? "filled" : "outlined"}
                      onClick={onClickDislike}
                  />
              </Tooltip>
              <span style={{ paddingLeft: '8px', cursor: 'auto' }}>{dislikes}</span>
          </span>
    </div>
  )
}

export default LikeDislike