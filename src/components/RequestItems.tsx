import React, { useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import * as FaIcons  from 'react-icons/fa6'

const RequestItems = (props:any) => {
    
    const [accepted,setAccepted] = useState(false);
  return (
    <Row key={props.request._id}>
        <Col xs={8}>{props.request.firstName} {props.request.lastName}</Col>
        <Col xs={4}>
            {!accepted ? <><FaIcons.FaCheck className='icons' onClick={() => {
                    //alert("acceprted");
                    setAccepted(true);
                    setTimeout(() =>{
                        props.handleRequest('accepted',props.request.request_id)
                    },2000)
                    

                }}
            /> 
            <FaIcons.FaXmark className='icons' style={{ marginLeft:'10px'}} onClick={() => props.handleRequest('rejected',props.request._id)}/>
            </>
            :
            <FaIcons.FaCheck style={{color:'green',fontSize:'20px'}}/>
        }
            </Col>
    </Row>
  )
}

export default React.memo(RequestItems)