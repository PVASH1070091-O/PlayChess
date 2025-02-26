import axios from 'axios'
import React, { useCallback } from 'react'
import { Col, Row } from 'react-bootstrap'
import * as  FaIcons  from 'react-icons/fa6'

const SuggestionList = (props:any) => {
    console.log("friend",props.friend)
    const sendRequest = () =>{
      axios.post(import.meta.env.VITE_API_KEY+ "api/sendRequest",{sendTo:props.friend.firstName.toLowerCase()},{withCredentials:true})
      .then((res)=>{
          console.log("friend request response",res)
      })
      .catch((err)=>{
          console.log("err",err)
      })
    }
  return (
    <Row>
        <Col xs={9}>{props.friend.firstName} {props.friend?.lastName}</Col>
        {props.friendsList.some((item:any) =>item.userName === props.friend.userName) ?
        <p style={{fontSize:'10px',margin:0,padding:0,paddingTop:'6px',width:'20%'}}>Friend</p>
         :
         <Col xs={3}><FaIcons.FaUserPlus style={{cursor:'pointer'}} onClick={sendRequest}/></Col>
        }
        <hr/>
    </Row>
  )
}

export default SuggestionList