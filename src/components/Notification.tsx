import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Badge, Button } from 'react-bootstrap'
import * as FaIcons  from 'react-icons/fa6'
import './Board.css'

interface PropsType{
    setPanel:React.Dispatch<React.SetStateAction<boolean>>;
    count:number;
}

const Notification = (props:PropsType) => {

  return (
    <>
    <span style={{position:'relative',left:'-12px'}}><FaIcons.FaBell style={{fontSize:'20px'}} onClick={() => props.setPanel(true)}/>{props.count >0 &&<Badge bg="danger" className='badge'>{props.count} </Badge>}</span>
    
    </>
  )
}

export default Notification