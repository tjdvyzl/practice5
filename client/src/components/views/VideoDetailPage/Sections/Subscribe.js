import Axios from 'axios'
import React, { useEffect, useState } from 'react'

function Subscribe(props) {

    const [SubscribeNumber, setSubScribeNumber] = useState();
    const [Subscribed, setSubscribed] = useState(false);

    useEffect(() => {

        let variables = {
            userTo: props.userTo
        }  

        Axios.post('/api/subscribe/subscriberNubmer', variables)
            .then(response => {
                if (response.data.success) {
                    setSubScribeNumber(response.data.subscribeNumber);
                }
                else {
                    alert('getting SubscriberNumber fail')
                }
            })


        // 내가 이 유저를 구독하고 있는지 여부 가져오기

        let subscribedVariables = {
            userTo: props.userTo,
            // 지금 로그인한 유저의 아이디를 갖고온다. 로그인할 때 크롬 로컬 스토리지에 저장해둠
            userFrom: localStorage.getItem('userId')
        }

        Axios.post('/api/subscribe/subscribed', subscribedVariables)
            .then(response => {
                if (response.data.success) {
                    setSubscribed(response.data.subscribed);
                }
                else {
                    alert('정보 받기 실패')
                }
            })

    },[])

    const onSubscribe = () => {
        
        let variables = {
            userTo: props.userTo,
            userFrom: props.userFrom
        }

        // 구독 중이라면
        if (Subscribed) {
            Axios.post('/api/subscribe/unSubscribe', variables)
                .then(response => {
                    if (response.data.success) {
                        setSubScribeNumber(SubscribeNumber - 1);
                        setSubscribed(!Subscribed);
                    }
                    else {
                        alert('fail')
                    }
                })
        }
        // 구독 중이 아니라면
        else {
            Axios.post('/api/subscribe/subscribe', variables)
                .then(response => {
                    if (response.data.success) {
                        setSubScribeNumber(SubscribeNumber + 1);
                        setSubscribed(!Subscribed);
                    }
                    else {

                    }
                })
        }

    }

  return (
      <div>
          <button 
            onClick={onSubscribe}
            style={{
                backgroundColor: `${Subscribed ? '#AAAAAA' : '#CC0000'}`,
                borderRadius: '4px', color: 'white',
                padding: '10px 16px', fontWeight: '500', fontSize: '1rem', textTransform: 'uppercase'
            }}>
               {SubscribeNumber} {Subscribed ? 'Subscribed' : 'Subscribe'}
          </button>
      </div>
  )
}

export default Subscribe