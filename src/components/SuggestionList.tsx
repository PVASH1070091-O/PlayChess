import React from 'react'
import { Col, Row } from 'react-bootstrap'
import * as  FaIcons  from 'react-icons/fa6'

const SuggestionList = (props:any) => {
    
  return (
    <Row>
        <Col xs={9}>{props.friend.firstName} {props.friend?.lastName}</Col>
        {props.friendsList.some((item:any) =>item.userName === props.friend.userName) ?
        <p style={{fontSize:'10px',margin:0,padding:0,paddingTop:'6px',width:'20%'}}>Friend</p>
         :
         <Col xs={3}><FaIcons.FaUserPlus style={{cursor:'pointer'}} onClick={props.sendRequest}/></Col>
        }
        <hr/>
    </Row>
  )
}

export default SuggestionList